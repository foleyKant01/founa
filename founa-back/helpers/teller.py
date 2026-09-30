from config.db import db
from model.founa import *
from flask import request
from sqlalchemy import func, extract




def CreateOneTeller():
    
    reponse = {}
    try:
        fullname = (request.json.get('fullname'))
        email = (request.json.get('email'))
        phone = (request.json.get('phone'))
        password = (request.json.get('password'))
        confirmpassword = (request.json.get('confirmpassword'))
        if not str(confirmpassword) == str(password):
            return "Mot de passe non conforme"
        
        new_teller = Teller()
        new_teller.fullname = fullname
        new_teller.email = email
        new_teller.phone = phone
        new_teller.password = password
        
        db.session.add(new_teller)
        db.session.commit()

        rs = {}
        rs['uid'] = new_teller.uid
        rs['fullname'] = fullname
        rs['email'] = email
        rs['phone'] = phone
        rs['creation_date'] = str(new_teller.created_date)

        reponse['status'] = 'success'
        reponse['user_infos'] = rs

    except Exception as e:
        reponse['error_description'] = str(e)
        reponse['status'] = 'error'

    return reponse



def ReadAllTellers():
    response = {}
    try:
        all_teller = Teller.query.all()

        if all_teller:
            teller_informations = [
                {
                    'uid': teller.uid,
                    'fullname': teller.fullname,
                    'email': teller.email,
                    'phone': teller.phone,
                    'creation_date': str(teller.created_date)
                } 
                for teller in all_teller
            ]
            response['status'] = 'success'
            response['all_teller'] = teller_informations
        else:
            response['status'] = 'erreur'
            response['motif'] = 'aucun teller trouvé'

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response



def ReadSingleTeller():
    response = {}
    try:
        teller_id = (request.json.get('uid'))
        teller = Teller.query.filter_by(uid=teller_id).first()

        if teller:
            teller_info = {
                'uid': teller.uid,
                'fullname': teller.fullname,
                'email': teller.email,
                'phone': teller.phone,
                'creation_date': str(teller.created_date)
            }
            response['status'] = 'success'
            response['teller'] = teller_info
        else:
            response['status'] = 'error'
            response['message'] = 'teller introuvable'

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response



def UpdateTeller():
    response = {}

    try:
        teller_id = (request.json.get('uid'))
        update_teller = Teller.query.filter_by(uid=teller_id).first()
        
        if update_teller:
            update_teller.fullname = request.json.get('fullname', update_teller.fullname)
            update_teller.email = request.json.get('email', update_teller.email)
            update_teller.phone = request.json.get('phone', update_teller.phone)
            update_teller.password = request.json.get('password', update_teller.password)
     
        db.session.add(update_teller)
        db.session.commit() 
        
        response['status'] = 'success'
        response['message'] = "Mise à jour effectuer"

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response



def StatistiquesTeller():
    
    try:

        data = request.get_json() or {}

        teller_id = data.get("teller_id")

        if not teller_id:
            return {
                "status": "error",
                "message": "teller_id requis"
            }, 400

        total_revenu = (
            db.session.query(
                func.sum(Commande.prix_total * 0.03)
            )
            .filter(
                Commande.teller_id == teller_id,
                Commande.statut == "Livrer"
            )
            .scalar()
            or 0
        )

        return {
            "status": "success",
            "teller_id": teller_id,
            "revenu_total": float(total_revenu)
        }, 200

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500
        
        
def RevenuTellerPeriode():
    
    try:

        data = request.get_json() or {}

        teller_id = data.get("teller_id")
        date_debut = data.get("date_debut")
        date_fin = data.get("date_fin")

        if not teller_id:
            return {
                "status": "error",
                "message": "teller_id requis"
            }, 400

        if not date_debut:
            return {
                "status": "error",
                "message": "date_debut requise"
            }, 400

        if not date_fin:
            return {
                "status": "error",
                "message": "date_fin requise"
            }, 400

        try:
            date_debut_obj = datetime.datetime.strptime(
                date_debut,
                "%Y-%m-%d"
            )

            date_fin_obj = datetime.datetime.strptime(
                date_fin,
                "%Y-%m-%d"
            )

            date_fin_obj = date_fin_obj + datetime.timedelta(days=1)

        except ValueError:
            return {
                "status": "error",
                "message": "Format de date invalide. Utilisez YYYY-MM-DD."
            }, 400

        revenu = (
            db.session.query(
                func.sum(Commande.prix_total * 0.03)
            )
            .filter(
                Commande.teller_id == teller_id,
                Commande.statut == "Livrer",
                Commande.created_date >= date_debut_obj,
                Commande.created_date < date_fin_obj
            )
            .scalar()
            or 0
        )

        return {
            "status": "success",
            "teller_id": teller_id,
            "date_debut": date_debut,
            "date_fin": date_fin,
            "revenu": float(revenu)
        }, 200

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500