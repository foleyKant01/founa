from flask_restful import Resource
from helpers.produits import *


class ProduitsApi(Resource):
    def post(self, route):
        if route == "create":
            return CreateUser()
        
        if route == "login":
            return LoginUser()
        
        if route == "save_new_password":
            return SaveNewPassword()
        
        if route == "delete":
            return DeleteUser()
        
    
    def get(self, route):
        if route == "readall":
            return ReadAllUser()