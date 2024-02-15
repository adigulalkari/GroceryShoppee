export default {
    template : `<nav class="navbar navbar-expand-lg bg-body-tertiary ">
    <div class="container-fluid">
      <a class="navbar-brand text-warning"  href="/#/">GroceryShopee</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/login" v-if='!is_login'>Login</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/register" v-if='!is_login'>Register</router-link>
          </li>
          <li class="nav-item" v-if="role=='admin'">
            <router-link class="nav-link" to="/users">Users</router-link>
          </li>
          <li class="nav-item" v-if="role=='manager'">
            <router-link class="nav-link" to="/product/create">Create Product</router-link>
          </li>
          <li class="nav-item" v-if="role=='manager'">
            <router-link class="nav-link" to="/category/create">Create Category</router-link>
          </li>
          <li class="nav-item" v-if="role=='admin'">
            <router-link class="nav-link" to="/category/create">Create Category</router-link>
          </li>
          <li class="nav-item" v-if="role=='customer'">
            <router-link class="nav-link" to="/cart">Cart</router-link>
          </li>
          <li class="nav-item" v-if="role=='customer'">
            <router-link class="nav-link" to="/history">History</router-link>
          </li>
          <li class="nav-item text-end" v-if='is_login'>
            <button class="nav-link" @click='logout'>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>`,
  data(){
    return{
      role : localStorage.getItem('role'),
      is_login : localStorage.getItem('auth-token')
    }
  },
  methods: {
    logout(){
      localStorage.removeItem('role')
      localStorage.removeItem('auth-token')
      localStorage.removeItem('id')
      this.$router.push('/')
      this.$router.go(0)
    }
  }
}