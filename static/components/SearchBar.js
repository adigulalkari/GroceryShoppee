// SearchBar.js
export default {
    template: `
        <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search by name or category">
            <div class="input-group-append" style="width: 15%;">
                <select class="form-select" v-model="filterOption">
                    <option value="product">Product</option>
                    <option value="category">Category</option>
                </select>
                <button class="btn btn-outline-secondary" type="button" @click="search">Search</button>
            </div>
        </div>
    `,
    data() {
        return {
            searchQuery: '',
            filterOption: 'product'
        };
    },
    methods: {
        search() {
            this.$emit('search', { query: this.searchQuery, filter: this.filterOption });
        }
    }
};
