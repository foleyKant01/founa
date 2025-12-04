from flask_restful import Resource
from helpers.produits import *


class ProduitsApi(Resource):
    def post(self, route):
        if route == "create_produit":
            return CreateProduit()
        
    
    def get(self, route):
        if route == "get_all_produits":
            return GetAllProduits()