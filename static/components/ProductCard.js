
export default {

    props: {
        product: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="card" style="margin: 0.5em .5em; width: calc(100%/3);">
            <div class="image-wrapper" style="max-width:100%; height:19em; justify-content:center; align-items:flex-start">
                <img src="https://www.freightwaves.com/wp-content/uploads/2021/11/misfits-1-1200x720.png" class="card-img-top" alt="Product Image" style="max-width:100%; max-height:100%">
            </div>
            <div class="card-body">
                <h5 class="card-title">{{ product.productName }}</h5>
                <p class="card-text">Unit: {{ product.unit }}</p>
                <p class="card-text">Price: {{ product.price }}</p>
                <p class="card-text">Avail Quantity: {{ product.quantity }}</p>
                <div v-if="userRole==='customer'">
                    <div v-if="product.quantity === 0">
                        <button type="button" class="btn btn-primary" disabled>Out of Stock</button>
                    </div>
                    <div v-else>
                        <div class="add-to-cart">
                            <div class="input-group mb-3">
                                <button class="btn btn-outline-secondary" type="button" @click="decreaseQuantity">-</button>
                                <input type="text" class="form-control" v-model="quantity" readonly>
                                <button class="btn btn-outline-secondary" type="button" @click="increaseQuantity">+</button>
                            </div>
                            <button class="btn btn-primary" @click="addToCart(product.id)">Add to Cart</button>
                        </div>
                    </div>
                </div>
                <div v-if="userRole==='manager'" class="edit-card">
                    <button class="btn btn-primary" @click="editCategory">Edit</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            quantity: 0,
            userRole: localStorage.getItem('role'),
            cart: []
        };
    },
    methods: {
        // Method to increase the quantity
        increaseQuantity() {
            if(this.quantity < this.product.quantity)
            this.quantity++;
        },
        // Method to decrease the quantity
        decreaseQuantity() {
            if (this.quantity > 0) {
                this.quantity--;
            }
        },
        // Method to navigate to the product edit page for managers
        editCategory() {
            console.log(this.product);
            console.log(typeof this.product.id)
            this.$router.push(`/product/edit/${this.product.id}`);
        },
        // Method to add the product to the cart for customers
        addToCart(id) {
            this.$store.commit('addToCart', { productId: id, quantity: this.quantity });
            console.log(this.$store.state.cart);
            const Swal = SweetAlert
            Swal.fire({
                title: 'Success!',
                text: 'Added to the Cart!',
                icon: 'success',
                confirmButtonText: 'Close'
            })
        },
    }
};
