export default {
    template: `
    <div class="p-3">
        <h2>Update Your Transaction</h2>
        <div class="row border">
            <div class="col-4 border" style="min-height: 750px;">
                <h2>Update Transaction</h2>
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
            .then(response => response.json())
            .then(data => {
                const match = data.find(item => item.id == transId);
                if (match) {
                    this.t.name = match.name;
                    this.t.type = match.type;
                    this.t.source = match.source;
                    this.t.destination = match.destination;
                    this.t.description = match.description;
                }
            })
        },
        updateTrans() {
            const transId = this.$route.params.id;
            fetch(`/api/update/${transId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(this.t)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.$router.push('/dashboard')
            })
        }
    }
}
