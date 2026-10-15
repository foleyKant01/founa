
from flask import request
from config.db import db
from config.constant import *
from model.founa import *
from services.fcm_service import *
from datetime import datetime
import uuid


def RegisterDeviceToken():
    try:
        data = request.get_json() or {}
        user_uid = data.get("user_uid")
        user_type = data.get("user_type")
        device_token = data.get("device_token")
        device_type = data.get("device_type", "web")
        if not user_uid or not user_type or not device_token:
            return {
            "status": "error",
            "message": "user_uid, user_type et device_token sont obligatoires."
        }, 400
        existing = DeviceTokens.query.filter_by(device_token=device_token).first()
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
        return {
            "status": "error",
            "message": str(e)
        }, 500