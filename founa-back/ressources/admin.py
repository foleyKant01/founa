from flask_restful import Resource
from helpers.admin import *


class AdminApi(Resource):
    def post(self, route):
        if route == "create_admin":
            return CreateAdmin()