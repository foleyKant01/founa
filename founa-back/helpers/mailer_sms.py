from config.constant import *
import requests


def send_sms_by_sendexa(phone, message):
    import requests
    response = {}
    token = SENDEXA_BASE64_TOKEN
    phone_number = "+225" + phone
    response = requests.post(SENDEXA_API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Basic {token}"
        },
        json={
            "to": phone_number,
            "from": SENDEXA_SENDER_ID,
            "message": message
        }
    )
    return response.json()


def send_whatsapp_by_sendexa(phone, message):
    try:
        token = SENDEXA_BASE64_TOKEN_WHAT
        phone_number = "+225" + phone.lstrip("+")
        response = requests.post(
            "https://api.sendexa.co/v1/whatsapp/send",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Basic {token}"
            },
            json={
                "to": phone_number,
                "type": "text",
                "text": {
                    "body": message
                }
            },
        )
        return response.json()
    except requests.RequestException as e:
        return {
            "success": False,
            "message": "Erreur lors de l'envoi WhatsApp",
            "error": str(e)
        }
        
        
# def send_whatsapp_by_sendexa(phone, message):
#     try:
#         token = SENDEXA_BASE64_TOKEN_WHAT
#         phone_number = "+225" + phone.lstrip("+")
#         response = requests.post(
#             "https://api.sendexa.co/v1/whatsapp/send",
#             headers={
#                 "Content-Type": "application/json",
#                 "Authorization": "Basic {token}",
#             },
#             json={
#                 "to": phone_number,
#                 "type": "text",
#                 "text": {"body": message},
#             },
#         )
#         return response.json()
#     except requests.RequestException as e:
#         return {
#             "success": False,
#             "message": "Erreur lors de l'envoi WhatsApp",
#             "error": str(e)
#         }