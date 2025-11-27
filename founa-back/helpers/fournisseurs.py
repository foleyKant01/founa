from config.db import db
from model.founa import *
from flask import request



def CreateFournisseur():
    data = request.json

    fournisseur = Fournisseur(
        nom=data.get('nom'),
        contact=data.get('contact'),
        mode=data.get('mode')
    )

    db.session.add(fournisseur)
    db.session.commit()

    return {"status": "success", "message": "Fournisseur créé"}, 201



def GetAllFournisseurs():
    
    fournisseurs = Fournisseur.query.all()
    result = [
        {
            "uid": f.uid,
            "nom": f.nom,
            "contact_email": f.contact_email,
            "contact_telephone": f.contact_telephone,
            "mode_dropshipping": f.mode_dropshipping,
            "creation_date": str(f.creation_date),
        } for f in fournisseurs
    ]
    return result



def UpdateFournisseur():
    
    fournisseur_id = (request.json.get('uid'))
    update_commande = Fournisseur.query.filter_by(uid=fournisseur_id).first()
    data = request.json

    update_commande.nom = data.get('nom', update_commande.nom)
    update_commande.contact = data.get('contact', update_commande.contact)
    update_commande.mode = data.get('mode', update_commande.mode)
    update_commande.update_date = datetime.datetime.utcnow()

    db.session.commit()
    return {"message": "Fournisseur mis à jour"}



def DeleteFournisseur(id):
    fournisseur = Fournisseur.query.get_or_404(id)

    db.session.delete(fournisseur)
    db.session.commit()

    return {"message": "Fournisseur supprimé"}

