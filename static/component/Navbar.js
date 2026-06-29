export default {
    template: `
    <div class="row g-0 border-bottom align-items-center px-4 py-2" style="background-color: #fff;">
        <div class="col fs-3 fw-bold text-dark">
            <router-link to="/" class="text-decoration-none text-dark">logiX</router-link>
        </div>
        <div class="col-auto d-flex align-items-center">
            <span v-if="isLoggedIn" class="me-3 text-secondary">Logged in as: <strong>{{ username }}</strong></span>
            <template v-if="isLoggedIn">
                <router-link v-if="isAdmin" class="btn btn-outline-primary px-3 me-2" to="/admin">Admin Panel</router-link>
                <router-link v-else class="btn btn-outline-primary px-3 me-2" to="/dashboard">Dashboard</router-link>
                <button class="btn btn-danger px-3" @click="logout">Logout</button>
            </template>
            <template v-else>
                <router-link class="btn btn-primary px-3 me-2" to="/login">Login</router-link>
                <router-link class="btn btn-warning px-3" to="/register">Register</router-link>
            </template>
        </div>
    </div>
    `,
    data() {
        return {
            isLoggedIn: !!localStorage.getItem("auth_token"),
            isAdmin: false,
            username: ""
        }
    },
    created() {
        this.updateState();
    },
    watch: {
        $route() {
            this.updateState();
        }
    },
    methods: {
        updateState() {
            this.isLoggedIn = !!localStorage.getItem("auth_token");
            this.username = localStorage.getItem("username") || "";
            const rolesStr = localStorage.getItem("roles");
            if (rolesStr) {
                try {
                    const roles = JSON.parse(rolesStr);
                    this.isAdmin = Array.isArray(roles) && roles.includes("admin");
                } catch (e) {
                    this.isAdmin = rolesStr.includes("admin");
                }
            } else {
                this.isAdmin = false;
            }
        },
        logout() {
            fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth_token') || ''
                }
            }).finally(() => {
                localStorage.clear();
                this.updateState();
                this.$router.push('/login');
            });
        }
    }
}
