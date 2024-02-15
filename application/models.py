# models.py
from .database import db
from datetime import datetime
from flask_security import UserMixin, RoleMixin


# Association table for many-to-many relationship between roles and users
class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column('user_id',db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column('role_id',db.Integer, db.ForeignKey('role.id'))


# User class representing the user entity with SQLAlchemy
class User(db.Model, UserMixin):
    __tablename__= 'user'
    id = db.Column(db.Integer, unique=True, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users', backref= db.backref('users'))


# Role class representing user roles with SQLAlchemy
class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


# Association table for many-to-many relationship between categories and products
class Categories_Products(db.Model):
    __tablename__ = "categories_products"
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column('category_id',db.Integer, db.ForeignKey('category.id'))
    product_id = db.Column('product_id',db.Integer, db.ForeignKey('product.id'))


# Category class representing product categories with SQLAlchemy
class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    catName = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    active = db.Column(db.Boolean, default=False)


# Product class representing products with SQLAlchemy
class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, primary_key=True)
    productName = db.Column(db.String(100), unique=True)
    unit = db.Column(db.String(50))
    price = db.Column(db.Float())
    quantity = db.Column(db.Integer(), default=0)
    category = db.relationship('Category', secondary='categories_products', backref= db.backref('category'))


# Order class representing orders with SQLAlchemy
class Order(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    order_date = db.Column(db.DateTime, default=datetime.now())
    total_price = db.Column(db.Float(), default=0.0)


# OrderItem class representing items within an order with SQLAlchemy
class OrderItem(db.Model):
    __tablename__ = 'order_item'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer(), default=0)