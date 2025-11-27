from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask import Flask, render_template
import os
from flask_restful import Api
from config.db import db
from config.constant import *
from model.founa import *
from ressources.clients import ClientsApi
from ressources.commandes import CommandesApi
from ressources.fournisseurs import FournisseursApi
from ressources.produits import ProduitsApi
from flask_migrate import Migrate
from flask_cors import CORS



app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'super-secret'
jwt = JWTManager(app)

app.secret_key = os.urandom(24)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = LIEN_BASE_DE_DONNEES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

migrate = Migrate(app, db)
api = Api(app)

CORS(app, resources={r"/*": {"origins": "*"}}) 

@app.after_request
def after_request(response):
    response.headers["Content-Type"] = "application/json"
    return response


@app.route('/a')    
def home():
    print('Founa CI')
    return render_template('index.html')


api.add_resource(ClientsApi, '/api/clients/<string:route>', endpoint='all_clients', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(CommandesApi, '/api/commandes/<string:route>', endpoint='all_commandes', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(FournisseursApi, '/api/fournisseurs/<string:route>', endpoint='all_fournisseurs', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(ProduitsApi, '/api/produits/<string:route>', endpoint='all_produits', methods=['GET', 'POST', 'DELETE', 'PATCH'])

@app.route("/api/test", methods=["GET"])
def test():
    return {"message": "API OK"}


if __name__ == '__main__':
    app.run(debug=True,  host="0.0.0.0")  