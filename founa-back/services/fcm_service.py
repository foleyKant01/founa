import firebase_admin

from firebase_admin import (
    credentials,
    messaging
)
from model.founa import DeviceTokens

firebase_app = None


def initialize_firebase():
    global firebase_app
    if firebase_app is not None:
        return firebase_app
    cred = credentials.Certificate(
        "/home/founa/secrets/firebase-service-account.json"
    )
    firebase_app = firebase_admin.initialize_app(
        cred
    )
    return firebase_app


def send_push_notification(
    user_uid: str,
    user_type: str,
    title: str,
    body: str,
    data: dict | None = None
):
    try:
        initialize_firebase()
        tokens = DeviceTokens.query.filter_by(
            user_uid=user_uid,
            user_type=user_type,
            is_active=True
        ).all()
        if not tokens:
            return {
                "status": "success",
                "sent": 0,
                "message": "Aucun appareil enregistré"
            }
        sent = 0
        failed = 0
        for token_record in tokens:
            try:
                message = messaging.Message(
                    notification=messaging.Notification(
                        title=title,
                        body=body
                    ),

                    data={
                        key: str(value)
                        for key, value in (data or {}).items()
                    },

                    webpush=messaging.WebpushConfig(
                        notification=messaging.WebpushNotification(
                            title=title,
                            body=body,
                            icon="/logo-founa2.png"
                        ),

                        fcm_options=messaging.WebpushFCMOptions(
                            link=(
                                data or {}
                            ).get(
                                "url",
                                "https://founa.ci"
                            )
                        )
                    ),
                    token=token_record.device_token
                )

                messaging.send(
                    message
                )

                sent += 1
            except Exception as e:
                failed += 1
                print(
                    "Erreur FCM token:",
                    token_record.device_token,
                    str(e)
                )
        return {
            "status": "success",
            "sent": sent,
            "failed": failed
        }
    except Exception as e:
        print(
            "Erreur send_push_notification:",
            str(e)
        )
        return {
            "status": "error",
            "message": str(e)
        }