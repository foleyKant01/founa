import requests
from config.constant import *
from flask import request 
from model.founa import *
from helpers.commandestatuslog import CreateCommandeStatusLog
import hmac
import hashlib
import json
import os
import datetime


def GetAllJekoStores():
    url = "https://api.jeko.africa/partner_api/stores"
    headers = {
        "X-API-KEY": API_KEY,
        "X-API-KEY-ID": API_KEY_ID
    }
    try:
        response = requests.get(url,headers=headers,timeout=30)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict):
            if data.get("id") == "business_not_enabled_for_api_access":
                return {
                    "status": "error",
                    "message": data.get(
                        "message",
                        (
                            "Ce compte professionnel "
                            "n'est pas autorisé à utiliser "
                            "l'API Jeko."
                        )
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
            "message": (
                "La requête vers Jeko a expiré."
            )
        }, 504
    except requests.exceptions.HTTPError as e:
        return {
            "status": "error",
            "message": (
                "Jeko a retourné une erreur HTTP."
            ),
            "error": str(e),
            "response": response.text
        }, response.status_code
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": (
                "Erreur lors de la connexion à Jeko."
            ),
            "error": str(e)
        }, 500
    except ValueError:
        return {
            "status": "error",
            "message": (
                "La réponse de Jeko "
                "n'est pas un JSON valide."
            )
        }, 500 
        
            
        
def GetJekoStoreBalance():
    storeId = request.form.get('storeId')
    url = f"https://api.jeko.africa/partner_api/stores/{storeId}/balance"
    headers = {
        "X-API-KEY": API_KEY,
        "X-API-KEY-ID": API_KEY_ID
    }
    try:
        response = requests.get( url, headers=headers, timeout=30)
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
        


def PaymentRequest():
    try:
        data = request.json or {}
        commande_id = data.get("commande_id")
        paymentMethod = data.get("paymentMethod")
        if not commande_id:
            return {
                "status": "error",
                "message": "commande_id est obligatoire"
            }, 400
        if not paymentMethod:
            return {
                "status": "error",
                "message": "paymentMethod est obligatoire"
            }, 400
        # Vérifier le moyen de paiement
        payment_methods = ["wave", "orange", "mtn"]
        if paymentMethod not in payment_methods:
            return {
                "status": "error",
                "message": "Moyen de paiement invalide"
            }, 400
        # Rechercher la commande
        single_commande = Commande.query.filter_by(
            commande_id=commande_id
        ).first()
        if not single_commande:
            return {
                "status": "error",
                "message": "Commande introuvable"
            }, 404
        # Déterminer le coût d'expédition
        if single_commande.option_envoie == "maritime":
            cout_envoie = single_commande.cout_envoie_maritime or 0
        elif single_commande.option_envoie == "aérienne":
            cout_envoie = single_commande.cout_envoie_aérienne or 0
        else:
            return {
                "status": "error",
                "message": "Option d'envoi invalide ou non définie"
            }, 400
        # Calcul du montant total
        prix_total = single_commande.prix_total or 0
        amountCents = prix_total + cout_envoie
        # Payload Jeko
        payload = {
            "amountCents": amountCents,
            "currency": "XOF",
            "reference": single_commande.commande_id,
            "storeId": "7b247170-dbf3-4731-9ec8-be176651b217",
            "paymentDetails": {
                "type": "redirect",
                "data": {
                    "paymentMethod": paymentMethod,
                    "successUrl": "https://founa.ci/payment/success",
                    "errorUrl": "https://founa.ci/payment/error"
                }
            }
        }
        # Appel Jeko
        result, status_code = CreateJekoPaymentRequest(
            payload
        )
        return result, status_code
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500
        


def CreateJekoPaymentRequest(payload):
    url = "https://api.jeko.africa/partner_api/payment_requests"
    payment_details = payload.get("paymentDetails",{})
    payment_data = payment_details.get("data",{})
    body = {
        "amountCents": payload.get("amountCents"),
        "currency": payload.get("currency"),
        "reference": payload.get("reference"),
        "storeId": payload.get("storeId"),
        "paymentDetails": {
            "type": payment_details.get(
                "type",
                "redirect"
            ),
            "data": {
                "paymentMethod": payment_data.get(
                    "paymentMethod"
                ),
                "successUrl": payment_data.get(
                    "successUrl"
                ),
                "errorUrl": payment_data.get(
                    "errorUrl"
                )
            }
        }
    }
    headers = {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
        "X-API-KEY-ID": API_KEY_ID
    }
    try:
        response = requests.post( url, json=body, headers=headers, timeout=30)
        response.raise_for_status()
        try:
            response_data = response.json()
        except ValueError:
            return {
                "status": "error",
                "message": (
                    "La réponse de Jeko "
                    "n'est pas un JSON valide."
                ),
                "response": response.text
            }, 500
        return {
            "status": "success",
            "payment": response_data
        }, response.status_code
    except requests.exceptions.Timeout:
        return {
            "status": "error",
            "message": (
                "La requête vers Jeko a expiré."
            )
        }, 504
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "message": (
                "Erreur lors de la création "
                "du paiement Jeko."
            ),
            "error": str(e),
            "response": (
                e.response.text
                if e.response is not None
                else None
            )
        }, (
            e.response.status_code
            if e.response is not None
            else 500
        )
    except Exception as e:
        return {
            "status": "error",
            "message": (
                "Erreur inattendue lors "
                "de la création du paiement Jeko."
            ),
            "error": str(e)
        }, 500
        
        



JEKO_WEBHOOK_SECRET = SECRET_WEBHOOK


def VerifyJekoWebhookSignature(raw_body, signature):
    """
    Vérifie que le webhook provient bien de Jeko.

    La signature est calculée sur le body brut avec
    HMAC-SHA256 et le secret partagé avec Jeko.
    """

    if not JEKO_WEBHOOK_SECRET:
        return False

    if not signature:
        return False

    expected_signature = hmac.new(
        JEKO_WEBHOOK_SECRET.encode("utf-8"),
        raw_body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(
        expected_signature,
        signature
    )


def ReceiveJekoWebhook():
    try:
        # ==========================================
        # 1. RECUPERATION DU BODY BRUT
        # ==========================================
        #
        # IMPORTANT :
        # On doit récupérer le body brut AVANT
        # de faire request.get_json().
        #
        # La signature HMAC de Jeko porte sur
        # exactement ce contenu.
        #
        raw_body = request.get_data()
        if not raw_body:
            return {
                "status": "error",
                "message": "Payload webhook vide."
            }, 400

        # 2. RECUPERATION DE LA SIGNATURE JEKO
        signature = request.headers.get(
            "Jeko-Signature",
            ""
        )
        # 3. VERIFICATION DE SECURITE
        signature_valid = VerifyJekoWebhookSignature(
            raw_body,
            signature
        )
        if not signature_valid:
            return {
                "status": "error",
                "message": "Signature webhook Jeko invalide."
            }, 401
        # 4. CONVERSION DU JSON
        try:
            data = json.loads(raw_body)
        except json.JSONDecodeError:
            return {
                "status": "error",
                "message": (
                    "Le payload webhook contient "
                    "un JSON invalide."
                )
            }, 400
        # 5. VERIFICATION DU TYPE DE PAYLOAD
        if not data:
            return {
                "status": "error",
                "message": (
                    "Payload webhook vide ou invalide."
                )
            }, 400
        if not isinstance(data, dict):
            return {
                "status": "error",
                "message": (
                    "Le payload webhook doit être "
                    "un objet JSON."
                )
            }, 400
        # 6. RECUPERATION DES INFORMATIONS
        transaction_id = data.get("id")
        transaction_type = data.get(
            "transactionType"
        )
        status = data.get("status")
        payment_method = data.get(
            "paymentMethod"
        )
        amount_data = data.get("amount") or {}
        amount = amount_data.get("amount")
        currency = amount_data.get("currency")
        fees_data = data.get("fees") or {}
        fees = fees_data.get("amount")
        fees_currency = fees_data.get("currency")
        transaction_details = (
            data.get("transactionDetails") or {}
        )
        reference = transaction_details.get(
            "reference"
        )
        payment_link_id = transaction_details.get(
            "paymentLinkId"
        )
        # 7. VERIFICATION ID TRANSACTION
        if not transaction_id:
            return {
                "status": "error",
                "message": (
                    "L'identifiant de transaction "
                    "Jeko est obligatoire."
                )
            }, 400
        # 8. IDEMPOTENCE
        # Jeko peut potentiellement envoyer plusieurs fois le même webhook.
        # On évite donc d'enregistrer plusieurs fois la même transaction.
        webhook_existant = Webhook.query.filter_by(
            transaction_id=transaction_id
        ).first()
        if webhook_existant:
            return {
                "status": "success",
                "message": "Webhook déjà reçu.",
                "duplicate": True,
                "webhook_uid": webhook_existant.uid
            }, 200
        # 9. DATE D'EXECUTION
        executed_at = None
        executed_at_raw = data.get(
            "executedAt"
        )
        if executed_at_raw:
            try:
                executed_at = (
                    datetime.datetime.strptime(
                        executed_at_raw,
                        "%Y-%m-%d %H:%M:%S"
                    )
                )
            except ValueError:
                executed_at = None
        # 10. CREATION DU WEBHOOK
        webhook = Webhook(
            transaction_id=transaction_id,
            transaction_type=transaction_type,
            reference=reference,
            payment_link_id=payment_link_id,
            status=status,
            payment_method=payment_method,
            amount=amount,
            currency=currency,
            fees=fees,
            fees_currency=fees_currency,
            counterpart_label=data.get(
                "counterpartLabel"
            ),
            counterpart_identifier=data.get(
                "counterpartIdentifier"
            ),
            business_name=data.get(
                "businessName"
            ),
            store_name=data.get(
                "storeName"
            ),
            description=data.get(
                "description"
            ),
            executed_at=executed_at,
            payload=data,
            processed=False
        )
        db.session.add(webhook)
        db.session.commit()
        if status == "success":
            CreateCommandeStatusLog({
                "commande_id": reference,
                "statut": status,
                "teller_id": ""
            })
        
        # 11. REPONSE JEKO
        return {
            "status": "success",
            "message": (
                "Webhook Jeko reçu avec succès."
            ),
            "webhook_uid": webhook.uid,
            "transaction_id": transaction_id
        }, 200
    except Exception as e:
        # 12. ANNULATION EN CAS D'ERREUR
        db.session.rollback()
        return {
            "status": "error",
            "message": (
                "Erreur lors du traitement "
                "du webhook Jeko."
            ),
            "error": str(e)
        }, 500