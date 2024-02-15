// index.js
import router from "./router.js"
import Navbar from "./components/Navbar.js"
import store from "./store/store.js"


// Global navigation guard to check authentication token
router.beforeEach((to, from, next) => {
    const authToken = localStorage.getItem('auth-token');

    // Redirect to Home if not authenticated and trying to access protected routes
    if (!authToken && to.name !== 'Home' && to.name !== 'Login' && to.name !== 'Register') {
        next({ name: 'Home' }); 
    } 
    else {
        next(); // Proceed with navigation
    }
});



new Vue({
    el : "#app",
    template : `<div>
    <Navbar :key='has_changed'/>
    <router-view class='m-3'/>
    </div>`,
    router,
    store: store,
    components: {
        Navbar
    },
    data:{
        has_changed:true
    },
    // Watch for changes in the route and toggle has_changed to force re-rendering of Navbar
    watch:{
        $route(to, from){
            this.has_changed = !this.has_changed
        },
    }
})