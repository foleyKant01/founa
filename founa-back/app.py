from flask_jwt_extended import JWTManager
from flask import Flask, render_template
import os
from flask_restful import Api
from config.db import db
from config.constant import *
from model.founa import *
from ressources.clients import ClientsApi 
from ressources.teller import TellerApi 
from ressources.admin import AdminApi 
from ressources.commandes import CommandesApi
from ressources.auth import AuthApi
from ressources.produits import ProduitsApi
from ressources.favoris import FavorisApi 
from ressources.pushnotification import PushNotificationApi 
from ressources.jeko import JekoApi
from ressources.partnerpub import PartnerPubApi
from ressources.commandestatuslog import CommandeStatusLogApi
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
api.add_resource(TellerApi, '/api/teller/<string:route>', endpoint='all_tellers', methods=['GET', 'POST', 'DELETE', 'PATCH']) 
api.add_resource(AdminApi, '/api/admin/<string:route>', endpoint='all_admins', methods=['GET', 'POST', 'DELETE', 'PATCH']) 
api.add_resource(CommandesApi, '/api/commandes/<string:route>', endpoint='all_commandes', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(ProduitsApi, '/api/produits/<string:route>', endpoint='all_produits', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(FavorisApi, '/api/favoris/<string:route>', endpoint='all_favoris', methods=['GET', 'POST', 'DELETE', 'PATCH']) 
api.add_resource(AuthApi, '/api/auth/<string:route>', endpoint='all_auth', methods=['GET', 'POST', 'DELETE', 'PATCH']) 
api.add_resource(JekoApi, '/api/jeko/<string:route>', endpoint='all_jeko', methods=['GET', 'POST', 'DELETE', 'PATCH']) 
api.add_resource(PushNotificationApi, '/api/pushnotification/<string:route>', endpoint='all_pushnotification', methods=['GET', 'POST', 'DELETE', 'PATCH']) 
api.add_resource(CommandeStatusLogApi, '/api/commandestatuslog/<string:route>', endpoint='all_commandestatuslog', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(PartnerPubApi, '/api/partner_pub/<string:route>', endpoint='all_partner_pub', methods=['GET', 'POST', 'DELETE', 'PATCH'])

@app.route("/api/test", methods=["GET"])
def test():
    return {"message": "API OK"}

if __name__ == '__main__':
    app.run(debug=True,  host="0.0.0.0")  