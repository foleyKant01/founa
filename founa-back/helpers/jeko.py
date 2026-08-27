import requests
from config.constant import *
from flask import request



def GetAllJekoStores():
    url = "https://api.jeko.africa/partner_api/stores"

    headers = {
        "X-API-KEY": API_KEY,
        "X-API-KEY-ID": API_KEY_ID
    }

    try:
        response = requests.get(
            url,
            headers=headers,
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        # Vérifier si Jeko retourne une erreur dans le JSON
        if data.get("id") == "business_not_enabled_for_api_access":
            return {
                "status": "error",
                "message": data.get(
                    "message",
                    "Ce compte professionnel n'est pas autorisé à utiliser l'API Jeko."
                ),
                "error_id": data.get("id"),
                "extras": data.get("extras")
            }, 403

        return {
            "status": "success",
            "stores": data
        }, 200

    except requests.exceptions.Timeout:
        return {
            "status": "error",
            "message": "La requête vers Jeko a expiré."
        }, 504

    except requests.exceptions.HTTPError as e:
        return {
            "status": "error",
            "message": "Jeko a retourné une erreur HTTP.",
            "error": str(e),
            "response": response.text
        }, response.status_code

    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": "Erreur lors de la connexion à Jeko.",
            "error": str(e)
        }, 500

    except ValueError:
        return {
            "status": "error",
            "message": "La réponse de Jeko n'est pas un JSON valide."
        }, 500
        
        
def GetJekoStoreBalance():
    storeId = request.form.get('storeId')
    
    url = f"https://api.jeko.africa/partner_api/stores/{storeId}/balance"
    headers = {
        "X-API-KEY": API_KEY,
        "X-API-KEY-ID": API_KEY_ID
    }
    try:
        response = requests.get(
            url,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        return {
            "status": "success",
            "balance": response.json()
        }, 200
    except requests.exceptions.Timeout:
        return {
            "status": "error",
            "message": "La requête vers Jeko a expiré."
        }, 504
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": "Erreur lors de la connexion à Jeko.",
            "error": str(e)
        }, 500
    except ValueError:
        return {
            "status": "error",
            "message": "La réponse de Jeko n'est pas un JSON valide."
        }, 500
        
        

paylod = {
  "amountCents": 10,
  "currency": "XOF",
  "reference": "P24001",
  "storeId": "b8adcdc8-9238-4168-90f8-77b2d14c211c",
  "paymentDetails": {
    "type": "redirect",
    "data": {
      "paymentMethod": "orange",
      "successUrl": "http://example.com",
      "errorUrl": "http://example.com"
    }
  }
}

def CreateJekoPaymentRequest(paylod):
    url = "https://api.jeko.africa/partner_api/payment_requests"

    body = {
        "amountCents": paylod.amountCents,
        "currency": paylod.currency,
        "reference": paylod.reference,
        "storeId": paylod.storeId,
        "paymentDetails": {
            "type": "redirect",
            "data": {
                "paymentMethod": paylod.paymentMethod,
                "successUrl": paylod.successUrl,
                "errorUrl": paylod.errorUrl
            }
        }
    }
    headers = {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
        "X-API-KEY-ID": API_KEY_ID
    }
    try:
        response = requests.post(url,json=body,headers=headers,timeout=30)
        response.raise_for_status()
        return {
            "status": "success",
            "payment": response.json()
        }, 200

    except requests.exceptions.Timeout:
        return {
            "status": "error",
            "message": "La requête vers Jeko a expiré."
        }, 504
        
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": "Erreur lors de la création du paiement Jeko.",
            "error": str(e)
        }, 500
        
    except ValueError:
        return {
            "status": "error",
            "message": "La réponse de Jeko n'est pas un JSON valide."
        }, 500