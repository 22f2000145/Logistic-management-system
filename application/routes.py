from flask_security import roles_accepted
from application.database import db
from application.models import User, Role, Transaction
from flask import current_app as app
from flask_security import auth_required, roles_required, current_user, hash_password, verify_password, login_user
from flask import jsonify, request, render_template
from application.utils import roles_list


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/api/admin')
@auth_required('token') #authentication required for this route, using token authentication
@roles_required('admin')#authorization required for this route, only users with 'admin' role can access this route
def admin():
    return {
        'message': 'Welcome to the admin page'
    }

@app.route('/api/home') 
@auth_required('token') #authentication required for this route, using token authentication
@roles_accepted('user','admin') #authorization required for this route, only users with 'user' role can access this route
def user_home():
    user = current_user
    return jsonify({
        'username': user.username,
        'email': user.email,
        'roles': roles_list(user.roles)
    })  

@app.route('/api/login', methods=['POST'])
def user_login():
    body = request.get_json()
    email = body['email']
    password = body['password']
    
    if not email:
        return jsonify({
            'message': 'Email is required'
        }), 400
    
    user = app.security.datastore.find_user(email=email)

    if user:
        if verify_password(password, user.password):
            if current_user.is_authenticated:
                return jsonify({
                    'message': 'User already logged in'
                }), 400
            login_user(user)
            return jsonify({
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'roles': roles_list(user.roles),
                'auth-token': user.get_auth_token()
            }), 200
        else:
            return jsonify({
                'message': 'Invalid password'
            }), 400
    else:
        return jsonify({
            'message': 'User not found'
        }), 404

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

@app.route('/api/pay/<int:trans_id>')
@auth_required('token')
@roles_required('user')
def payment(trans_id):
    transaction = Transaction.query.get(trans_id)
    if transaction:
        transaction.internal_status = 'paid'
        db.session.commit()
        return jsonify({
            'message': 'Payment successful'
        }), 200
    return jsonify({
        'message': 'Transaction not found'
    }), 404

@app.route('/api/deliver/<int:trans_id>', methods=['POST'])
@auth_required('token')
@roles_required('admin')
def deliver(trans_id):
   body = request.get_json()
   trans = Transaction.query.get(trans_id)
   trans.delivery_status = body['status']
   db.session.commit()
   return jsonify({
       'message': 'Delivered status updated'
   }), 200


@app.route('/api/review/<int:trans_id>', methods=['POST'])
@auth_required('token')
@roles_required('admin')
def review(trans_id):
    body = request.get_json()
    trans = Transaction.query.get(trans_id)
    trans.delivery = body['delivery']
    trans.amount = body['amount']
    trans.internal_status = 'pending'
    db.session.commit()
    return jsonify({
        'message': 'Review done'
    }), 200
