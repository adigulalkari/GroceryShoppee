export default{
    props: {
        formtype: {
            type: String,
            required: true
        },
        id:{
            type: String
        }
    },
    template:`
    <div class="container mt-5">
        <h2>Create A New Category</h2>
        <br>
        <form>
            <div class="mb-3">
                <label for="categoryName" class="form-label">Category Name</label>
                <input type="text" class="form-control" id="categoryName" placeholder="Enter category name" v-model="category.catName" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <input type="text" class="form-control" id="description" placeholder="Enter description" v-model="category.description" required>
            </div>
            <button type="button" class="btn btn-danger" v-if="formtype==='edit'" @click="deleteCategory">Delete</button>
            <button @click="formAction" class="btn btn-primary">{{ formButtonText }}</button>
        </form>
    </div>
    `,
    data(){
        return {
            data: [],
            category: {
                catID: null,
                catName: null,
                description: null
            },
            token: localStorage.getItem('auth-token'),
            filtered_data: {}
        }
    },
    // Created lifecycle hook - runs when the component is created
    async created() {
        await this.getCategories();
        this.filtered_data = this.filteredProduct();
        this.category.catID = this.filtered_data.id;
        this.category.catName = this.filtered_data.catName;
        this.category.description = this.filtered_data.description;
    },
    // Computed property to dynamically set the text on the form button
    computed: {
        formButtonText() {
            return this.formtype === 'create' ? 'Create Category' : 'Update';
        }
    },
    methods: {
        // Method to fetch category data from the server
        async getCategories() {
            try {
                const response = await fetch('/api/category', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                this.data = data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        // Method to filter the category data based on the provided ID
        filteredProduct() {
            const parsedID = parseInt(this.id)
            return this.data.find(item => item.id === parsedID) || {};
        },
        // Method to perform form action (create or update)
        async formAction() {
            if (this.formtype === 'create') {
                await this.createCategory();
            } else if (this.formtype === 'edit') {
                await this.updateCategory();
            }
        },
        // Method to create a new category
        async createCategory() {
            Swal.fire({
                title: 'Success!',
                text: 'Created a new Category',
                icon: 'success',
                confirmButtonText: 'Close'
            })
            const res = await fetch('/api/category', {
            method: 'POST',
            headers: {
                'Authentication-Token': this.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.category),
            })
            if (res.ok) {
                this.$router.push("/")
                this.$router.push(0)
            }
        },
        // Method to update an existing category
        async updateCategory(){
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
                        const res = await fetch('/api/category', {
                            method: 'PUT',
                            headers: {
                                'Authentication-Token': this.token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.category)
                        });
        
                        if (res.ok) {
                            Swal.fire({
                                title: "UPDATED!",
                                text: "Your category has been updated.",
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
                        console.error('Error updating category:', error);
                        Swal.fire({
                            title: "Error",
                            text: "An unexpected error occurred. Please try again.",
                            icon: "error"
                        });
                    }
                }
            });
        },
        // Method to delete a category
        async deleteCategory(){
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await fetch('/api/category', {
                            method: 'DELETE',
                            headers: {
                                'Authentication-Token': this.token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.category)
                        });
        
                        if (res.ok) {
                            Swal.fire({
                                title: "DELETED!",
                                text: "Your category has been deleted.",
                                icon: "success"
                            });
                            this.$router.push("/");
                            this.$router.push(0);
                        } 
                    } catch (error) {
                        console.error('Error delete category:', error);
                        Swal.fire({
                            title: "Error",
                            text: "An unexpected error occurred. Please try again.",
                            icon: "error"
                        });
                    }
                }
            });
        }
    }   
}