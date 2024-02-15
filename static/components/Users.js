
export default {
    template: `
    <div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Activation</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in allUsers" :key="user.id">
                    <td>{{ user.email }}</td>
                    <td>
                        <button v-if="!user.active" @click="approve(user.id)" class="btn btn-primary">Activate</button>
                        <button v-else class="btn btn-secondary" disabled>Activated</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    data() {
        return {
            allUsers: [],
            token: localStorage.getItem('auth-token'),
            error: null
        };
    },
    methods: {
        // Method to approve user activation
        async approve(mgr_id) {
            const res = await fetch(`admin/activate/${mgr_id}`, {
                headers: {
                    'Authentication-Token': this.token
                }
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'User has been Approved!',
                    icon: 'success',
                    confirmButtonText: 'Close'
                })
                this.$router.push(0);
            }
        }
    },
     // Component lifecycle hook - executed after the component has been mounted
    async mounted() {
        const res = await fetch('/users', {
            headers: {
                'Authentication-Token': this.token
            },
        });
        const data = await res.json().catch((e) => {});
        if (res.ok) {
            this.allUsers = data; // Assign fetched users to the component data
        } else {
            this.error = res.status;// Assign error status to the error variable
        }
    }
}
