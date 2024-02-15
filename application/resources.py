from flask import jsonify, request
from flask_restful import Resource, Api, fields,marshal_with,reqparse, marshal_with, fields
from flask_security import auth_required, roles_required
from .models import Product, Category, Categories_Products, Order, OrderItem
from .database import db
from .instances import cache

# Create an instance of Flask RESTful API
api = Api()

# Request parser for handling product-related operations
prod_parser = reqparse.RequestParser()
prod_parser.add_argument('productName', type=str)
prod_parser.add_argument('unit', type=str)
prod_parser.add_argument('price', type=float)
prod_parser.add_argument('quantity', type=int)
prod_parser.add_argument('category', type=str)

# Fields for product representation in responses
product_fields = {
    'id': fields.Integer,
    'productName': fields.String,
    'unit': fields.String,
    'price': fields.Float,
    'quantity': fields.Integer,
    'category_id': fields.Integer,
    'category_name': fields.String
}

# Request parser for handling category-related operations
cat_parser = reqparse.RequestParser()
cat_parser.add_argument('catName', type=str)
cat_parser.add_argument('description', type=str)

# Fields for category representation in responses
category_fields = {
    'id': fields.Integer,
    'catName' : fields.String,
    'description' : fields.String
}


# Resource class for handling product-related operations
class Products(Resource):
    @marshal_with(product_fields)
    def get(self):
        # Retrieve products with associated categories
        products_with_categories = []
        products = Product.query.all()
        for product in products:
            categories = Category.query.join(
                Categories_Products,
                Categories_Products.category_id == Category.id
            ).filter(
                Categories_Products.product_id == product.id
            ).all()
            for category in categories:
                product_with_category = {
                    'id': product.id,
                    'productName': product.productName,
                    'unit': product.unit,
                    'price': product.price,
                    'quantity': product.quantity,
                    'category_id': category.id,
                    'category_name': category.catName
                }
                products_with_categories.append(product_with_category)
        return products_with_categories


    def post(self):
        # Add a new product with category association
        args = prod_parser.parse_args()
        category_name = args.pop('category', [])
        product = Product(**args)
        category = Category.query.filter_by(catName=category_name).first()
        if category:
            product.category.append(category)

        db.session.add(product)
        db.session.commit()
        return {"message":"Product has been added!"}    


    def put(self):
        # Update an existing product
        id = request.json.get("prodID") 
        print(f"Received PUT request for product ID: {id}")
        args = prod_parser.parse_args()
        print(args)
        product = Product.query.get(id)
        if product is None:
            print(f"Product with ID {id} not found")
            return {"message": f"Product with ID {id} not found"}, 404
        for key, value in args.items():
            if key != 'category':
                setattr(product, key, value)
        category_name = args.get('category')
        category = Category.query.filter_by(catName=category_name).first()
        if category:
            product.category = [category]
        db.session.commit()
        print(f"Updated product with ID: {id}")
        return {"message": "Updated Successfully"}

    def delete(self):
        # Delete an existing product and its associations
        id = request.json.get("prodID") 
        product = Product.query.get(id)
        db.session.delete(product)
        prod_cats = Categories_Products.query.filter_by(product_id=id)
        for prod in prod_cats:
            db.session.delete(prod)
        db.session.commit()



# Resource class for handling category-related operations
class Categories(Resource):
    @marshal_with(category_fields)
    def get(self):
        # Retrieve all categories
        cat = Category.query.all()
        return cat


    def post(self):
        # Add a new category
        args = cat_parser.parse_args()
        category = Category(**args)
        db.session.add(category)
        db.session.commit()
        return jsonify({"message":"Category has been added!"})


    def put(self):
        # Update an existing category
        args = cat_parser.parse_args()
        cat_id = request.json.get("catID")

        category = Category.query.get(cat_id)
        if category is None:
            return {"message": f"Category with ID {cat_id} not found"}, 404

        for key, value in args.items():
            setattr(category, key, value)
        db.session.commit()
        return jsonify({"message": "Category has been updated!"})


    def delete(self):
        # Delete an existing category and its associations
        cat_id = request.json.get("catID")
        category = Category.query.get(cat_id)
        db.session.delete(category)
        prod_cats = Categories_Products.query.filter_by(category_id=cat_id)
        for cat in prod_cats:
            db.session.delete(cat)
        db.session.commit()



# Request parser for handling order-related operations
order_parser = reqparse.RequestParser()
order_parser.add_argument('user_id', type=int)
order_parser.add_argument('total_price', type=float)
order_parser.add_argument('products', type=list, location='json') 

# Fields for product representation in responses
order_product_fields = {
    'id': fields.Integer,
    'productName': fields.String,
    'quantity': fields.Integer,
}

# Fields for order representation in responses with product details
order_fields_with_products = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'order_date': fields.DateTime(dt_format='iso8601'),
    'total_price': fields.Float,
    'products': fields.List(fields.Nested(order_product_fields)),
}


# Resource class for handling order-related operations
class Orders(Resource):
    @marshal_with(order_fields_with_products)
    def get(self):
        # Retrieve orders with associated products and details
        orders_with_products = []
        orders = Order.query.all()

        for order in orders:
            order_with_products = {
                'id': order.id,
                'user_id': order.user_id,
                'order_date': order.order_date,
                'total_price': order.total_price,
                'products': []
            }

            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            for order_item in order_items:
                product = Product.query.get(order_item.product_id)
                product_details = {
                    'id': product.id,
                    'productName': product.productName,
                    'quantity': order_item.quantity,
                }
                order_with_products['products'].append(product_details)

            orders_with_products.append(order_with_products)

        return orders_with_products



    @cache.cached(timeout=10)
    @auth_required()
    def post(self):
        # Place a new order
        args = order_parser.parse_args()
        order = Order(user_id=args['user_id'], total_price=args['total_price'])
        db.session.add(order)
        db.session.commit()

        for product in args['products']:
            print('Processing product:', product)
            order_item = OrderItem(
                order_id=order.id,
                product_id=product['id'],
                quantity=product['quantity'],
            )
            db.session.add(order_item)
            db.session.commit()
            
            prod = Product.query.filter_by(id=order_item.product_id).first()
            prod.quantity -= order_item.quantity
            db.session.commit()
            
        return {"message": "Order has been placed!"}

