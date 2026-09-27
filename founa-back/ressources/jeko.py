from flask_restful import Resource
from helpers.jeko import *


class JekoApi(Resource):
    def post(self, route):
        if route == "get_jeko_store_balance": 
            return GetJekoStoreBalance()
        
        if route == "payment_request":
            return PaymentRequest() 
        
        if route == "/payment/webhook":
            return ReceiveJekoWebhook()
        
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
        
        if route == "GenerateAccessToken":
            return GenerateAccessToken()
             
    
    def get(self, route):
        if route == "get_all_jeko_stores":
            return GetAllJekoStores()
        