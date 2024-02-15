import os

# Get the absolute path of the current directory
base_dir = os.path.abspath(os.path.dirname(__file__))

# Base configuration class
class Config():
    DEBUG=False
    TESTING=False
    SQLITE_DB_DIR=None
    SQLALCHEMY_DATABASE_URI=None
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    

# Configuration class for local development, inherits from Config
class LocalDevConfig(Config):
    DEBUG=True
    SQLITE_DB_DIR = os.path.join(base_dir,'../db_dir')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///'+os.path.join(SQLITE_DB_DIR,'db.sqlite3')
    SECRET_KEY = '1GW~RUWO5!ve^0Z'

    # Salt used for hashing passwords
    SECURITY_PASSWORD_SALT = 'thisissaltpass'
    # Disable CSRF protection for local development
    WTF_CSRF_ENABLED = False
    # Header field for authentication token
    SECURITY_AUTHENTICATION_TOKEN_HEADER = 'Authentication-Token'

    # Cache configuration using Redis
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3

