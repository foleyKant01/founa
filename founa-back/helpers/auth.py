from config.db import db
from model.founa import *
from flask import request
from flask import request, jsonify

from helpers.send_mailer import *

   


def LoginClient():
    reponse = {}

    try:
        email = request.json.get('email')
        password = request.json.get('password')

        if not email or not password:
            reponse['status'] = 'error'
            reponse['message'] = 'Les champs email et password sont requis.'
            return reponse

        login_user = Client.query.filter_by(email=email).first()

        if not login_user:
            reponse['status'] = 'error'
            reponse['message'] = 'Numéro de téléphone incorrect.'
            return reponse

        if login_user.password == password:
            rs = {
                'uid': login_user.uid,
                'fullname': login_user.fullname,
                'email': login_user.email,
                'phone': login_user.phone,
                'adresse_livraison': login_user.adresse_livraison,
                'created_date': str(login_user.created_date),
            }

            reponse['status'] = 'success'
            reponse['message'] = 'Connexion réussie.'
            reponse['user_infos'] = rs

        else:
            reponse['status'] = 'error'
            reponse['message'] = 'Mot de passe incorrect.'

    except Exception as e:
        reponse['status'] = 'error'
        reponse['message'] = str(e)

    return reponse





def ForgotPassword():
    response = {}
    email = request.json.get('email')
    single_client = Client.query.filter_by(email=email).first()

    if single_client:
        # send_mailer_update_password(email, single_client.uid)  # envoyer mail ici
        response['status'] = 'success'
        response['message'] = 'Un email de réinitialisation a été envoyé.'
        response['email'] = email
    else:
        response['status'] = 'error'
        response['message'] = 'Utilisateur non trouvé'

    return jsonify(response)




def SaveNewPassword():
    response = {}
    try:
        email = request.json.get('email')
        newpassword = request.json.get('newpassword')
        confirmpassword = request.json.get('confirmpassword')
        
        if newpassword != confirmpassword:
            response['status'] = 'error'
            response['message'] = "Les mots de passe ne correspondent pas."
            return response
        single_user = Client.query.filter_by(email=email).first()
        
        if not single_user:
            response['status'] = 'error'
            response['message'] = "Aucun utilisateur avec cet email."
            return response
        
        single_user.password = newpassword
        db.session.commit()
        response['status'] = 'success'
        response['message'] = 'Mot de passe reinitialise avec succes.'
            
    except Exception as e:
        response['status'] = 'error'
        response['message'] = str(e)

    return response