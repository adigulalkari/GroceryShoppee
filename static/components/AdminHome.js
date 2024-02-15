// AdminHome.js

export default {
    template: `
    <div>
        <h1 class="mb-4">Welcome Admin</h1>
        <table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Description</th>
                    <th scope="col">Edit</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in data" :key="category.id">
                    <td>{{ category.catName }}</td>
                    <td>{{ category.description }}</td>
                    <td>
                        <button @click="editCategory(category.id)" class="btn btn-primary">Edit</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`,
    // Data property to store categories and authentication token
    data() {
        return {
            data: [],
            token: localStorage.getItem('auth-token')
        };
    },
    methods: {
        // Method to fetch categories from the server
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

        // Method to navigate to the category edit page
        editCategory(categoryId) {
            this.$router.push(`/category/edit/${categoryId}`);
        },
    },
    mounted() {
        // Fetch categories when the component is mounted
        this.getCategories();
    }
}
