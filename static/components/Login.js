export default {
    template : `
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
        <div class="mb-3 p-5 bg-light">
            <div>{{ error }}</div>
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com"
            v-model="cred.email">
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password" >
            <button class="btn btn-primary mt-2" @click='login' > Login </button>
        </div>
    </div>
    `,
    data(){
        return {
            cred : {
                email : null,
                password : null
            },
            error: null,
        }
    },

    methods: {
        // Method to handle the login process
        async login(){
            // Make a POST request to the server for user login
            const res = await fetch('/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(this.cred)
            })
            // Check if the login was successful (HTTP status code 200)
            if(res.ok){
                const data = await res.json()
                this.userRole = data.role
                // Save user information and authentication token in local storage
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                localStorage.setItem('id', data.id)
                this.$router.push({path: '/'})
            }
        }
    }
}