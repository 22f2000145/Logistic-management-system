export default {
    template: `
    <div class="row justify-content-center align-items-center" style="min-height: 750px;">
        <div class="col-md-4 px-4">
            <div class="card p-4 shadow-sm">
                <p class="mx-2 mt-2 text-danger text-center" v-if="message">{{message}}</p>
                <h3 class="text-center mb-4">Register</h3>
                
                <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" id="email" class="form-control" placeholder="name@example.com" v-model="formData.email">
                </div>
                
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" id="username" class="form-control" placeholder="Choose a username" v-model="formData.username">
                </div>
                
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" class="form-control" placeholder="Choose a password" v-model="formData.password">
                </div>
                
                <button class="btn btn-warning w-100 mt-2" @click="registerUser">Register</button>
            </div>
        </div>
    </div>
    `,
    data: function () {
        return {
            message: '',
            formData: {
                email: '',
                username: '',
                password: ''
            }
        }
    },
    methods: {
        registerUser: function () {
            fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.formData) //the content goes to backend in JSON string
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then(err => {
                            throw new Error(err.message || "Registration failed");
                        });
                    }
                })
                .then(data => {
                    alert(data.message);
                    this.$router.push('/login');
                })
                .catch(err => {
                    this.message = err.message;
                });
        }
    }
}



