from datetime import datetime
from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required, roles_required, roles_accepted, current_user

api = Api()

def roles_list(roles):
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list

parser = reqparse.RequestParser()


parser.add_argument('name')
parser.add_argument('type')
# parser.add_argument('date')
parser.add_argument('source')
parser.add_argument('destination')
parser.add_argument('description')


class TransApi(Resource):
    @auth_required('token')
    @roles_accepted('user','admin')

    def get(self):
        transactions = []
        trans_json = []
        if "admin" in roles_list(current_user.roles):
            transactions = Transaction.query.all()
        else:
            transactions = current_user.trans
        for transaction in transactions:
            this_trans = {}
            this_trans['id'] = transaction.id
            this_trans['name'] = transaction.name
            this_trans['type'] = transaction.type
            this_trans['date'] = transaction.date
            this_trans['delivery'] = transaction.delivery
            this_trans['source'] = transaction.source
            this_trans['destination'] = transaction.destination
            this_trans['internal_status'] = transaction.internal_status
            this_trans['delivery_status'] = transaction.delivery_status
            this_trans['description'] = transaction.description
            this_trans['amount'] = transaction.amount
            this_trans['user'] = transaction.user_id
            trans_json.append(this_trans)
        
        if trans_json:
            return trans_json, 200
        return {
            'message': 'No transactions found'
        }, 404


    @auth_required('token')
    @roles_accepted('user','admin')
    def post(self):
        args = parser.parse_args()
        try:
            transaction = Transaction(name = args["name"],
                                    type = args["type"],
                                    date = datetime.now(),
                                    source = args["source"],
                                    destination = args['destination'],
                                    description = args['description'],
                                    user_id = current_user.id
            )
            
            db.session.add(transaction)
            db.session.commit()
            return {
                "message": "created successfully"
            }
        except:
            return {
                "message": "one or more field is missing"
            }, 400


    @auth_required('token')
    @roles_accepted('user')
    def put(self, trans_id):
        args = parser.parse_args()
        trans = Transaction.query.get(trans_id) 
        if trans:
            trans.name = args['name']
            trans.type = args['type']
            trans.date = args['date']
            trans.source = args['source']
            trans.destination = args['destination']
            trans.description = args['description']
            db.session.commit()
            return {
                "message": "updated successfully"
            }, 200
        else:
            return {
                "message": "transaction not found"
            }, 404
    
    @auth_required('token')
    @roles_accepted('admin')
    def delete(self, trans_id):
        trans = Transaction.query.get(trans_id)
        if trans:
            db.session.delete(trans)
            db.session.commit()
            return {
                "message": "deleted successfully"
            }, 200
        else:
            return {
                "message": "transaction not found"
            }, 404


api.add_resource(TransApi,
                '/api/get',
                '/api/create',
                '/api/update/<int:trans_id>',
                '/api/delete/<int:trans_id>')


