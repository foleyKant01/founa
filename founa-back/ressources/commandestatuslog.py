from flask_restful import Resource
from helpers.commandestatuslog import *


class CommandeStatusLogApi(Resource): 
    def post(self, route):
        if route == "get_single_commande_status_log": 
            return GetSingleCommandeStatusLog()
        
    
    # def get(self, route):
    #     if route == "get_all_produits":
    #         return GetAllProduits() 