from config.db import db
from model.founa import *
from flask import request
from sqlalchemy import func, extract
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()


def CreateOnePartnerPub():
    response = {}

    try:
        data = request.json or {}

        fullname = (data.get("fullname") or "").strip()
        email = (data.get("email") or "").strip().lower()
        phone = (data.get("phone") or "").strip()
        code_promo = (data.get("code_promo") or "").strip()
        password = data.get("password")
        confirmpassword = data.get("confirmpassword")

        # =========================
        # VALIDATION
        # =========================

        if not fullname:
            return {
                "status": "error",
                "message": "Le nom complet est obligatoire."
            }, 400

        if not email:
            return {
                "status": "error",
                "message": "L'adresse email est obligatoire."
            }, 400

        if not phone:
            return {
                "status": "error",
                "message": "Le numéro de téléphone est obligatoire."
            }, 400

        if not code_promo:
            return {
                "status": "error",
                "message": "Le code promo est obligatoire."
            }, 400

        if not password:
            return {
                "status": "error",
                "message": "Le mot de passe est obligatoire."
            }, 400

        if str(password) != str(confirmpassword):
            return {
                "status": "error",
                "message": "Les mots de passe ne correspondent pas."
            }, 400

        # =========================
        # VERIFICATION EMAIL
        # =========================

        existing_email = PartnerPub.query.filter_by(
            email=email
        ).first()

        if existing_email:
            return {
                "status": "error",
                "message": "Cette adresse email est déjà utilisée."
            }, 409

        # =========================
        # VERIFICATION TELEPHONE
        # =========================

        existing_phone = PartnerPub.query.filter_by(
            phone=phone
        ).first()

        if existing_phone:
            return {
                "status": "error",
                "message": "Ce numéro de téléphone est déjà utilisé."
            }, 409

        # =========================
        # VERIFICATION CODE PROMO
        # =========================

        existing_code_promo = PartnerPub.query.filter_by(
            code_promo=code_promo
        ).first()

        if existing_code_promo:
            return {
                "status": "error",
                "message": "Ce code promo est déjà utilisé."
            }, 409

        # =========================
        # CREATION
        # =========================
        hashed_password = ph.hash(str(password))

        new_partner = PartnerPub(
            fullname=fullname,
            email=email,
            phone=phone,
            code_promo=code_promo,
            password=hashed_password
        )

        db.session.add(new_partner)
        db.session.commit()

        # =========================
        # INFORMATIONS RETOURNEES
        # =========================

        user_infos = {
            "uid": new_partner.uid,
            "fullname": new_partner.fullname,
            "email": new_partner.email,
            "phone": new_partner.phone,
            "code_promo": new_partner.code_promo,
            "creation_date": str(new_partner.created_date),
            "updated_date": str(new_partner.updated_date)
        }

        return {
            "status": "success",
            "message": "Compte partenaire créé avec succès.",
            "user_infos": user_infos
        }, 200

    except Exception as e:
        db.session.rollback()

        return {
            "status": "error",
            "message": "Erreur lors de la création du partenaire.",
            "error_description": str(e)
        }, 500
        


def ReadAllPartnerPub():
    try:

        all_partners = PartnerPub.query.all()

        if not all_partners:
            return {
                "status": "success",
                "message": "Aucun partenaire trouvé.",
                "all_partnerpub": []
            }, 200

        partner_informations = [
            {
                "uid": partner.uid,
                "fullname": partner.fullname,
                "email": partner.email,
                "phone": partner.phone,
                "code_promo": partner.code_promo,
                "creation_date": str(partner.created_date),
                "updated_date": str(partner.updated_date)
            }
            for partner in all_partners
        ]

        return {
            "status": "success",
            "all_partnerpub": partner_informations
        }, 200

    except Exception as e:
        return {
            "status": "error",
            "message": "Erreur lors de la récupération des partenaires.",
            "error_description": str(e)
        }, 500


def ReadSinglePartnerPub():
    try:

        data = request.json or {}

        partnerpub_id = (data.get("partnerpub_id") or "").strip()

        if not partnerpub_id:
            return {
                "status": "error",
                "message": "L'identifiant du partenaire est obligatoire."
            }, 400

        partner = PartnerPub.query.filter_by(
            uid=partnerpub_id
        ).first()

        if not partner:
            return {
                "status": "error",
                "message": "Partenaire introuvable."
            }, 404

        partner_info = {
            "uid": partner.uid,
            "fullname": partner.fullname,
            "email": partner.email,
            "phone": partner.phone,
            "code_promo": partner.code_promo,
            "creation_date": str(partner.created_date),
            "updated_date": str(partner.updated_date)
        }

        return {
            "status": "success",
            "partner": partner_info
        }, 200

    except Exception as e:
        return {
            "status": "error",
            "message": "Erreur lors de la récupération du partenaire.",
            "error_description": str(e)
        }, 500


def UpdatePartnerPub():
    try:

        data = request.json or {}

        partnerpub_id = (data.get("partnerpub_id") or "").strip()

        if not partnerpub_id:
            return {
                "status": "error",
                "message": "L'identifiant du partenaire est obligatoire."
            }, 400

        partner = PartnerPub.query.filter_by(
            uid=partnerpub_id
        ).first()

        if not partner:
            return {
                "status": "error",
                "message": "Partenaire introuvable."
            }, 404

        # =========================
        # NOUVELLES VALEURS
        # =========================

        fullname = data.get("fullname")
        email = data.get("email")
        phone = data.get("phone")
        code_promo = data.get("code_promo")
        password = data.get("password")

        # =========================
        # EMAIL
        # =========================

        if email is not None:
            email = email.strip().lower()

            existing_email = PartnerPub.query.filter(
                PartnerPub.email == email,
                PartnerPub.uid != partnerpub_id
            ).first()

            if existing_email:
                return {
                    "status": "error",
                    "message": "Cette adresse email est déjà utilisée."
                }, 409

            partner.email = email

        # =========================
        # TELEPHONE
        # =========================

        if phone is not None:
            phone = phone.strip()

            existing_phone = PartnerPub.query.filter(
                PartnerPub.phone == phone,
                PartnerPub.uid != partnerpub_id
            ).first()

            if existing_phone:
                return {
                    "status": "error",
                    "message": "Ce numéro de téléphone est déjà utilisé."
                }, 409

            partner.phone = phone

        # =========================
        # NOM
        # =========================

        if fullname is not None:
            fullname = fullname.strip()

            if not fullname:
                return {
                    "status": "error",
                    "message": "Le nom complet ne peut pas être vide."
                }, 400

            partner.fullname = fullname

        # =========================
        # CODE PROMO
        # =========================

        if code_promo is not None:
            code_promo = code_promo.strip()

            if not code_promo:
                return {
                    "status": "error",
                    "message": "Le code promo ne peut pas être vide."
                }, 400

            existing_code = PartnerPub.query.filter(
                PartnerPub.code_promo == code_promo,
                PartnerPub.uid != partnerpub_id
            ).first()

            if existing_code:
                return {
                    "status": "error",
                    "message": "Ce code promo est déjà utilisé."
                }, 409

            partner.code_promo = code_promo

        # =========================
        # MOT DE PASSE
        # =========================

        if password is not None:

            if not str(password).strip():
                return {
                    "status": "error",
                    "message": "Le mot de passe ne peut pas être vide."
                }, 400

            partner.password = password

        # =========================
        # DATE DE MODIFICATION
        # =========================

        partner.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {
            "status": "success",
            "message": "Partenaire mis à jour avec succès.",
            "partner": {
                "uid": partner.uid,
                "fullname": partner.fullname,
                "email": partner.email,
                "phone": partner.phone,
                "code_promo": partner.code_promo,
                "creation_date": str(partner.created_date),
                "updated_date": str(partner.updated_date)
            }
        }, 200

    except Exception as e:

        db.session.rollback()

        return {
            "status": "error",
            "message": "Erreur lors de la mise à jour du partenaire.",
            "error_description": str(e)
        }, 500
        

def StatistiquesPartnerPub():
    try:
        partnerpub_id = request.json.get("partnerpub_id")

        if not partnerpub_id:
            return {
                "status": "error",
                "message": "partnerpub_id requis"
            }, 400

        # Récupérer le PartnerPub
        partnerpub = PartnerPub.query.filter_by(uid=partnerpub_id).first()

        if not partnerpub:
            return {
                "status": "error",
                "message": "PartnerPub introuvable"
            }, 404

        # Toutes les commandes livrées dont le client
        # utilise le code promo de ce PartnerPub
        commandes_livrees = (
            db.session.query(Commande)
            .join(Client, Commande.client_id == Client.uid)
            .filter(
                Commande.statut == "Livrer",
                Client.code_promo == partnerpub.code_promo
            )
            .all()
        )

        # Nombre de commandes concernées
        nombre_commandes_livrees = len(commandes_livrees)

        # Revenu total du PartnerPub : 1%
        revenu_total = sum(
            commande.prix_total * 0.01
            for commande in commandes_livrees
        )

        # Revenu par mois
        revenu_par_mois = (
            db.session.query(
                extract(
                    'year',
                    Commande.created_date
                ).label('year'),

                extract(
                    'month',
                    Commande.created_date
                ).label('month'),

                func.sum(
                    Commande.prix_total * 0.01
                ).label('revenu')
            )
            .join(
                Client,
                Commande.client_id == Client.uid
            )
            .filter(
                Commande.statut == "Livrer",
                Client.code_promo == partnerpub.code_promo
            )
            .group_by(
                'year',
                'month'
            )
            .order_by(
                'year',
                'month'
            )
            .all()
        )

        revenu_mois_dict = [
            {
                "year": int(r.year),
                "month": int(r.month),
                "revenu": float(r.revenu)
            }
            for r in revenu_par_mois
        ]

        return {
            "status": "success",
            "partnerpub_uid": partnerpub.uid,
            "code_promo": partnerpub.code_promo,
            "nombre_commandes_livrees": nombre_commandes_livrees,
            "revenu_total": float(revenu_total),
            "revenu_par_mois": revenu_mois_dict
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500