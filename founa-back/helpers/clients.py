from config.db import db
from model.founa import *
from flask import request
from config.constant import *
from helpers.mailer_sms import *

import secrets
from argon2 import PasswordHasher
from argon2 import PasswordHasher
from argon2.exceptions import (
    VerifyMismatchError,
    VerificationError,
    InvalidHashError
)

ph = PasswordHasher()

def generate_otp():
    return str(secrets.randbelow(900000) + 100000)


def CreateClient():
    try:
        data = request.json or {}
        fullname = (data.get("fullname") or "").strip()
        phone = (data.get("phone") or "").strip()
        code_promo = (data.get("code_promo") or "").strip().upper()
        adresse_livraison = (
            data.get("adresse_livraison") or ""
        ).strip()
        password = data.get("password")
        confirmpassword = data.get("confirmpassword")
        if (
            not fullname
            or not phone
            or not adresse_livraison
            or not password
            or not confirmpassword
        ):
            return {
                "status": "error",
                "message": "Tous les champs obligatoires doivent être renseignés."
            }, 400
        if not phone.isdigit() or not (8 <= len(phone) <= 15):
            return {
                "status": "error",
                "message": "Veuillez entrer un numéro de téléphone valide."
            }, 400
        if str(password) != str(confirmpassword):
            return {
                "status": "error",
                "message": "Les mots de passe ne correspondent pas."
            }, 400
        existing_phone = Client.query.filter_by(
            phone=phone
        ).first()
        if existing_phone:
            return {
                "status": "error",
                "message": "Ce numéro de téléphone est déjà utilisé."
            }, 409
        status_code_promo = None
        if code_promo:
            existing_code_promo = PartnerPub.query.filter_by(
                code_promo=code_promo
            ).first()
            if not existing_code_promo:
                return {
                    "status": "error",
                    "message": "Ce code promo n'existe pas."
                }, 409
            status_code_promo = "non-utiliser"
            
        hashed_password = ph.hash(str(password))
        new_client = Client()
        new_client.fullname = fullname
        new_client.phone = phone
        new_client.code_promo = code_promo or None
        new_client.status_code_promo = status_code_promo
        new_client.adresse_livraison = adresse_livraison
        new_client.password = hashed_password
        db.session.add(new_client)
        db.session.commit()
        user_infos = {
            "uid": new_client.uid,
            "fullname": new_client.fullname,
            "phone": new_client.phone,
            "code_promo": new_client.code_promo,
            "adresse_livraison": new_client.adresse_livraison,
            "creation_date": str(new_client.created_date)
        }
        return {
            "status": "success",
            "message": "Compte créé. Un code de vérification a été envoyé par SMS.",
            "verification_required": True,
            "user_infos": user_infos
        }, 200
    except Exception:
        db.session.rollback()
        return {
            "status": "error",
            "message": "Erreur lors de la création du compte."
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
    expiration_time = (datetime.datetime.utcnow()- datetime.timedelta(hours=24))
    clients_expires = Client.query.filter(Client.created_date < expiration_time,Client.status == "non-verifier").all()
    for client in clients_expires:
        commande_exist = Commande.query.filter_by(client_id=client.uid).first()
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
            "message": "Impossible d'envoyer le code de vérification.",
            "sms_response": sms_response
        }, 500
    return {
        "status": "success",
        "message": "Code de vérification envoyé avec succès.",
        "sms_response": sms_response
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
    expiration_time = (datetime.datetime.utcnow()- datetime.timedelta(minutes=5))
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
        data = request.json or {}
        client_id = (data.get('uid') or '').strip()
        password = data.get('password')
        email = (data.get('email') or '').strip().lower()

        if not client_id:
            return {
                "status": "error",
                "message": "L'identifiant du client est obligatoire"
            }, 400
        update_client = Client.query.filter_by(uid=client_id).first()
        if not update_client:
            return {
                "status": "error",
                "message": "Client introuvable"
            }, 404
        if not password:
            return {
                "status": "error",
                "message": "Le mot de passe est obligatoire"
            }, 400

        try:
            ph.verify(update_client.password, str(password))
        except (VerifyMismatchError, VerificationError, InvalidHashError):
            return {
                "status": "error",
                "message": "Mot de passe incorrect"
            }, 401
        if email and email != update_client.email.lower():
            existing_email = Client.query.filter(
                Client.email.ilike(email),
                Client.uid != client_id
            ).first()
            if existing_email:
                return {
                    "status": "error",
                    "message": "Cette adresse email est déjà utilisée"
                }, 409
            update_client.email = email
        update_client.fullname = data.get(
            'fullname', update_client.fullname
        )
        update_client.phone = data.get(
            'phone', update_client.phone
        )
        update_client.adresse_livraison = data.get(
            'adresse_livraison', update_client.adresse_livraison
        )
        db.session.commit()
        return {
            "status": "success",
            "message": "Mise à jour effectuée"
        }, 200
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": "Une erreur est survenue lors de la mise à jour",
            "error_description": str(e)
        }, 500


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