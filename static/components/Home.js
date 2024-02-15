import AdminHome from "./AdminHome.js"
import CustomerHome from "./CustomerHome.js"
import ManagerHome from "./ManagerHome.js"
import Landing from "./Landing.js"

export default {
    template: `
    <div> 
        <AdminHome v-if="userRole === 'admin'" />
        <CustomerHome v-else-if="userRole === 'customer'" />
        <ManagerHome v-else-if="userRole === 'manager'" />
        <Landing v-else />
    </div>`,
    data(){
        return {
            userRole : localStorage.getItem('role')
        }
    },
    components:{
        AdminHome,
        CustomerHome,
        ManagerHome,
        Landing
    }
}