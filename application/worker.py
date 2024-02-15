# worker.py
from celery import Celery, Task


# Function to initialize Celery with a Flask app
def celery_init_app(app):
    # Custom Celery Task class that ensures tasks run within the app context
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            # Use the Flask app context for running tasks
            with app.app_context():
                return self.run(*args, **kwargs)

    # Create a Celery app instance
    celery_app = Celery(app.name, task_cls=FlaskTask)

    # Configure Celery app from the specified celeryconfig module
    celery_app.config_from_object("celeryconfig")
    # Autodiscover tasks in the 'application.tasks' module
    celery_app.autodiscover_tasks(['application.tasks'])

    return celery_app