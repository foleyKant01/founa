
from flask import jsonify, request
from config.db import db
from config.constant import *
from model.founa import *
import jwt
from datetime import datetime
import uuid



def RegisterDeviceToken():
    try:
        data = request.get_json() or {}
        user_uid = data.get("user_uid")
        user_type = data.get("user_type")
        device_token = data.get("device_token")
        device_type = data.get("device_type", "web")
        
        if not user_uid:
            return {
                "status": "error",
                "message": "user_uid obligatoire"
            }, 400

        if not user_type:
            return {
                "status": "error",
                "message": "user_type obligatoire"
            }, 400

        if not device_token:
            return {
                "status": "error",
                "message": "device_token obligatoire"
            }, 400

        existing = DeviceTokens.query.filter_by(
            device_token=device_token
        ).first()

        if existing:
            existing.user_uid = user_uid
            existing.user_type = user_type
            existing.device_type = device_type
            existing.is_active = True
            existing.updated_at = datetime.utcnow()

        else:
            token = DeviceTokens(
                u_uid=str(uuid.uuid4()),
                user_uid=user_uid,
                user_type=user_type,
                device_token=device_token,
                device_type=device_type,
                is_active=True
            )
            db.session.add(token)
        db.session.commit()

        return {
            "status": "success",
            "message": "Token enregistré"
        }, 200

    except Exception as e:
        db.session.rollback()
        print(
            "Erreur RegisterDeviceToken:",
            str(e)
        )
        return {
            "status": "error",
            "message": str(e)
        }, 500



def send_ios_push_notification(message: str, device_token: str):

    response = {}
    """
    Send a push notification to an iOS device.

    :param device_token: The APNs token for the target device
    :param message: The message to send in the notification
    """
    # Generate a JWT for authentication
    current_time = int(time.time())
    jwt_headers = {
        "alg": "ES256",
        "kid": APNS_KEY_ID
    }
    jwt_payload = {
        "iss": TEAM_ID,
        "iat": current_time
    }
    with open(APNS_KEY_PATH, "r") as key_file:
        private_key = key_file.read()
    
    token = jwt.encode(jwt_payload, private_key, algorithm="ES256", headers=jwt_headers)

    # Create the APNs client
    use_sandbox = IS_PRODUCTION
    server = "https://api.sandbox.push.apple.com" if use_sandbox else "https://api.push.apple.com"

    token_credentials = TokenCredentials(
        auth_key_path=APNS_KEY_PATH,
        auth_key_id=APNS_KEY_ID,
        team_id=TEAM_ID
    )
    client = APNsClient(credentials=token_credentials, use_sandbox=use_sandbox)

    # Create the payload
    payload = Payload(alert=message, sound="default", badge=1)

    print("Starting notification process...")
    print(f"Using device_token: {device_token}")
    print(f"APNS_KEY_PATH: {APNS_KEY_PATH}")
    print(f"APNS_KEY_ID: {APNS_KEY_ID}")
    print(f"TEAM_ID: {TEAM_ID}")
    print(f"APNS_TOPIC: {APNS_TOPIC}")

    try:
        # Send the notification
        client.send_notification(device_token, payload, APNS_TOPIC)
        print(f"Notification sent successfully to {device_token}")
        response['status'] = 'Success'
        response['description'] = f"Notification sent successfully to {device_token}"

    except Exception as e:
        print(f"Failed to send notification: {e}")
        response['status'] = 'Error'
        response['error_description'] = f"Failed to send notification: {str(e)}"

    return response


def send_notification(data):
    response = {}
    try:
        user_id = data.get('user_id')
        message = data.get('message')
        link = data.get('link', '')  
        transaction_session_id = data.get('transaction_session_id', '')  

        if not user_id or not message:
            response['status'] = 'error'
            response['error_description'] = 'Missing user_id or message'
            response['message'] = 'Both user_id and message are required.'
            return response

        notif = cd_notifications()
        notif.message = message
        notif.created_by = user_id
        notif.link = link
        notif.reading_status = 'Unread'
        notif.transaction_session_id = transaction_session_id

        db.session.add(notif)
        db.session.commit()

        response['status'] = 'success'
        response['message'] = 'Notification sent successfully'
        response['result'] = {
            'notification_id': notif.uid,
            'message': notif.message
        }
    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)
        response['message'] = 'An error occurred while sending the notification'

    return response


def SaveNotifPromoForAllUser(message, user_id):
    response = {}
    try:
        notif = cd_notifications()
        notif.message = message
        notif.created_by = user_id
        notif.reading_status = 'Unread'

        db.session.add(notif)
        db.session.commit()

        response['status'] = 'success'
        response['message'] = 'Notification sent successfully'
        response['result'] = {
            'notification_id': notif.uid,
            'message': notif.message
        }
    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)
        response['message'] = 'An error occurred while sending the notification'

    return response


def get_all_notification():
    response = {}
    try:
        user_id = request.json.get('user_id')
        if not user_id:
            response['status'] = 'error'
            response['error_description'] = 'Missing transaction_session_id'
            response['message'] = 'transaction_session_id is required.'
            return jsonify(response)
        
        notif = cd_notifications.query.filter_by(created_by=user_id).all()
        notification_info = []
        for item  in notif:
            notification_infos = {
                'uid': item.uid,              
                'message': item.message,              
                'link': item.link,              
                'reading_status': item.reading_status,              
                'transaction_session_id': item.transaction_session_id,            
                'created_by': item.created_by,          
                'creation_date': str(item.creation_date),          
            }
            notification_info.append(notification_infos)
        response['status'] = 'success'
        response ['notification'] = notification_info
        
    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)
        response['message'] = 'An error occurred while retrieving the notification'
    
    return jsonify(response)


def get_single_notification():
    response = {}
    try:
        uid = request.json.get('uid')
        notif = cd_notifications.query.filter_by(uid=uid).first()
        if notif:
            notification_infos = {
                'uid': notif.uid,              
                'message': notif.message,              
                'link': notif.link,              
                'reading_status': notif.reading_status,              
                'transaction_session_id': notif.transaction_session_id,            
                'created_by': notif.created_by,          
                'creation_date': str(notif.creation_date),          
            }
            response['status'] = 'success'
            response ['notification'] = notification_infos
        
    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)
        response['message'] = 'An error occurred while retrieving the notification'
    
    return jsonify(response)



def UpdateAllNotificationStatus():

    response = {}
    try:
        user_id = request.json.get('user_id')
        all_notifs = cd_notifications.query.filter_by(created_by=user_id).all()
        updated_notifs = []
        if all_notifs:
            for item in all_notifs:
                item.reading_status = 'Read'
                updated_notifs.append({
                    'uid': item.uid,
                    'message': item.message, 
                    'link': item.link,
                    'reading_status': item.reading_status,
                    'transaction_session_id': item.transaction_session_id,
                    'created_by': item.created_by,
                    'creation_date': str(item.creation_date)
                })
            db.session.commit()

            response['status'] = 'success'
            response['update_recharge_status_infos'] = updated_notifs
        else:
            response['status'] = 'success'
            response['message'] = 'No notifications to update.'

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response


def UpdateSingleNotificationStatus():

    response = {}
    try:
        user_id = request.json.get('user_id')
        uid = request.json.get('uid')
        updated_notifs = cd_notifications.query.filter_by(created_by=user_id, uid=uid).first()

        if updated_notifs:
            updated_notifs.reading_status = 'Read'
            db.session.add(updated_notifs)
            db.session.commit()
            notifs_infos = {
                'uid': updated_notifs.uid,
                'message': updated_notifs.message, 
                'link': updated_notifs.link,
                'reading_status': updated_notifs.reading_status,
                'transaction_session_id': updated_notifs.transaction_session_id,
                'created_by': updated_notifs.created_by,
                'creation_date': str(updated_notifs.creation_date)
            }
            response['status'] = 'success'
            response['notifs_infos'] = notifs_infos
        else:
            response['status'] = 'success'
            response['message'] = 'No notifications to update.'

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response


# def get_notification():

#     response = {}
#     try:
#         transaction_session_id = request.json.get('transaction_session_id')
#         if not transaction_session_id:
#             response['status'] = 'error'
#             response['error_description'] = 'Missing transaction_session_id'
#             response['message'] = 'transaction_session_id is required.'
#             return jsonify(response)
        
#         notif = cd_notifications.query.filter_by(transaction_session_id=transaction_session_id).first()
#         if not notif:
#             response['status'] = 'error'
#             response['message'] = 'Notification not found'
#             return jsonify(response)
        
#         response['status'] = 'success'
#         response['message'] = 'Notification retrieved successfully'
#         response['result'] = {
#             'uid': notif.uid,
#             'message': notif.message,
#             'transaction_session_id': notif.transaction_session_id,  # Correction ici
#             'created_at': notif.creation_date
#         }
#     except Exception as e:
#         response['status'] = 'error'
#         response['error_description'] = str(e)
#         response['message'] = 'An error occurred while retrieving the notification'
    
#     return jsonify(response)



# def get_all_notifications():
#     response = {}
#     try:
#         created_by = request.json.get('user_id')
#         if not created_by:
#             response['status'] = 'error'
#             response['message'] = 'User ID not provided'
#             return response

#         print(f'Received user_id: {created_by}')
#         notifications = cd_notifications.query.filter_by(created_by=created_by).order_by(cd_notifications.creation_date.desc()).all()
#         print(f'Notifications found: {notifications}')

#         if not notifications:
#             response['status'] = 'error'
#             response['message'] = 'No notifications found'
#             return response

#         notifications_list = []
#         for notif in notifications:
#             notifications_list.append({
#                 'notification_id': notif.id,
#                 'message': notif.message,
#                 'transaction_session_id': notif.transaction_session_id,
#                 'created_at': str(notif.creation_date)
#             })

#         response['status'] = 'success'
#         response['message'] = 'Notifications retrieved successfully'
#         response['result'] = notifications_list

#     except Exception as e:
#         response['status'] = 'error'
#         response['error_description'] = str(e)
#         response['message'] = 'An error occurred while retrieving the notifications'

#     return response
