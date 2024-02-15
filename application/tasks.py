# tasks.py
from celery import shared_task
from .models import Product, User, Order,OrderItem
import flask_excel as excel
from .mail_service import send_daily_emails, send_monthly_emails
from jinja2 import Template
from flask import render_template
from datetime import datetime, timedelta


# Celery shared task to create a CSV file from Product data
@shared_task(ignore_result=False)
def create_csv():
    # Retrieve Product data
    stud_res = Product.query.with_entities(
        Product.id, Product.productName,Product.price,Product.quantity,Product.unit).all()

    # Generate CSV file using flask_excel
    csv_output = excel.make_response_from_query_sets(
        stud_res, ["id", "productName", "price","quantity", "unit"], "csv")
    filename = "test.csv"

    # Save the generated CSV file
    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename


# Celery shared task for sending daily reminders to customers
@shared_task(ignore_result=True)
def daily_reminder():
    today = datetime.now().date()
    customers = User.query.filter(User.roles.any(name='customer')).all()

    for customer in customers:
        latest_order = Order.query.filter_by(user_id=customer.id).order_by(Order.order_date.desc()).first()

        if latest_order and latest_order.order_date.date() == today:
            # Send a "Thank You" email
            with open('./templates/email.html', 'r') as f:
                template = Template(f.read())
            send_daily_emails(customer.email, "Thank You for Visiting!", template.render(email=customer.email))
        else:
            # Send a "We Missed You" email
            with open('./templates/email2.html', 'r') as f:
                template = Template(f.read())
            send_daily_emails(customer.email, "We missed you!", template.render(email=customer.email))
    return "OK"


# Celery shared task for sending monthly reports to customers
@shared_task(ignore_result=True)
def monthly_report():
    customers = User.query.filter(User.roles.any(name='customer')).all()
    today = datetime.now()
    start_date = datetime(today.year, today.month, 1)
    end_date = start_date + timedelta(days=31)
    customer_order_details = {}

    # Retrieve order details for each customer
    for customer in customers:
        total_cost = 0
        orders = Order.query.filter_by(user_id=customer.id).filter(Order.order_date.between(start_date, end_date)).all()
        order_details = []

        for order in orders:
            total_cost += order.total_price
            order_details.append({"order_no": order.id, "total_cost": order.total_price})

        customer_order_details[customer.email] = {"order_details": order_details, "total": total_cost}

    # Send monthly reports to customers (move this part outside the loop)
    for email, orders in customer_order_details.items():
        with open('./templates/monthly_report.html', 'r') as f:
            template = Template(f.read())
        send_monthly_emails(
            email, 
            "Your monthly report is here!", 
            template.render(order_details=orders['order_details'], total_cost=orders['total'])
        )

    return "Monthly reports sent successfully!"
