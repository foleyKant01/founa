from flask_restful import Resource
from helpers.produits import *


class ProduitsApi(Resource): 
    def post(self, route):
        if route == "create_produit": 
            return CreateProduit()
        
        if route == "get_single_produit":
            return GetSingleProduit() 
        
        if route == "get_all_produit_by_teller":
            return GetAllProduitByTeller() 

        if route == "update_produit":
            return UpdateProduit()   
        
        if route == "all_similar_products":
            return AllSimilarProducts()   
             
        if route == "delete_produit_by_teller":
            return DeleteProduitByTeller()  
        
        if route == "search_product":
            return SearchProduct()   
             
    
    def get(self, route):
        if route == "get_all_produits":
            return GetAllProduits()