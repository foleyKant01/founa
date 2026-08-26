from config.db import db
from model.founa import *


def CreateCommandeStatusLog(data):
    try:
        status_log = CommandeStatusLog(
            commande_id=data.get("commande_id"),
            status_commande=data.get("statut"),
            teller_id=data.get("teller_id")
        )
        db.session.add(status_log)
        db.session.commit()
        return {
            "success": True,
            "message": "Historique du statut de la commande enregistré avec succès",
            "data": {
                "uid": status_log.uid,
                "commande_id": status_log.commande_id,
                "status_commande": status_log.status_commande,
                "teller_id": status_log.teller_id,
                "created_date": str(status_log.created_date),
                "updated_date": str(status_log.updated_date)
            }
        }
    except Exception as e:
        db.session.rollback()
        return {
            "success": False,
            "message": "Erreur lors de l'enregistrement du statut de la commande",
            "error": str(e)
        }, 500