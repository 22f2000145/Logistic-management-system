from application.database import db
from application.models import User, Role
from flask import current_app as app
from flask_security import auth_required, roles_required, current_user, hash_password
from flask import jsonify, request

@app.route('/', methods=['GET'])
def home():
    return {
        'message': 'Welcome to the Flask Security API'
    }

@app.route('/api/admin')
@auth_required('token') #authentication required for this route, using token authentication
@roles_required('admin')#authorization required for this route, only users with 'admin' role can access this route
def admin():
    return {
        'message': 'Welcome to the admin page'
    }

@app.route('/api/home') 
@auth_required('token') #authentication required for this route, using token authentication
@roles_required('user') #authorization required for this route, only users with 'user' role can access this route
def user_home():
    user = current_user
    return jsonify({
        'username': user.username,
        'email': user.email,
        'password': user.password
    })  


@app.route('/api/register', methods=['POST'])
def create_user():
    credentials = request.get_json()
    if not app.security.datastore.find_user(email=credentials['email']):
        app.security.datastore.create_user(email=credentials['email'], 
                                           username=credentials['username'], 
                                           password=hash_password(credentials['password']), 
                                           roles=['user'])
        db.session.commit()
        return jsonify({
            'message': 'User created successfully'
        }), 201

    return jsonify({
        'message': 'User already exists'
    }), 400