from flask import current_app as app
from flask_security import auth_required, roles_required

@app.route('/admin')
@auth_required('token') #authentication required for this route, using token authentication
@roles_required('admin')#authorization required for this route, only users with 'admin' role can access this route
def admin():
    return {
        'message': 'Welcome to the admin page'
    }

