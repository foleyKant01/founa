from config.db import db
from model.founa import *
from config.constant import *
from flask import request, jsonify
import uuid
from sqlalchemy import or_


def upload_to_s3(files):
    urls = []

    for file in files:
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        S3_CLIENT.upload_fileobj(
            file,  # file doit être un FileStorage Flask
            BUCKET_NAME,
            filename,
            ExtraArgs={"ACL": "public-read"}  # rendre le fichier public
        )
        url = URL + {filename}
        urls.append(url)
    return urls



def CreateProduit():
    nom = request.form.get('nom')
    description = request.form.get('description')
    prix_fournisseur = request.form.get('prix_fournisseur')
    prix_vente = request.form.get('prix_vente')
    stock_disponible = request.form.get('stock_disponible')
    fournisseur_id = request.form.get('fournisseur_id')
    files = request.files.getlist('images')
    images_urls = upload_to_s3(files)
    produit = Produit(
        nom=nom,
        description=description,
        prix_fournisseur=float(prix_fournisseur),
        prix_vente=float(prix_vente),
        stock_disponible=int(stock_disponible),
        fournisseur_id=fournisseur_id,
        images=images_urls,
    )

    db.session.add(produit)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Produit créé avec succès",
        "produit_uid": produit.uid,
        "images_urls": images_urls
    })



def GetAllProduits():
    produits = Produit.query.all()
    result = []

    for p in produits:

        result.append({
            "id": p.id,
            "uid": p.uid,
            "nom": p.nom,
            "description": p.description,
            "prix_fournisseur": p.prix_fournisseur,
            "prix_vente": p.prix_vente,
            "stock_disponible": p.stock_disponible,
            "fournisseur_id": p.fournisseur_id,
            "images": p.images
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
            "prix_fournisseur": produit.prix_fournisseur,
            "prix_vente": produit.prix_vente,
            "stock_disponible": produit.stock_disponible,
            "fournisseur_id": produit.fournisseur_id,
            "images": images
        }
    })
    
    
def UpdateProduit():
    
    produit_id = request.form.get('produit_id')
    produit = Produit.query.filter_by(uid=produit_id).first()
    if not produit:
        return jsonify({
            "status": "error",
            "message": "Produit non trouvé"
        }), 404

    # Récupération des champs depuis le formulaire (si fournis)
    nom = request.form.get('nom')
    description = request.form.get('description')
    prix_fournisseur = request.form.get('prix_fournisseur')
    prix_vente = request.form.get('prix_vente')
    stock_disponible = request.form.get('stock_disponible')
    fournisseur_id = request.form.get('fournisseur_id')
    if produit:
        produit.nom = nom
        produit.description = description
        produit.prix_fournisseur = float(prix_fournisseur)
        produit.prix_vente = float(prix_vente)
        produit.stock_disponible = int(stock_disponible)
        produit.fournisseur_id = fournisseur_id

    # Gestion des nouvelles images (optionnel)
    files = request.files.getlist('images')
    if files:
        images_urls = upload_to_s3(files)

    # Commit des changements
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Produit mis à jour avec succès",
        "produit_uid": produit.uid,
        "images": images_urls
    })
    
    
    
# def AllSimilarProducts():
#     response = {}
    
#     try:
#         product_type = request.json.get('type')
#         uid = request.json.get('pr_uid')
#         all_products = Produit.query.filter(Produit.type == product_type, Produit.pr_uid != uid).all()

#         products_info = []

#         for products  in all_products:
#             products_infos = {
#                 'name': products.name,              
#                 'price': products.price,  
#                 'image_file': str(IMGHOSTNAME)+str(products.image_file),              
#                 'pr_uid': products.pr_uid,          
#                 'type': products.type,          
#             }
#             products_info.append(products_infos)

#         response['status'] = 'success'
#         response['products'] = products_info

#     except Exception as e:
#         response['status'] = 'error'
#         response['error_description'] = str(e)

#     return response



def AllSimilarProducts():
    response = {}
    try:
        # product_type = request.json.get('type')
        uid = request.json.get('uid')
        product_name = request.json.get('nom')
        product_description = request.json.get('description')

        all_products = (
            Produit.query
            .filter(
                Produit.uid != uid,
                # Produit.type == product_type,
                or_(
                    Produit.nom.ilike(f"%{product_name}%"),
                    Produit.description.ilike(f"%{product_description}%")
                )
            )
            .distinct(Produit.nom)
            .limit(10)   # 🔥 limite pour UX & perf
            .all()
        )

        products_info = []
        for product in all_products:
            products_info.append({
                "id": product.id,
                "uid": product.uid,
                "nom": product.nom,
                "description": product.description,
                "prix_fournisseur": product.prix_fournisseur,
                "prix_vente": product.prix_vente,
                "stock_disponible": product.stock_disponible,
                "fournisseur_id": product.fournisseur_id,
                "images": product.images
            })

        response['status'] = 'success'
        response['products'] = products_info

    except Exception as e:
        response['status'] = 'error'
        response['error_description'] = str(e)

    return response
