from config.db import db
from model.founa import *
from flask import request
from sqlalchemy import func, extract




def CreateTeller():
    
    reponse = {}
    try:
        fullname = (request.json.get('fullname'))
        email = (request.json.get('email'))
        phone = (request.json.get('phone'))
        password = (request.json.get('password'))
        confirmpassword = (request.json.get('confirmpassword'))
        if not str(confirmpassword) == str(password):
            return "Mot de passe non conforme"
        
        new_client = Teller()
        new_client.fullname = fullname
        new_client.email = email
        new_client.phone = phone
        new_client.password = password
        
        db.session.add(new_client)
        db.session.commit()

        rs = {}
        rs['uid'] = new_client.uid
        rs['fullname'] = fullname
        rs['email'] = email
        rs['phone'] = phone
        rs['creation_date'] = str(new_client.created_date)

        reponse['status'] = 'success'
        reponse['user_infos'] = rs

    except Exception as e:
        reponse['error_description'] = str(e)
        reponse['status'] = 'error'

    return reponse



def ReadAllClients():
    response = {}
    try:
        all_clients = Client.query.all()

        if all_clients:
            clients_informations = [
                {
                    'uid': client.uid,
                    'fullname': client.fullname,
                    'email': client.email,
                    'phone': client.phone,
                    'creation_date': str(client.created_date)
                } 
                for client in all_clients
            ]
            response['status'] = 'success'
            response['all_clients'] = clients_informations
        else:
            response['status'] = 'erreur'
            response['motif'] = 'aucun client trouvé'

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response



def ReadSingleTeller():
    response = {}
    try:
        cliend_id = (request.json.get('uid'))
        client = Client.query.filter_by(uid=cliend_id).first()

        if client:
            client_info = {
                'uid': client.uid,
                'fullname': client.fullname,
                'email': client.email,
                'phone': client.phone,
                'creation_date': str(client.created_date)
            }
            response['status'] = 'success'
            response['client'] = client_info
        else:
            response['status'] = 'error'
            response['message'] = 'Client introuvable'

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response



def UpdateTeller():
    response = {}

    try:
        cliend_id = (request.json.get('uid'))
        update_client = Client.query.filter_by(uid=cliend_id).first()
        
        if update_client:
            update_client.fullname = request.json.get('fullname', update_client.fullname)
            update_client.email = request.json.get('email', update_client.email)
            update_client.phone = request.json.get('phone', update_client.phone)
            update_client.password = request.json.get('password', update_client.password)
     
        db.session.add(update_client)
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
        total_revenu = db.session.query(func.sum(Commande.prix_total * 0.08)) \
            .filter_by(teller_id=teller_id, statut="Livrer").scalar() or 0
        revenu_par_mois = (
            db.session.query(
                extract('year', Commande.created_date).label('year'),
                extract('month', Commande.created_date).label('month'),
                func.sum(Commande.prix_total * 0.08).label('revenu')
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


# def DeleteUser():

#     reponse = {}
#     try:
#         uid = request.json.get('uid')
#         deleteuser = User.query.filter_by(uid=uid).first_or_404()

#         db.session.delete(deleteuser)
#         db.session.commit()
#         reponse['status'] = 'success'

#     except Exception as e:
#         reponse['error_description'] = str(e)
#         reponse['status'] = 'error'

#     return reponse