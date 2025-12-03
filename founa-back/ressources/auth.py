from flask_restful import Resource
from helpers.auth import *


class AuthApi(Resource):
    def post(self, route):
        if route == "login_client":
            return LoginClient() 
        
        if route == "=forgot_password":
            return ForgotPassword()
        
        if route == "=save_new_password":
            return SaveNewPassword()