from config.constant import *


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