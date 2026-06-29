export default {
    template: `
    <div class="p-3">
        <h2>Welcome, {{userData.username || localUsername}}!</h2>
        <div class="row border">
            <div class="col-8 border" style="height: 750px; overflow-y: auto;">
                <h2>Requested Transactions</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Created At</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in transactions" v-if="t.internal_status == 'requested'">
                            <td>{{ t.date.substring(0, 10) }}</td>
                            <td>{{ t.name }}</td>
                            <td>{{ t.type }}</td>
                            <td>{{ t.source }}</td>
                            <td>{{ t.destination }}</td>
                            <td>
                                <button class="btn btn-success">Review</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h2>Pending Transactions</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Created At</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in transactions" v-if="t.internal_status == 'pending'">
                            <td>{{ t.date.substring(0, 10) }}</td>
                            <td>{{ t.name }}</td>
                            <td>{{ t.type }}</td>
                            <td>{{ t.source }}</td>
                            <td>{{ t.destination }}</td>
                            <td>{{ t.amount }}</td>
                            <td>
                                <button class="btn btn-success">Accept</button>
                                <button class="btn btn-danger">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h2>Paid Transactions</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Created At</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Delivery Status</th>
                            <th>Date of Delivery</th>
                            <th>Update Delivery Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in transactions" v-if="t.internal_status == 'paid'">
                            <td>{{ t.date.substring(0, 10) }}</td>
                            <td>{{ t.name }}</td>
                            <td>{{ t.type }}</td>
                            <td>{{ t.source }}</td>
                            <td>{{ t.destination }}</td>
                            <td>{{ t.delivery_status }}</td>
                            <td>{{ t.delivery }}</td>
                            <td>
                                <div class="d-flex gap-2">
                                    <select class="form-select" aria-label="Default select example" v-model="t.delivery_status">
                                        <option value="" disabled selected hidden>Select</option>
                                        <option value="in-process">In Process</option>
                                        <option value="in-transit">In Transit</option>
                                        <option value="dispatched">Dispatched</option>
                                        <option value="out-for-delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                    <button class="btn btn-success" @click="update(t.id)">Update</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                    <button class="btn btn-primary" @click="review" :disabled="isSubmitting">
                        <span v-if="isSubmitting">reviewing</span>
                        <span v-else>review</span>
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
        review() {

        },
        update(id) {
            const trans = this.transactions.find(t => t.id === id);
            if (!trans) return;
            fetch(`/api/deliver/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({ status: trans.delivery_status })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Could not update status");
                })
                .then(data => {
                    alert(data.message || "Status updated successfully!");
                    this.loadTrans();
                })
                .catch(err => {
                    console.error(err);
                    alert(err.message || "Failed to update status");
                });
        }
    }
}
