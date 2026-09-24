from flask_restful import Resource
from helpers.pushnotification import *


class PushNotificationApi(Resource): 
    def post(self, route):
        if route == "register_device_token": 
            return RegisterDeviceToken()
        
        return {
            "status": "error",
            "message": "Route inconnue"
        }, 404