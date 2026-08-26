from config.db import *
import uuid
import datetime



class Fournisseur(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    nom = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(128))
    phone = db.Column(db.String(128))
    boutique = db.Column(db.String(128))
    teller_id = db.Column(db.String(128))  # API / mode dropshipping
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    update_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)



class Produit(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))

    nom = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(128), nullable=True)
    categorie = db.Column(db.String(128), nullable=True)
    description = db.Column(db.Text)
    lien_1 = db.Column(db.Text, nullable=False)
    lien_2 = db.Column(db.Text, nullable=False)
    prix_fournisseur = db.Column(db.Float, nullable=False)
    prix_vente = db.Column(db.Float, nullable=False)
    images = db.Column(db.JSON, nullable=False)
    stock_disponible = db.Column(db.Integer, default=0)
    moq = db.Column(db.Integer, default=0)
    
    teller_id = db.Column(db.String(128), db.ForeignKey('teller.uid'), nullable=False)
    teller = db.relationship('Teller', backref=db.backref('produit', lazy=True))

    fournisseur_id = db.Column(db.String(128), db.ForeignKey('fournisseur.uid'), nullable=True)
    fournisseur = db.relationship('Fournisseur', backref=db.backref('produit', lazy=True))

    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    update_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)


class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    fullname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    phone = db.Column(db.String(128), nullable=False)
    status = db.Column(db.String(128), nullable=False, default="non-verifier") # verifier, non-verifier
    adresse_livraison = db.Column(db.Text)
    password = db.Column(db.String(128), nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    
    
class Otp(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    otp = db.Column(db.String(6), nullable=False)
    phone = db.Column(db.String(128), nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    
    
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    fullname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    phone = db.Column(db.String(128), nullable=False)
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
    
    
class AlibabSellers(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    trace_id_ = db.Column(db.String(128), nullable=False)
    access_token = db.Column(db.String(128), nullable=False)
    account = db.Column(db.String(128), nullable=False)
    account_platform = db.Column(db.String(128), nullable=False)
    code = db.Column(db.String(128), nullable=False)
    country = db.Column(db.String(128), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    refresh_expires_at = db.Column(db.DateTime, nullable=False)
    refresh_token = db.Column(db.String(128), nullable=False)
    request_id = db.Column(db.String(128), nullable=False)
    loginId = db.Column(db.String(128), nullable=False)
    seller_id = db.Column(db.String(128), nullable=False)
    user_id = db.Column(db.String(128), nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    
    
    
class Commande(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    commande_id = db.Column(db.String(128), unique=True)
    client_id = db.Column(db.String(128), db.ForeignKey('client.uid'), nullable=False)
    client = db.relationship('Client', backref=db.backref('commande', lazy=True))
    produit_id = db.Column(db.String(128), db.ForeignKey('produit.uid'), nullable=False)
    produit = db.relationship('Produit', backref=db.backref('commande', lazy=True)) 
    teller_id = db.Column(db.String(128), db.ForeignKey('teller.uid'), nullable=False)
    teller = db.relationship('Teller', backref=db.backref('commande', lazy=True))
    fournisseur_id = db.Column(db.String(128), db.ForeignKey('fournisseur.uid'), nullable=True)
    fournisseur = db.relationship('Fournisseur', backref=db.backref('commande', lazy=True))
    quantite = db.Column(db.Integer, nullable=False)
    prix_total = db.Column(db.Float, nullable=False)
    statut = db.Column(db.String(128), default='commande Initier') # commande en charge, Validerr, Payerr, en expedition, en livraison, Livrerr
    details = db.Column(db.Text, nullable=True)
    cout_envoie_maritime = db.Column(db.Float, nullable=True)
    cout_envoie_aérienne = db.Column(db.Float, nullable=True)
    option_envoie = db.Column(db.String(128), nullable=True) # maritime, aerien
    view = db.Column(db.String(1), nullable=False, default='0')
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)


class Historiques(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    h_uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    produit_id = db.Column(db.String(128), db.ForeignKey('produit.uid'), nullable=False)
    produit = db.relationship('Produit', backref=db.backref('historiques', lazy=True))
    client_id = db.Column(db.String(128), db.ForeignKey('client.uid'))
    client = db.relationship('Client', backref=db.backref('historiques', lazy=True))
    visited_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

class Favoris(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fa_uid = db.Column(db.String(128), unique=True, default=lambda: str(uuid.uuid4()))
    produit_id = db.Column(db.String(128), db.ForeignKey('produit.uid'), nullable=False)
    produit = db.relationship('Produit', backref=db.backref('favoris', lazy=True))
    client_id = db.Column(db.String(128), db.ForeignKey('client.uid'))
    client = db.relationship('Client', backref=db.backref('favoris', lazy=True))
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

