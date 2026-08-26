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
        url = "https://openapi-api.alibaba.com/rest"
        client = iop.IopClient(
            url,
            ALIBABA_APP_KEY,
            ALIBABA_APP_SECRET
        )
        req = iop.IopRequest("/auth/token/create")
        req.add_api_param("code", code)
        response = client.execute(req)
        return response
    except Exception as e:
        print("Alibaba OAuth error:", str(e))
        return {
            "success": False,
            "message": "Erreur lors de la récupération du token Alibaba",
            "error": str(e)
        }, 500
    



def CreateAlibabaSeller():
    try:
        data = request.json
        user_info = data.get("user_info", {})

        expires_at = datetime.datetime.utcnow() + datetime.timedelta(
            seconds=int(data.get("expires_in", 0))
        )
        refresh_expires_at = datetime.datetime.utcnow() + datetime.timedelta(
            seconds=int(data.get("refresh_expires_in", 0))
        )
        trace_id_ = data.get("trace_id_") 
        access_token = data.get("access_token") 
        account = data.get("account") 
        account_platform = data.get("account_platform") 
        code = data.get("code") 
        country = data.get("country") 
        expires_at = expires_at 
        refresh_expires_at = refresh_expires_at 
        refresh_token = user_info.get("refresh_token") 
        request_id = user_info.get("request_id") 
        loginId = user_info.get("loginId") 
        seller_id = user_info.get("seller_id") 
        user_id = user_info.get("user_id") 
        
        seller = AlibabSellers(
            trace_id_=trace_id_,
            access_token=access_token,
            account=account,
            account_platform=account_platform,
            code=code,
            country=country,
            expires_at=expires_at,
            refresh_expires_at=refresh_expires_at,
            refresh_token=refresh_token,
            request_id=request_id,
            loginId=loginId,
            seller_id=seller_id,
            user_id=user_id
        )
        db.session.add(seller)
        db.session.commit()
        return {
            "success": True,
            "message": "Vendeur Alibaba créé avec succès",
            "data": seller
        }
    except Exception as e:
        db.session.rollback()
        return {
            "success": False,
            "message": "Erreur lors de la création du vendeur Alibaba",
            "error": str(e)
        }



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



def UpdateAlibabaSeller(uid, data):
    try:
        seller = AlibabSellers.query.filter_by(uid=uid).first()

        if not seller:
            return {
                "success": False,
                "message": "Vendeur Alibaba introuvable"
            }
        if data.get("trace_id_") is not None:
            seller.trace_id_ = data.get("trace_id_")

        if data.get("access_token") is not None:
            seller.access_token = data.get("access_token")

        if data.get("account") is not None:
            seller.account = data.get("account")

        if data.get("account_platform") is not None:
            seller.account_platform = data.get("account_platform")

        if data.get("code") is not None:
            seller.code = data.get("code")

        if data.get("country") is not None:
            seller.country = data.get("country")

        if data.get("expires_at") is not None:
            seller.expires_at = data.get("expires_at")

        if data.get("refresh_expires_at") is not None:
            seller.refresh_expires_at = data.get("refresh_expires_at")

        if data.get("refresh_token") is not None:
            seller.refresh_token = data.get("refresh_token")

        if data.get("request_id") is not None:
            seller.request_id = data.get("request_id")

        if data.get("loginId") is not None:
            seller.loginId = data.get("loginId")

        if data.get("seller_id") is not None:
            seller.seller_id = data.get("seller_id")

        if data.get("user_id") is not None:
            seller.user_id = data.get("user_id")

        seller.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {
            "success": True,
            "message": "Vendeur Alibaba mis à jour avec succès",
            "data": seller
        }

    except Exception as e:
        db.session.rollback()

        return {
            "success": False,
            "message": "Erreur lors de la mise à jour du vendeur Alibaba",
            "error": str(e)
        }



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