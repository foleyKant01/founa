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
        teller_id = request.json.get("teller_id")
        if not teller_id:
            return {"status": "error", "message": "teller_id requis"}, 400
        nb_livrees = Commande.query.filter_by(teller_id=teller_id, statut="Livrer").count()
        total_revenu = db.session.query(func.sum(Commande.prix_total * 0.3)) \
            .filter_by(teller_id=teller_id, statut="Livrer").scalar() or 0
        revenu_par_mois = (
            db.session.query(
                extract('year', Commande.created_date).label('year'),
                extract('month', Commande.created_date).label('month'),
                func.sum(Commande.prix_total * 0.03).label('revenu')
            )
            .filter_by(teller_id=teller_id, statut="Livrer")
            .group_by('year', 'month')
            .order_by('year', 'month')
            .all()
        )
        revenu_mois_dict = [
            {"year": int(r.year), "month": int(r.month), "revenu": float(r.revenu)}
            for r in revenu_par_mois
        ]
        return {
            "status": "success",
            "nombre_commandes_livrees": nb_livrees,
            "revenu_total": float(total_revenu),
            "revenu_par_mois": revenu_mois_dict
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}, 500