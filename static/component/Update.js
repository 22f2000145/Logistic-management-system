export default {
    template: `
    <div class="p-3">
        <h2>Update Your Transaction</h2>
        <div class="row border">
            <div class="col-4 border" style="min-height: 750px;">
                <h2>Update Transaction</h2>
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
                    <button class="btn btn-warning" @click="updateTrans" :disabled="isSubmitting">
                        <span v-if="isSubmitting">Updating...</span>
                        <span v-else>Update</span>
                    </button>
                    <router-link to="/dashboard" class="btn btn-secondary ms-2">Cancel</router-link>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function () {
        return {
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
        this.fetchTransaction();
    },
    methods: {
        fetchTransaction() {
            const transId = this.$route.params.id;
            fetch('/api/get', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Could not fetch transaction details");
                })
                .then(data => {
                    const match = data.find(t => t.id == transId);
                    if (match) {
                        this.transdata.name = match.name;
                        this.transdata.type = match.type;
                        this.transdata.source = match.source;
                        this.transdata.destination = match.destination;
                        this.transdata.description = match.description;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        updateTrans() {
            this.isSubmitting = true;
            const transId = this.$route.params.id;
            fetch(`/api/update/${transId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.transdata)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    return response.json().then(err => {
                        throw new Error(err.message || "Could not update transaction");
                    });
                })
                .then(data => {
                    alert(data.message || "Transaction updated successfully!");
                    this.$router.push('/dashboard');
                })
                .catch(err => {
                    console.log(err);
                    alert(err.message || "Failed to update transaction.");
                })
                .finally(() => {
                    this.isSubmitting = false;
                });
        }
    }
}
