from flask import Flask
from application.config import LocalDevConfig
from application.database import db
from application.models import User, Role, RolesUsers, Categories_Products, Category, Product, OrderItem,Order
from application.sec import datastore
from application.worker import celery_init_app
from flask_security import Security, SQLAlchemyUserDatastore
from werkzeug.security import generate_password_hash
from flask_restful import Api
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import daily_reminder, monthly_report
from application.instances import cache

# Global variables to store Flask app and API instances
app= None
api= None

# Function to create Flask app and API instances
def create_app():
    app = Flask(__name__, template_folder='templates')
    app.config.from_object(LocalDevConfig)
    db.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    api=Api(app, prefix='/api')
    app.app_context().push()
    cache.init_app(app)
    return app, api

# Initializing the Flask app and API
app, api= create_app()
celery_app = celery_init_app(app)

# Celery periodic tasks for sending daily and monthly emails
@celery_app.on_after_configure.connect
def send_daily_emails(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=20, minute=7),
        daily_reminder.s(),
    )

@celery_app.on_after_configure.connect
def send_monthly_emails(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=20, minute=7, day_of_month=21),
        monthly_report.s(),
    )

# Importing resources and adding them to the Flask API
from application.resources import Products, Categories, Orders
api.add_resource(Products,'/product')
api.add_resource(Categories,'/category')
api.add_resource(Orders, '/orders')


# Main block to run the application
if __name__ == "__main__":
    with app.app_context():
        import application.views
        # Creating database tables and initializing roles and users
        db.create_all()
        datastore.find_or_create_role(name="admin", description="User is an admin")
        datastore.find_or_create_role(name="manager", description="User is an Store Manager")
        datastore.find_or_create_role(name="customer", description="User is a Customer")
        db.session.commit()
        
        # Creating default users if not present
        if not datastore.find_user(email="admin@email.com"):
            datastore.create_user(username="admin", email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])
        if not datastore.find_user(email="manager@email.com"):
            datastore.create_user(username="manager", email="manager@email.com", password=generate_password_hash("manager"), roles=["manager"], active=False)
        if not datastore.find_user(email="customer@email.com"):
            datastore.create_user(username="customer", email="customer@email.com", password=generate_password_hash("customer"), roles=["customer"])
            db.session.commit()
    # Running the Flask application
    app.run(debug =True, host='0.0.0.0', port=8080)
