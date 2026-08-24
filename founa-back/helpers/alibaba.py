from urllib.parse import urlencode
from config.db import db
from config.constant import *
from model.founa import *
from model.founa import AlibabSellers
import datetime
from flask import request, redirect


def AlibabaAuthorize():
    params = {
        "response_type": "code",
        "redirect_uri": "https://founa.ci/api/alibaba/callback",
        "client_id": "503830"
    }

    authorization_url = (
        "https://openapi-auth.alibaba.com/oauth/authorize?"
        + urlencode(params)
    )

    return redirect(authorization_url)



def AlibabaCallback():
    import iop

    code = request.args.get("code")

    if not code:
        return {
            "success": False,
            "message": "Authorization code manquant"
        }, 400

    print("Code Alibaba reçu :", code)

    try:
        client = iop.IopClient(
            "https://openapi-api.alibaba.com/rest",
            ALIBABA_APP_KEY,
            ALIBABA_APP_SECRET
        )

        req = iop.IopRequest("/auth/token/create")
        req.add_api_param("code", code)

        response = client.execute(req)
        print("Alibaba token response:")
        print(response.body)

        data = response.body

        # Vérifier que Alibaba a bien retourné un token
        if data.get("code") != "0":
            return {
                "success": False,
                "message": "Alibaba n'a pas retourné un token valide",
                "data": data
            }, 400

        # Récupérer les informations du vendeur
        user_info = data.get("user_info", {})

        seller_id = user_info.get("seller_id")
        user_id = user_info.get("user_id")

        print("Seller ID :", seller_id)
        print("User ID :", user_id)

        # Vérification
        if not seller_id or not user_id:
            return {
                "success": False,
                "message": "Informations du vendeur Alibaba manquantes"
            }, 400

        # Chercher le vendeur
        single_seller = AlibabSellers.query.filter_by(
            user_id=user_id,
            seller_id=seller_id
        ).first()

        if single_seller:
            result = UpdateAlibabaSeller(data)
        else:
            result = CreateAlibabaSeller(data)

        return result

    except Exception as e:
        print("Alibaba OAuth error:", str(e))

        return {
            "success": False,
            "message": "Erreur lors de la récupération du token Alibaba",
            "error": str(e)
        }, 500
    


def CreateAlibabaSeller(data):
    
    try:
        user_info = data.get("user_info", {})
        expires_at = datetime.datetime.utcnow() + datetime.timedelta(
            seconds=int(data.get("expires_in", 0))
        )
        refresh_expires_at = datetime.datetime.utcnow() + datetime.timedelta(
            seconds=int(data.get("refresh_expires_in", 0))
        )
        seller = AlibabSellers(
            trace_id_=data.get("_trace_id_"),
            access_token=data.get("access_token"),
            account=data.get("account"),
            account_platform=data.get("account_platform"),
            code=data.get("code"),
            country=data.get("country"),
            expires_at=expires_at,
            refresh_expires_at=refresh_expires_at,
            refresh_token=data.get("refresh_token"),
            request_id=data.get("request_id"),
            loginId=user_info.get("loginId"),
            seller_id=user_info.get("seller_id"),
            user_id=user_info.get("user_id")
        )
        db.session.add(seller)
        db.session.commit()
        return {
            "success": True,
            "message": "Vendeur Alibaba créé avec succès",
            "data": {
                "uid": seller.uid,
                "seller_id": seller.seller_id,
                "user_id": seller.user_id,
                "account": seller.account,
                "country": seller.country,
                "expires_at": seller.expires_at.isoformat(),
                "refresh_expires_at": seller.refresh_expires_at.isoformat()
            }
        }
    except Exception as e:
        db.session.rollback()
        return {
            "success": False,
            "message": "Erreur lors de la création du vendeur Alibaba",
            "error": str(e)
        }, 500



def GetSingleAlibabaSeller(uid):
    try:
        seller = AlibabSellers.query.filter_by(uid=uid).first()

        if not seller:
            return {
                "success": False,
                "message": "Vendeur Alibaba introuvable"
            }

        return {
            "success": True,
            "message": "Vendeur Alibaba trouvé",
            "data": seller
        }

    except Exception as e:

        return {
            "success": False,
            "message": "Erreur lors de la récupération du vendeur Alibaba",
            "error": str(e)
        }



def GetAllAlibabaSellers():
    try:
        sellers = AlibabSellers.query.order_by(
            AlibabSellers.created_date.desc()
        ).all()

        return {
            "success": True,
            "message": "Liste des vendeurs Alibaba récupérée",
            "total": len(sellers),
            "data": sellers
        }

    except Exception as e:

        return {
            "success": False,
            "message": "Erreur lors de la récupération des vendeurs Alibaba",
            "error": str(e)
        }


def UpdateAlibabaSeller(data):
    try:
        user_info = data.get("user_info", {})
        seller_id = user_info.get("seller_id")
        user_id = user_info.get("user_id")
        seller = AlibabSellers.query.filter_by(
            user_id=user_id,
            seller_id=seller_id
        ).first()
        if not seller:
            return {
                "success": False,
                "message": "Vendeur Alibaba introuvable"
            }, 404
        expires_at = datetime.datetime.utcnow() + datetime.timedelta(
            seconds=int(data.get("expires_in", 0))
        )
        refresh_expires_at = datetime.datetime.utcnow() + datetime.timedelta(
            seconds=int(data.get("refresh_expires_in", 0))
        )
        seller.trace_id_ = data.get("_trace_id_")
        seller.access_token = data.get("access_token")
        seller.account = data.get("account")
        seller.account_platform = data.get("account_platform")
        seller.code = data.get("code")
        seller.country = data.get("country")
        seller.expires_at = expires_at
        seller.refresh_expires_at = refresh_expires_at
        seller.refresh_token = data.get("refresh_token")
        seller.request_id = data.get("request_id")
        seller.loginId = user_info.get("loginId")
        seller.seller_id = seller_id
        seller.user_id = user_id
        seller.updated_date = datetime.datetime.utcnow()
        db.session.commit()

        return {
            "success": True,
            "message": "Vendeur Alibaba mis à jour avec succès",
            "data": {
                "uid": seller.uid,
                "seller_id": seller.seller_id,
                "user_id": seller.user_id,
                "account": seller.account,
                "expires_at": seller.expires_at.isoformat(),
                "refresh_expires_at": seller.refresh_expires_at.isoformat()
            }
        }
    except Exception as e:
        db.session.rollback()
        return {
            "success": False,
            "message": "Erreur lors de la mise à jour du vendeur Alibaba",
            "error": str(e)
        }, 500



def DeleteAlibabaSeller(uid):
    try:
        seller = AlibabSellers.query.filter_by(uid=uid).first()

        if not seller:
            return {
                "success": False,
                "message": "Vendeur Alibaba introuvable"
            }

        db.session.delete(seller)
        db.session.commit()

        return {
            "success": True,
            "message": "Vendeur Alibaba supprimé avec succès"
        }

    except Exception as e:
        db.session.rollback()

        return {
            "success": False,
            "message": "Erreur lors de la suppression du vendeur Alibaba",
            "error": str(e)
        }

# {
#     "_trace_id_": "21038c2217875405416913607e0df7",
#     "access_token": "50000201016pnEqbc3ouGmtawTGc1ac67b8ebCq6ps1ciItgWmx1CF3CNBZkPB",
#     "account": "krayediego@gmail.com",
#     "account_platform": "buyerApp",
#     "code": "0",
#     "country": "GLOBAL",
#     "expires_in": 86400,
#     "refresh_expires_in": 604800,
#     "refresh_token": "50001201716hl4irdwxdAgeq8PVz199493efcHeMlwlqvoCwjxvjMR2tK9uMf4",
#     "request_id": "21032c8717875405418356203",
#     "user_info": {
#       "country": "GLOBAL",
#       "loginId": "ci1393554581hatw",
#       "seller_id": "133698444782",
#       "user_id": "133698444782"
#     },
# }