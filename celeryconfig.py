# The URL for the message broker where Celery sends and receives messages.
# In this case, Redis is used as the message broker, and it's running on localhost at port 6379 with a database index 1.
broker_url = "redis://localhost:6379/1"

# The URL for the result backend where Celery stores task results.
# Redis is used here as well, running on localhost at port 6379 with a different database index 2.
result_backend = "redis://localhost:6379/2"

# Timezone Configuration
timezone = "Asia/kolkata"

# Broker Connection Retry on Startup
# If set to True, Celery will retry connecting to the broker if the connection fails on startup.
broker_connection_retry_on_startup=True