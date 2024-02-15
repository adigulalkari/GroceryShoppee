// LandingPage.js

export default {
    template: `
        <div>
            <header class="bg-success text-white text-center py-5">
                <h1 class="display-4 mb-4" style="color: #8CD7F4;">Welcome to <span class="text-warning">GroceryShopee</span></h1>
                <p class="lead">Your joyful journey to fresh and quality groceries begins here!</p>
            </header>

            <section class="container my-5">
                <div class="row">
                    <div class="col-md-6 d-flex align-items-center">
                        <div>
                            <h2 class="mb-4">Discover Freshness</h2>
                            <p>🌽 Explore our wide selection of fresh produce and quality groceries for your daily needs. 🍇</p>
                            <button class="btn btn-warning btn-lg" @click="login">Start Shopping <i class="fas fa-shopping-cart"></i></button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <img src="https://www.farmersalmanac.com/wp-content/uploads/2020/11/keep-food-fresh-AdobeStock_284474211-945x630.jpeg" alt="Fresh Groceries" class="img-fluid animated bounce" />
                    </div>
                </div>
            </section>

            <section class="bg-light text-center py-5">
                <div class="container">
                    <h2 class="mb-4"">Why Choose GroceryShopee?</h2>
                    <div class="row">
                        <div class="col-md-4 mb-4">
                            <i class="fas fa-shopping-basket fa-3x mb-3 text-success"></i>
                            <h4>Wide Selection</h4>
                            <p>🛒 Find everything you need with our extensive range of grocery products. 🌶️</p>
                        </div>
                        <div class="col-md-4 mb-4">
                            <i class="fas fa-leaf fa-3x mb-3 text-success"></i>
                            <h4>Fresh and Organic</h4>
                            <p>🌿 Experience freshness with our organic and locally sourced produce. 🍓</p>
                        </div>
                        <div class="col-md-4 mb-4">
                            <i class="fas fa-truck fa-3x mb-3 text-success"></i>
                            <h4>Fast Delivery</h4>
                            <p>🚚 Enjoy doorstep delivery with our reliable and fast delivery service. 🚀</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer class="text-center py-3" style="background-color: #8CD7F4; color: white;">
                <p>&copy; 2024 GroceryShopee. All rights reserved. Let the grocery adventure begin! 🛍️</p>
            </footer>
        </div>
    `,
    methods: {
        login() {
            this.$router.push("/login");
        }
    }
};
