from flask_restful import Resource
from helpers.jeko import *

class JekoApi(Resource):
    def post(self, route):
        if route == "get_jeko_store_balance": 
            return GetJekoStoreBalance()
        if route == "payment_request":
            return PaymentRequest() 
        if route == "webhook":
            return ReceiveJekoWebhook()
    
    def get(self, route):
        if route == "get_all_jeko_stores":
            return GetAllJekoStores()
        