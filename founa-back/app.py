from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask import Flask, render_template, request, redirect
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
from ressources.fournisseurs import FournisseursApi
from ressources.produits import ProduitsApi
from ressources.favoris import FavorisApi
from ressources.alibaba import AlibabaApi
from flask_migrate import Migrate

from flask_cors import CORS
import requests
from urllib.parse import urlencode



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
    
    
@app.route('/api/alibaba/authorize', methods=['GET'])
def alibaba_authorize():

    params = {
        "response_type": "code",
        "redirect_uri": "https://founa.ci/api/alibaba/callback",
        "client_id": "503830"
    }

    authorization_url = (
        "https://openapi-auth.alibaba.com/oauth/authorize?"
        + urlencode(params)
    )

    return redirect(authorization_url)


@app.route('/api/alibaba/callback', methods=['GET'])
def alibaba_callback():
    import iop

    code = request.args.get("code")

    if not code:
        return {
            "success": False,
            "message": "Authorization code manquant"
        }, 400

    print("Code Alibaba reçu :", code)

    try:
        client = iop.IopClient(
            "https://openapi-api.alibaba.com/rest",
            ALIBABA_APP_KEY,
            ALIBABA_APP_SECRET
        )

        req = iop.IopRequest("/auth/token/create")
        req.add_api_param("code", code)

        response = client.execute(req)

        print("Alibaba token response:")
        print(response.body)

        return {
            "success": True,
            "data": response.body
        }, 200

    except Exception as e:
        print("Alibaba OAuth error:", str(e))

        return {
            "success": False,
            "message": "Erreur lors de la récupération du token Alibaba",
            "error": str(e)
        }, 500
    

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
api.add_resource(FournisseursApi, '/api/fournisseurs/<string:route>', endpoint='all_fournisseurs', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(ProduitsApi, '/api/produits/<string:route>', endpoint='all_produits', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(FavorisApi, '/api/favoris/<string:route>', endpoint='all_favoris', methods=['GET', 'POST', 'DELETE', 'PATCH'])
api.add_resource(AuthApi, '/api/auth/<string:route>', endpoint='all_auth', methods=['GET', 'POST', 'DELETE', 'PATCH'])
# api.add_resource(AlibabaApi, '/api/alibaba/<string:route>', endpoint='all_alibaba', methods=['GET', 'POST', 'DELETE', 'PATCH'])

@app.route("/api/test", methods=["GET"])
def test():
    return {"message": "API OK"}


if __name__ == '__main__':
    app.run(debug=True,  host="0.0.0.0")  