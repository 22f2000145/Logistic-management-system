export default {
    template: `
    <div class="p-3">
        <h2>Welcome, {{userData.username || localUsername}}!</h2>
        <div class="row border">
            <div class="col-8 border" style="height: 750px; overflow-y: auto;">
                <h2>Your Transactions</h2>
                <div v-for="temp in transactions" class="card" style="border: 1px solid black; margin: 10px;">
                    <div class="card-body">
                        <h5 class="card-title">{{ temp.name }} <span class="badge text-white bg-warning">{{ temp.internal_status }}</span></h5>
                        <p class="card-text">Created at: {{ temp.date }}</p>
                        <p v-if="temp.internal_status == 'paid'" class="card-text">Delivery: {{ temp.delivery }}</p>
                        <p v-if="temp.internal_status == 'paid'" class="card-text">Delivery: {{ temp.delivery_status }}</p>
                        <p class="card-text">About: {{ temp.description }}</p>
                        <p class="card-text">From {{ temp.source }} to {{ temp.destination }}</p>
                        <div v-if="temp.internal_status == 'pending'">
                            <p class="card-text">Amount: {{ temp.amount }}</p>
                            <button class="btn btn-primary" @click="payTrans(temp.id)">Pay now </button>
                        </div> 
                        <div v-if="temp.internal_status == 'requested'">
                            <router-link :to="{name: 'Update', params: {id: temp.id}}" class="btn btn-warning">Update</router-link>
                            <button class="btn btn-danger" @click="deleteTrans(temp.id)">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 border" style="min-height: 750px;">
                <h2>Create Transaction</h2>
                <div class="mb-3">
                    <label for="name" class="form-label">Transaction Name</label>
                    <input type="text" class="form-control" id="name" v-model="t.name">
                </div>
                <div class="mb-3">
                    <label for="type" class="form-label">Transaction Type</label>
                    <input type="text" class="form-control" id="type" v-model="t.type">
                </div>
                <div class="d-flex"> 
                    <div class="mb-3">
                        <label for="source" class="form-label">Source</label>
                        <select class="form-select" aria-label="Default select example" v-model="t.source">
                            <option value="" disabled selected hidden>City</option>
                            <option value="Mumbai">Mumbai</option> 
                            <option value="Delhi">Delhi</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Hyderabad">Hyderabad</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="destination" class="form-label">Destination</label> 
                        <select class="form-select" aria-label="Default select example" v-model="t.destination">
                            <option value="" disabled selected hidden>City</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Hyderabad">Hyderabad</option>
                        </select>
                    </div>
                </div> 
                <div class="mb-4">
                    <label for="description" class="form-label">Description</label>
                    <input type="text" class="form-control" id="description" v-model="t.description">
                </div>
                <div class="mb-3 text-end">
                    <button class="btn btn-primary" @click="createTrans" :disabled="isSubmitting">
                        <span v-if="isSubmitting">Creating</span>
                        <span v-else>Create</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function () {
        return {
            userData: "",
            localUsername: localStorage.getItem("username"),
            transactions: null,
            isSubmitting: false,
            t: {
                name: "",
                type: "",
                source: "",
                destination: "",
                description: ""
            }
        }
    },
    mounted() {
        this.loadUser();
        this.loadTrans();
        this.polling = setInterval(() => {
            this.loadTrans();
        }, 10000);
    },
    beforeDestroy() {
        clearInterval(this.polling);
    },
    methods: {
        loadUser() {
            fetch('/api/home', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.userData = data;
                })
        },
        loadTrans() {
            fetch('/api/get', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.transactions = data;
                })
        },
        createTrans() {
            fetch('/api/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.t)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.t = { name: "", type: "", source: "", destination: "", description: "" }
                    this.loadTrans()
                })
        },
        payTrans(id) {
            fetch(`/api/pay/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.loadTrans()
                })
        },
        deleteTrans(id) {
            fetch(`/api/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.loadTrans()
                })
        }
    }
}
