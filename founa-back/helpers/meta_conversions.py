import time
import hashlib
import requests
from config.constant import *


def _sha256(value):
    if not value:
        return None

    normalized = str(value).strip().lower()

    if not normalized:
        return None

    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def SendMetaPurchase(commande, client, event_id):
    pixel_id = META_PIXEL_ID
    access_token = META_ACCESS_TOKEN
    api_version = META_GRAPH_API_VERSION

    if not pixel_id or not access_token:
        raise RuntimeError(
            "META_PIXEL_ID ou META_ACCESS_TOKEN manquant."
        )

    user_data = {}

    email = getattr(client, "email", None)
    phone = getattr(client, "phone", None)

    hashed_email = _sha256(email)
    hashed_phone = _sha256(phone)

    if hashed_email:
        user_data["em"] = [hashed_email]

    if hashed_phone:
        # Vérifier et normaliser le numéro au format international
        # avant le hachage, conformément aux exigences de Meta.
        user_data["ph"] = [hashed_phone]

    payload = {
        "data": [
            {
                "event_name": "Purchase",
                "event_time": int(time.time()),
                "event_id": event_id,
                "action_source": "website",
                "event_source_url": "https://founa.ci",
                "user_data": user_data,
                "custom_data": {
                    "currency": "XOF",
                    "value": float(commande.total_reel),
                    "order_id": str(commande.commande_id)
                }
            }
        ]
    }

    response = requests.post(
        f"https://graph.facebook.com/{api_version}/{pixel_id}/events",
        params={"access_token": access_token},
        json=payload,
        timeout=15
    )

    try:
        result = response.json()
    except ValueError:
        result = {"message": response.text[:500]}

    if not response.ok or result.get("error"):
        raise RuntimeError(
            f"Échec Meta Conversions API : {result}"
        )

    return result