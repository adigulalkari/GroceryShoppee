# GroceryShopee: A Grocery Store Application

## Overview:
GroceryShopee is an ecommerce platform specializing in everyday essentials such as fruits, vegetables, toiletries, snacks, and more. It facilitates store managers in efficiently managing product operations and provides customers with a seamless shopping experience. Users receive regular purchase reminders and monthly reports via email, while store managers can access real-time inventory information.

## Website Breakdown:
- **Landing Page:** Offers an introductory overview of the platform.
- **User Authentication:** Users can log in or register.
- **Customer Experience:** Customers can browse products, add them to the cart, and make purchases. They can also view their order history.
- **Manager Dashboard:** Managers can view and manage products and categories, download inventory information, and add new products/categories.
- **Admin Panel:** Admins can approve manager registrations, review pending category change requests, and manage products/categories.

## Code Breakdown:
- **Backend:** Developed using Flask framework.
- **Frontend:** Developed using Vue.js 2 and Bootstrap.
- **Database:** Utilizes sqlite3 databases for data storage.
- **Caching:** Certain API routes are cached using Redis for optimized response times.
- **Asynchronous Tasks:** Backend tasks such as downloading CSV files and sending emails are managed using Celery.

## Database Tables:
The database consists of 8 tables containing data for the entire website.

## How to Run:
1. Clone the repository.
2. Set up the virtual environment and install dependencies.
3. Run the Flask application.
4. Access the website through the provided URL.

## Contribution Guidelines:
1. Fork the repository.
2. Make changes in your forked repository.
3. Create a pull request with a detailed description of your changes.

