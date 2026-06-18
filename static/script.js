import Home from './component/Home.js'
import Login from './component/Login.js'
import Register from './component/Register.js'
import Navbar from './component/Navbar.js'
import Footer from './component/footer.js'
import Dashboard from './component/Dashboard.js'

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard }
]

const router = new VueRouter({
    routes
})


const app = new Vue({
    el: '#app',
    router,
    template: `
    <div class="container-fluid px-0">
    <nav-bar></nav-bar>
    <router-view></router-view>
    <foot></foot>
    </div>
    `,
    data: {
        section: "Atul loves ridhi!!!"
    },
    components: {
        'nav-bar': Navbar,
        'foot': Footer
    }
})

