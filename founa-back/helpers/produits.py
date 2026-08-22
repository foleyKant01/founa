from config.db import db
from model.founa import *
from config.constant import *
from flask import request, jsonify
import uuid
import json
import math
import re
from sqlalchemy import or_
import unicodedata
import cloudinary.uploader
from werkzeug.utils import secure_filename


# def upload_to_s3(files):
#     urls = []

#     for file in files:
#         print('file', file)    
#         original_name = file.filename
#         print('original_name', original_name)    
#         clean_name = secure_filename(original_name)
#         print('clean_name', clean_name)    
#         clean_name = re.sub(r"\s+", "+", clean_name)
#         print('clean_name', clean_name)    
#         filename = f"{uuid.uuid4().hex}_{clean_name}"
#         S3_CLIENT.upload_fileobj(
#             file,
#             BUCKET_NAME,
#             filename,
#             ExtraArgs={"ACL": "public-read"}
#         )
#         url = URL + filename
#         urls.append(url)

#     return urls


def upload_to_cloudinary(files):
    urls = []

    for file in files:

        original_name = file.filename
        clean_name = secure_filename(original_name)
        clean_name = re.sub(r"\s+", "_", clean_name)

        public_id = f"products/{uuid.uuid4().hex}_{clean_name}"

        result = cloudinary.uploader.upload(
            file,
            public_id=public_id,
            folder="founa",
            resource_type="image"
        )

        urls.append(result["secure_url"])

    return urls



def CreateProduit():
    nom = request.form.get('nom')
    description = request.form.get('description')
    prix_fournisseur_str = request.form.get('prix_fournisseur') or "0"
    try:
        prix_fournisseur = float(prix_fournisseur_str)
    except ValueError:
        prix_fournisseur = 0.0

    prix_vente = math.ceil(prix_fournisseur * 1.25 / 10) * 10    
    stock_disponible_str = request.form.get('stock_disponible') or "0"
    moq_str = request.form.get('moq') or "0"
    stock_disponible = int(stock_disponible_str)
    moq = int(moq_str)
    fournisseur_id = request.form.get('fournisseur_id')
    lien_1 = request.form.get('lien_1')
    lien_2 = request.form.get('lien_2')
    teller_id = request.form.get('teller_id')
    files = request.files.getlist('images')
    images_urls = upload_to_cloudinary(files)
    produit = Produit(
        nom=nom,
        description=description,
        prix_fournisseur=prix_fournisseur,
        prix_vente=prix_vente,
        stock_disponible=stock_disponible,
        moq=moq,
        fournisseur_id=fournisseur_id,
        lien_1=lien_1,
        lien_2=lien_2,
        teller_id=teller_id,
        images=json.dumps(images_urls),
    )
    db.session.add(produit)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Produit créé avec succès",
        "produit_uid": produit.uid,
        "images_urls": produit.images
    })



def GetAllProduits():
    produits = Produit.query.all()
    result = []
    for p in produits:
        result.append({
            "uid": p.uid,
            "nom": p.nom,
            "description": p.description,
            "lien_1": p.lien_1,
            "lien_2": p.lien_2,
            "prix_vente": p.prix_vente, 
            "images": p.images, 
            "stock_disponible": p.stock_disponible, 
            "moq": p.moq, 
            "status": p.status, 
            "teller_id": p.teller_id, 
            "fournisseur_id": p.fournisseur_id,
            "creation_date": str(p.creation_date),
        })
    return jsonify({
        "status": "success",
        "produits": result
    })



def GetSingleProduit():
    produit_id = request.json.get('produit_id')
    produit = Produit.query.filter_by(uid=produit_id).first()
    if not produit:
        return jsonify({
            "status": "error",
            "message": "Produit non trouvé"
        }), 404
    images = produit.images
    return jsonify({
        "status": "success",
        "produit": {
            "uid": produit.uid,
            "nom": produit.nom,
            "description": produit.description,
            "lien_1": produit.lien_1,
            "lien_2": produit.lien_2,
            "prix_fournisseur": produit.prix_fournisseur,
            "prix_vente": produit.prix_vente,
            "images": images,
            "stock_disponible": produit.stock_disponible,
            "moq": produit.moq,
            "status": produit.status,
            "teller_id": produit.teller_id,
            "fournisseur_id": produit.fournisseur_id,
            "creation_date": str(produit.creation_date),
            "update_date": str(produit.update_date),
        }
    })
    
    
    
def GetAllProduitByTeller():
    teller_id = request.json.get('teller_id')
    all_produit = Produit.query.filter_by(teller_id=teller_id).all()
    result = []
    if not all_produit:
        return {"message": "Aucun produit trouvé"}, 200
    for p in all_produit:
        result.append({
            "uid": p.uid,
            "nom": p.nom,
            "description": p.description,
            "lien_1": p.lien_1,
            "lien_2": p.lien_2,
            "prix_vente": p.prix_vente, 
            "images": p.images, 
            "stock_disponible": p.stock_disponible, 
            "moq": p.moq, 
            "status": p.status, 
            "teller_id": p.teller_id, 
            "fournisseur_id": p.fournisseur_id,
            "creation_date": str(p.creation_date),
        })
    return {"status": "success", "produits": result}, 200
    
    
    
def UpdateProduit():
    produit_id = request.form.get('produit_id')
    produit = Produit.query.filter_by(uid=produit_id).first()
    if not produit:
        return {
            "status": "error",
            "message": "Produit non trouvé"
        }, 404
    nom = request.form.get('nom')
    description = request.form.get('description')
    prix_fournisseur_str = request.form.get('prix_fournisseur')
    lien_1 = request.form.get('lien_1')
    lien_2 = request.form.get('lien_2')
    moq = request.form.get('moq')
    try:
        prix_fournisseur = float(prix_fournisseur_str)
    except (TypeError, ValueError):
        prix_fournisseur = 0.0  # valeur par défaut si l'entrée est inValider
    prix_vente = round(prix_fournisseur * 1.25, 2)  # arrondi à 2 décimales
    stock_disponible = request.form.get('stock_disponible')
    if produit:
        produit.nom = nom
        produit.description = description
        produit.prix_fournisseur = prix_fournisseur
        produit.prix_vente = prix_vente
        produit.stock_disponible = int(stock_disponible)
        produit.moq = int(moq)
        produit.lien_1 = lien_1
        produit.lien_2 = lien_2
    files = request.files.getlist('images')
    if files:
        images_urls = upload_to_s3(files)
    db.session.commit()

    return {
        "status": "success",
        "message": "Produit mis à jour avec succès",
        "produit_uid": produit.uid,
    }



def AllSimilarProducts():
    response = {}
    try:
        data = request.json or {}
        uid = data.get("uid")
        product_name = (data.get("nom") or "").strip()
        product_description = (data.get("description") or "").strip()
        product_categorie = (data.get("categorie") or "").strip()
        filters = []
        if product_categorie:
            filters.append(
                Produit.categorie.ilike(f"%{product_categorie}%"))
        if product_name:
            filters.append(
                Produit.nom.ilike(f"%{product_name}%"))
        if product_description:
            filters.append(
                Produit.description.ilike(f"%{product_description}%"))
        if not filters:
            response["status"] = "success"
            response["products"] = []
            return response
        all_products = (
            Produit.query
            .filter(
                Produit.uid != uid,
                or_(*filters)
            )
            .all())
        products_info = []
        for product in all_products:
            score = 0
            categorie = (product.categorie or "").strip().lower()
            nom = (product.nom or "").strip().lower()
            description = (product.description or "").strip().lower()
            search_categorie = product_categorie.lower()
            search_name = product_name.lower()
            search_description = product_description.lower()
            if (
                search_categorie
                and categorie == search_categorie
            ):
                score += 50
            elif (
                search_categorie
                and search_categorie in categorie
            ):
                score += 50
            if (
                search_name
                and search_name in nom
            ):
                score += 30
            if (
                search_description
                and search_description in description
            ):
                score += 20
            if score > 0:
                products_info.append({
                    "id": product.id,
                    "uid": product.uid,
                    "nom": product.nom,
                    "description": product.description,
                    "categorie": product.categorie,
                    "prix_fournisseur": product.prix_fournisseur,
                    "prix_vente": product.prix_vente,
                    "stock_disponible": product.stock_disponible,
                    "moq": product.moq,
                    "fournisseur_id": product.fournisseur_id,
                    "teller_id": product.teller_id,
                    "images": product.images,
                    "similarity_score": score
                })
        products_info.sort(
            key=lambda product: product["similarity_score"],
            reverse=True
        )
        products_info = products_info[:10]
        response["status"] = "success"
        response["products"] = products_info
    except Exception as e:
        response["status"] = "error"
        response["error_description"] = str(e)
    return response


def DeleteProduitByTeller():
    try:
        data = request.json
        produit_id = data.get('produit_id')
        teller_id = data.get('teller_id')
        if not produit_id:
            return {"status": "error", "message": "Aucun produit sélectionné"}, 400
        produit = Produit.query.filter_by(uid=produit_id).first()
        if not produit:
            return {"status": "error", "message": "Produit introuvable"}, 404
        if teller_id and produit.teller_id != teller_id:
            return {"status": "error", "message": "Non autorisé"}, 403
        commande_exist = Commande.query.filter_by(produit_id=produit_id).first()
        if commande_exist:
            return {
                "status": "error",
                "message": "Impossible de supprimer ce produit (déjà utilisé dans des commandes)"
            }, 400
        db.session.delete(produit)
        db.session.commit()
        return {
            "status": "success",
            "message": "Produit supprimé avec succès"
        }
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": "Erreur serveur",
            "error": str(e)
        }, 500



def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return ''.join([c for c in nfkd_form if not unicodedata.combining(c)])


def normalize_text(text):
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text).lower()
    return text.split()   
     


def SearchProduct():
    """
    Recherche des produits selon un texte.
    Recherche dans :
        - nom
        - categorie
        - description

    Les résultats sont classés selon un score de pertinence.
    """
    response = {}
    try:
        data = request.json or {}
        text = data.get("textSearch", "").strip()
        page = max(int(data.get("page", 1)), 1)
        per_page = max(int(data.get("per_page", 10)), 1)
        if not text:
            return {
                "status": "error",
                "error_description": "textSearch is required"
            }, 400
        text_search = remove_accents(text.lower())
        words = [
            w
            for w in normalize_text(text_search)
            if len(w) > 2
        ]
        if not words:
            return {
                "status": "error",
                "error_description": "textSearch too short"
            }, 400
        filters = []
        for word in words:
            pattern = f"%{word}%"
            filters.append(
                Produit.nom.ilike(pattern)
            )
            filters.append(
                Produit.categorie.ilike(pattern)
            )
            filters.append(
                Produit.description.ilike(pattern)
            )
        query = Produit.query.filter(
            or_(*filters)
        )
        all_results = query.all()
        products_scored = []
        for product in all_results:
            score = 0
            nom = remove_accents(
                (product.nom or "").lower()
            )
            categorie = remove_accents(
                (product.categorie or "").lower()
            )
            description = remove_accents(
                (product.description or "").lower()
            )
            for word in words:
                if word in nom:
                    score += 50
                if word in categorie:
                    score += 30
                if word in description:
                    score += 20
            if score > 0:
                products_scored.append({
                    "product": product,
                    "score": score
                })
        products_scored.sort(
            key=lambda item: item["score"],
            reverse=True
        )
        total = len(products_scored)
        start = (page - 1) * per_page
        end = start + per_page
        results = products_scored[start:end]
        products_list = []
        for item in results:
            product = item["product"]
            products_list.append({
                "uid": product.uid,
                "nom": product.nom or "",
                "categorie": product.categorie or "",
                "description": (
                    product.description[:150] + "..."
                    if product.description
                    and len(product.description) > 150
                    else product.description or ""
                ),
                "lien_1": product.lien_1 or "",
                "lien_2": product.lien_2 or "",
                "prix_vente": product.prix_vente or 0,
                "images": product.images or [],
                "stock_disponible": product.stock_disponible or 0,
                "moq": product.moq or 0,
                "status": product.status or "",
                "teller_id": product.teller_id or "",
                "fournisseur_id": product.fournisseur_id or "",
                "creation_date": str(
                    product.creation_date
                ),
                "search_score": item["score"]
            })
        response = {
            "status": "success",
            "total": total,
            "pages": (
                (total + per_page - 1)
                // per_page
            ),
            "current_page": page,
            "products": products_list
        }
    except Exception as e:
        response = {
            "status": "error",
            "error_description": str(e)
        }
    return response


# import iop

# def testAlibab():
#     url = "TON_URL_API"
#     appkey = "503830"
#     appSecret = "TON_APP_SECRET"
#     access_token = "TON_ACCESS_TOKEN"

#     client = iop.IopClient(url, appkey, appSecret)

#     request = iop.IopRequest(
#         "/icbu/product/category/get"
#     )

#     request.add_api_param(
#         "cat_id",
#         "127686030"
#     )

#     response = client.execute(
#         request,
#         access_token
#     )

#     print(response.type)
#     print(response.body)

#     return response


# def GenerateAccessToken():
    
#     url = "https://openapi-api.alibaba.com/rest"
#     appkey = "503830"
#     appSecret = "ujrarI5lyCQlVoytNnQM5se36vxyY6NW"

#     client = iop.IopClient(url, appkey ,appSecret)
#     request = iop.IopRequest('/auth/token/create')
#     request.add_api_param('code', '0_100132_2DL4DV3jcU1UOT7WGI1A4rY91')
#     request.add_api_param('uuid', '1')
#     response = client.execute(request)
#     print(response.type)
#     print(response.body)

#     return response
 