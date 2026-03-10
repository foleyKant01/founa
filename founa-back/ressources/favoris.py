from ipaddress import ip_address
from flask_restful import Resource
from helpers.favoris import *


class FavorisApi(Resource):
    def post(self, route):
        if route == "save_favoris":
            return SaveFavoris()
        
        if route == "read_all_favoris_by_user":
            return ReadAllFavorisByUser()
        
        if route == "delete_favoris":
            return DeleteFavoris()
        