from config.db import db
from model.founa import *
from flask import request


import random
from datetime import datetime

def generate_order_id():
    date_part = datetime.now().strftime("%Y%m%d")  # ex: 20260104
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

        commande = Commande(
            commande_id=generate_order_id(),
            client_id=client_id,
            produit_id=produit_id,
            quantite=quantite,
            details=details,
            teller_id=produit.teller_id,
            prix_total=prix_total,
            statut="Commande initie"
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
                "teller_id": commande.teller_id,
                "quantite": commande.quantite,
                "prix_total": commande.prix_total,
                "statut": commande.statut
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
                "client": c.client,
                "produit_id": c.produit_id,
                "produit": c.produit,
                "teller_id": c.teller_id,
                "teller": c.teller,
                "quantite": c.quantite,
                "prix_total": c.prix_total,
                "statut": c.statut,
                "details": c.details,
                "created_date": str(c.created_date),
                "updated_date": str(c.updated_date),
            })

        return {"status": "success", "commandes": result}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    
    
    
def GetAllCommandeByClient():
    try:
        data = request.get_json(force=True)  # ✅ plus sûr
        client_id = data.get("client_id")
        if not client_id:
            return {"status": "error", "message": "client_id manquant"}, 400

        all_commande = Commande.query.filter_by(client_id=client_id).all()
        if not all_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404
        
        result = []
        for c in all_commande:
            single_product = Produit.query.filter_by(uid=c.produit_id).first()
            
            result.append({
                "commande_id": c.commande_id,
                "client_id": c.client_id,
                "produit_id": c.produit_id,
                "nom": single_product.nom,
                "teller_id": c.teller_id,
                "fournisseur_id": c.fournisseur_id,
                "quantite": c.quantite,
                "prix_total": c.prix_total,
                "statut": c.statut,
                "details": c.details,
                "created_date": str(c.created_date),
                "updated_date": str(c.updated_date),
            })
            
        return {"status": "success", "commandes": result}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    
    
def GetAllCommandeByTeller():
    try:
        teller_id = (request.json.get('teller_id'))
        all_commande = Commande.query.filter_by(teller_id=teller_id).all()

        if not all_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404
        
        result = []
        for c in all_commande:
            result.append({
                "commande_id": c.commande_id,
                "client_id": c.client_id,
                "client": c.client,
                "produit_id": c.produit_id,
                "produit": c.produit,
                "teller_id": c.teller_id,
                "teller": c.teller,
                "quantite": c.quantite,
                "prix_total": c.prix_total,
                "statut": c.statut,
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

        return {
            "status": "success",
            "commande": {
                "commande_id": single_commande.commande_id,
                "client_id": single_commande.client_id,
                "produit_id": single_commande.produit_id,
                "nom": single_product.nom,
                "images": single_product.images,
                "teller_id": single_commande.teller_id,
                "quantite": single_commande.quantite,
                "prix_total": single_commande.prix_total,
                "statut": single_commande.statut,
                "details": single_commande.details,
                "created_date": str(single_commande.created_date),
                "updated_date": str(single_commande.updated_date),
            }
        }, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500



def UpdateCommande():
    try:
        commande_id = request.json.get('commande_id')
        statut = request.json.get('statut')
        details = request.json.get('details')
        teller_id = request.json.get('teller_id')
        update_commande = Commande.query.filter_by(commande_id=commande_id).first()
        if not update_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        # Mise à jour simple
        update_commande.statut = statut
        update_commande.details = details
        update_commande.teller_id = teller_id
        update_commande.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {"status": "success", "message": "Statut de la commande mis à jour"}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    
    
def ValideCommande():
    try:
        commande_id = request.json.get('commande_id')
        statut = request.json.get('statut')
        update_commande = Commande.query.filter_by(commande_id=commande_id).first()
        if not update_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        # Mise à jour simple
        update_commande.statut = statut
        update_commande.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {"status": "success", "message": "Statut de la commande mis à jour"}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    
    
def CommandePayer():
    try:
        commande_id = request.json.get('commande_id')
        statut = request.json.get('statut')
        update_commande = Commande.query.filter_by(commande_id=commande_id).first()
        if not update_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        # Mise à jour simple
        update_commande.statut = statut
        update_commande.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {"status": "success", "message": "Statut de la commande mis à jour"}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    
    
def CommandeEnExpedition():
    try:
        commande_id = request.json.get('commande_id')
        statut = request.json.get('statut')
        fournisseur_id = request.json.get('fournisseur_id')
        update_commande = Commande.query.filter_by(commande_id=commande_id).first()
        if not update_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        # Mise à jour simple
        update_commande.statut = statut
        update_commande.fournisseur_id = fournisseur_id
        update_commande.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {"status": "success", "message": "Statut de la commande mis à jour"}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    
        
def CommandeEnLivraison():
    try:
        commande_id = request.json.get('commande_id')
        statut = request.json.get('statut')
        update_commande = Commande.query.filter_by(commande_id=commande_id).first()
        if not update_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        # Mise à jour simple
        update_commande.statut = statut
        update_commande.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {"status": "success", "message": "Statut de la commande mis à jour"}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
    
    
def CommandeLivrer():
    try:
        commande_id = request.json.get('commande_id')
        statut = request.json.get('statut')
        update_commande = Commande.query.filter_by(commande_id=commande_id).first()
        if not update_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        # Mise à jour simple
        update_commande.statut = statut
        update_commande.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {"status": "success", "message": "Statut de la commande mis à jour"}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
