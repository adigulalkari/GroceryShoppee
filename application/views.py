from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required
from flask_restful import marshal, fields
from werkzeug.security import check_password_hash, generate_password_hash
from .models import User, db
from .sec import datastore
from application.tasks import create_csv
import flask_excel as excel
from celery.result import AsyncResult
from .instances import cache


# Home route to render the index.html template
@app.get('/')
def home():
    return render_template('index.html')


# Admin route to activate a manager
@app.get('/admin/activate/<int:mgr_id>')
@auth_required("token")
@roles_required("admin")
@cache.cached(timeout=10)
def activate_mgr(mgr_id):
    manager = User.query.get(mgr_id)
    if not manager:
        return jsonify({"message": f"Manager with id {mgr_id} does not exist"}), 404
    manager.active = True
    db.session.commit()
    return jsonify({"message": "Manager has been activated"})


# User login route
@app.post('/user-login')
@cache.cached(timeout=10)
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"Error": "email not provided"}), 400
    
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"Error": "user not found"}), 404

    if not user.active:
        return jsonify({"Error": "User is inactive, Contact Admin!"}), 423
    if check_password_hash(user.password, data.get('password')):
        return jsonify({"id" : user.id,
                        "email" : user.email,
                        "role": user.roles[0].name, 
                        "token": user.get_auth_token()})
    else:
        return jsonify({"Error": "Invalid password"}), 401


# User registration route
@app.post('/user-register')
@cache.cached(timeout=10)
def user_register():
    data = request.get_json()
    print(data)
    email = data.get('email')
    if not email:
        return jsonify({"Message": "email not provided"}), 400
    user = datastore.find_user(email=email)
    if user:
        return jsonify({"Message": "Email already registered"}), 409
    else:
        roles = data.get('roles')
        active = True
        if 'manager' == roles:
            active = False
        
        datastore.create_user(username=data.get('username'), email=data.get('email'),\
                            password=generate_password_hash(data.get('password')), roles=[data.get('roles')], active=active)
        db.session.commit()
        return jsonify({"Message": "User successfully created!"})


# Define fields for user representation in responses
user_fields = {
    "id"  : fields.Integer,
    "email" : fields.String,
    "active": fields.Boolean
}


# Route to get all users (admin-only)
@app.get('/users')
@auth_required("token")
@cache.cached(timeout=10)
@roles_required("admin")
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message":"No Users Found"}), 404
    return marshal(users, user_fields)


# Route to trigger CSV creation task
@cache.cached(timeout=10)
@app.get('/download-csv')
def download_csv():
    task = create_csv.delay()
    return jsonify({"task_id": task.id})


# Route to get CSV file after task completion
@cache.cached(timeout=10)
@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending "}), 404

