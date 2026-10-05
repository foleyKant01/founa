from config.db import db
from model.founa import *
from flask import request
from helpers.clients import *
from helpers.send_mailer import *
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
ph = PasswordHasher()

USER_TABLES = [
    {"model": Admin, "role": "Admin"},
    {"model": Teller, "role": "Teller"},
    {"model": Client, "role": "Client"},
    {"model": PartnerPub, "role": "PartnerPub"},
]


def LoginClient():
    try:
        data = request.get_json() or {}
        email = (data.get("email") or "").strip().lower()
        phone = (data.get("phone") or "").strip()
        password = data.get("password")
        if not email and not phone:
            return {
                "status": "error",
                "message": "Veuillez renseigner votre email ou votre numéro de téléphone."
            }, 400
        if not password:
            return {
                "status": "error",
                "message": "Le mot de passe est requis."
            }, 400
        found_user = None
        user_role = None
        for table in USER_TABLES:
            model = table["model"]
            role = table["role"]
            if email:
                user = model.query.filter_by(email=email).first()
            else:
                user = model.query.filter_by(phone=phone).first()
            if user:
                stored_password = getattr(
                    user,
                    "password",
                    None
                )
                if not stored_password:
                    return {
                        "status": "error",
                        "message": "Email/téléphone ou mot de passe incorrect."
                    }, 401
                password_valid = False
                if stored_password.startswith("$argon2"):
                    try:
                        password_valid = ph.verify(
                            stored_password,
                            str(password)
                        )
                    except VerifyMismatchError:
                        password_valid = False
                    except InvalidHashError:
                        password_valid = False
                else:
                    if stored_password == str(password):
                        password_valid = True
                        user.password = ph.hash(str(password))
                        db.session.commit()
                if not password_valid:
                    return {
                        "status": "error",
                        "message": "Email/téléphone ou mot de passe incorrect."
                    }, 401
                found_user = user
                user_role = role
                break
        if not found_user:
            return {
                "status": "error",
                "message": "Email/téléphone ou mot de passe incorrect."
            }, 401
        response_data = {
            "uid": getattr(
                found_user,
                "uid",
                getattr(found_user, "id", None)
            ),
            "fullname": getattr(
                found_user,
                "fullname",
                ""
            ),
            "email": getattr(
                found_user,
                "email",
                ""
            ),
            "phone": getattr(
                found_user,
                "phone",
                ""
            ),
            "role": user_role
        }
        if user_role == "Client":
            response_data["status"] = getattr(
                found_user,
                "status",
                ""
            )
            response_data["adresse_livraison"] = getattr(
                found_user,
                "adresse_livraison",
                ""
            )
            response_data["created_date"] = str(
                getattr(
                    found_user,
                    "created_date",
                    ""
                )
            )
        if user_role == "Teller":
            CreateActivityLog({
                "actions": "connexion",
                "user": found_user.uid
            })
        if user_role == "PartnerPub":
            response_data["code_promo"] = getattr(
                found_user,
                "code_promo",
                ""
            )
            response_data["created_date"] = str(
                getattr(
                    found_user,
                    "created_date",
                    ""
                )
            )
            response_data["updated_date"] = str(
                getattr(
                    found_user,
                    "updated_date",
                    ""
                )
            )
        return {
            "status": "success",
            "message": f"Connexion réussie en tant que {user_role}.",
            "user_infos": response_data
        }, 200
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": "Erreur serveur."
        }, 500



def CreateActivityLog(data):
    try:
        actions = data.get("actions")
        user = data.get("user")
        if not actions or not user:
            return {
                "status": "error",
                "message": "actions et user sont requis"
            }, 400
        activity = ActivityLog(actions=actions,user=user)
        db.session.add(activity)
        db.session.commit()
        return {
            "status": "success",
            "message": "Activité enregistrée avec succès",
            "data": {
                "uid": activity.uid,
                "actions": activity.actions,
                "user": activity.user,
                "created_date": str(activity.created_date),
                "updated_date": str(activity.updated_date)
            }
        }, 201
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": str(e)
        }, 500


def ForgotPassword():
    response = {}
    email = request.json.get('email')
    single_client = Client.query.filter_by(email=email).first()
    if single_client:
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