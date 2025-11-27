from flask_restful import Resource
from helpers.commandes import *


class CommandesApi(Resource):
    def post(self, route):
        if route == "create_commande":
            return CreateCommande()
        
        if route == "get_single_commande":
            return GetSingleCommande()
        
        if route == "update_commande":
            return UpdateCommande()
        
    
    def get(self, route):
        if route == "get_all_commandes":
            return GetAllCommandes()