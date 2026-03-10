from config.db import db
from model.founa import *
from flask import request, jsonify



def SaveFavoris():
    reponse = {}
    try:
        data = request.get_json()

        produit_id = data.get('produit_id')
        client_id = data.get('client_id')      
        all_favs = Favoris.query.filter_by(produit_id=produit_id, client_id=client_id).first()
        if all_favs:
            rs = {
                'fav_status': all_favs.fa_uid
            }
            reponse['status'] = 'success'
            reponse['fav_infos'] = rs
        else:
            new_fav = Favoris(
                produit_id=produit_id,
                client_id=client_id,
            )
            db.session.add(new_fav)
            db.session.commit()

            rs = {
                'fa_uid': new_fav.fa_uid,
                'produit_id': new_fav.produit_id,
                'client_id': new_fav.client_id,
                'creation_date': str(new_fav.creation_date)
            }
        reponse['status'] = 'success'
        reponse['fav_infos'] = rs

    except Exception as e:
        reponse['status'] = 'error'
        reponse['error_description'] = str(e)

    return jsonify(reponse)



def ReadAllFavorisByUser():
    reponse = {}
    try:
        uid = request.json.get('client_id')

        all_favs = Favoris.query.filter_by(client_id=uid).all()
        favs_informations = []

        for fav in all_favs:
            produit = Produit.query.filter_by(uid=fav.produit_id).first()

            if produit:
                favs_infos = {
                    "uid": fav.fa_uid,
                    "produit_id": produit.uid,
                    "nom": produit.name,
                    "image": produit.image,  # chemin image
                    "price": produit.price,
                    "creation_date": str(fav.creation_date),
                }
                favs_informations.append(favs_infos)

        reponse["status"] = "success"
        reponse["favorites"] = favs_informations

    except Exception as e:
        reponse["status"] = "error"
        reponse["error_description"] = str(e)

    return reponse




def DeleteFavoris():
    reponse = {}
    try:
        data = request.get_json()
        produit_id = data.get('produit_id')
        client_id = data.get('client_id')

        delete_fav = Favoris.query.filter_by(
            produit_id=produit_id,
            client_id=client_id
        ).first()

        if delete_fav:
            db.session.delete(delete_fav)
            db.session.commit()
            reponse['status'] = 'success'
            reponse['fav_infos'] = 'Fav deleted'
        else:
            reponse['status'] = 'error'
            reponse['error_description'] = 'Favori introuvable'

    except Exception as e:
        reponse['status'] = 'error'
        reponse['error_description'] = str(e)

    return jsonify(reponse)
