from sqlalchemy.ext.declarative import declarative_base
from flask_sqlalchemy import SQLAlchemy

engine = None

# Create a base class for declarative models
Base = declarative_base()

# Create an instance of Flask SQLAlchemy for database operations
db=SQLAlchemy()