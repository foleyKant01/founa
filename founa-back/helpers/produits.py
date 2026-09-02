from config.db import db
from model.founa import *
from config.constant import *
from flask import request, jsonify
import uuid
import json
import math
import re
from flask import jsonify
from sqlalchemy import or_
import unicodedata
import cloudinary.uploader
from werkzeug.utils import secure_filename



def upload_to_cloudinary(files):
    images = []
    for file in files:
        original_name = file.filename
        clean_name = secure_filename(original_name)
        clean_name = re.sub(r"\s+", "_", clean_name)

        filename_without_ext = os.path.splitext(clean_name)[0]

        public_id = f"products/{uuid.uuid4().hex}_{filename_without_ext}"
        result = cloudinary.uploader.upload(
            file,
            public_id=public_id,
            folder="founa",
            resource_type="image"
        )
        images.append({
            "url": result["secure_url"],
            "public_id": result["public_id"]
        })
    return images


def delete_cloudinary_images(images):
    for image in images:
        try:
            public_id = image.get("public_id")

            if public_id:
                cloudinary.uploader.destroy(
                    public_id,
                    resource_type="image"
                )
        except Exception as e:
            print(
                f"Erreur suppression Cloudinary "
                f"{image.get('public_id')}: {str(e)}"
            )



def ImporterProduit():
    produits_crees = []
    erreurs = []
    produits_ignores = []
    try:
        base_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))
        )
        fichier_json = os.path.join(
            base_dir,
            "data",
            "produits.json"
        )
        if not os.path.exists(fichier_json):
            return {
                "status": "error",
                "message": f"Fichier introuvable : {fichier_json}"
            }
        with open(
            fichier_json,
            "r",
            encoding="utf-8"
        ) as fichier:
            produits = json.load(fichier)

        if not isinstance(produits, list):
            return {
                "status": "error",
                "message": "Le fichier produits.json doit contenir une liste de produits."
            }
        noms_deja_vus = set()
        images_deja_vues = set()
        for index, data in enumerate(produits, start=1):
            try:
                nom = (data.get("nom") or "").strip()
                description = (
                    data.get("description") or ""
                ).strip()
                categorie = (
                    data.get("categorie") or ""
                ).strip()
                if not nom:
                    raise ValueError(
                        "Le nom du produit est obligatoire"
                    )
                prix_fournisseur_usd = float(
                    data.get("prix_fournisseur") or 0
                )
                prix_fournisseur = (
                    prix_fournisseur_usd * TAUX_USD_XOF
                )
                prix_vente = (math.ceil(prix_fournisseur * 1.25 / 10) * 10)
                moq = int(data.get("moq") or 0)
                informations_fournisseur = (data.get("informations_fournisseur") or "").strip()
                fournisseur_nom = (data.get("fournisseur") or "").strip()
                supplier_id = (data.get("supplierId") or "").strip()

                fournisseur = ", ".join(
                    valeur
                    for valeur in [
                        informations_fournisseur,
                        fournisseur_nom,
                        supplier_id
                    ]
                    if valeur
                )
                lien_1 = (
                    data.get("lien_1") or ""
                ).strip()
                images = data.get("images") or []

                if not isinstance(images, list):
                    images = [images]
                images = [
                    url.strip()
                    for url in images
                    if isinstance(url, str)
                    and url.strip()
                ]
                nom_normalise = nom.lower().strip()
                images_normalisees = set(images)
                doublon_nom_json = (
                    nom_normalise in noms_deja_vus
                )
                doublon_image_json = any(
                    image in images_deja_vues
                    for image in images_normalisees
                )
                if doublon_nom_json or doublon_image_json:
                    raisons = []
                    if doublon_nom_json:
                        raisons.append(
                            "nom du produit déjà présent dans le fichier JSON"
                        )
                    if doublon_image_json:
                        raisons.append(
                            "une ou plusieurs images déjà présentes dans le fichier JSON"
                        )
                    produits_ignores.append({
                        "index": index,
                        "nom": nom,
                        "sku": data.get("sku"),
                        "message": (
                            "Doublon détecté : "
                            + " et ".join(raisons)
                        )
                    })
                    continue
                produit_existant_nom = (
                    Produit.query
                    .filter_by(nom=nom)
                    .first()
                )
                if produit_existant_nom:
                    produits_ignores.append({
                        "index": index,
                        "nom": nom,
                        "produit_uid": produit_existant_nom.uid,
                        "message": (
                            "Produit déjà présent dans la base "
                            "de données avec le même nom"
                        )
                    })
                    continue
                produit_existant_image = None
                produits_existants = Produit.query.all()
                for produit_db in produits_existants:
                    images_db = produit_db.images
                    if not images_db:
                        continue
                    if isinstance(images_db, str):
                        try:
                            images_db = json.loads(
                                images_db
                            )
                        except (json.JSONDecodeError, TypeError):
                            images_db = [
                                images_db
                            ]
                    if not isinstance(images_db, list):
                        images_db = [images_db]
                    images_db = {
                        str(image).strip()
                        for image in images_db
                        if image
                    }
                    if images_normalisees.intersection(
                        images_db
                    ):
                        produit_existant_image = (
                            produit_db
                        )
                        break
                if produit_existant_image:
                    produits_ignores.append({
                        "index": index,
                        "nom": nom,
                        "produit_uid": (
                            produit_existant_image.uid
                        ),
                        "message": (
                            "Produit déjà présent dans la base "
                            "de données avec une ou plusieurs "
                            "images identiques"
                        )
                    })
                    continue
                noms_deja_vus.add(
                    nom_normalise
                )
                images_deja_vues.update(
                    images_normalisees
                )
                produit = Produit(
                    nom=nom,
                    fournisseur=fournisseur,
                    status="disponible",
                    categorie=categorie,
                    description=description,
                    lien_1=lien_1,
                    prix_fournisseur=prix_fournisseur,
                    prix_fournisseur_usd=prix_fournisseur_usd,
                    prix_vente=prix_vente,
                    images=json.dumps(
                        images,
                        ensure_ascii=False
                    ),
                    stock_disponible=100,
                    moq=moq
                )
                db.session.add(produit)
                produits_crees.append({
                    "nom": nom,
                    "prix_fournisseur_usd": prix_fournisseur_usd,
                    "prix_fournisseur_fcfa": prix_fournisseur,
                    "prix_vente": prix_vente,
                    "moq": moq,
                    "produit_uid": produit.uid,
                    "images": images
                })
            except Exception as product_error:
                erreurs.append({
                    "index": index,
                    "nom": data.get("nom", ""),
                    "erreur": str(product_error)
                })
        db.session.commit()
        return {
            "status": "success",
            "message": (
                f"{len(produits_crees)} produit(s) créé(s)"
            ),
            "produits_crees": produits_crees,
            "erreurs": erreurs,
            "produits_ignores": produits_ignores
        }
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": str(e)
        }



def CreateProduit():
    try:
        nom = (request.form.get("nom") or "").strip()
        description = (request.form.get("description") or "").strip()
        fournisseur = (request.form.get("fournisseur") or "").strip()
        lien_1 = (request.form.get("lien_1") or "").strip()
        prix_fournisseur_str = (
            request.form.get(
                "prix_fournisseur"
            ) or "0"
        )
        try:
            prix_fournisseur = float(
                prix_fournisseur_str
            )
        except (ValueError, TypeError):
            prix_fournisseur = 0.0
        prix_vente = (
            math.ceil(
                prix_fournisseur * 1.25 / 10
            ) * 10
        )
        stock_disponible_str = (
            request.form.get(
                "stock_disponible"
            ) or "0"
        )
        try:
            stock_disponible = int(
                stock_disponible_str
            )
        except (ValueError, TypeError):
            stock_disponible = 0
        moq_str = (
            request.form.get("moq") or "0"
        )
        try:
            moq = int(moq_str)
        except (ValueError, TypeError):
            moq = 0
        produit_existant_nom = (
            Produit.query
            .filter_by(nom=nom)
            .first()
        )
        if produit_existant_nom:
            return jsonify({
                "status": "error",
                "message": (
                    "Un produit avec ce nom existe déjà."
                ),
                "produit_uid": (
                    produit_existant_nom.uid
                )
            }), 409
        files = request.files.getlist(
            "images"
        )
        files = [
            file
            for file in files
            if file and file.filename
        ]
        if not files:
            return jsonify({
                "status": "error",
                "message": (
                    "Au moins une image est obligatoire."
                )
            }), 400
        images = upload_to_cloudinary(
            files
        )
        if not images:
            return jsonify({
                "status": "error",
                "message": (
                    "Aucune image n'a pu être uploadée."
                )
            }), 400
        if not isinstance(images, list):
            images = [images]
        images = [
            str(url).strip()
            for url in images
            if url
        ]
        produits_existants = Produit.query.all()
        for produit_db in produits_existants:
            images_db = produit_db.images
            if not images_db:
                continue
            if isinstance(images_db, str):
                try:
                    images_db = json.loads(
                        images_db
                    )
                except (
                    json.JSONDecodeError,
                    TypeError
                ):
                    images_db = [
                        images_db
                    ]
            if not isinstance(
                images_db,
                list
            ):
                images_db = [
                    images_db
                ]
            images_db = {
                str(image).strip()
                for image in images_db
                if image
            }
            images_nouvelles = set(
                images
            )
            if images_nouvelles.intersection(
                images_db
            ):
                return jsonify({
                    "status": "error",
                    "message": (
                        "Une ou plusieurs images "
                        "appartiennent déjà à un "
                        "produit existant."
                    ),
                    "produit_uid": (
                        produit_db.uid
                    )
                }), 409
        produit = Produit(
            nom=nom,
            description=description,
            prix_fournisseur=prix_fournisseur,
            prix_vente=prix_vente,
            stock_disponible=100,
            moq=moq,
            fournisseur=fournisseur,
            lien_1=lien_1,
            images=json.dumps(
                images,
                ensure_ascii=False
            )
        )
        db.session.add(
            produit
        )
        db.session.commit()
        return jsonify({
            "status": "success",
            "message": ("Produit créé avec succès"),
            "produit_uid": (produit.uid),
            "images": images,
            "prix_fournisseur": (prix_fournisseur),
            "prix_vente": (prix_vente),
            "stock_disponible": 100,
            "moq": moq
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
        
        

def GetAllProduits():
    produits = Produit.query.all()
    result = []
    for p in produits:
        result.append({
            "uid": p.uid,
            "nom": p.nom,
            "description": p.description,
            "lien_1": p.lien_1,
            "prix_vente": p.prix_vente, 
            "images": p.images, 
            "stock_disponible": p.stock_disponible, 
            "moq": p.moq, 
            "status": p.status, 
            "fournisseur": p.fournisseur,
            "creation_date": str(p.creation_date),
        })
    return jsonify({
        "status": "success",
        "produits": result
    })
    
    
    
def MettreAJourPrixVente():
    try:
        produits = Produit.query.all()
        produits_mis_a_jour = []
        for p in produits:
            prix_fournisseur_usd = float(
                p.prix_fournisseur_usd or 0
            )
            prix_fournisseur_fcfa = (
                prix_fournisseur_usd * TAUX_USD_XOF
            )
            p.prix_fournisseur = prix_fournisseur_fcfa
            prix_vente = (
                prix_fournisseur_fcfa * 1.25
            )
            p.prix_vente = (
                math.ceil(prix_vente / 10) * 10
            )
            produits_mis_a_jour.append({
                "uid": p.uid,
                "nom": p.nom,
                "prix_fournisseur_usd": prix_fournisseur_usd,
                "prix_fournisseur_fcfa": prix_fournisseur_fcfa,
                "prix_vente": p.prix_vente
            })
        db.session.commit()
        return {
            "status": "success",
            "message": f"{len(produits_mis_a_jour)} produit(s) mis à jour",
            "produits": produits_mis_a_jour
        }
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": str(e)
        }



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
            "prix_fournisseur": produit.prix_fournisseur,
            "prix_vente": produit.prix_vente,
            "images": images,
            "stock_disponible": produit.stock_disponible,
            "moq": produit.moq,
            "status": produit.status,
            "fournisseur": produit.fournisseur,
            "creation_date": str(produit.creation_date),
            "update_date": str(produit.update_date),
        }
    })
    
    
    
def UpdateProduit():
    try:
        produit_id = request.form.get('produit_id')
        produit = Produit.query.filter_by(uid=produit_id).first()
        if not produit:
            return {
                "status": "error",
                "message": "Produit non trouvé"
            }, 404
        nom = request.form.get('nom')
        description = request.form.get('description')
        prix_fournisseur_str = request.form.get('prix_fournisseur') or "0"
        try:
            prix_fournisseur = float(prix_fournisseur_str)
        except (TypeError, ValueError):
            prix_fournisseur = 0.0
        prix_vente = math.ceil(
            prix_fournisseur * 1.25 / 10
        ) * 10
        stock_disponible_str = request.form.get(
            'stock_disponible'
        ) or "0"
        moq_str = request.form.get('moq') or "0"
        try:
            stock_disponible = int(stock_disponible_str)
        except (TypeError, ValueError):
            stock_disponible = 0
        try:
            moq = int(moq_str)
        except (TypeError, ValueError):
            moq = 0
        lien_1 = request.form.get('lien_1')
        
        produit.nom = nom
        produit.description = description
        produit.prix_fournisseur = prix_fournisseur
        produit.prix_vente = prix_vente
        produit.stock_disponible = stock_disponible
        produit.moq = moq
        produit.lien_1 = lien_1
        
        files = request.files.getlist('images')
        files = [
            file
            for file in files
            if file and file.filename
        ]

        if files:
            old_images = []
            if produit.images:
                try:
                    old_images = json.loads(
                        produit.images
                    )
                except Exception:
                    old_images = []
            new_images = upload_to_cloudinary(files)
            delete_cloudinary_images(
                old_images
            )
        produit.updated_date = datetime.datetime.utcnow()
        db.session.commit()
        return {
            "status": "success",
            "message": "Produit mis à jour avec succès",
            "produit_uid": produit.uid,
            "images_urls": json.loads(produit.images)
                if produit.images else []
        }, 200
    except Exception as e:
        db.session.rollback()
        return {
            "status": "error",
            "message": "Erreur lors de la mise à jour du produit",
            "error": str(e)
        }, 500



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
                    "fournisseur": product.fournisseur,
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
                "prix_vente": product.prix_vente or 0,
                "images": product.images or [],
                "stock_disponible": product.stock_disponible or 0,
                "moq": product.moq or 0,
                "status": product.status or "",
                "fournisseur": product.fournisseur or "",
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



def TopProducts():
    try:
        result = (
            db.session.query(
                Produit,
                db.func.count(Commande.id).label("nombre_commandes_payees")
            )
            .join(
                Commande,
                Commande.produit_id == Produit.uid
            )
            .filter(
                Commande.statut == "Payer"
            )
            .group_by(
                Produit.uid
            )
            .order_by(
                db.func.count(Commande.id).desc()
            )
            .limit(50)
            .all()
        )
        produits = []
        for produit, nombre_commandes_payees in result:
            produits.append({
                "uid": produit.uid,
                "nom": produit.nom,
                "status": produit.status,
                "categorie": produit.categorie,
                "description": produit.description,
                "lien_1": produit.lien_1,
                "prix_fournisseur": produit.prix_fournisseur,
                "prix_vente": produit.prix_vente,
                "images": produit.images,
                "stock_disponible": produit.stock_disponible,
                "moq": produit.moq,
                "fournisseur": produit.fournisseur,
                "nombre_commandes_payees": nombre_commandes_payees,
                "creation_date": str(produit.creation_date),
                "update_date": str(produit.update_date)
            })
        return {
            "status": "success",
            "nombre": len(produits),
            "produits": produits
        }, 200
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500