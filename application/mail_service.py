from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# SMTP server configuration
SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'server@groceryshopee.com'
SENDER_PASSWORD = ''


# Function to send daily emails
def send_daily_emails(to, subject, content_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))

    # Connect to the SMTP server and send the message
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()



# Function to send monthly emails
def send_monthly_emails(to, subject, content_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))

    # Connect to the SMTP server and send the message
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()

