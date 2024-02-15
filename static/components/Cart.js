// Cart.js

export default {
    template: `
        <div>
            <ol class="list-group list-group-numbered">
                <li v-for="(quantity, productId) in cart" :key="productId" class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">Product Name: {{ getProductById(productId).productName }}</div>
                        <div>Quantity: {{ quantity }}</div>
                    </div>
                    <span class="badge bg-primary rounded-pill">Total Price: {{ getTotalPrice(productId) }}</span>
                </li>
            </ol>
            <div class="d-flex justify-content-center">
                <h2 >Grand Total: {{ grandTotal }}</h2>
            </div>
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary btn-lg btn-success" @click="placeOrder">Confirm order</button>
            </div>
        </div>
    `,
    // Data properties to store the cart, product data, authentication token, and customer ID
    data() {
        return {
            cart: this.$store.state.cart,
            data: [],
            token: localStorage.getItem('auth-token'),
            cust_id: localStorage.getItem('id')
        };
    },
    computed: {
        // Computed property to get a product by its ID
        getProductById() {
            return (productId) => this.data.find((product) => product.id === parseInt(productId, 10)) || {};
        },
        // Computed property to calculate the grand total of the shopping cart
        grandTotal() {
            const total = Object.keys(this.cart).reduce((total, productId) => {
                const product = this.getProductById(productId);
                const quantity = this.cart[productId];
        
                if (product && !isNaN(product.price) && !isNaN(quantity)) {
                    total += product.price * quantity;
                }
        
                return total;
            }, 0);
            // Commit the total to the Vuex store
            this.$store.commit('updateGrandTotal', total);
            return total;
        }
    },
    methods: {
        // Method to fetch product data from the server
        async getProducts() {
            try {
                const response = await fetch('/api/product', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                this.data = data;
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },

        // Method to calculate the total price of a product in the shopping cart
        getTotalPrice(productId) {
            const product = this.getProductById(productId);
            const total = product.price * this.cart[productId];
            return total;
        },

        // Method to place an order
        async placeOrder() {
            // Check if the cart is empty before placing the order
            if(parseFloat(this.$store.state.grandTotal)===0){
                Swal.fire({
                    title: 'Error!',
                    text: 'The cart is Empty',
                    icon: 'error',
                    confirmButtonText: 'Close'
                });
            }
            else{
                // Prepare the order payload
                const orderPayload = {
                    user_id: this.cust_id,
                    total_price: parseFloat(this.$store.state.grandTotal),
                    products: Object.keys(this.cart).map(productId => ({
                        id: productId,
                        quantity: this.cart[productId]
                    }))
                };
                
                // Send the order payload to the server
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderPayload),
                });
            
                console.log('Received response:', response);

                // Handle the response and show appropriate messages
                if (response.ok) {
                    this.$store.commit('resetCart')
                    Swal.fire({
                        title: 'Success!',
                        text: 'Order has been placed successfully',
                        icon: 'success',
                        confirmButtonText: 'Close'
                        }).then(() => {
                        this.$router.push('/');
                    });
                } else {
                    const errorData = await response.json();
                    console.error('Error placing order. HTTP status:', response.status, 'Message:', errorData.message);
                }
            }
        }                
    },

    // Lifecycle hook to fetch products when the component is about to be mounted
    beforeMount() {
        this.getProducts();
    },
};
