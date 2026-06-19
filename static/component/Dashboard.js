export default {
    template: `
    <div class="p-3">
        <h2>Welcome, {{userData.username || localUsername}}!</h2>
        <div class="row border">
            <div class="col-8 border" style="min-height: 750px;">
                <h2>Your Transactions</h2>
                <div v-for="t in transactions" class="card" style="border: 1px solid black; margin: 10px;">
                    <div class="card-body">
                        <h5 class="card-title">{{ t.name }} <span class="badge text-white bg-warning">{{ t.internal_status }}</span></h5>
                        <p class="card-text">Created at: {{ t.date }}</p>
                        <p v-if="t.internal_status == 'paid'" class="card-text">Delivery: {{ t.delivery }}</p>
                        <p v-if="t.internal_status == 'paid'" class="card-text">Delivery: {{ t.delivery_status }}</p>
                        <p class="card-text">About: {{ t.description }}</p>
                        <p class="card-text">From {{ t.source }} to {{ t.destination }}</p>
                        <div v-if="t.internal_status == 'pending'">
                            <p class="card-text">Amount: {{ t.amount }}</p>
                            <button class="btn btn-primary">Pay now </button>
                        </div> 
                        <div v-if="t.internal_status == 'requested'">
                            <button class="btn btn-warning">Update</button>
                            <button class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 border" style="min-height: 750px;">
                <h2>Create Transaction</h2>
                <div class="mb-3">
                    <label for="name" class="form-label">Transaction Name</label>
                    <input type="text" class="form-control" id="name" v-model="transdata.name">
                </div>
                <div class="mb-3">
                    <label for="type" class="form-label">Transaction Type</label>
                    <input type="text" class="form-control" id="type" v-model="transdata.type">
                </div>
                <div class="d-flex"> 
                <div class="mb-3">
                    <label for="source" class="form-label">Source</label>
                    <select class="form-select" aria-label="Default select example" v-model="transdata.source">
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
                    <select class="form-select" aria-label="Default select example" v-model="transdata.destination">
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
                    <input type="text" class="form-control" id="description" v-model="transdata.description">
                </div>
                <div class="mb-3 text-end">
                    <button class="btn btn-primary" @click = "createTrans">Create</button>
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
            transdata: {
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
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Could not fetch user details");
                })
                .then(data => {
                    this.userData = data;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        loadTrans() {
            fetch('/api/get',
                {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                }
            ).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Could not fetch transactions");
            })
                .then(data => {
                    this.transactions = data;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        createTrans() {
            fetch('/api/create',
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    },
                    body: JSON.stringify(this.transdata)
                }
            ).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Could not create transaction");
            })
                .then(data => {
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        loadUser() {
            fetch('/api/home', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Could not fetch user details");
                })
                .then(data => {
                    this.userData = data;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        loadTrans() {
            fetch('/api/get',
                {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token")
                    }
                }
            ).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Could not fetch transactions");
            })
                .then(data => {
                    this.transactions = data;
                })
                .catch(err => {
                    console.log(err);
                })
        },
    }
}
