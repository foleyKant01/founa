from config.db import db
from model.founa import *
from flask import request
import bcrypt
import datetime
   


def LoginClient():
    reponse = {}

    try:
        phone = request.json.get('phone')
        password = request.json.get('password')

        if not phone or not password:
            reponse['status'] = 'error'
            reponse['message'] = 'Les champs phone et password sont requis.'
            return reponse

        login_user = Client.query.filter_by(phone=phone).first()

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

    try:
        phone = request.json.get('phone')
        new_password = request.json.get('new_password')

        if not new_password:
            response['status'] = 'error'
            response['message'] = 'Le nouveau mot de passe est requis.'
            return response

        client = None
        if phone:
            client = Client.query.filter_by(phone=phone).first()
    
        if not client:
            response['status'] = 'error'
            response['message'] = 'Utilisateur introuvable.'
            return response

        client.password = new_password
        client.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        response['status'] = 'success'
        response['message'] = 'Mot de passe réinitialisé avec succès.'

    except Exception as e:
        db.session.rollback()
        response['status'] = 'error'
        response['message'] = str(e)

    return response



def SaveNewPassword():
    response = {}
    try:
        email = request.json.get('email')
        motpreferer = request.json.get('motpreferer')
        newpassword = request.json.get('newpassword')
        confirmpassword = request.json.get('confirmpassword')
        
        if newpassword != confirmpassword:
            response['status'] = 'error'
            response['message'] = "Les mots de passe ne correspondent pas."
            return response
        single_user = User.query.filter_by(email=email).first()
        
        if not single_user:
            response['status'] = 'error'
            response['message'] = "Aucun utilisateur avec cet email."
            return response
        
        if single_user.motpreferer == motpreferer:
            single_user.password = newpassword
            db.session.commit()
            response['status'] = 'success'
            response['message'] = 'Mot de passe reinitialise avec succes.'
            
        else:
            response['status'] = 'error'
            response['message'] = 'Code temporaire invalide'

    except Exception as e:
        response['status'] = 'error'
        response['message'] = str(e)

    return response