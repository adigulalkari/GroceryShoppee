export default{
    template:`
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
        <div class="mb-3 p-5 bg-light">
            <div>{{ error }}</div>
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com"
            v-model="cred.email">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" placeholder="username"
            v-model="cred.username">
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password" >

            <input type="radio" class="form-check-input" id="manager" value="manager" v-model="cred.roles">
            <label for="manager" class="form-check-label">Manager</label>

            <input type="radio" class="form-check-input" id="customer" value="customer" v-model="cred.roles" >
            <label for="customer" class="form-check-label">Customer</label>

            <button class="btn btn-primary mt-2" @click='register' > Register </button>
        </div>
    </div>
    `,
    data(){
        return{
            cred : {
                email : null,
                username : null,
                password : null,
                roles : null
            },
            error: null,
        }
    },
    methods: {
        async register(){
            const res = await fetch('/user-register', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(this.cred)
            })
            if(res.ok){
                this.$router.push({path: '/'})
            }
        }
    }
}