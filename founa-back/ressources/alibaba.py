from flask_restful import Resource
from helpers.alibaba import *


class AlibabaApi(Resource):
    def post(self, route):
        
        
        if route == "update_commande":
            return UpdateCommande()
        
        
        
    
    def get(self, route):
        if route == "authorize":
            return AlibabaAuthorize()
        
        if route == "callback":
            return AlibabaCallback() 