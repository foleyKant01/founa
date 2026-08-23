from flask_restful import Resource
from helpers.clients import *


class ClientsApi(Resource):
    def post(self, route):
        if route == "create_client":
            return CreateClient() 
        
        if route == "send_otp":
            print("🔥🔥🔥 JE VAIS APPELER SEND_OTP 🔥🔥🔥")
            return send_OTP()
        
        if route == "verfiy_otp":
            return verfiy_OTP()
        
        if route == "read_single_client":
            return ReadSingleClient() 
        
        if route == "update_client":
            return UpdateClient()
        
        if route == "update_password":
            return UpdatePassword()
        
        # if route == "delete":
        #     return DeleteUser() 
        
    
    def get(self, route):
        if route == "read_all_client":
            return ReadAllClients()