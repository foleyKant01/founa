from config.db import *
import uuid
import datetime



class Fournisseur(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    nom = db.Column(db.String(255), nullable=False)
    contact_email = db.Column(db.String(128))
    contact_telephone = db.Column(db.String(128))
    mode_dropshipping = db.Column(db.String(128))  # API / mode dropshipping
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    update_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)



class Produit(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))

    nom = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    prix_fournisseur = db.Column(db.Float, nullable=False)
    prix_vente = db.Column(db.Float, nullable=False)
    images = db.Column(db.Text)  # JSON string : ["img1.jpg", "img2.jpg"]
    stock_disponible = db.Column(db.Integer, default=0)

    fournisseur_id = db.Column(db.String(128), db.ForeignKey('fournisseur.uid'), nullable=False)
    fournisseur = db.relationship('Fournisseur', backref=db.backref('produits', lazy=True))

    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    update_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)


class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    fullname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    phone = db.Column(db.String(128), nullable=False)
    adresse_livraison = db.Column(db.Text)
    password = db.Column(db.String(128), nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    
    
class Teller(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    fullname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    phone = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)


class Commande(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True)
    client_id = db.Column(db.String(128), db.ForeignKey('client.uid'), nullable=False)
    client = db.relationship('Client', backref=db.backref('commandes', lazy=True))
    produit_id = db.Column(db.String(128), db.ForeignKey('produit.uid'), nullable=False)
    produit = db.relationship('Produit', backref=db.backref('commandes', lazy=True))
    teller_id = db.Column(db.String(128), db.ForeignKey('teller.uid'), nullable=False)
    teller = db.relationship('Teller', backref=db.backref('commandes', lazy=True))
    quantite = db.Column(db.Integer, nullable=False)
    prix_total = db.Column(db.Float, nullable=False)
    statut = db.Column(db.String(128), default='Paiement reçu')
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)


