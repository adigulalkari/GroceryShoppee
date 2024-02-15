// CustomerHome.js
import ProductCard from "./ProductCard.js";
import ProductCarousel from "./ProductCarousel.js";
import SearchBar from "./SearchBar.js";

export default {
    template: `
        <div>
            <h1>Welcome Customer</h1>
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
            
        }
    },
    computed: {
        categorizedProducts() {
            // Use filtered products if available, otherwise use all products
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
        // Method to perform search based on user input
        performSearch({ query, filter }) {
            if (filter === 'product') {
                this.filteredProducts = this.data.filter(product => product.productName.toLowerCase().includes(query.toLowerCase()));
            } else if (filter === 'category') {
                this.filteredProducts = this.data.filter(product => product.category_name.toLowerCase().includes(query.toLowerCase()));
            }
        }
    },
    // Lifecycle hook that runs before the component is mounted
    beforeMount() {
        this.getProducts();
    }
}




