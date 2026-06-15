export default {
    template: `
    <div class="row border border-black">
    <div class="col" style="height: 750;">
        <div class="border mx-auto mt-5" style="height: 400px; width: 200px">
            {{userData.username}}
            {{userData.email}}
            {{userData.password}}
        </div>

    </div>
</div>
 `,
    data: function () {
        return {
            userData: ""
        }
    },
    mounted() {
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
            })
            .then(data => {
                this.userData = data;
            })
            .catch(err => {
                console.log(err);
            })
    }
}  