// ManagerHome.js
import ProductCard from "./ProductCard.js";
import ProductCarousel from "./ProductCarousel.js";
import SearchBar from "./SearchBar.js";

export default {
    template: `
    <div>
        <h1>Welcome Manager</h1>
        <button class="btn btn-primary my-3" @click='downloadStock'>Download Stock</button><span v-if="isWaiting"> Waiting...</span>
        <SearchBar @search="performSearch" /> 
        <div v-for="(carouselData, category) in categorizedProducts" :key="category">
            <h2>{{ category }}</h2>
            <ProductCarousel :products="carouselData" :category="category" />
        </div>
    </div>
    `,
    components: {
        ProductCard,
        ProductCarousel,
        SearchBar
    },
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            data: [],
            filteredProducts: [],
            isWaiting: false
        }
    },
    computed: {
        // Computed property to categorize products based on category_name
        categorizedProducts() {
            const products = this.filteredProducts.length ? this.filteredProducts : this.data;
            const categorized = {};
            products.forEach(product => {
                const categoryName = product.category_name;
                if (!categorized[categoryName]) {
                    categorized[categoryName] = [];
                }
                categorized[categoryName].push(product);
            });
            return categorized;
        }
    },
    methods: {
        // Method to fetch products from the server
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
        // Method to handle search functionality
        performSearch({ query, filter }) {
            if (filter === 'product') {
                this.filteredProducts = this.data.filter(product => product.productName.toLowerCase().includes(query.toLowerCase()));
            } else if (filter === 'category') {
                this.filteredProducts = this.data.filter(product => product.category_name.toLowerCase().includes(query.toLowerCase()));
            }
        },
         // Method to initiate the stock download process
        async downloadStock(){
            this.isWaiting=true
            const res = await fetch("/download-csv")
            const data = await res.json()
            if(res.ok){
                const taskId = data['task_id']
                // Polling to check if the task is completed and download link is available
                const intv = setInterval(async ()=>{
                    const csv_res = await fetch(`/get-csv/${taskId}`)
                    if(csv_res.ok){
                        this.isWaiting = false
                        clearInterval(intv)
                        window.location.href = `/get-csv/${taskId}` // Redirect to the download link
                    }
                },1000)
            }
        }
    },
    beforeMount() {
        // Lifecycle hook to fetch products before the component is mounted
        this.getProducts();
    }
}




