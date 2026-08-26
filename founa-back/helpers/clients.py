from config.db import db
from model.founa import *
from flask import request
from config.constant import *
from helpers.mailer_sms import *
# from dotenv import load_dotenv

import secrets

def generate_otp():
    return str(secrets.randbelow(900000) + 100000)


def CreateClient():
    
    try:
        data = request.json or {}
        fullname = data.get("fullname")
        email = data.get("email")
        phone = data.get("phone")
        adresse_livraison = data.get("adresse_livraison")
        password = data.get("password")
        confirmpassword = data.get("confirmpassword")
        if not fullname or not email or not phone or not password:
            return {
                "status": "error",
                "message": "Tous les champs obligatoires doivent être renseignés."
            }, 400
        if str(password) != str(confirmpassword):
            return {
                "status": "error",
                "message": "Les mots de passe ne correspondent pas."
            }, 400
        existing_email = Client.query.filter_by(
            email=email
        ).first()
        if existing_email:
            return {"status": "error", "message": "Cette adresse email est déjà utilisée."}, 409
        existing_phone = Client.query.filter_by(
            phone=phone
        ).first()
        if existing_phone:
            return {
                "status": "error",
                "message": "Ce numéro de téléphone est déjà utilisé."
            }, 409
            
        new_client = Client()
        new_client.fullname = fullname
        new_client.email = email
        new_client.phone = phone
        new_client.adresse_livraison = adresse_livraison
        new_client.password = password
        db.session.add(new_client)
        db.session.commit()
        
        user_infos = {
            "uid": new_client.uid,
            "fullname": new_client.fullname,
            "email": new_client.email,
            "phone": new_client.phone,
            "adresse_livraison": new_client.adresse_livraison,
            "creation_date": str(new_client.created_date)
        }
        return {
            "status": "success",
            "message": "Compte créé. Un code de vérification a été envoyé par SMS.",
            "verification_required": True,
            "user_infos": user_infos
        }, 200
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": "Erreur lors de la création du compte.",
            "error_description": str(e)
        }, 500
        
        
def send_OTP():

    phone = request.json.get('phone')
    phone_session = request.json.get('phone_session')

    if not phone_session or not phone:
        return {"status": "error","message": "Numéro de téléphone requis"}, 400

    if phone_session != phone:
        return {
            "status": "error",
            "message": "Les numéros de téléphone ne correspondent pas"
        }, 400
        
    expiration_time = (
        datetime.datetime.utcnow()
        - datetime.timedelta(hours=24))
    
    clients_expires = Client.query.filter(Client.created_date < expiration_time,Client.status == "non-verifier").all()
    for client in clients_expires:
        commande_exist = Commande.query.filter_by(
            client_id=client.uid
        ).first()
        if commande_exist:
            continue
        db.session.delete(client)
            
    db.session.commit()
    
    single_client = Client.query.filter_by(phone=phone).first()
    if not single_client:
        return {
            "status": "error",
            "message": "Aucun compte associé à ce numéro."
        }, 404
        
    if single_client.status != "non-verifier":
        return {
            "status": "error",
            "message": "Ce compte est déjà vérifié."
        }, 400

    Otp.query.filter_by(phone=phone).delete(synchronize_session=False)

    otp_code = generate_otp()
    new_otp = Otp()
    new_otp.otp = otp_code
    new_otp.phone = phone

    db.session.add(new_otp)
    db.session.commit()
    
    sms_response = send_sms_by_sendexa(
        phone,
        f"Votre code de verification Founa CI est : {otp_code}. "
        "Ce code est valable pendant 5 minutes."
    )

    if not sms_response.get("success", True):
        return {
            "status": "error",
            "message": "Impossible d'envoyer le code de vérification."
        }, 500

    return {
        "status": "success",
        "message": "Code de vérification envoyé avec succès."
    }



def verfiy_OTP():
    
    response = {}
    
    otp_code = request.json.get('otp_code')
    phone = request.json.get('phone')
    if not otp_code:
        return {
            "status": "error",
            "message": "Code OTP requis"
        }, 400
    if not phone:
        return {
            "status": "error",
            "message": "Numéro de téléphone requis"
        }, 400

    expiration_time = (
        datetime.datetime.utcnow()
        - datetime.timedelta(minutes=5)
    )

    Otp.query.filter(Otp.created_date < expiration_time).delete(synchronize_session=False)
    db.session.commit()

    single_otp = Otp.query.filter_by(
        otp=str(otp_code),
        phone=str(phone)
    ).first()

    if not single_otp:
        return {
            "status": "error",
            "message": "Code OTP invalide ou expiré"
        }, 400

    single_client = Client.query.filter_by(
        phone=str(phone)
    ).first()

    if not single_client:
        db.session.delete(single_otp)
        db.session.commit()

        return {
            "status": "error",
            "message": "Client introuvable"
        }, 404

    if single_client.status == "verifier":
        db.session.delete(single_otp)
        db.session.commit()
        
        response['status'] = 'error'
        response['message'] = "Ce compte est déjà vérifié"

    single_client.status = "verifier"
    db.session.delete(single_otp)
    db.session.commit()
    
    response['status'] = 'success'
    response['message'] = "Numéro de téléphone vérifié avec succès"

    return response



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
                    'adresse_livraison': client.adresse_livraison,
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



def ReadSingleClient():
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
                'adresse_livraison': client.adresse_livraison,
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



def UpdateClient():
    response = {}

    try:
        cliend_id = (request.json.get('uid'))
        password = (request.json.get('password'))
        
        update_client = Client.query.filter_by(uid=cliend_id).first()
        if password != update_client.password:
            return {"status": "error", "message": "Mot de passe incorrecte"}
        
        if update_client:
            update_client.fullname = request.json.get('fullname', update_client.fullname)
            update_client.email = request.json.get('email', update_client.email)
            update_client.phone = request.json.get('phone', update_client.phone)
            update_client.adresse_livraison = request.json.get('adresse_livraison', update_client.adresse_livraison)
     
        db.session.add(update_client)
        db.session.commit() 
        
        response['status'] = 'success'
        response['message'] = "Mise à jour effectuer"

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response


def UpdatePassword():
    response = {}

    try:
        cliend_id = (request.json.get('uid'))
        old_password = (request.json.get('old_password'))
        new_password = (request.json.get('password'))
        
        update_client = Client.query.filter_by(uid=cliend_id).first()
        if not update_client:
            return {"status": "error", "message": "Utilisateur introuvable"}
            
        if old_password != update_client.password:
            return {"status": "error", "message": "Ancien mot de passe incorrecte"}
            
        update_client.password = new_password

        db.session.add(update_client)
        db.session.commit() 
        
        response['status'] = 'success'
        response['message'] = "Mise à jour effectuer"

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response


# def send(phone, message):
    
#     import http.client
#     import json
    
#     phone = str(phone).strip()
#     if phone.startswith("+225"):
#         phone_number = phone[1:]
#     elif phone.startswith("225"):
#         phone_number = phone
#     else:
#         phone_number = "225" + phone.lstrip("0")
#     conn = http.client.HTTPSConnection(INFOBIP_API_URL)
#     payload = json.dumps({
#         "messages": [
#             {
#                 "destinations": [
#                     {
#                         "to": phone_number
#                     }
#                 ],
#                 "sender": INFOBIP_SENDER_ID,
#                 "content": {
#                     "text": message
#                 }
#             }
#         ]
#     })
#     headers = {
#         "Authorization": f"App {INFOBIP_API_KEY}",
#         "Content-Type": "application/json",
#         "Accept": "application/json"
#     }
#     try:
#         conn.request("POST","/sms/3/messages",payload,headers)
#         res = conn.getresponse()
#         raw_response = res.read()
#         response_text = raw_response.decode("utf-8")
#         try:
#             response_data = json.loads(response_text)
#         except json.JSONDecodeError:
#             response_data = {
#                 "raw_response": response_text
#             }
#         if res.status >= 200 and res.status < 300:
#             return {
#                 "status": "success",
#                 "code": res.status,
#                 "message": "SMS envoyé avec succès",
#                 "data": response_data
#             }
#         return {
#             "status": "error",
#             "code": res.status,
#             "message": "Erreur lors de l'envoi du SMS",
#             "data": response_data
#         }
#     except Exception as e:
#         return {
#             "status": "error",
#             "message": "Erreur lors de la communication avec Infobip",
#             "error": str(e)
#         }
#     finally:
#         conn.close()






