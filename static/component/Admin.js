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
                        <tr v-for="temp in transactions" v-if="temp.internal_status == 'requested'">
                            <td>{{ temp.date ? temp.date.substring(0, 10) : '' }}</td>
                            <td>{{ temp.name }}</td>
                            <td>{{ temp.type }}</td>
                            <td>{{ temp.source }}</td>
                            <td>{{ temp.destination }}</td>
                            <td>
                                <button class="btn btn-success" @click="selectForReview(temp)">Review</button>
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
                        <tr v-for="temp in transactions" v-if="temp.internal_status == 'pending'">
                            <td>{{ temp.date ? temp.date.substring(0, 10) : '' }}</td>
                            <td>{{ temp.name }}</td>
                            <td>{{ temp.type }}</td>
                            <td>{{ temp.source }}</td>
                            <td>{{ temp.destination }}</td>
                            <td>{{ temp.amount }}</td>
                            <td>
                                <button class="btn btn-success" @click="acceptTrans(temp.id)">Accept</button>
                                <button class="btn btn-danger" @click="rejectTrans(temp.id)">Reject</button>
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
                        <tr v-for="temp in transactions" v-if="temp.internal_status == 'paid'">
                            <td>{{ temp.date ? temp.date.substring(0, 10) : '' }}</td>
                            <td>{{ temp.name }}</td>
                            <td>{{ temp.type }}</td>
                            <td>{{ temp.source }}</td>
                            <td>{{ temp.destination }}</td>
                            <td><span class="badge bg-success">{{ temp.delivery_status || 'Pending' }}</span></td>
                            <td>{{ temp.delivery }}</td>
                            <td>
                                <div class="d-flex gap-2">
                                    <select class="form-select" aria-label="Default select example" v-model="temp.new_status">
                                        <option value="" disabled selected hidden>Select</option>
                                        <option value="in-process">In Process</option>
                                        <option value="in-transit">In Transit</option>
                                        <option value="dispatched">Dispatched</option>
                                        <option value="out-for-delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                    <button class="btn btn-success" @click="update(temp.id)">Update</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-4 border" style="min-height: 750px; padding: 15px;">
                <div v-if="t.id">
                    <h2>Review Transaction</h2>
                    <div v-if="reviewed">
                        <p class="text-success fw-bold">Transaction reviewed successfully!</p>
                        <button class="btn btn-secondary" @click="clearReview">Clear</button>
                    </div>
                    <div v-else class="mb-3">
                        <p class="fs-5 fw-bold mb-1">Transaction name</p>
                        <p class="border p-2 bg-light rounded">{{ t.name }}</p>
                    </div>

                    <div class="mb-3"> 
                        <p class="fs-5 fw-bold mb-1">Transaction type</p>
                        <p class="border p-2 bg-light rounded">{{ t.type }}</p>
                    </div>

                    <div class="mb-3">
                        <p class="fs-5 fw-bold mb-1">Transaction route</p>
                        <p class="border p-2 bg-light rounded">{{ t.source }} to {{ t.destination }}</p>
                    </div>  
                    
                    <div class="mb-3">
                        <label for="delivery" class="form-label fw-bold">Delivery Date</label>
                        <input type="date" class="form-control" id="delivery" v-model="t.delivery">  
                    </div>

                    <div class="mb-3">
                        <label for="amount" class="form-label fw-bold">Amount</label>
                        <input type="number" class="form-control" id="amount" v-model="t.amount">  
                    </div>
                    <div class="mb-3 text-end">
                        <button class="btn btn-secondary me-2" @click="clearReview">Cancel</button>
                        <button class="btn btn-primary" @click="save(t.id)" :disabled="isSubmitting">
                            <span v-if="isSubmitting">saving</span>
                            <span v-else>Save</span>
                        </button>
                    </div>
                </div>
                <div v-else class="text-center mt-5 text-muted">
                    <p class="fs-5">Select a transaction from the table to review.</p>
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
            reviewed: false,
            isSubmitting: false,
            t: {
                id: null,
                name: "",
                type: "",
                source: "",
                destination: "",
                description: "",
                amount: "",
                delivery: ""
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
        selectForReview(transaction) {
            this.reviewed = false;
            this.t = { ...transaction };
        },
        clearReview() {
            this.reviewed = false;
            this.t = {
                id: null,
                name: "",
                type: "",
                source: "",
                destination: "",
                description: "",
                amount: "",
                delivery: ""
            };
        },
        review(temp) {
            this.t.name = temp.name;
            this.t.type = temp.type;
            this.t.source = temp.source;
            this.t.destination = temp.destination;
            this.t.delivery = temp.delivery;
            this.t.amount = temp.amount;
        },
        update(id) {
            const trans = this.transactions.find(t => t.id === id);
            fetch(`/api/deliver/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({ status: trans.new_status || trans.delivery_status })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.loadTrans()
                })
        },
        save(id) {
            fetch(`/api/review/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.t)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.loadTrans()
                    this.clearReview()
                })
        },
        acceptTrans(id) {
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
        rejectTrans(id) {
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
