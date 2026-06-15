export default {
    template: `
    <div class="row border border-black">
      <div class="col" style="height: 750px;">
        <div class="border mx-auto mt-5" style="height: 400px; width: 200px;">
          <div>
            <h2 class="text-center">Registration Form</h2>
            <div>
              <label for="email">Enter Your Email</label>
              <input type="text" id="email" v-model="formData.email">
            </div>
            <div>
              <label for="username">Enter Your Username</label>
              <input type="text" id="username" v-model="formData.username">
            </div>
            <div>
              <label for="password">Enter Your Password</label>
              <input type="password" id="password" v-model="formData.password">
            </div>
            <div>
              <button class="btn btn-primary" @click="registerUser">Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    data: function () {
        return {
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
                    alert(err.message);
                });
        }
    }
}



