// Store.js

// Vuex store state
const state = {
    cart: {},
    grandTotal : 0
}
// Vuex store mutations
const mutations = {
    // Mutation to add items to the cart
    addToCart(state, payload) {
        state.cart[payload.productId] = payload.quantity;
    },
    // Mutation to update the grand total of the cart
    updateGrandTotal(state, total) {
        state.grandTotal = total;
    },
    // Mutation to reset the cart (clear items and set grand total to 0)
    resetCart(state){
        state.cart = {}
        state.grandTotal = 0;
    }
}
// Export a new Vuex store instance with the defined state and mutations
export default new Vuex.Store({
    state,
    mutations
});
