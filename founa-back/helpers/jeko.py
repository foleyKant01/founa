import requests
from config.constant import *
from flask import request 
from model.founa import *
from services.fcm_service import send_push_notification
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
        
        
def GetJekoStoreIdByName(store_name):
    result, status_code = GetAllJekoStores()

    if status_code != 200:
        return None, result

    stores = result.get("stores", [])

    if not isinstance(stores, list):
        return None, {
            "status": "error",
            "message": "La liste des stores Jeko est invalide."
        }

    for store in stores:
        if store.get("name") == store_name:
            return store.get("id"), None

    return None, {
        "status": "error",
        "message": f"Store Jeko '{store_name}' introuvable."
    }
        
            
        
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
        
        
def GenerateJekoReference(commande_id):
    return f"{commande_id}-{uuid.uuid4().hex[:8]}"
        

def PaymentRequest():
    try:
        create_new_payment = False
        data = request.json or {}
        commande_id = (data.get("commande_id") or "").strip()
        payment_method = (data.get("paymentMethod") or "").strip().lower()

        # VALIDATION DES DONNÉES
        if not commande_id:
            return {
                "status": "error",
                "message": "commande_id est obligatoire"
            }, 400
        if not payment_method:
            return {
                "status": "error",
                "message": "paymentMethod est obligatoire"
            }, 400
        payment_methods = [
            "wave",
            "orange",
            "mtn",
            "moov",
            "djamo"
        ]
        if payment_method not in payment_methods:
            return {
                "status": "error",
                "message": "Moyen de paiement invalide"
            }, 400

        # RECHERCHE DE LA COMMANDE
        single_commande = Commande.query.filter_by(
            commande_id=commande_id
        ).first()
        if not single_commande:
            return {
                "status": "error",
                "message": "Commande introuvable"
            }, 404
            
        # Une commande déjà payée ne doit pas créer
        # un nouveau paiement.
        if single_commande.statut == "Payer":
            return {
                "status": "error",
                "message": "Cette commande est déjà payée."
            }, 409

        # RECHERCHE DU CLIENT
        single_client = Client.query.filter_by(
            uid=single_commande.client_id
        ).first()

        if not single_client:
            return {
                "status": "error",
                "message": "Client de la commande introuvable"
            }, 404

        # COÛT D'EXPÉDITION
        if single_commande.option_envoie == "maritime":
            cout_envoie = (
                single_commande.cout_envoie_maritime or 0
            )
        elif single_commande.option_envoie == "aérienne":
            cout_envoie = (
                single_commande.cout_envoie_aérienne or 0
            )
        else:
            return {
                "status": "error",
                "message": "Option d'envoi invalide ou non définie"
            }, 400

        # CALCUL DU MONTANT RÉEL
        prix_articles = float(single_commande.prix_total or 0)

        # CODE PROMO
        # code_promo_disponible = (
        #     bool(single_client.code_promo)
        #     and single_client.status_code_promo == "non-utiliser"
        # )

        if single_client.code_promo and single_client.status_code_promo == "non-utiliser":
            reduction = prix_articles * 0.10
        else:
            reduction = 0
        prix_apres_reduction = (
            prix_articles - reduction
        )
        total_reel = (
            prix_apres_reduction
            + float(cout_envoie)
        )
        if total_reel <= 0:
            return {
                "status": "error",
                "message": "Le montant du paiement est invalide."
            }, 400
        amount_cents = int(
            round(total_reel * 100)
        )

        # VÉRIFIER UN PAYMENT REQUEST EXISTANT
        if single_commande.paiement_infos:
            try:
                paiement_infos = json.loads(
                    single_commande.paiement_infos
                )
            except (json.JSONDecodeError, TypeError):
                paiement_infos = None
            if paiement_infos:
                result_data = (
                    paiement_infos.get("result") or {}
                )
                payment_data = (
                    result_data.get("payment") or {}
                )
                payment_request_id = (
                    payment_data.get("id")
                )
                saved_reference = (
                    payment_data.get("reference")
                )
                saved_payment_method = (
                    payment_data.get("paymentMethod")
                )
                redirect_url = (
                    payment_data.get("redirectUrl")
                )

                # Vérifier que les informations sauvegardées
                # correspondent bien à cette commande.
                if payment_request_id:
                    check_result, check_status = (GetJekoPaymentRequest(payment_request_id))
                    if check_status == 200:
                        current_payment = (
                            check_result.get("payment") or {}
                        )
                        current_status = (
                            current_payment.get("status")
                        )
                        current_error_reason = (
                            current_payment.get("errorReason")
                        )

                        # PAIEMENT ENCORE EN ATTENTE
                        if current_status == "pending":
                            if redirect_url:
                                return {
                                    "status": "success",
                                    "message": (
                                        "Une demande de paiement "
                                        "est déjà en attente."
                                    ),
                                    "payment": {
                                        "id": payment_request_id,
                                        "reference": saved_reference,
                                        "paymentMethod": (
                                            saved_payment_method
                                        ),
                                        "status": "pending",
                                        "redirectUrl": redirect_url
                                    }
                                }, 200

                        # PAIEMENT DÉJÀ RÉUSSI
                        if current_status == "success":
                            return {
                                "status": "error",
                                "message": (
                                    "Cette demande de paiement "
                                    "a déjà été effectuée."
                                ),
                                "payment": current_payment
                            }, 409

                        # PAIEMENT ÉCHOUÉ / LIEN EXPIRÉ
                        if current_status == "error":
                            create_new_payment = True
                            print(
                                "[JEKO] Ancienne demande de paiement "
                                f"expirée/échouée : "
                                f"{current_error_reason}"
                            )

                            # On continue plus bas pour créer une nouvelle Payment Request.
                    elif check_status == 404:
                        create_new_payment = True
                        print(
                            "[JEKO] Ancienne Payment Request "
                            "introuvable. Création d'une nouvelle."
                        )
                    else:
                        create_new_payment = True
                        return {
                            "status": "error",
                            "message": (
                                "Impossible de vérifier "
                                "la demande de paiement Jèko."
                            ),
                            "response": check_result
                        }, check_status
                        
        # reference = single_commande.commande_id
        # Si une nouvelle tentative est nécessaire,
        # on génère une référence Jeko unique.
        if create_new_payment:
            reference = GenerateJekoReference(
                single_commande.commande_id
            )
        else:
            reference = single_commande.commande_id

        # CRÉATION D'UNE NOUVELLE PAYMENT REQUEST
        payload = {
            "amountCents": amount_cents,
            "currency": "XOF",
            "reference": reference,
            "storeId": (
                "eb765f96-3eb0-413a-9f65-dd573f5eaf94"
            ),
            "paymentDetails": {
                "type": "redirect",
                "data": {
                    "paymentMethod": payment_method,
                    "successUrl": (
                        "https://founa.ci/payment/success"
                        f"?commande_id="
                        f"{single_commande.commande_id}"
                    ),
                    "errorUrl": (
                        "https://founa.ci/payment/error"
                        f"?commande_id="
                        f"{single_commande.commande_id}"
                    )
                }
            }
        }
        result, status_code = (CreateJekoPaymentRequest(payload))
        print("status_code:", status_code)
        print("result:", result)

        # SI JEKO REFUSE LA CRÉATION
        if status_code < 200 or status_code >= 300:
            return result, status_code
        if result.get("status") != "success":
            return result, status_code

        # VÉRIFIER LA RÉPONSE JEKO
        payment_data = (
            result.get("payment") or {}
        )
        payment_request_id = (
            payment_data.get("id")
        )
        redirect_url = (
            payment_data.get("redirectUrl")
        )
        if not payment_request_id:
            return {
                "status": "error",
                "message": (
                    "Jèko n'a pas retourné "
                    "l'identifiant du paiement."
                ),
                "response": result
            }, 502

        if not redirect_url:
            return {
                "status": "error",
                "message": (
                    "Jèko n'a pas retourné "
                    "l'URL de paiement."
                ),
                "response": result
            }, 502

        # ==========================================================
        # SAUVEGARDE
        # ==========================================================

        single_commande.paiement_infos = json.dumps(
            {
                "result": result,
                "status_code": status_code
            },
            ensure_ascii=False
        )

        db.session.commit()

        # ==========================================================
        # RETOUR
        # ==========================================================

        return result, status_code
    except Exception as e:
        db.session.rollback()
        print(
            f"[PAYMENT REQUEST ERROR] {str(e)}"
        )
        return {
            "status": "error",
            "message": (
                "Erreur lors de la création "
                "de la demande de paiement."
            ),
            "error": str(e)
        }, 500


def GetJekoPaymentRequest(payment_request_id):
    url = (
        "https://api.jeko.africa"
        f"/partner_api/payment_requests/"
        f"{payment_request_id}"
    )
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

        try:
            response_data = response.json()

        except ValueError:

            return {
                "status": "error",
                "message": (
                    "La réponse de Jèko "
                    "n'est pas un JSON valide."
                ),
                "response": response.text
            }, 502

        if response.status_code != 200:

            return {
                "status": "error",
                "message": (
                    "Impossible de vérifier "
                    "la demande de paiement Jèko."
                ),
                "response": response_data
            }, response.status_code

        return {
            "status": "success",
            "payment": response_data
        }, 200

    except requests.exceptions.Timeout:

        return {
            "status": "error",
            "message": (
                "La vérification de la demande "
                "de paiement Jèko a expiré."
            )
        }, 504

    except requests.exceptions.RequestException as e:

        return {
            "status": "error",
            "message": (
                "Erreur lors de la vérification "
                "de la demande de paiement Jèko."
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


def CreateJekoPaymentRequest(payload):

    url = (
        "https://api.jeko.africa"
        "/partner_api/payment_requests"
    )

    payment_details = (
        payload.get("paymentDetails") or {}
    )

    payment_data = (
        payment_details.get("data") or {}
    )

    body = {

        "amountCents": payload.get(
            "amountCents"
        ),

        "currency": payload.get(
            "currency"
        ),

        "reference": payload.get(
            "reference"
        ),

        "storeId": payload.get(
            "storeId"
        ),

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

        response = requests.post(
            url,
            json=body,
            headers=headers,
            timeout=30
        )

        try:
            response_data = response.json()

        except ValueError:

            return {
                "status": "error",
                "message": (
                    "La réponse de Jèko "
                    "n'est pas un JSON valide."
                ),
                "response": response.text
            }, 502

        if response.status_code < 200 or response.status_code >= 300:

            return {
                "status": "error",
                "message": (
                    "Erreur lors de la création "
                    "du paiement Jèko."
                ),
                "response": response_data
            }, response.status_code

        return {
            "status": "success",
            "payment": response_data
        }, response.status_code

    except requests.exceptions.Timeout:

        return {
            "status": "error",
            "message": (
                "La requête vers Jèko "
                "a expiré."
            )
        }, 504

    except requests.exceptions.RequestException as e:

        return {
            "status": "error",
            "message": (
                "Erreur lors de la création "
                "du paiement Jèko."
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
                "de la création du paiement Jèko."
            ),
            "error": str(e)
        }, 500
        
        
        
def VerifyJekoWebhookSignature(raw_body, signature):

    if not SECRET_WEBHOOK:
        return False

    if not signature:
        return False

    expected_signature = hmac.new(
        SECRET_WEBHOOK.encode("utf-8"),
        raw_body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(
        expected_signature,
        signature
    )


def ReceiveJekoWebhook():

    try:

        # ==========================================================
        # BODY BRUT
        # ==========================================================

        raw_body = request.get_data()

        if not raw_body:

            return {
                "status": "error",
                "message": "Payload webhook vide."
            }, 400

        # ==========================================================
        # ÉVÉNEMENT
        # ==========================================================

        event = request.headers.get(
            "Jeko-Event",
            ""
        )

        if event != "TRANSACTION_COMPLETED":

            return {
                "status": "success",
                "message": "Événement Jèko ignoré.",
                "event": event
            }, 200

        # ==========================================================
        # SIGNATURE
        # ==========================================================

        signature = request.headers.get(
            "Jeko-Signature",
            ""
        )

        if not VerifyJekoWebhookSignature(
            raw_body,
            signature
        ):

            return {
                "status": "error",
                "message": (
                    "Signature webhook Jèko invalide."
                )
            }, 401

        # ==========================================================
        # JSON
        # ==========================================================

        try:

            data = json.loads(
                raw_body
            )

        except json.JSONDecodeError:

            return {
                "status": "error",
                "message": (
                    "Le payload webhook "
                    "contient un JSON invalide."
                )
            }, 400

        if not isinstance(data, dict):

            return {
                "status": "error",
                "message": (
                    "Le payload webhook "
                    "doit être un objet JSON."
                )
            }, 400

        # ==========================================================
        # DONNÉES TRANSACTION
        # ==========================================================

        transaction_id = data.get("id")

        status = data.get("status")

        transaction_type = data.get(
            "transactionType"
        )

        payment_method = data.get(
            "paymentMethod"
        )

        amount_data = (
            data.get("amount") or {}
        )

        amount_cents = amount_data.get(
            "amount"
        )

        currency = amount_data.get(
            "currency"
        )

        fees_data = (
            data.get("fees") or {}
        )

        fees_cents = fees_data.get(
            "amount"
        )

        fees_currency = fees_data.get(
            "currency"
        )

        transaction_details = (
            data.get("transactionDetails") or {}
        )

        reference = transaction_details.get(
            "reference"
        )

        payment_link_id = transaction_details.get(
            "paymentLinkId"
        )

        # ==========================================================
        # VALIDATIONS
        # ==========================================================

        if not transaction_id:

            return {
                "status": "error",
                "message": (
                    "L'identifiant de transaction "
                    "Jèko est obligatoire."
                )
            }, 400

        if not reference:

            return {
                "status": "error",
                "message": (
                    "La référence de commande "
                    "est absente."
                )
            }, 400

        if amount_cents is None:

            return {
                "status": "error",
                "message": (
                    "Le montant de la transaction "
                    "Jèko est absent."
                )
            }, 400

        # Les frais peuvent être absents
        # selon le payload.
        fees = (
            float(fees_cents) / 100
            if fees_cents is not None
            else 0
        )

        amount = (
            float(amount_cents) / 100
        )

        # ==========================================================
        # IDEMPOTENCE
        # ==========================================================

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

        # ==========================================================
        # COMMANDE
        # ==========================================================
        commande_id = reference.rsplit("-", 1)[0]

        commande = Commande.query.filter_by(
            commande_id=commande_id
        ).first()

        if not commande:

            return {
                "status": "error",
                "message": (
                    f"Commande introuvable : {reference}"
                )
            }, 404

        # ==========================================================
        # CLIENT
        # ==========================================================

        single_client = Client.query.filter_by(
            uid=commande.client_id
        ).first()

        if not single_client:

            return {
                "status": "error",
                "message": (
                    "Client de la commande introuvable."
                )
            }, 404

        # ==========================================================
        # DATE D'EXÉCUTION
        # ==========================================================

        executed_at = None

        executed_at_raw = data.get(
            "executedAt"
        )

        if executed_at_raw:

            try:

                executed_at = datetime.datetime.strptime(
                    executed_at_raw,
                    "%Y-%m-%d %H:%M:%S"
                )

            except ValueError:

                executed_at = None

        # ==========================================================
        # ENREGISTREMENT DU WEBHOOK
        # ==========================================================

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

        db.session.add(
            webhook
        )

        # ==========================================================
        # PAIEMENT RÉUSSI
        # ==========================================================

        if status == "success":

            if commande.statut != "Payer":

                ancien_statut = commande.statut

                # --------------------------------------------------
                # COMMANDE
                # --------------------------------------------------

                commande.statut = "Payer"

                commande.updated_date = (
                    datetime.datetime.utcnow()
                )

                # --------------------------------------------------
                # CODE PROMO
                # --------------------------------------------------

                if (
                    single_client.code_promo
                    and single_client.status_code_promo
                    == "non-utiliser"
                ):

                    single_client.status_code_promo = (
                        "utiliser"
                    )

                # --------------------------------------------------
                # LOG
                # --------------------------------------------------

                log_result = (
                    CreateCommandeStatusLog({
                        "commande_id": (
                            commande.commande_id
                        ),
                        "statut": "Payer",
                        "teller_id": (
                            commande.teller_id
                        )
                    })
                )

                if isinstance(log_result, tuple):

                    log_data, log_status = (
                        log_result
                    )

                    if log_status != 200:

                        db.session.rollback()

                        return {
                            "status": "error",
                            "message": (
                                "Le statut de la commande "
                                "n'a pas pu être enregistré "
                                "dans les logs."
                            ),
                            "log_error": log_data
                        }, 500

                elif isinstance(
                    log_result,
                    dict
                ):

                    if not log_result.get(
                        "success"
                    ):

                        db.session.rollback()

                        return {
                            "status": "error",
                            "message": (
                                "Le statut de la commande "
                                "n'a pas pu être enregistré "
                                "dans les logs."
                            ),
                            "log_error": log_result
                        }, 500

                # --------------------------------------------------
                # NOTIFICATION CLIENT
                # --------------------------------------------------

                send_push_notification(

                    user_uid=commande.client_id,

                    user_type="user",

                    title=(
                        "Mise à jour de votre commande"
                    ),

                    body=(
                        f"Votre commande "
                        f"{commande.commande_id} "
                        f"est maintenant : "
                        f"{commande.statut}"
                    ),

                    data={
                        "type": "order_status",
                        "commande_id": (
                            commande.commande_id
                        ),
                        "statut": commande.statut,
                        "url": (
                            "https://founa.ci/orders"
                        )
                    }
                )

                # --------------------------------------------------
                # NOTIFICATION TELLER
                # --------------------------------------------------

                if commande.teller_id:

                    send_push_notification(

                        user_uid=commande.teller_id,

                        user_type="teller",

                        title="Nouvelle commande",

                        body=(
                            f"Une commande "
                            f"{commande.commande_id} "
                            f"vient d'être payée."
                        ),

                        data={
                            "type": "new_order",
                            "commande_id": (
                                commande.commande_id
                            ),
                            "statut": commande.statut,
                            "url": (
                                "https://founa.ci/teller/orders"
                            )
                        }
                    )

                print(
                    f"[JEKO] Commande "
                    f"{commande.commande_id} "
                    f"passée de "
                    f"'{ancien_statut}' "
                    f"à 'Payer'."
                )

            else:

                print(
                    f"[JEKO] Commande "
                    f"{commande.commande_id} "
                    f"est déjà au statut 'Payer'."
                )

        # ==========================================================
        # PAIEMENT ÉCHOUÉ
        # ==========================================================

        elif status == "error":

            print(
                f"[JEKO] Paiement échoué pour "
                f"la commande "
                f"{commande.commande_id}. "
                f"Status Jèko : {status}"
            )

        # ==========================================================
        # AUTRE STATUT
        # ==========================================================

        else:

            print(
                f"[JEKO] Statut Jèko reçu : "
                f"{status} pour "
                f"{commande.commande_id}"
            )

        # ==========================================================
        # WEBHOOK TRAITÉ
        # ==========================================================

        webhook.processed = True

        webhook.processed_at = (
            datetime.datetime.utcnow()
        )

        db.session.commit()

        return {
            "status": "success",
            "message": (
                "Webhook Jèko traité avec succès."
            ),
            "transaction_id": transaction_id,
            "commande_id": commande.commande_id,
            "commande_status": commande.statut
        }, 200

    except Exception as e:

        db.session.rollback()

        print(
            f"[JEKO WEBHOOK ERROR] {str(e)}"
        )

        return {
            "status": "error",
            "message": (
                "Erreur lors du traitement "
                "du webhook Jèko."
            ),
            "error": str(e)
        }, 500