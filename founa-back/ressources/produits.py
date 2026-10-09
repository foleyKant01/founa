from flask_restful import Resource
from helpers.produits import *


class ProduitsApi(Resource): 
    def post(self, route):
        if route == "get_single_produit":
            return GetSingleProduit()  
        
        if route == "update_produit":
            return UpdateProduit()   
        
        if route == "all_similar_products":
            return AllSimilarProducts()   
             
        if route == "search_product":
            return SearchProduct() 
        
        if route == "get_produits_by_categorie":
            return GetProduitsByCategorie() 

    
    def get(self, route):
        if route == "get_all_produits":
            return GetAllProduits() 
        
        if route == "get_all_unavaible_product":
            return GetAllUnavaibleProduct() 
        
        if route == "importer_produit":
            return ImporterProduit() 
        
        if route == "top_products":
            return TopProducts()
        
        if route == "mettre_a_jour_prix_vente":
            return MettreAJourPrixVente()