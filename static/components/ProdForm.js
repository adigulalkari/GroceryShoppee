
// ProductForm.js
export default {
    props: {
        formtype: {
            type: String,
            required: true
        },
        id:{
            type: String
        }
    },
    template: `
    <div class="container my-4">
        <h2>Create A New Product</h2>
        <br>
        <form>
            <div class="mb-3">
                <label for="productName" class="form-label">Product Name</label>
                <input type="text" class="form-control" id="productName" placeholder="Product Name" v-model="product.productName">
            </div>
            <div class="mb-3">
                <label for="unit" class="form-label">Unit of Product</label>
                <input type="text" class="form-control" id="unit" placeholder="Unit of Product" v-model="product.unit">
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="text" class="form-control" id="price" placeholder="Price" v-model="product.price">
            </div>
            <div class="mb-3">
                <label for="quantity" class="form-label">Quantity</label>
                <input type="text" class="form-control" id="quantity" placeholder="Quantity" v-model="product.quantity">
            </div>
            <div class="mb-3">
                <label for="category" class="form-label">Category</label>
                <input type="text" class="form-control" id="category" placeholder="Category" v-model="product.category">
            </div>
            
            <button type="button" class="btn btn-danger" v-if="formtype==='edit'" @click="deleteProduct">Delete</button>
            <button type="button" class="btn btn-primary" v-if="formtype==='create'" @click="createProduct">Create New Product</button>
            <button type="button" class="btn btn-success" v-if="formtype==='edit'" @click="updateProduct">Update Product</button>
        </form>
    </div>
    `,
    data() {
        return {
            data : [],
            product: {
                prodID: null,
                productName: null,
                unit: null,
                price: null,
                quantity: null,
                manufacture: null,
                expiry: null,
                category: null
            },
            token: localStorage.getItem('auth-token'),
            filtered_data : {}
        };
    },
    async created() {
        try {
            // Make getProduct synchronous by using await
            await this.getProduct();
            this.filtered_data = this.filteredProduct();
            // Update product data based on formtype and filtered data
            this.product.prodID = this.filtered_data.id;
            this.product.productName = this.filtered_data.productName;
            this.product.unit = this.filtered_data.unit;
            this.product.quantity = this.filtered_data.quantity;
            this.product.category = this.filtered_data.category_name;
            this.product.price = this.filtered_data.price;
        } catch (error) {
            console.error('Error in created hook:', error);
        }
    },
    methods: {
        // Method to fetch products from the server
        async getProduct() {
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
            console.log("This is data :" ,this.data)
        },
        // Method to filter the product based on the provided ID
        filteredProduct() {
            const parsedID = parseInt(this.id)
            return this.data.find(item => item.id === parsedID) || {};
        },
        // Method to create a new product
        async createProduct() {
            const res = await fetch('/api/product', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.product)
            });

            const data = await res.json();
            if (res.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'New Product Added!',
                    icon: 'success',
                    confirmButtonText: 'Close'
                })
                // Reset product data to null
                this.product = {
                    productName: null,
                    unit: null,
                    price: null,
                    quantity: null,
                    manufacture: null,
                    expiry: null,
                    category: null
                };
            }
        },
        // Method to update an existing product
        async updateProduct() {
            // Confirm with the user before updating the product
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await fetch('/api/product', {
                            method: 'PUT',
                            headers: {
                                'Authentication-Token': this.token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.product)
                        });
        
                        if (res.ok) {
                            Swal.fire({
                                title: "UPDATED!",
                                text: "Your product has been updated.",
                                icon: "success"
                            });
                            this.$router.push("/");
                            this.$router.push(0);
                        } else {
                            const data = await res.json();
                            Swal.fire({
                                title: "Error",
                                text: `Failed to update product. ${data.message || 'Please try again.'}`,
                                icon: "error"
                            });
                        }
                    } catch (error) {
                        console.error('Error updating product:', error);
                        Swal.fire({
                            title: "Error",
                            text: "An unexpected error occurred. Please try again.",
                            icon: "error"
                        });
                    }
                }
            });
        },
        // Method to delete an existing product
        deleteProduct() {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"    
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        try {
                            const res = await fetch('/api/product', {
                                method: 'DELETE',
                                headers: {
                                    'Authentication-Token': this.token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(this.product)
                            });
            
                            if (res.ok) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Your product has been Deleted!.",
                                    icon: "success"
                                });
                                this.$router.push("/");
                                this.$router.push(0);
                            }
                        }catch (error) {
                                console.error('Error deleting product:', error);
                                Swal.fire({
                                    title: "Error",
                                    text: "An unexpected error occurred. Please try again.",
                                    icon: "error"
                                });
                            }
                        }
                })
            }
    }
};
