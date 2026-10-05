from config.db import db
from model.founa import *
from flask import request
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()


def CreateAdmin():
    reponse = {}
    try:
        fullname = (request.json.get('fullname'))
        email = (request.json.get('email'))
        phone = (request.json.get('phone'))
        password = (request.json.get('password'))
        confirmpassword = (request.json.get('confirmpassword'))
        if not str(confirmpassword) == str(password):
            return "Mot de passe non conforme"
        
        hashed_password = ph.hash(str(password))

        new_client = Admin()
        new_client.fullname = fullname
        new_client.email = email
        new_client.phone = phone
        new_client.password = hashed_password
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