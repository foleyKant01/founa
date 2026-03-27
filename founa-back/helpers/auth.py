from config.db import db
from model.founa import *
from flask import request
from flask import request, jsonify

from helpers.send_mailer import *



# def LoginClient():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')
#         if not email or not password:
#             return {
#                 'status': 'error',
#                 'message': 'Les champs email et password sont requis.'
#             }, 400
#         login_user = Client.query.filter_by(email=email).first()
#         login_teller = Teller.query.filter_by(email=email).first()
#         login_admin = Admin.query.filter_by(email=email).first()
#         if not login_user and not login_teller and not login_admin:
#             return {
#                 'status': 'error',
#                 'message': 'Email incorrect.'
#             }, 401
#         if login_user:
#             user_info = login_user
#         if login_teller:
#             user_info = login_teller
#         if login_admin:
#             user_info = login_admin
            
#         if user_info.password != password:
#             return {
#                 'status': 'error',
#                 'message': 'Mot de passe incorrect.'
#             }, 401
#         user_info = {
#             'uid': login_user.uid,
#             'fullname': login_user.fullname,
#             'email': login_user.email,
#             'phone': login_user.phone,
#             'adresse_livraison': login_user.adresse_livraison,
#             'created_date': str(login_user.created_date),
#         }
#         return {
#             'status': 'success',
#             'message': 'Connexion réussie.',
#             'user_infos': user_info
#         }, 200
#     except Exception as e:
#         return {
#             'status': 'error',
#             'message': f"Erreur serveur: {str(e)}"
#         }, 500
        
        
# Tables à vérifier et leur rôle
USER_TABLES = [
    {"model": Admin, "role": "Admin"},
    {"model": Teller, "role": "Teller"},
    {"model": Client, "role": "Client"},
]

def LoginClient():
    """
    Login universel pour Admin, Teller et Client.
    Connexion par email. Les mots de passe doivent être hachés.
    """
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {
                'status': 'error',
                'message': 'Les champs email et mot de passe sont requis.'
            }, 400
        found_user = None
        user_role = None
        for table in USER_TABLES:
            model = table["model"]
            role = table["role"]
            user = model.query.filter_by(email=email).first()
    
            if user:
                if user.password != password:
                    break
                user_role = role
                found_user = user

        if not found_user:
            return {
                'status': 'error',
                'message': 'Email ou mot de passe incorrect.'
            }, 401
        response_data = {
            "uid": getattr(found_user, 'uid', getattr(found_user, 'id', None)),
            "fullname": getattr(found_user, 'fullname', ''),
            "email": found_user.email,
            "phone": getattr(found_user, 'phone', ''),
            "role": user_role
        }
        if user_role == "Client":
            response_data["adresse_livraison"] = getattr(found_user, 'adresse_livraison', '')
            response_data["created_date"] = str(getattr(found_user, 'created_date', ''))

        return {
            "status": "success",
            "message": f"Connexion réussie en tant que {user_role}.",
            "user_infos": response_data
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": f"Erreur serveur: {str(e)}"
        }, 500



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

    return response




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