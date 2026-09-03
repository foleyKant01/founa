from config.db import db
from model.founa import *
from flask import request
from datetime import datetime
from helpers.commandestatuslog import *
import random



def GetTellerForNewCommande():
    try:
        login_activities = (
            ActivityLog.query
            .filter(ActivityLog.actions == "connexion")
            .order_by(ActivityLog.created_date.desc())
            .all()
        )
        if not login_activities:
            return None
        teller_uids = []
        for activity in login_activities:
            if activity.user not in teller_uids:
                teller_uids.append(activity.user)
        if not teller_uids:
            return None
        tellers = (
            Teller.query
            .filter(Teller.uid.in_(teller_uids))
            .all()
        )
        if not tellers:
            return None
        teller_data = []
        for teller in tellers:
            nombre_commandes = Commande.query.filter_by(
                teller_id=teller.uid
            ).count()
            derniere_connexion = (
                ActivityLog.query
                .filter(
                    ActivityLog.user == teller.uid,
                    ActivityLog.actions == "connexion"
                )
                .order_by(ActivityLog.created_date.desc())
                .first()
            )
            if derniere_connexion:
                teller_data.append({
                    "teller": teller,
                    "nombre_commandes": nombre_commandes,
                    "derniere_connexion": derniere_connexion.created_date
                })
        if not teller_data:
            return None
        teller_data.sort(
            key=lambda x: (
                x["derniere_connexion"],
                x["nombre_commandes"]
            ),
            reverse=True
        )
        return teller_data[0]["teller"].uid
    except Exception as e:
        print("Erreur sélection Teller :", str(e))
        return None
    
    
def AttribuerCommandes():
    try:

        data = request.json
        commande_id = data.get('commande_id')
        if not commande_id:
            return {
                "status": "error",
                "message": "commande_id est requis"
            }, 400
        single_commande = Commande.query.filter_by(
            commande_id=commande_id
        ).first()
        if not single_commande:
            return {
                "status": "error",
                "message": "Commande introuvable"
            }, 404
        teller = GetTellerForNewCommande()
        if not teller:
            return {
                "status": "error",
                "message": "Aucun teller disponible"
            }, 404
        single_commande.teller_id = teller.uid
        status_log = CommandeStatusLog(
            commande_id=single_commande.commande_id,
            status_commande=single_commande.statut,
            teller_id=teller.uid
        )
        db.session.add(status_log)
        db.session.commit()
        return {
            "status": "success",
            "message": "Commande attribuée avec succès",
            "commande": {
                "commande_id": single_commande.commande_id,
                "teller_id": teller.uid,
                "teller_name": teller.fullname,
                "statut": single_commande.statut
            }
        }, 200
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": str(e)
        }, 500



def generate_order_id():
    date_part = datetime.datetime.now().strftime("%Y%m%d")  # ex: 20260104
    random_part = random.randint(100, 999)       # 3chiffres
    return f"COM{date_part}{random_part}"


def CreateCommande():
    try:
        data = request.json

        client_id = data.get('client_id')
        produit_id = data.get('produit_id')
        quantite = data.get('quantite')
        details = data.get('details')

        if not client_id or not produit_id or not quantite:
            return {"status": "error", "message": "client_id, produit_id et quantite sont requis"}, 400

        # Vérifier que client ➕ produit existent
        client = Client.query.filter_by(uid=client_id).first()
        produit = Produit.query.filter_by(uid=produit_id).first()

        if not client:
            return {"status": "error", "message": "Client introuvable"}, 404

        if not produit:
            return {"status": "error", "message": "Produit introuvable"}, 404

        # Calcul du prix total
        prix_total = float(produit.prix_vente) * int(quantite)
        teller_id = GetTellerForNewCommande()
        commande = Commande(
            commande_id=generate_order_id(),
            client_id=client_id,
            produit_id=produit_id, 
            quantite=quantite,
            details=details,
            prix_total=prix_total,
            teller_id=teller_id,
            statut="Initier",
            view="1"
        )

        db.session.add(commande)
        db.session.commit()

        return {
            "status": "success",
            "message": "Commande créée avec succès",
            "commande": {
                "id": commande.id,
                "commande_id": commande.commande_id,
                "client_id": commande.client_id,
                "produit_id": commande.produit_id,
                "details": commande.details,
                "quantite": commande.quantite,
                "prix_total": commande.prix_total, 
                "statut": commande.statut,
                "teller_id": teller_id
            }
        }, 201

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    


def GetAllCommandes():
    try:
        commandes = Commande.query.all()
        result = []
        for c in commandes:
            result.append({
                "commande_id": c.commande_id,
                "client_id": c.client_id,
                "client": {
                    "uid": c.client.uid if c.client else None,
                    "nom": c.client.fullname if c.client else "",
                    "email": c.client.email if c.client else "",
                    "phone": c.client.phone if c.client else ""
                },
                "produit_id": c.produit_id,
                "produit": {
                    "uid": c.produit.uid if c.produit else None,
                    "nom": c.produit.nom if c.produit else ""
                },
                "quantite": c.quantite,
                "prix_total": c.prix_total,
                "statut": c.statut,
                "details": c.details,
                "teller_id": c.teller_id,
                "fournisseur_id": c.fournisseur_id,
                "cout_envoie_maritime": c.cout_envoie_maritime,
                "cout_envoie_aérienne": c.cout_envoie_aérienne,
                "option_envoie": c.option_envoie,
                "created_date": (
                    c.created_date.isoformat()
                    if c.created_date
                    else None
                ),
                "updated_date": (
                    c.updated_date.isoformat()
                    if c.updated_date
                    else None
                )
            })
        return {
            "status": "success",
            "commandes": result
        }, 200
    except Exception as e:
        print("Erreur GetAllCommandes :", str(e))
        return {
            "status": "error",
            "message": str(e)
        }, 500
    
    
def GetAllCommandeByClient():
    try:
        # data = request.get_json(force=True)  # ✅ plus sûr
        # client_id = data.get("client_id")
        client_id = request.json.get("client_id")
        if not client_id: 
            return {"status": "error", "message": "client_id manquant"}, 400

        all_commande = Commande.query.filter_by(client_id=client_id).all()
        if not all_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404
        
        result = []
        for c in all_commande:
            single_product = Produit.query.filter_by(uid=c.produit_id).first()
            print(c.produit_id)
            if not single_product:
                return {"status": "error", "message": "Produit introuvable alors Commande impossible"}, 404
            
            result.append({
                "commande_id": c.commande_id,
                "client_id": c.client_id,
                "produit_id": c.produit_id,
                "nom": single_product.nom,
                "fournisseur_id": c.fournisseur_id,
                "quantite": c.quantite,
                "prix_total": c.prix_total,
                "statut": c.statut,
                "teller_id": c.teller_id,
                "details": c.details,
                "view": c.view,
                "created_date": str(c.created_date),
                "updated_date": str(c.updated_date),
            })
            
        return {"status": "success", "commandes": result}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    
    
    
def GetAllCommandeByTeller():
    try:
        teller_id = request.json.get('teller_id')
        all_commande = Commande.query.filter_by(teller_id=teller_id).all()

        if not all_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        result = []
        for c in all_commande:
            result.append({
                "commande_id": c.commande_id,
                "client": {
                    "uid": c.client.uid,
                    "nom": c.client.fullname,
                    "email": c.client.email,
                    "phone": c.client.phone,
                },
                "produit": {
                    "uid": c.produit.uid,
                    "nom": c.produit.nom,
                    "prix_vente": c.produit.prix_vente,
                    # ajoute d'autres champs nécessaires
                },
                "quantite": c.quantite,
                "prix_total": c.prix_total,
                "statut": c.statut,
                "teller_id": c.teller_id,
                "details": c.details,
                "created_date": str(c.created_date),
                "updated_date": str(c.updated_date),
            })

        return {"status": "success", "commandes": result}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500



def GetSingleCommande():
    try:
        commande_id = (request.json.get('commande_id'))
        single_commande = Commande.query.filter_by(commande_id=commande_id).first()
        single_product = Produit.query.filter_by(uid=single_commande.produit_id).first()

        if not single_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404
        
        single_commande.view = "0"
        db.session.commit()
        
        return {
            "status": "success",
            "commande": {
                "commande_id": single_commande.commande_id,
                "client_id": single_commande.client_id,
                "produit_id": single_commande.produit_id,
                "nom": single_product.nom,
                "images": single_product.images,
                "quantite": single_commande.quantite,
                "prix_total": single_commande.prix_total,
                "statut": single_commande.statut,
                "details": single_commande.details,
                "cout_envoie_maritime": single_commande.cout_envoie_maritime,
                "cout_envoie_aérienne": single_commande.cout_envoie_aérienne,
                "view": single_commande.view,
                "created_date": str(single_commande.created_date),
                "updated_date": str(single_commande.updated_date),
            }
        }, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500



def UpdateCommande():
    try:
        data = request.json

        commande_id = data.get('commande_id')
        statut = data.get('statut')
        details = data.get('details')
        cout_envoie_maritime = data.get('cout_envoie_maritime', 0)
        cout_envoie_aerienne = data.get('cout_envoie_aérienne', 0)

        update_commande = Commande.query.filter_by(commande_id=commande_id).first()

        if not update_commande:
            return {
                "status": "error",
                "message": "Commande introuvable"
            }, 404

        update_commande.statut = statut
        update_commande.details = details
        update_commande.details = details
        update_commande.cout_envoie_maritime = float(cout_envoie_maritime or 0)
        update_commande.cout_envoie_aérienne = float(cout_envoie_aerienne or 0)
        update_commande.view = "1"
        update_commande.updated_date = datetime.datetime.now()
        
        db.session.commit()
        
        CreateCommandeStatusLog({
            "commande_id": update_commande.commande_id,
            "statut": update_commande.statut,
            "teller_id": update_commande.teller_id
        })
        return {
            "status": "success",
            "message": "Commande mise à jour"
        }, 200
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": str(e)
        }, 500
    
    
def OptionEnvoie():
    try:
        data = request.json
        commande_id = data.get('commande_id')
        option_envoie = data.get('option_envoie')
        update_commande = Commande.query.filter_by(commande_id=commande_id).first()
        if not update_commande:
            return {
                "status": "error",
                "message": "Commande introuvable"
            }, 404
        update_commande.option_envoie = option_envoie
        update_commande.updated_date = datetime.datetime.now()
        db.session.commit()
        return {
            "status": "success",
            "message": "Commande mise à jour"
        }, 200
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": str(e)
        }, 500
    

    
def DeleteExpiredCommandes():
    import datetime
    try:
        limite_date = datetime.datetime.utcnow() - datetime.timedelta(days=7)
        commandes = Commande.query.filter(
            Commande.statut == "Valider",
            Commande.created_date <= limite_date
        ).all()
        nombre_supprime = len(commandes)
        for commande in commandes:
            db.session.delete(commande)
        db.session.commit()
        return {
            "success": True,
            "message": f"{nombre_supprime} commande(s) expirée(s) supprimée(s)",
            "deleted_count": nombre_supprime
        }
    except Exception as e:
        db.session.rollback()
        return {
            "success": False,
            "message": "Erreur lors de la suppression des commandes expirées",
            "error": str(e)
        }