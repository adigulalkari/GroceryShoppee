from flask_security import SQLAlchemyUserDatastore
from .models import User, Role
from .database import db

# Create an instance of SQLAlchemyUserDatastore with the User and Role models
datastore = SQLAlchemyUserDatastore(db, User, Role)