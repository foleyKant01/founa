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
        
        
        
def GetSingleCommandeStatusLog(commande_id):
    try:
        status_log = CommandeStatusLog.query.filter_by(
            commande_id=commande_id
        ).order_by(
            CommandeStatusLog.created_date.desc()
        ).first()

        if not status_log:
            return {
                "success": False,
                "message": "Aucun historique de statut trouvé pour cette commande",
                "data": None
            }, 404
        return {
            "success": True,
            "message": "Statut de la commande récupéré avec succès",
            "data": {
                "uid": status_log.uid,
                "commande_id": status_log.commande_id,
                "status_commande": status_log.status_commande,
                "teller_id": status_log.teller_id,
                "created_date": str(status_log.created_date),
                "updated_date": str(status_log.updated_date)
            }
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": "Erreur lors de la récupération du statut de la commande",
            "error": str(e)
        }, 500