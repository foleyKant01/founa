from config.db import db
from model.founa import *
from flask import request


def CreateCommande():
    try:
        data = request.json

        client_id = data.get('client_id')
        produit_id = data.get('produit_id')
        quantite = data.get('quantite')

        if not client_id or not produit_id or not quantite:
            return {"status": "error", "message": "client_id, produit_id et quantite sont requis"}, 400

        # Vérifier que client ➕ produit existent
        client = Client.query.get(client_id)
        produit = Produit.query.get(produit_id)

        if not client:
            return {"status": "error", "message": "Client introuvable"}, 404

        if not produit:
            return {"status": "error", "message": "Produit introuvable"}, 404

        # Calcul du prix total
        prix_total = float(produit.prix_vente) * int(quantite)

        commande = Commande(
            client_id=client_id,
            produit_id=produit_id,
            quantite=quantite,
            prix_total=prix_total,
            statut="Paiement reçu"
        )

        db.session.add(commande)
        db.session.commit()

        return {
            "status": "success",
            "message": "Commande créée avec succès",
            "commande": {
                "id": commande.id,
                "uid": commande.uid,
                "client_id": commande.client_id,
                "produit_id": commande.produit_id,
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
                "id": c.id,
                "uid": c.uid,
                "client_id": c.client_id,
                "produit_id": c.produit_id,
                "quantite": c.quantite,
                "prix_total": c.prix_total,
                "statut": c.statut,
                "created_date": str(c.created_date),
                "updated_date": str(c.updated_date),
            })

        return {"status": "success", "commandes": result}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500



def GetSingleCommande():
    try:
        commande_id = (request.json.get('uid'))
        single_commande = Commande.query.filter_by(uid=commande_id).first()

        if not single_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        return {
            "status": "success",
            "commande": {
                "uid": single_commande.uid,
                "client_id": single_commande.client_id,
                "produit_id": single_commande.produit_id,
                "quantite": single_commande.quantite,
                "prix_total": single_commande.prix_total,
                "statut": single_commande.statut,
                "created_date": str(single_commande.created_date),
                "updated_date": str(single_commande.updated_date),
            }
        }, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500



def UpdateCommande():
    try:
        commande_id = request.json.get('uid')
        statut = request.json.get('statut')
        teller_id = request.json.get('teller_id')
        update_commande = Commande.query.filter_by(uid=commande_id).first()
        if not update_commande:
            return {"status": "error", "message": "Commande introuvable"}, 404

        # Mise à jour simple
        update_commande.statut = statut
        update_commande.teller_id = teller_id
        update_commande.updated_date = datetime.datetime.utcnow()

        db.session.commit()

        return {"status": "success", "message": "Statut de la commande mis à jour"}, 200

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500
