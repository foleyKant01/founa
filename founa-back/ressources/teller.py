from flask_restful import Resource
from helpers.teller import *


class TellerApi(Resource):
    def post(self, route):
        if route == "create_teller":
            return CreateTeller()
        
        if route == "read_single_teller":
            return ReadSingleTeller()
        
        if route == "update_teller":
            return UpdateTeller()
        
        # if route == "delete":
        #     return DeleteUser()
        
    
    def get(self, route):
        if route == "read_all_teller":
            return ReadAllClients()