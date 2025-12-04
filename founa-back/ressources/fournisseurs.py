from flask_restful import Resource
from helpers.fournisseurs import *


class FournisseursApi(Resource):
    def post(self, route):
        if route == "create_fournisseur":
            return CreateFournisseur()
        
        if route == "update_fournisseur":
            return UpdateFournisseur()
        
        if route == "delete_fournisseur":
            return DeleteFournisseur()
        
    
    def get(self, route):
        if route == "get_all_fournisseurs":
            return GetAllFournisseurs()