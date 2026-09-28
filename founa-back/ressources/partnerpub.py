from flask_restful import Resource
from helpers.partnerpub import *


class PartnerPubApi(Resource):

    def post(self, route):

        if route == "create_partnerpub":
            return CreateOnePartnerPub()

        if route == "read_single_partnerpub":
            return ReadSinglePartnerPub()

        if route == "update_partnerpub":
            return UpdatePartnerPub()

        if route == "statistiques_partnerpub":
            return StatistiquesPartnerPub()

    def get(self, route):

        if route == "read_all_partnerpub":
            return ReadAllPartnerPub()