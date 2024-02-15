export default {
    template: `
    <div>
        <h2 class="mb-4">Your Previous Orders</h2>
        <ul class="list-group">
            <li v-for="order in filteredOrders" :key="order.id" class="list-group-item">
                <h5 class="mb-3">Order ID: {{ order.id }}</h5>
                <p>Order Date: {{ order.order_date }}</p>
                <p>Total Price: {{ order.total_price.toFixed(2) }}</p>
                <p class="mb-2">Products:</p>
                <ul class="list-group">
                    <li v-for="product in order.products" :key="product.id" class="list-group-item" style="background-color: #FFF;">
                        <p class="mb-1"><strong>Product Name:</strong> {{ product.productName }}</p>
                        <p class="mb-1"><strong>Quantity:</strong> {{ product.quantity }}</p>
                    </li>
                </ul>
                <hr class="my-4" style="border-color: #333;">
            </li>
        </ul>
    </div>
    `,
    data() {
        return {
            orders: [],
            id: localStorage.getItem("id")
        };
    },
    computed: {
        filteredOrders() {
            // Filter orders based on the customer ID
            return this.orders.filter(order => order.user_id === parseInt(this.id));
        }
    },
    methods: {
        async getOrders() {
            try {
                console.log('Fetching orders...');
                const response = await fetch('/api/orders');
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                console.log('Fetched orders:', data);
                this.orders = data;
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
    },
    mounted() {
        console.log('Component mounted. Fetching orders...');
        this.getOrders();
    }
};
