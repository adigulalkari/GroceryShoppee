// import Home from './components/Home.js'
import Home from './components/Home.vue'
import Login from "./components/Login.js"
import Users from './components/Users.js'
import Register from './components/Register.js'
import CatForm from './components/CatForm.js'
import ProdForm from './components/ProdForm.js'
import Cart from './components/Cart.js'
import History from './components/History.js'

// Define routes
const routes = [
    { path : '/', component : Home, name:'Home' },
    { path : '/login', component : Login, name:'Login' },
    { path : '/users', component : Users},
    { path : '/register', component : Register,name:'Register'},
    { path: '/product/:formtype/:id?', component: ProdForm, props: true },
    { path: '/category/:formtype/:id?', component: CatForm, props: true},
    { path: '/cart', component: Cart},
    { path: '/history', component: History}
]

export default new VueRouter({
    routes
})