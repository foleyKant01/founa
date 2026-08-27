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



produits = [
    {
        "nom": "MFI Factory Certificate 1m/2m/3m 20W USB C to MFI Type C PD Fast Charging Cable for iPhone 11 12 13 14 15 16 Pro Max",
        "variantes": "Longueurs : 1 m (3,28 ft), 2 m (6,56 ft), 3 m ; couleur : blanc ; marque INGZOOM ; modèle HJ-01",
        "materiaux": "PVC/TPE (gaine), cuivre pur (conducteur)",
        "dimensions": "Longueurs : 1 m / 2 m / 3 m ; colis : 5 x 5 x 1 cm",
        "categorie": "USB Cable for iPhone",
        "poids": "0,02 kg (poids brut unitaire)",
        "informations_fournisseur": "Dongguan Yingzhongcheng Electronic Co., Ltd. (Dongguan, Guangdong, Chine) — fondée en 2019 (5 ans) ; Custom Manufacturer (Trade Assurance) ; note 4,6/5 (677 avis) ; 2 377+ unités vendues ; on-time dispatch 93,9 % ; réponse <= 7h ; revenu en ligne US$90 000+ ; 3 500 m² ; certifications : MFi (Apple), IEC 62368, EMC, RoHS, vérifiée par TÜV Rheinland ; marchés : USA, UK, Australie",
        "description": "Câble de charge rapide 20W certifié MFi (Apple), conducteur en cuivre pur pour durabilité et conductivité, compatible iPhone 11 à 16 Pro Max. Charge rapide 3A / Power Delivery 20W. Emballage : boîte en papier blanc.",
        "lien_1": "https://www.alibaba.com/product-detail/MFI-Factory-Certificate-1m-2m-3m_1600538620089.html",
        "prix_fournisseur": 0.68,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H719d1558369a48d1ae984756de50b779o.png",
            "https://s.alicdn.com/@sc04/kf/H7f47089dc64d4354aae972f80f33cab3c.jpg",
            "https://s.alicdn.com/@sc04/kf/H2def6abea4c8416ab47447bf077c3d887.png"
        ],
        "stock_disponible": 0,
        "moq": 10,
        "fournisseur": "Dongguan Yingzhongcheng Electronic Co., Ltd.",
        "supplierId": "yzcables"
    },

    {
        "nom": "1M 2M 60W Braided Charger Cable Type C to Type C (pour iPhone 15 / 15 Pro Max, ordinateurs portables)",
        "variantes": "Longueurs : 1 m, 2 m ; marque ORPHIE ; modèle OR0-A1068 ; personnalisation : logo (min. 500 pcs), emballage (min. 10 pcs), longueur (min. 300 pcs)",
        "materiaux": "Nylon (tressage), TPE, PVC, cuivre étamé et cuivre pur (conducteur), alliage d'aluminium",
        "dimensions": "Longueurs : 1 m / 2 m ; colis : 5 x 5 x 5 cm",
        "poids": "25 g (poids net) ; 0,022 kg (poids brut unitaire)",
        "categorie": "Type C to Type C Cable",
        "informations_fournisseur": "Shenzhen Oufei'er Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — 7 ans Gold Supplier (12 ans dans l'industrie) ; Custom Manufacturer (Trade Assurance) ; note 4,4/5 (4 454 avis) ; 29 724+ unités vendues ; on-time dispatch 95 % ; réponse <= 2h ; revenu en ligne US$200 000+ ; 109 employés ; 4 300 m² ; garantie 6 mois ; badge « Certified » ; #1 le plus populaire dans sa catégorie ; catégories : chargeurs, câbles, écouteurs",
        "description": "Câble de charge et de données tressé nylon 60W (5A), Type-C vers Type-C, optimisé pour iPhone 15 / 15 Pro Max et ordinateurs portables. Charge rapide + transfert de données, gaine résistante à la flexion.",
        "lien_1": "https://www.alibaba.com/product-detail/1M-2M-60W-Braided-Charger-Cable_1600952063877.html",
        "prix_fournisseur": 0.66,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H121c31a460f24649b4c88595cdd20821Q.png",
            "https://s.alicdn.com/@sc04/kf/He4e5c97d7008450aa05bd64544891c4aq.jpg",
            "https://s.alicdn.com/@sc04/kf/H5c3ae58f057949f8b245c0ba2bccc7e4M.jpg"
        ],
        "stock_disponible": 0,
        "moq": 2,
        "fournisseur": "Shenzhen Oufei'er Technology Co., Ltd.",
        "supplierId": "246999273"
    },

    {
        "nom": "High Quality USB Type-C Cable — câble USB vers Type-C, charge rapide 5A/6A et transfert de données (connecteur USB 3.0)",
        "variantes": "Longueurs : 1 m / 2 m (personnalisables) ; couleur : noir (personnalisable) ; connecteur USB 3.0 nickelé ; OEM/ODM et moule privé disponibles",
        "materiaux": "PVC/TPE (gaine), cuivre pur (conducteur), blindage tressé",
        "dimensions": "Longueur : 1 à 2 m (personnalisable)",
        "categorie": "USB Cable — câble de charge rapide Type-C (USB Data Charger Cable)",
        "poids": "Non disponible",
        "informations_fournisseur": "Dongguan Yilian Photoelectric Technology Co., Ltd. (Dongguan, Guangdong, Chine) — fondée en 2020 ; fabricant et négociant (Combined) ; fournisseur Vérifié Alibaba (catégorie vérifiée) ; note produit 4,8/5 (236 avis) ; taux de réponse 99,8 % (réponse ~1h) ; revenu annuel déclaré > US$100M (à confirmer) ; certifications valides : CE (2029), RoHS (2030), FCC (2028), EMC (2030), UKCA (2029) ; 1 300 m² de bureaux ; port d'export : Shenzhen ; boutique ylgd.en.alibaba.com avec vidéos évaluées, rapports d'inspection d'usine et lignes de production vérifiées ; principaux produits : câbles HDMI, fibre optique, Type-C, Starlink. ID Alibaba : 280891666",
        "description": "Câble USB vers Type-C de charge rapide 5A/6A avec transfert de données, conducteur en cuivre pur, gaine PVC/TPE, blindage tressé, connecteur USB 3.0 nickelé. Certifications CE, RoHS, FCC. Statut produit déclaré : en stock. Compatible téléphones mobiles, ordinateurs, Android, banques d'alimentation, tablettes.",
        "lien_1": "https://www.alibaba.com/product-detail/High-Quality-USB-Type-C-Cable_1601275333243.html",
        "prix_fournisseur": 0.39,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hab67e88841c945e9843264e1270f0664r.jpg"
        ],
        "stock_disponible": 0,
        "moq": 1,
        "fournisseur": "Dongguan Yilian Photoelectric Technology Co., Ltd.",
        "supplierId": "280891666"
    },

    {
        "nom": "4 in 1 65W/27W PD Multi-function Charging Cable, 1m, Nylon Braided, USB A/USB C, Fast Charging for Laptop, 480Mbps",
        "variantes": "Couleur affichée : jaune ; options de packages : câble seul ou chargeur + câble ; marque CS ; modèle CSDATACHARGINGCABLE",
        "materiaux": "Nylon (gaine tressée)",
        "dimensions": "Longueur : 1 m ; colis : 17 x 8 x 3 cm",
        "categorie": "4 in 1 Cable",
        "poids": "0,07 kg (poids brut unitaire)",
        "informations_fournisseur": "Dongguan CS Electronic Technology Co., Limited (Dongguan, Guangdong, Chine) — fondée en 2022 (3 ans) ; Custom Manufacturer (Onsite Check Alibaba, Trade Assurance) ; note 4,5/5 (50 avis) ; on-time dispatch 100 % ; réponse <= 4h ; 51-100 employés ; 3 000-5 000 m² ; valeur de production US$10-50 millions ; pièces de rechange gratuites et support technique en ligne ; produits : câbles audio/vidéo, Type-C, HDMI, USB, DisplayPort. ID Alibaba : 285536055",
        "description": "Câble de charge multifonction 4-en-1 (USB-A / USB-C vers Type-C / Lightning), puissance 65W pour ordinateurs portables et 27W pour autres appareils, transfert de données 480 Mbps, protection contre les courts-circuits, gaine nylon tressé anti-nœuds. Compatible laptop, Android, AirPods, Switch.",
        "lien_1": "https://www.alibaba.com/product-detail/4-in-1-65W-27W-PD_1601429621518.html",
        "prix_fournisseur": 1.38,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H44e03af2ac3743889038cede35898843e.jpg"
        ],
        "stock_disponible": 0,
        "moq": 100,
        "fournisseur": "Dongguan CS Electronic Technology Co., Limited",
        "supplierId": "285536055"
    },

    {
        "nom": "Best Seller USB-C PD 3.0 60W Fast Charging Data Cable (Type-C vers Type-C, gaine PVC + jacket nylon, en boîte, pour iPhone 15/16/16 Pro Max)",
        "variantes": "Longueur : 1 m ; couleur : options non affichées dans l'extraction ; marque OEM (private mold disponible : oui)",
        "materiaux": "PVC (gaine), nylon (jacket tressé), cuivre étamé (conducteur)",
        "dimensions": "Longueur : 1 m ; colis : 10 x 10 x 8 cm",
        "poids": "0,051 kg (poids brut unitaire)",
        "categorie": "Fast Charging Cable — Type-C vers Type-C (catégorie Alibaba : chargeurs et adaptateurs, #1 le plus populaire)",
        "informations_fournisseur": "Shenzhen Aibo Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — 6 ans d'activité ; Custom Manufacturer ; #1 le plus populaire dans la catégorie chargeurs/adaptateurs ; note boutique 4,5/5 (1 522 avis) ; 190+ unités vendues sur ce produit (note produit 5,0/5, 1 avis) ; réponse <= 2h ; on-time delivery >= 95 % ; taux de recompra 10 % ; personnalisation partielle et sur dessin ; promotion en cours : -10 % dès le 1er septembre, livraison gratuite à partir de $20. ID Alibaba : 251861674",
        "description": "Câble de données et de charge rapide USB-C PD 3.0 60W, Type-C vers Type-C, gaine PVC avec jacket nylon tressé pour la durabilité, conducteur en cuivre étamé, blindage tressé, charge rapide 3A, compatible iPhone 15/16/16 Pro Max et téléphones mobiles. Emballage en boîte. Le vendeur déclare que le produit dispose des certifications requises dans les pays applicables.",
        "lien_1": "https://www.alibaba.com/product-detail/Best-Seller-USB-C-PD-3_1601573247537.html",
        "prix_fournisseur": 0.55,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hcf9e16de21cb49ecaa733d7560aec1efT.jpg"
        ],
        "stock_disponible": 0,
        "moq": 10,
        "fournisseur": "Shenzhen Aibo Technology Co., Ltd.",
        "supplierId": "251861674"
    },

    {
        "nom": "High Quality Type-C to USB 3.0 Fast Charging Cable — Shielding TPE Jacket (S8/S9 Plus, iPhone, ordinateur, caméra, écouteurs)",
        "variantes": "Connecteurs : Type-C, USB 2.0, USB 3.0 ; longueur : 1 m ; modèle 05",
        "materiaux": "TPE (gaine), cuivre composite (conducteur), feuille d'aluminium (blindage)",
        "dimensions": "Longueur : 1 m ; colis : 5 x 1 x 1 cm",
        "poids": "0,03 kg (poids brut unitaire)",
        "categorie": "Data Cables (câbles de données)",
        "informations_fournisseur": "Jiangxi Angeli Wire Co., Ltd. (Ganzhou, Jiangxi, Chine) — fondée en 2023 ; Custom Manufacturer certifié (Onsite Check Alibaba, Trade Assurance) ; note 4,7/5 (46 avis) ; 2 340+ unités vendues ; on-time dispatch 98,6 % ; réponse <= 1h ; revenu en ligne US$10 000+ ; 101-200 employés ; 8 530 m² ; certification RoHS ; marchés : Amérique du Nord/Sud, Europe de l'Est, Asie du Sud-Est, Afrique ; produits : câbles USB, chargeurs, power banks. ID Alibaba : 292003561",
        "description": "Câble de charge rapide 3A Type-C vers USB 3.0, gaine TPE flexible et blindage en feuille d'aluminium contre les interférences électromagnétiques. Compatible caméras, ordinateurs, écouteurs, smartphones (Android/iPhone), banques d'alimentation, tablettes et montres connectées.",
        "lien_1": "https://www.alibaba.com/product-detail/High-Quality-Type-C-to-USB_1601652646082.html",
        "prix_fournisseur": 0.26,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H40385fdf91f944f68b18c5d1e1139d993.jpg"
        ],
        "stock_disponible": 0,
        "moq": 20,
        "fournisseur": "Jiangxi Angeli Wire Co., Ltd.",
        "supplierId": "292003561"
    },
    
    {
        "nom": "MFI Factory Certificate 1m/2m/3m 20W USB C to MFI Type C PD Fast Charging Cable for iPhone 11 12 13 14 15 16 Pro Max",
        "variantes": "Longueurs : 1 m (3,28 ft), 2 m (6,56 ft), 3 m ; couleur : blanc ; marque INGZOOM ; modèle HJ-01",
        "materiaux": "PVC/TPE (gaine), cuivre pur (conducteur)",
        "dimensions": "Longueurs : 1 m / 2 m / 3 m ; colis : 5 x 5 x 1 cm",
        "categorie": "USB Cable for iPhone",
        "poids": "0,02 kg (poids brut unitaire)",
        "informations_fournisseur": "Dongguan Yingzhongcheng Electronic Co., Ltd. (Dongguan, Guangdong, Chine) — fondée en 2019 (5 ans) ; Custom Manufacturer (Trade Assurance) ; note 4,6/5 (677 avis) ; 2 377+ unités vendues ; on-time dispatch 93,9 % ; réponse <= 7h ; revenu en ligne US$90 000+ ; 3 500 m² ; certifications : MFi (Apple), IEC 62368, EMC, RoHS, vérifiée par TÜV Rheinland ; marchés : USA, UK, Australie",
        "description": "Câble de charge rapide 20W certifié MFi (Apple), conducteur en cuivre pur pour durabilité et conductivité, compatible iPhone 11 à 16 Pro Max. Charge rapide 3A / Power Delivery 20W. Emballage : boîte en papier blanc.",
        "lien_1": "https://www.alibaba.com/product-detail/MFI-Factory-Certificate-1m-2m-3m_1600538620089.html",
        "prix_fournisseur": 0.68,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H719d1558369a48d1ae984756de50b779o.png",
            "https://s.alicdn.com/@sc04/kf/H7f47089dc64d4354aae972f80f33cab3c.jpg",
            "https://s.alicdn.com/@sc04/kf/H2def6abea4c8416ab47447bf077c3d887.png"
        ],
        "stock_disponible": 0,
        "moq": 10,
        "fournisseur": "Dongguan Yingzhongcheng Electronic Co., Ltd.",
        "supplierId": "yzcables"
    },
    
    {
        "nom": "1M 2M 60W Braided Charger Cable Type C to Type C (pour iPhone 15 / 15 Pro Max, ordinateurs portables)",
        "variantes": "Longueurs : 1 m, 2 m ; marque ORPHIE ; modèle OR0-A1068 ; personnalisation : logo (min. 500 pcs), emballage (min. 10 pcs), longueur (min. 300 pcs)",
        "materiaux": "Nylon (tressage), TPE, PVC, cuivre étamé et cuivre pur (conducteur), alliage d'aluminium",
        "dimensions": "Longueurs : 1 m / 2 m ; colis : 5 x 5 x 5 cm",
        "categorie": "Type C to Type C Cable",
        "poids": "25 g (poids net) ; 0,022 kg (poids brut unitaire)",
        "informations_fournisseur": "Shenzhen Oufei'er Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — 7 ans Gold Supplier (12 ans dans l'industrie) ; Custom Manufacturer (Trade Assurance) ; note 4,4/5 (4 454 avis) ; 29 724+ unités vendues ; on-time dispatch 95 % ; réponse <= 2h ; revenu en ligne US$200 000+ ; 109 employés ; 4 300 m² ; garantie 6 mois ; badge « Certified » ; #1 le plus populaire dans sa catégorie ; catégories : chargeurs, câbles, écouteurs",
        "description": "Câble de charge et de données tressé nylon 60W (5A), Type-C vers Type-C, optimisé pour iPhone 15 / 15 Pro Max et ordinateurs portables. Charge rapide + transfert de données, gaine résistante à la flexion.",
        "lien_1": "https://www.alibaba.com/product-detail/1M-2M-60W-Braided-Charger-Cable_1600952063877.html",
        "prix_fournisseur": 0.66,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H121c31a460f24649b4c88595cdd20821Q.png",
            "https://s.alicdn.com/@sc04/kf/He4e5c97d7008450aa05bd64544891c4aq.jpg",
            "https://s.alicdn.com/@sc04/kf/H5c3ae58f057949f8b245c0ba2bccc7e4M.jpg"
        ],
        "stock_disponible": 0,
        "moq": 2,
        "fournisseur": "Shenzhen Oufei'er Technology Co., Ltd.",
        "supplierId": "246999273"
    },
    
    {
        "nom": "High Quality USB Type-C Cable — câble USB vers Type-C, charge rapide 5A/6A et transfert de données (connecteur USB 3.0)",
        "variantes": "Longueurs : 1 m / 2 m (personnalisables) ; couleur : noir (personnalisable) ; connecteur USB 3.0 nickelé ; OEM/ODM et moule privé disponibles",
        "materiaux": "PVC/TPE (gaine), cuivre pur (conducteur), blindage tressé",
        "dimensions": "Longueur : 1 à 2 m (personnalisable)",
        "categorie": "USB Cable — câble de charge rapide Type-C (USB Data Charger Cable)",
        "poids": "Non disponible",
        "informations_fournisseur": "Dongguan Yilian Photoelectric Technology Co., Ltd. (Dongguan, Guangdong, Chine) — fondée en 2020 ; fabricant et négociant (Combined) ; fournisseur Vérifié Alibaba (catégorie vérifiée) ; note produit 4,8/5 (236 avis) ; taux de réponse 99,8 % (réponse ~1h) ; certifications : CE, RoHS, FCC, EMC, UKCA ; port d'export : Shenzhen ; principaux produits : câbles HDMI, fibre optique, Type-C, Starlink. ID Alibaba : 280891666",
        "description": "Câble USB vers Type-C de charge rapide 5A/6A avec transfert de données, conducteur en cuivre pur, gaine PVC/TPE, blindage tressé, connecteur USB 3.0 nickelé. Certifications CE, RoHS, FCC. Statut produit déclaré : en stock. Compatible téléphones mobiles, ordinateurs, Android, banques d'alimentation, tablettes.",
        "lien_1": "https://www.alibaba.com/product-detail/High-Quality-USB-Type-C-Cable_1601275333243.html",
        "prix_fournisseur": 0.39,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hab67e88841c945e9843264e1270f0664r.jpg"
        ],
        "stock_disponible": 0,
        "moq": 1,
        "fournisseur": "Dongguan Yilian Photoelectric Technology Co., Ltd.",
        "supplierId": "280891666"
    },
    
    {
        "nom": "4 in 1 65W/27W PD Multi-function Charging Cable, 1m, Nylon Braided, USB A/USB C, Fast Charging for Laptop, 480Mbps",
        "variantes": "Couleur affichée : jaune ; options de packages : câble seul ou chargeur + câble ; marque CS ; modèle CSDATACHARGINGCABLE",
        "materiaux": "Nylon (gaine tressée)",
        "dimensions": "Longueur : 1 m ; colis : 17 x 8 x 3 cm",
        "categorie": "4 in 1 Cable",
        "poids": "0,07 kg (poids brut unitaire)",
        "informations_fournisseur": "Dongguan CS Electronic Technology Co., Limited (Dongguan, Guangdong, Chine) — fondée en 2022 (3 ans) ; Custom Manufacturer (Onsite Check Alibaba, Trade Assurance) ; note 4,5/5 (50 avis) ; on-time dispatch 100 % ; réponse <= 4h ; 51-100 employés ; 3 000-5 000 m² ; valeur de production US$10-50 millions ; pièces de rechange gratuites et support technique en ligne ; produits : câbles audio/vidéo, Type-C, HDMI, USB, DisplayPort. ID Alibaba : 285536055",
        "description": "Câble de charge multifonction 4-en-1 (USB-A / USB-C vers Type-C / Lightning), puissance 65W pour ordinateurs portables et 27W pour autres appareils, transfert de données 480 Mbps, protection contre les courts-circuits, gaine nylon tressé anti-nœuds. Compatible laptop, Android, AirPods, Switch.",
        "lien_1": "https://www.alibaba.com/product-detail/4-in-1-65W-27W-PD_1601429621518.html",
        "prix_fournisseur": 1.38,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H44e03af2ac3743889038cede35898843e.jpg"
        ],
        "stock_disponible": 0,
        "moq": 100,
        "fournisseur": "Dongguan CS Electronic Technology Co., Limited",
        "supplierId": "285536055"
    },
    
    {
        "nom": "Best Seller USB-C PD 3.0 60W Fast Charging Data Cable (Type-C vers Type-C, gaine PVC + jacket nylon, en boîte, pour iPhone 15/16/16 Pro Max)",
        "variantes": "Longueur : 1 m ; couleur : options non affichées dans l'extraction ; marque OEM (private mold disponible : oui)",
        "materiaux": "PVC (gaine), nylon (jacket tressé), cuivre étamé (conducteur)",
        "dimensions": "Longueur : 1 m ; colis : 10 x 10 x 8 cm",
        "categorie": "Fast Charging Cable — Type-C vers Type-C (catégorie Alibaba : chargeurs et adaptateurs, #1 le plus populaire)",
        "poids": "0,051 kg (poids brut unitaire)",
        "informations_fournisseur": "Shenzhen Aibo Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — 6 ans d'activité ; Custom Manufacturer ; #1 le plus populaire dans la catégorie chargeurs/adaptateurs ; note boutique 4,5/5 (1 522 avis) ; 190+ unités vendues sur ce produit (note produit 5,0/5, 1 avis) ; réponse <= 2h ; on-time delivery >= 95 % ; taux de recompra 10 % ; personnalisation partielle et sur dessin ; promotion en cours : -10 % dès le 1er septembre, livraison gratuite à partir de $20. ID Alibaba : 251861674",
        "description": "Câble de données et de charge rapide USB-C PD 3.0 60W, Type-C vers Type-C, gaine PVC avec jacket nylon tressé pour la durabilité, conducteur en cuivre étamé, blindage tressé, charge rapide 3A, compatible iPhone 15/16/16 Pro Max et téléphones mobiles. Emballage en boîte. Le vendeur déclare que le produit dispose des certifications requises dans les pays applicables.",
        "lien_1": "https://www.alibaba.com/product-detail/Best-Seller-USB-C-PD-3_1601573247537.html",
        "prix_fournisseur": 0.55,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hcf9e16de21cb49ecaa733d7560aec1efT.jpg"
        ],
        "stock_disponible": 0,
        "moq": 10,
        "fournisseur": "Shenzhen Aibo Technology Co., Ltd.",
        "supplierId": "251861674"
    },
    
    {
        "nom": "High Quality Type-C to USB 3.0 Fast Charging Cable — Shielding TPE Jacket (S8/S9 Plus, iPhone, ordinateur, caméra, écouteurs)",
        "variantes": "Connecteurs : Type-C, USB 2.0, USB 3.0 ; longueur : 1 m ; modèle 05",
        "materiaux": "TPE (gaine), cuivre composite (conducteur), feuille d'aluminium (blindage)",
        "dimensions": "Longueur : 1 m ; colis : 5 x 1 x 1 cm",
        "categorie": "Data Cables (câbles de données)",
        "poids": "0,03 kg (poids brut unitaire)",
        "informations_fournisseur": "Jiangxi Angeli Wire Co., Ltd. (Ganzhou, Jiangxi, Chine) — fondée en 2023 ; Custom Manufacturer certifié (Onsite Check Alibaba, Trade Assurance) ; note 4,7/5 (46 avis) ; 2 340+ unités vendues ; on-time dispatch 98,6 % ; réponse <= 1h ; revenu en ligne US$10 000+ ; 101-200 employés ; 8 530 m² ; certification RoHS ; marchés : Amérique du Nord/Sud, Europe de l'Est, Asie du Sud-Est, Afrique ; produits : câbles USB, chargeurs, power banks. ID Alibaba : 292003561",
        "description": "Câble de charge rapide 3A Type-C vers USB 3.0, gaine TPE flexible et blindage en feuille d'aluminium contre les interférences électromagnétiques. Compatible caméras, ordinateurs, écouteurs, smartphones (Android/iPhone), banques d'alimentation, tablettes et montres connectées.",
        "lien_1": "https://www.alibaba.com/product-detail/High-Quality-Type-C-to-USB_1601652646082.html",
        "prix_fournisseur": 0.26,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H40385fdf91f944f68b18c5d1e1139d993.jpg"
        ],
        "stock_disponible": 0,
        "moq": 20,
        "fournisseur": "Jiangxi Angeli Wire Co., Ltd.",
        "supplierId": "292003561"
    },
    
    {
        "nom": "Hot Selling Gasoline Direct Drive Walking Tractor with Trailer Plow Harrow Electric Start Low MOQ for Orchard Distributor Supply",
        "variantes": "Modèle YK105G-G-M ; couleurs : rouge, vert, noir, argent, blanc ; accessoires (remorque, charrue, herse) : à sélectionner",
        "materiaux": "Non disponible",
        "dimensions": "1000 × 550 × 780 mm",
        "categorie": "Motoculteur (Farm Cultivator / Tiller) — Machinerie agricole",
        "poids": "110 kg",
        "informations_fournisseur": "Youkexin (Chongqing) Industrial Technology Co., Ltd. — fournisseur vérifié (Verified Supplier, Gold Supplier) ; société de négoce ; établie ≈2025/2026 ; Chongqing, Chine ; 7 employés ; 0 avis ; 0 commande sur 90 jours ; taux de réponse 100 % ; temps de réponse ≤ 1 h ; certification produit : CE ; garantie 1 an",
        "description": "Motoculteur / tracteur à conducteur marchant à essence (4,0 kW / 3600 tr/min, cylindrée 210 ml, réservoir 3,6 L) ; démarrage électrique ; transmission directe ; largeur de travail 1050 mm ; profondeur de travail ≥ 100 mm ; lame Ø 300 mm ; boîte de vitesses -1/0/1/2 ; consommation ≤ 374 g/kW·h ; rapport d'essai machine fourni ; garantie 1 an. (Description synthétisée à partir des caractéristiques techniques — aucune description narrative publiée par le fournisseur.)",
        "lien_1": "https://www.alibaba.com/product-detail/Hot-Selling-Gasoline-Direct-Drive-Walking_1601909252323.html",
        "prix_fournisseur": 266.25,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H861524a73dec44ebadab5dc00b4dff4cN.png"
        ],
        "stock_disponible": 0,
        "moq": 1,
        "fournisseur": "Youkexin (Chongqing) Industrial Technology Co., Ltd.",
        "supplierId": "293042162"
    },
    
    {
        "nom": "Quick Charge 20W PD Type C Wall Plug With C to C Sync Data Transfer Cable Kit Retail Box Set for Outdoor Camping Adventure",
        "variantes": "Bundle : chargeur + câble ; norme de prise : US/EU ; couleur : non précisée sur la page",
        "materiaux": "PC ignifuge (boîtier), ABS+PC",
        "dimensions": "Colis unitaire : 15 × 15 × 12 cm",
        "categorie": "Chargeur mural USB / adaptateur universel (Fast Charger / Universal Adapter) — Consommables électroniques",
        "poids": "0,5 kg (poids brut unitaire)",
        "informations_fournisseur": "Shenzhen Evolve Electronic Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — Gold Supplier 1 an ; société mixte fabricant/négociant ; note boutique 5,0/5 (13 avis) ; taux de réponse 99,39 % ; temps de réponse ≤ 2 h ; expédition à temps ≥ 96 % ; taux de réachat 15 % ; certification produit : CE + déclaration de conformité ; marchés principaux : États-Unis, Australie, Cambodge, Japon, Canada ; ID Alibaba : 292519620",
        "description": "Chargeur mural universel PD 20 W (12 W/20 W) avec port USB/Type-C et câble Type-C vers Type-C de transfert de données inclus, en coffret retail. Entrée 100-240 V/0,5 A, protocole PD 3.0, protection ignifuge. Marque EVOLVE, modèle K25-GB, origine Chine. Sortie PD+QC3.0 (personnalisable). Service : design personnalisé en 3 jours, échantillon personnalisé en 7 jours. Remise -10 % affichée (prix le plus bas sur 180 jours). (Description synthétisée à partir des caractéristiques techniques — aucune description narrative publiée par le fournisseur.)",
        "lien_1": "https://www.alibaba.com/product-detail/Quick-Charge-20w-Pd-Type-C_1601853283799.html",
        "prix_fournisseur": 1.78,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H97d6e22d178d44a3a711788de08a694bZ.png"
        ],
        "stock_disponible": 0,
        "moq": 2,
        "fournisseur": "Shenzhen Evolve Electronic Technology Co., Ltd.",
        "supplierId": "292519620"
    },
    
    {
        "nom": "UK 65W PD 3.0 Fast Charger 2C+1A 3 Ports Wall Plug Type-C Cable Combo Set Fireproof for Mobile Phone",
        "variantes": "Bundle : chargeur + câble Type-C ; prise : UK ; couleur : comme illustré (non détaillée)",
        "materiaux": "ABS / PC anti-feu (boîtier)",
        "dimensions": "Colis unitaire : 15 × 7 × 4 cm",
        "categorie": "Chargeur mural USB (USB wall charger) — Consommables électroniques",
        "poids": "0,15 kg (poids brut unitaire)",
        "informations_fournisseur": "SKYLIGHT ELECTRONIC TECHNOLOGY (HK) CO., LIMITED (Hong Kong) — société de négoce (Trading Company), Gold Supplier 2 ans, vérifié Onsite Check (Trade Assurance) ; note boutique 4,5/5 (194 avis) ; taux de réponse 99,41 % ; temps de réponse ≤ 3 h ; expédition à temps ≥ 97 % ; taux de réachat 8 % ; 51-100 employés ; 1 000-3 000 m² ; valeur de production annuelle US$10-50 M ; fondée en 2013 selon le profil boutique (2024 selon le registre API) ; certification : CE, déclaration de conformité ; garantie 1 an ; marchés : Amérique du Nord, Afrique, Europe de l'Ouest, Asie du Sud-Est, Moyen-Orient ; ID Alibaba : 286351000",
        "description": "Chargeur mural 65 W PD 3.0 / QC4.0, 3 ports (2× Type-C + 1× USB-A), avec câble Type-C inclus (combo). Entrée 100-240 V/0,15 A, sortie 5 V/2 A. Protections : court-circuit, surtension, surintensité, surcharge, basse tension, ignifuge. Pliable et écologique. Marque SKYLIGHT, modèle SK-WP6, origine Guangdong, Chine. Échantillon disponible (3 $). Délai de production : 7 jours (1-1 000 pièces), négociable au-delà. 100 unités vendues ; certifié CE. (Description synthétisée à partir des caractéristiques techniques — aucune description narrative publiée par le fournisseur.)",
        "lien_1": "https://www.alibaba.com/product-detail/UK-65W-PD-3-0-Fast_1601908668684.html",
        "prix_fournisseur": 2.16,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H855e64efb39f4118b32bb657d397e584T.jpg",
            "https://s.alicdn.com/@sc04/kf/H4910f9b97d4e4de283b6ad734939ecbbj.jpg",
            "https://s.alicdn.com/@sc04/kf/H21d8a853a31c47ec860f6bcd52e8b33d2.jpg",
            "https://s.alicdn.com/@sc04/kf/H9d48c638facf4304a163101744673c8fO.jpg",
            "https://s.alicdn.com/@sc04/kf/H865fb92cc91e41d7a37791364e628e29k.jpg",
            "https://s.alicdn.com/@sc04/kf/Hf37521d0a48f4474a31f7b1a423ad4a4F.jpg"
        ],
        "stock_disponible": 0,
        "moq": 20,
        "fournisseur": "SKYLIGHT ELECTRONIC TECHNOLOGY (HK) CO., LIMITED",
        "supplierId": "286351000"
    },

    {
        "nom": "Kit de charge rapide 20 W avec câbles Type-C et 8 broches pour iPhone 14 15 16 17 Pro Max, boîte cadeau de luxe (titre traduit de la version espagnole Alibaba)",
        "variantes": "Bundle : chargeur + câble + boîte d'emballage ; prise : Royaume-Uni ; couleur : blanc ; câbles Type-C et 8 broches (Lightning), longueur 1 m ; logo client possible (MOQ 1 000 sets)",
        "materiaux": "PC ignifuge (boîtier), TPE (gaine du câble)",
        "dimensions": "Colis unitaire : 18 × 15 × 6 cm",
        "categorie": "Kit chargeur mural 20 W + câbles (Fast Charger) — Consommables électroniques",
        "poids": "0,13 kg (poids brut unitaire)",
        "informations_fournisseur": "Shenzhen Zhihuang Electronic Co., Ltd. (Guangdong, Chine) — fabricant personnalisé (Custom Manufacturer), Gold Supplier 4 ans, vérifié par Intertek ; note boutique 4,7/5 (52 avis) ; temps de réponse ≤ 3 h ; expédition à temps 100 % ; 42 employés ; 1 085 m² ; 4 lignes de production ; 27 machines ; 9 ans d'expérience dans le secteur ; fondée en 2023 (registre API) ; certifications : CE, MFi ; services OEM/ODM, inspection des matières et du produit fini ; produit #3 des plus populaires dans la catégorie chargeurs/adaptateurs TPE ; 420 vendus ; ID Alibaba : 281045560",
        "description": "Kit de charge rapide 20 W (chargeur + câble Type-C + câble 8 broches) pour iPhone 14/15/16/17 Pro Max, livré avec boîte cadeau de luxe. Sorties : 5 V/3 A, 9 V/2,22 A, 12 V/1,67 A ; entrée : AC 110-240 V 50/60 Hz, 0,5 A max. Protocoles : QC2.0, QC3.0, PD 2.0, PD 3.0, FCP, SCP. Protection contre les courts-circuits, matériau PC ignifuge, prise rotative à 90°. Marque OEM/ODM, modèle WC0027, origine Guangdong, Chine. Personnalisation logo/dessin : à partir de 1 000 sets. Délai : 7 jours (1-500 sets), négociable au-delà. Livraison gratuite affichée jusqu'à un certain montant. (Description synthétisée à partir des caractéristiques techniques — page consultée en espagnol.)",
        "lien_1": "https://www.alibaba.com/product-detail/20W-Fast-Charge-Kit-with-Type_1601584879267.html",
        "prix_fournisseur": 12521,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hb9b024a8456d4628aa89983478cbc6ddV.jpg"
        ],
        "stock_disponible": 0,
        "moq": 100,
        "fournisseur": "Shenzhen Zhihuang Electronic Co., Ltd.",
        "supplierId": "281045560"
    },
    
    {
        "nom": "Hot Selling USB C 20W Charger & Cable Kits Combo for iPhone US EU Adapters Supports OEM Box Cardboard",
        "variantes": "Couleurs : blanc, noir ; prise : EU (autres normes en option) ; bundle : chargeur + câble ; personnalisation : emballage (à partir de 1 000 pcs) et norme de prise (à partir de 1 000 pcs)",
        "materiaux": "ABS (boîtier)",
        "dimensions": "Colis unitaire : 7,5 × 15 × 3 cm",
        "categorie": "Chargeur mural USB 20 W 2-en-1 avec câble (Multifunction Charger) — Consommables électroniques",
        "poids": "0,16 kg (poids brut unitaire)",
        "informations_fournisseur": "Abc (Shenzhen) Electronics Co., Ltd. (Shenzhen, Guangdong, Chine) — fabricant personnalisé (Custom Manufacturer), Gold Supplier 15 ans, vérifié par SGS (Supplier Assessment + Onsite Check) ; note boutique 4,8/5 (2 044 avis) ; temps de réponse ≤ 5 h ; expédition à temps 100 % ; taux de réachat 13 % ; 55 employés ; 2 000 m² ; 2 lignes de production ; 8 contrôleurs qualité ; fondée en 2011 ; 21 ans d'expérience export (travaille avec des grossistes Top 10 USA) ; certifications : CE, FCC, RoHS, déclaration de conformité ; 9 certificats, 1 brevet, 2 marques déposées ; revenu en ligne US$310 000+ ; marchés : Amérique du Nord, Moyen-Orient, Océanie, Amérique du Sud, Europe de l'Est ; #9 des plus populaires en chargeurs multifonctions (EU top-seller) ; 179 vendus ; ID Alibaba : 213643627",
        "description": "Chargeur mural USB-C 20 W avec câble inclus (combo), compatible iPhone 12 à 16 Pro. Entrée : 5 V/3 A, 9 V/2,2 A ; sortie : 9 V/2,2 A ; protocoles PD et QC3.0. Protections : court-circuit, surtension (OVP), surintensité, surcharge, basse tension, ignifuge. Matériau ABS durable, emballage boîte de marque (Brand Box Package). Marque MIUSB, modèle ABC-780, origine Guangdong, Chine. OEM/ODM bienvenus ; usine avec 19 ans d'expérience. Délai : 7 jours (1-100 pièces), négociable au-delà. Le vendeur déclare que le produit dispose des qualifications/licences requises dans certains pays applicables. (Description synthétisée à partir des caractéristiques techniques.)",
        "lien_1": "https://www.alibaba.com/product-detail/Hot-Selling-USB-C-20W-Charger_1601601313474.html",
        "prix_fournisseur": 2.08,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hd234baaf040e4f7db900c249bb44d01db.jpg"
        ],
        "stock_disponible": 0,
        "moq": 20,
        "fournisseur": "Abc (Shenzhen) Electronics Co., Ltd.",
        "supplierId": "213643627"
    }
]




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



def CreateProduit():
    produits_crees = []
    erreurs = []
    
    produits = [
    {
        "nom": "MFI Factory Certificate 1m/2m/3m 20W USB C to MFI Type C PD Fast Charging Cable for iPhone 11 12 13 14 15 16 Pro Max",
        "variantes": "Longueurs : 1 m (3,28 ft), 2 m (6,56 ft), 3 m ; couleur : blanc ; marque INGZOOM ; modèle HJ-01",
        "materiaux": "PVC/TPE (gaine), cuivre pur (conducteur)",
        "dimensions": "Longueurs : 1 m / 2 m / 3 m ; colis : 5 x 5 x 1 cm",
        "categorie": "USB Cable for iPhone",
        "poids": "0,02 kg (poids brut unitaire)",
        "informations_fournisseur": "Dongguan Yingzhongcheng Electronic Co., Ltd. (Dongguan, Guangdong, Chine) — fondée en 2019 (5 ans) ; Custom Manufacturer (Trade Assurance) ; note 4,6/5 (677 avis) ; 2 377+ unités vendues ; on-time dispatch 93,9 % ; réponse <= 7h ; revenu en ligne US$90 000+ ; 3 500 m² ; certifications : MFi (Apple), IEC 62368, EMC, RoHS, vérifiée par TÜV Rheinland ; marchés : USA, UK, Australie",
        "description": "Câble de charge rapide 20W certifié MFi (Apple), conducteur en cuivre pur pour durabilité et conductivité, compatible iPhone 11 à 16 Pro Max. Charge rapide 3A / Power Delivery 20W. Emballage : boîte en papier blanc.",
        "lien_1": "https://www.alibaba.com/product-detail/MFI-Factory-Certificate-1m-2m-3m_1600538620089.html",
        "prix_fournisseur": 0.68,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H719d1558369a48d1ae984756de50b779o.png",
            "https://s.alicdn.com/@sc04/kf/H7f47089dc64d4354aae972f80f33cab3c.jpg",
            "https://s.alicdn.com/@sc04/kf/H2def6abea4c8416ab47447bf077c3d887.png"
        ],
        "stock_disponible": 0,
        "moq": 10,
        "fournisseur": "Dongguan Yingzhongcheng Electronic Co., Ltd.",
        "supplierId": "yzcables"
    },

    {
        "nom": "1M 2M 60W Braided Charger Cable Type C to Type C (pour iPhone 15 / 15 Pro Max, ordinateurs portables)",
        "variantes": "Longueurs : 1 m, 2 m ; marque ORPHIE ; modèle OR0-A1068 ; personnalisation : logo (min. 500 pcs), emballage (min. 10 pcs), longueur (min. 300 pcs)",
        "materiaux": "Nylon (tressage), TPE, PVC, cuivre étamé et cuivre pur (conducteur), alliage d'aluminium",
        "dimensions": "Longueurs : 1 m / 2 m ; colis : 5 x 5 x 5 cm",
        "poids": "25 g (poids net) ; 0,022 kg (poids brut unitaire)",
        "categorie": "Type C to Type C Cable",
        "informations_fournisseur": "Shenzhen Oufei'er Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — 7 ans Gold Supplier (12 ans dans l'industrie) ; Custom Manufacturer (Trade Assurance) ; note 4,4/5 (4 454 avis) ; 29 724+ unités vendues ; on-time dispatch 95 % ; réponse <= 2h ; revenu en ligne US$200 000+ ; 109 employés ; 4 300 m² ; garantie 6 mois ; badge « Certified » ; #1 le plus populaire dans sa catégorie ; catégories : chargeurs, câbles, écouteurs",
        "description": "Câble de charge et de données tressé nylon 60W (5A), Type-C vers Type-C, optimisé pour iPhone 15 / 15 Pro Max et ordinateurs portables. Charge rapide + transfert de données, gaine résistante à la flexion.",
        "lien_1": "https://www.alibaba.com/product-detail/1M-2M-60W-Braided-Charger-Cable_1600952063877.html",
        "prix_fournisseur": 0.66,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H121c31a460f24649b4c88595cdd20821Q.png",
            "https://s.alicdn.com/@sc04/kf/He4e5c97d7008450aa05bd64544891c4aq.jpg",
            "https://s.alicdn.com/@sc04/kf/H5c3ae58f057949f8b245c0ba2bccc7e4M.jpg"
        ],
        "stock_disponible": 0,
        "moq": 2,
        "fournisseur": "Shenzhen Oufei'er Technology Co., Ltd.",
        "supplierId": "246999273"
    },

    {
        "nom": "High Quality USB Type-C Cable — câble USB vers Type-C, charge rapide 5A/6A et transfert de données (connecteur USB 3.0)",
        "variantes": "Longueurs : 1 m / 2 m (personnalisables) ; couleur : noir (personnalisable) ; connecteur USB 3.0 nickelé ; OEM/ODM et moule privé disponibles",
        "materiaux": "PVC/TPE (gaine), cuivre pur (conducteur), blindage tressé",
        "dimensions": "Longueur : 1 à 2 m (personnalisable)",
        "categorie": "USB Cable — câble de charge rapide Type-C (USB Data Charger Cable)",
        "poids": "Non disponible",
        "informations_fournisseur": "Dongguan Yilian Photoelectric Technology Co., Ltd. (Dongguan, Guangdong, Chine) — fondée en 2020 ; fabricant et négociant (Combined) ; fournisseur Vérifié Alibaba (catégorie vérifiée) ; note produit 4,8/5 (236 avis) ; taux de réponse 99,8 % (réponse ~1h) ; revenu annuel déclaré > US$100M (à confirmer) ; certifications valides : CE (2029), RoHS (2030), FCC (2028), EMC (2030), UKCA (2029) ; 1 300 m² de bureaux ; port d'export : Shenzhen ; boutique ylgd.en.alibaba.com avec vidéos évaluées, rapports d'inspection d'usine et lignes de production vérifiées ; principaux produits : câbles HDMI, fibre optique, Type-C, Starlink. ID Alibaba : 280891666",
        "description": "Câble USB vers Type-C de charge rapide 5A/6A avec transfert de données, conducteur en cuivre pur, gaine PVC/TPE, blindage tressé, connecteur USB 3.0 nickelé. Certifications CE, RoHS, FCC. Statut produit déclaré : en stock. Compatible téléphones mobiles, ordinateurs, Android, banques d'alimentation, tablettes.",
        "lien_1": "https://www.alibaba.com/product-detail/High-Quality-USB-Type-C-Cable_1601275333243.html",
        "prix_fournisseur": 0.39,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hab67e88841c945e9843264e1270f0664r.jpg"
        ],
        "stock_disponible": 0,
        "moq": 1,
        "fournisseur": "Dongguan Yilian Photoelectric Technology Co., Ltd.",
        "supplierId": "280891666"
    },

    {
        "nom": "4 in 1 65W/27W PD Multi-function Charging Cable, 1m, Nylon Braided, USB A/USB C, Fast Charging for Laptop, 480Mbps",
        "variantes": "Couleur affichée : jaune ; options de packages : câble seul ou chargeur + câble ; marque CS ; modèle CSDATACHARGINGCABLE",
        "materiaux": "Nylon (gaine tressée)",
        "dimensions": "Longueur : 1 m ; colis : 17 x 8 x 3 cm",
        "categorie": "4 in 1 Cable",
        "poids": "0,07 kg (poids brut unitaire)",
        "informations_fournisseur": "Dongguan CS Electronic Technology Co., Limited (Dongguan, Guangdong, Chine) — fondée en 2022 (3 ans) ; Custom Manufacturer (Onsite Check Alibaba, Trade Assurance) ; note 4,5/5 (50 avis) ; on-time dispatch 100 % ; réponse <= 4h ; 51-100 employés ; 3 000-5 000 m² ; valeur de production US$10-50 millions ; pièces de rechange gratuites et support technique en ligne ; produits : câbles audio/vidéo, Type-C, HDMI, USB, DisplayPort. ID Alibaba : 285536055",
        "description": "Câble de charge multifonction 4-en-1 (USB-A / USB-C vers Type-C / Lightning), puissance 65W pour ordinateurs portables et 27W pour autres appareils, transfert de données 480 Mbps, protection contre les courts-circuits, gaine nylon tressé anti-nœuds. Compatible laptop, Android, AirPods, Switch.",
        "lien_1": "https://www.alibaba.com/product-detail/4-in-1-65W-27W-PD_1601429621518.html",
        "prix_fournisseur": 1.38,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H44e03af2ac3743889038cede35898843e.jpg"
        ],
        "stock_disponible": 0,
        "moq": 100,
        "fournisseur": "Dongguan CS Electronic Technology Co., Limited",
        "supplierId": "285536055"
    },

    {
        "nom": "Best Seller USB-C PD 3.0 60W Fast Charging Data Cable (Type-C vers Type-C, gaine PVC + jacket nylon, en boîte, pour iPhone 15/16/16 Pro Max)",
        "variantes": "Longueur : 1 m ; couleur : options non affichées dans l'extraction ; marque OEM (private mold disponible : oui)",
        "materiaux": "PVC (gaine), nylon (jacket tressé), cuivre étamé (conducteur)",
        "dimensions": "Longueur : 1 m ; colis : 10 x 10 x 8 cm",
        "poids": "0,051 kg (poids brut unitaire)",
        "categorie": "Fast Charging Cable — Type-C vers Type-C (catégorie Alibaba : chargeurs et adaptateurs, #1 le plus populaire)",
        "informations_fournisseur": "Shenzhen Aibo Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — 6 ans d'activité ; Custom Manufacturer ; #1 le plus populaire dans la catégorie chargeurs/adaptateurs ; note boutique 4,5/5 (1 522 avis) ; 190+ unités vendues sur ce produit (note produit 5,0/5, 1 avis) ; réponse <= 2h ; on-time delivery >= 95 % ; taux de recompra 10 % ; personnalisation partielle et sur dessin ; promotion en cours : -10 % dès le 1er septembre, livraison gratuite à partir de $20. ID Alibaba : 251861674",
        "description": "Câble de données et de charge rapide USB-C PD 3.0 60W, Type-C vers Type-C, gaine PVC avec jacket nylon tressé pour la durabilité, conducteur en cuivre étamé, blindage tressé, charge rapide 3A, compatible iPhone 15/16/16 Pro Max et téléphones mobiles. Emballage en boîte. Le vendeur déclare que le produit dispose des certifications requises dans les pays applicables.",
        "lien_1": "https://www.alibaba.com/product-detail/Best-Seller-USB-C-PD-3_1601573247537.html",
        "prix_fournisseur": 0.55,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hcf9e16de21cb49ecaa733d7560aec1efT.jpg"
        ],
        "stock_disponible": 0,
        "moq": 10,
        "fournisseur": "Shenzhen Aibo Technology Co., Ltd.",
        "supplierId": "251861674"
    },

    {
        "nom": "High Quality Type-C to USB 3.0 Fast Charging Cable — Shielding TPE Jacket (S8/S9 Plus, iPhone, ordinateur, caméra, écouteurs)",
        "variantes": "Connecteurs : Type-C, USB 2.0, USB 3.0 ; longueur : 1 m ; modèle 05",
        "materiaux": "TPE (gaine), cuivre composite (conducteur), feuille d'aluminium (blindage)",
        "dimensions": "Longueur : 1 m ; colis : 5 x 1 x 1 cm",
        "poids": "0,03 kg (poids brut unitaire)",
        "categorie": "Data Cables (câbles de données)",
        "informations_fournisseur": "Jiangxi Angeli Wire Co., Ltd. (Ganzhou, Jiangxi, Chine) — fondée en 2023 ; Custom Manufacturer certifié (Onsite Check Alibaba, Trade Assurance) ; note 4,7/5 (46 avis) ; 2 340+ unités vendues ; on-time dispatch 98,6 % ; réponse <= 1h ; revenu en ligne US$10 000+ ; 101-200 employés ; 8 530 m² ; certification RoHS ; marchés : Amérique du Nord/Sud, Europe de l'Est, Asie du Sud-Est, Afrique ; produits : câbles USB, chargeurs, power banks. ID Alibaba : 292003561",
        "description": "Câble de charge rapide 3A Type-C vers USB 3.0, gaine TPE flexible et blindage en feuille d'aluminium contre les interférences électromagnétiques. Compatible caméras, ordinateurs, écouteurs, smartphones (Android/iPhone), banques d'alimentation, tablettes et montres connectées.",
        "lien_1": "https://www.alibaba.com/product-detail/High-Quality-Type-C-to-USB_1601652646082.html",
        "prix_fournisseur": 0.26,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H40385fdf91f944f68b18c5d1e1139d993.jpg"
        ],
        "stock_disponible": 0,
        "moq": 20,
        "fournisseur": "Jiangxi Angeli Wire Co., Ltd.",
        "supplierId": "292003561"
    },
    
    {
        "nom": "MFI Factory Certificate 1m/2m/3m 20W USB C to MFI Type C PD Fast Charging Cable for iPhone 11 12 13 14 15 16 Pro Max",
        "variantes": "Longueurs : 1 m (3,28 ft), 2 m (6,56 ft), 3 m ; couleur : blanc ; marque INGZOOM ; modèle HJ-01",
        "materiaux": "PVC/TPE (gaine), cuivre pur (conducteur)",
        "dimensions": "Longueurs : 1 m / 2 m / 3 m ; colis : 5 x 5 x 1 cm",
        "categorie": "USB Cable for iPhone",
        "poids": "0,02 kg (poids brut unitaire)",
        "informations_fournisseur": "Dongguan Yingzhongcheng Electronic Co., Ltd. (Dongguan, Guangdong, Chine) — fondée en 2019 (5 ans) ; Custom Manufacturer (Trade Assurance) ; note 4,6/5 (677 avis) ; 2 377+ unités vendues ; on-time dispatch 93,9 % ; réponse <= 7h ; revenu en ligne US$90 000+ ; 3 500 m² ; certifications : MFi (Apple), IEC 62368, EMC, RoHS, vérifiée par TÜV Rheinland ; marchés : USA, UK, Australie",
        "description": "Câble de charge rapide 20W certifié MFi (Apple), conducteur en cuivre pur pour durabilité et conductivité, compatible iPhone 11 à 16 Pro Max. Charge rapide 3A / Power Delivery 20W. Emballage : boîte en papier blanc.",
        "lien_1": "https://www.alibaba.com/product-detail/MFI-Factory-Certificate-1m-2m-3m_1600538620089.html",
        "prix_fournisseur": 0.68,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H719d1558369a48d1ae984756de50b779o.png",
            "https://s.alicdn.com/@sc04/kf/H7f47089dc64d4354aae972f80f33cab3c.jpg",
            "https://s.alicdn.com/@sc04/kf/H2def6abea4c8416ab47447bf077c3d887.png"
        ],
        "stock_disponible": 0,
        "moq": 10,
        "fournisseur": "Dongguan Yingzhongcheng Electronic Co., Ltd.",
        "supplierId": "yzcables"
    },
    
    {
        "nom": "1M 2M 60W Braided Charger Cable Type C to Type C (pour iPhone 15 / 15 Pro Max, ordinateurs portables)",
        "variantes": "Longueurs : 1 m, 2 m ; marque ORPHIE ; modèle OR0-A1068 ; personnalisation : logo (min. 500 pcs), emballage (min. 10 pcs), longueur (min. 300 pcs)",
        "materiaux": "Nylon (tressage), TPE, PVC, cuivre étamé et cuivre pur (conducteur), alliage d'aluminium",
        "dimensions": "Longueurs : 1 m / 2 m ; colis : 5 x 5 x 5 cm",
        "categorie": "Type C to Type C Cable",
        "poids": "25 g (poids net) ; 0,022 kg (poids brut unitaire)",
        "informations_fournisseur": "Shenzhen Oufei'er Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — 7 ans Gold Supplier (12 ans dans l'industrie) ; Custom Manufacturer (Trade Assurance) ; note 4,4/5 (4 454 avis) ; 29 724+ unités vendues ; on-time dispatch 95 % ; réponse <= 2h ; revenu en ligne US$200 000+ ; 109 employés ; 4 300 m² ; garantie 6 mois ; badge « Certified » ; #1 le plus populaire dans sa catégorie ; catégories : chargeurs, câbles, écouteurs",
        "description": "Câble de charge et de données tressé nylon 60W (5A), Type-C vers Type-C, optimisé pour iPhone 15 / 15 Pro Max et ordinateurs portables. Charge rapide + transfert de données, gaine résistante à la flexion.",
        "lien_1": "https://www.alibaba.com/product-detail/1M-2M-60W-Braided-Charger-Cable_1600952063877.html",
        "prix_fournisseur": 0.66,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H121c31a460f24649b4c88595cdd20821Q.png",
            "https://s.alicdn.com/@sc04/kf/He4e5c97d7008450aa05bd64544891c4aq.jpg",
            "https://s.alicdn.com/@sc04/kf/H5c3ae58f057949f8b245c0ba2bccc7e4M.jpg"
        ],
        "stock_disponible": 0,
        "moq": 2,
        "fournisseur": "Shenzhen Oufei'er Technology Co., Ltd.",
        "supplierId": "246999273"
    },
    
    {
        "nom": "High Quality USB Type-C Cable — câble USB vers Type-C, charge rapide 5A/6A et transfert de données (connecteur USB 3.0)",
        "variantes": "Longueurs : 1 m / 2 m (personnalisables) ; couleur : noir (personnalisable) ; connecteur USB 3.0 nickelé ; OEM/ODM et moule privé disponibles",
        "materiaux": "PVC/TPE (gaine), cuivre pur (conducteur), blindage tressé",
        "dimensions": "Longueur : 1 à 2 m (personnalisable)",
        "categorie": "USB Cable — câble de charge rapide Type-C (USB Data Charger Cable)",
        "poids": "Non disponible",
        "informations_fournisseur": "Dongguan Yilian Photoelectric Technology Co., Ltd. (Dongguan, Guangdong, Chine) — fondée en 2020 ; fabricant et négociant (Combined) ; fournisseur Vérifié Alibaba (catégorie vérifiée) ; note produit 4,8/5 (236 avis) ; taux de réponse 99,8 % (réponse ~1h) ; certifications : CE, RoHS, FCC, EMC, UKCA ; port d'export : Shenzhen ; principaux produits : câbles HDMI, fibre optique, Type-C, Starlink. ID Alibaba : 280891666",
        "description": "Câble USB vers Type-C de charge rapide 5A/6A avec transfert de données, conducteur en cuivre pur, gaine PVC/TPE, blindage tressé, connecteur USB 3.0 nickelé. Certifications CE, RoHS, FCC. Statut produit déclaré : en stock. Compatible téléphones mobiles, ordinateurs, Android, banques d'alimentation, tablettes.",
        "lien_1": "https://www.alibaba.com/product-detail/High-Quality-USB-Type-C-Cable_1601275333243.html",
        "prix_fournisseur": 0.39,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hab67e88841c945e9843264e1270f0664r.jpg"
        ],
        "stock_disponible": 0,
        "moq": 1,
        "fournisseur": "Dongguan Yilian Photoelectric Technology Co., Ltd.",
        "supplierId": "280891666"
    },
    
    {
        "nom": "4 in 1 65W/27W PD Multi-function Charging Cable, 1m, Nylon Braided, USB A/USB C, Fast Charging for Laptop, 480Mbps",
        "variantes": "Couleur affichée : jaune ; options de packages : câble seul ou chargeur + câble ; marque CS ; modèle CSDATACHARGINGCABLE",
        "materiaux": "Nylon (gaine tressée)",
        "dimensions": "Longueur : 1 m ; colis : 17 x 8 x 3 cm",
        "categorie": "4 in 1 Cable",
        "poids": "0,07 kg (poids brut unitaire)",
        "informations_fournisseur": "Dongguan CS Electronic Technology Co., Limited (Dongguan, Guangdong, Chine) — fondée en 2022 (3 ans) ; Custom Manufacturer (Onsite Check Alibaba, Trade Assurance) ; note 4,5/5 (50 avis) ; on-time dispatch 100 % ; réponse <= 4h ; 51-100 employés ; 3 000-5 000 m² ; valeur de production US$10-50 millions ; pièces de rechange gratuites et support technique en ligne ; produits : câbles audio/vidéo, Type-C, HDMI, USB, DisplayPort. ID Alibaba : 285536055",
        "description": "Câble de charge multifonction 4-en-1 (USB-A / USB-C vers Type-C / Lightning), puissance 65W pour ordinateurs portables et 27W pour autres appareils, transfert de données 480 Mbps, protection contre les courts-circuits, gaine nylon tressé anti-nœuds. Compatible laptop, Android, AirPods, Switch.",
        "lien_1": "https://www.alibaba.com/product-detail/4-in-1-65W-27W-PD_1601429621518.html",
        "prix_fournisseur": 1.38,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H44e03af2ac3743889038cede35898843e.jpg"
        ],
        "stock_disponible": 0,
        "moq": 100,
        "fournisseur": "Dongguan CS Electronic Technology Co., Limited",
        "supplierId": "285536055"
    },
    
    {
        "nom": "Best Seller USB-C PD 3.0 60W Fast Charging Data Cable (Type-C vers Type-C, gaine PVC + jacket nylon, en boîte, pour iPhone 15/16/16 Pro Max)",
        "variantes": "Longueur : 1 m ; couleur : options non affichées dans l'extraction ; marque OEM (private mold disponible : oui)",
        "materiaux": "PVC (gaine), nylon (jacket tressé), cuivre étamé (conducteur)",
        "dimensions": "Longueur : 1 m ; colis : 10 x 10 x 8 cm",
        "categorie": "Fast Charging Cable — Type-C vers Type-C (catégorie Alibaba : chargeurs et adaptateurs, #1 le plus populaire)",
        "poids": "0,051 kg (poids brut unitaire)",
        "informations_fournisseur": "Shenzhen Aibo Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — 6 ans d'activité ; Custom Manufacturer ; #1 le plus populaire dans la catégorie chargeurs/adaptateurs ; note boutique 4,5/5 (1 522 avis) ; 190+ unités vendues sur ce produit (note produit 5,0/5, 1 avis) ; réponse <= 2h ; on-time delivery >= 95 % ; taux de recompra 10 % ; personnalisation partielle et sur dessin ; promotion en cours : -10 % dès le 1er septembre, livraison gratuite à partir de $20. ID Alibaba : 251861674",
        "description": "Câble de données et de charge rapide USB-C PD 3.0 60W, Type-C vers Type-C, gaine PVC avec jacket nylon tressé pour la durabilité, conducteur en cuivre étamé, blindage tressé, charge rapide 3A, compatible iPhone 15/16/16 Pro Max et téléphones mobiles. Emballage en boîte. Le vendeur déclare que le produit dispose des certifications requises dans les pays applicables.",
        "lien_1": "https://www.alibaba.com/product-detail/Best-Seller-USB-C-PD-3_1601573247537.html",
        "prix_fournisseur": 0.55,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hcf9e16de21cb49ecaa733d7560aec1efT.jpg"
        ],
        "stock_disponible": 0,
        "moq": 10,
        "fournisseur": "Shenzhen Aibo Technology Co., Ltd.",
        "supplierId": "251861674"
    },
    
    {
        "nom": "High Quality Type-C to USB 3.0 Fast Charging Cable — Shielding TPE Jacket (S8/S9 Plus, iPhone, ordinateur, caméra, écouteurs)",
        "variantes": "Connecteurs : Type-C, USB 2.0, USB 3.0 ; longueur : 1 m ; modèle 05",
        "materiaux": "TPE (gaine), cuivre composite (conducteur), feuille d'aluminium (blindage)",
        "dimensions": "Longueur : 1 m ; colis : 5 x 1 x 1 cm",
        "categorie": "Data Cables (câbles de données)",
        "poids": "0,03 kg (poids brut unitaire)",
        "informations_fournisseur": "Jiangxi Angeli Wire Co., Ltd. (Ganzhou, Jiangxi, Chine) — fondée en 2023 ; Custom Manufacturer certifié (Onsite Check Alibaba, Trade Assurance) ; note 4,7/5 (46 avis) ; 2 340+ unités vendues ; on-time dispatch 98,6 % ; réponse <= 1h ; revenu en ligne US$10 000+ ; 101-200 employés ; 8 530 m² ; certification RoHS ; marchés : Amérique du Nord/Sud, Europe de l'Est, Asie du Sud-Est, Afrique ; produits : câbles USB, chargeurs, power banks. ID Alibaba : 292003561",
        "description": "Câble de charge rapide 3A Type-C vers USB 3.0, gaine TPE flexible et blindage en feuille d'aluminium contre les interférences électromagnétiques. Compatible caméras, ordinateurs, écouteurs, smartphones (Android/iPhone), banques d'alimentation, tablettes et montres connectées.",
        "lien_1": "https://www.alibaba.com/product-detail/High-Quality-Type-C-to-USB_1601652646082.html",
        "prix_fournisseur": 0.26,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H40385fdf91f944f68b18c5d1e1139d993.jpg"
        ],
        "stock_disponible": 0,
        "moq": 20,
        "fournisseur": "Jiangxi Angeli Wire Co., Ltd.",
        "supplierId": "292003561"
    },
    
    {
        "nom": "Hot Selling Gasoline Direct Drive Walking Tractor with Trailer Plow Harrow Electric Start Low MOQ for Orchard Distributor Supply",
        "variantes": "Modèle YK105G-G-M ; couleurs : rouge, vert, noir, argent, blanc ; accessoires (remorque, charrue, herse) : à sélectionner",
        "materiaux": "Non disponible",
        "dimensions": "1000 × 550 × 780 mm",
        "categorie": "Motoculteur (Farm Cultivator / Tiller) — Machinerie agricole",
        "poids": "110 kg",
        "informations_fournisseur": "Youkexin (Chongqing) Industrial Technology Co., Ltd. — fournisseur vérifié (Verified Supplier, Gold Supplier) ; société de négoce ; établie ≈2025/2026 ; Chongqing, Chine ; 7 employés ; 0 avis ; 0 commande sur 90 jours ; taux de réponse 100 % ; temps de réponse ≤ 1 h ; certification produit : CE ; garantie 1 an",
        "description": "Motoculteur / tracteur à conducteur marchant à essence (4,0 kW / 3600 tr/min, cylindrée 210 ml, réservoir 3,6 L) ; démarrage électrique ; transmission directe ; largeur de travail 1050 mm ; profondeur de travail ≥ 100 mm ; lame Ø 300 mm ; boîte de vitesses -1/0/1/2 ; consommation ≤ 374 g/kW·h ; rapport d'essai machine fourni ; garantie 1 an. (Description synthétisée à partir des caractéristiques techniques — aucune description narrative publiée par le fournisseur.)",
        "lien_1": "https://www.alibaba.com/product-detail/Hot-Selling-Gasoline-Direct-Drive-Walking_1601909252323.html",
        "prix_fournisseur": 266.25,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H861524a73dec44ebadab5dc00b4dff4cN.png"
        ],
        "stock_disponible": 0,
        "moq": 1,
        "fournisseur": "Youkexin (Chongqing) Industrial Technology Co., Ltd.",
        "supplierId": "293042162"
    },
    
    {
        "nom": "Quick Charge 20W PD Type C Wall Plug With C to C Sync Data Transfer Cable Kit Retail Box Set for Outdoor Camping Adventure",
        "variantes": "Bundle : chargeur + câble ; norme de prise : US/EU ; couleur : non précisée sur la page",
        "materiaux": "PC ignifuge (boîtier), ABS+PC",
        "dimensions": "Colis unitaire : 15 × 15 × 12 cm",
        "categorie": "Chargeur mural USB / adaptateur universel (Fast Charger / Universal Adapter) — Consommables électroniques",
        "poids": "0,5 kg (poids brut unitaire)",
        "informations_fournisseur": "Shenzhen Evolve Electronic Technology Co., Ltd. (Shenzhen, Guangdong, Chine) — Gold Supplier 1 an ; société mixte fabricant/négociant ; note boutique 5,0/5 (13 avis) ; taux de réponse 99,39 % ; temps de réponse ≤ 2 h ; expédition à temps ≥ 96 % ; taux de réachat 15 % ; certification produit : CE + déclaration de conformité ; marchés principaux : États-Unis, Australie, Cambodge, Japon, Canada ; ID Alibaba : 292519620",
        "description": "Chargeur mural universel PD 20 W (12 W/20 W) avec port USB/Type-C et câble Type-C vers Type-C de transfert de données inclus, en coffret retail. Entrée 100-240 V/0,5 A, protocole PD 3.0, protection ignifuge. Marque EVOLVE, modèle K25-GB, origine Chine. Sortie PD+QC3.0 (personnalisable). Service : design personnalisé en 3 jours, échantillon personnalisé en 7 jours. Remise -10 % affichée (prix le plus bas sur 180 jours). (Description synthétisée à partir des caractéristiques techniques — aucune description narrative publiée par le fournisseur.)",
        "lien_1": "https://www.alibaba.com/product-detail/Quick-Charge-20w-Pd-Type-C_1601853283799.html",
        "prix_fournisseur": 1.78,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H97d6e22d178d44a3a711788de08a694bZ.png"
        ],
        "stock_disponible": 0,
        "moq": 2,
        "fournisseur": "Shenzhen Evolve Electronic Technology Co., Ltd.",
        "supplierId": "292519620"
    },
    
    {
        "nom": "UK 65W PD 3.0 Fast Charger 2C+1A 3 Ports Wall Plug Type-C Cable Combo Set Fireproof for Mobile Phone",
        "variantes": "Bundle : chargeur + câble Type-C ; prise : UK ; couleur : comme illustré (non détaillée)",
        "materiaux": "ABS / PC anti-feu (boîtier)",
        "dimensions": "Colis unitaire : 15 × 7 × 4 cm",
        "categorie": "Chargeur mural USB (USB wall charger) — Consommables électroniques",
        "poids": "0,15 kg (poids brut unitaire)",
        "informations_fournisseur": "SKYLIGHT ELECTRONIC TECHNOLOGY (HK) CO., LIMITED (Hong Kong) — société de négoce (Trading Company), Gold Supplier 2 ans, vérifié Onsite Check (Trade Assurance) ; note boutique 4,5/5 (194 avis) ; taux de réponse 99,41 % ; temps de réponse ≤ 3 h ; expédition à temps ≥ 97 % ; taux de réachat 8 % ; 51-100 employés ; 1 000-3 000 m² ; valeur de production annuelle US$10-50 M ; fondée en 2013 selon le profil boutique (2024 selon le registre API) ; certification : CE, déclaration de conformité ; garantie 1 an ; marchés : Amérique du Nord, Afrique, Europe de l'Ouest, Asie du Sud-Est, Moyen-Orient ; ID Alibaba : 286351000",
        "description": "Chargeur mural 65 W PD 3.0 / QC4.0, 3 ports (2× Type-C + 1× USB-A), avec câble Type-C inclus (combo). Entrée 100-240 V/0,15 A, sortie 5 V/2 A. Protections : court-circuit, surtension, surintensité, surcharge, basse tension, ignifuge. Pliable et écologique. Marque SKYLIGHT, modèle SK-WP6, origine Guangdong, Chine. Échantillon disponible (3 $). Délai de production : 7 jours (1-1 000 pièces), négociable au-delà. 100 unités vendues ; certifié CE. (Description synthétisée à partir des caractéristiques techniques — aucune description narrative publiée par le fournisseur.)",
        "lien_1": "https://www.alibaba.com/product-detail/UK-65W-PD-3-0-Fast_1601908668684.html",
        "prix_fournisseur": 2.16,
        "images": [
            "https://s.alicdn.com/@sc04/kf/H855e64efb39f4118b32bb657d397e584T.jpg",
            "https://s.alicdn.com/@sc04/kf/H4910f9b97d4e4de283b6ad734939ecbbj.jpg",
            "https://s.alicdn.com/@sc04/kf/H21d8a853a31c47ec860f6bcd52e8b33d2.jpg",
            "https://s.alicdn.com/@sc04/kf/H9d48c638facf4304a163101744673c8fO.jpg",
            "https://s.alicdn.com/@sc04/kf/H865fb92cc91e41d7a37791364e628e29k.jpg",
            "https://s.alicdn.com/@sc04/kf/Hf37521d0a48f4474a31f7b1a423ad4a4F.jpg"
        ],
        "stock_disponible": 0,
        "moq": 20,
        "fournisseur": "SKYLIGHT ELECTRONIC TECHNOLOGY (HK) CO., LIMITED",
        "supplierId": "286351000"
    },

    {
        "nom": "Kit de charge rapide 20 W avec câbles Type-C et 8 broches pour iPhone 14 15 16 17 Pro Max, boîte cadeau de luxe (titre traduit de la version espagnole Alibaba)",
        "variantes": "Bundle : chargeur + câble + boîte d'emballage ; prise : Royaume-Uni ; couleur : blanc ; câbles Type-C et 8 broches (Lightning), longueur 1 m ; logo client possible (MOQ 1 000 sets)",
        "materiaux": "PC ignifuge (boîtier), TPE (gaine du câble)",
        "dimensions": "Colis unitaire : 18 × 15 × 6 cm",
        "categorie": "Kit chargeur mural 20 W + câbles (Fast Charger) — Consommables électroniques",
        "poids": "0,13 kg (poids brut unitaire)",
        "informations_fournisseur": "Shenzhen Zhihuang Electronic Co., Ltd. (Guangdong, Chine) — fabricant personnalisé (Custom Manufacturer), Gold Supplier 4 ans, vérifié par Intertek ; note boutique 4,7/5 (52 avis) ; temps de réponse ≤ 3 h ; expédition à temps 100 % ; 42 employés ; 1 085 m² ; 4 lignes de production ; 27 machines ; 9 ans d'expérience dans le secteur ; fondée en 2023 (registre API) ; certifications : CE, MFi ; services OEM/ODM, inspection des matières et du produit fini ; produit #3 des plus populaires dans la catégorie chargeurs/adaptateurs TPE ; 420 vendus ; ID Alibaba : 281045560",
        "description": "Kit de charge rapide 20 W (chargeur + câble Type-C + câble 8 broches) pour iPhone 14/15/16/17 Pro Max, livré avec boîte cadeau de luxe. Sorties : 5 V/3 A, 9 V/2,22 A, 12 V/1,67 A ; entrée : AC 110-240 V 50/60 Hz, 0,5 A max. Protocoles : QC2.0, QC3.0, PD 2.0, PD 3.0, FCP, SCP. Protection contre les courts-circuits, matériau PC ignifuge, prise rotative à 90°. Marque OEM/ODM, modèle WC0027, origine Guangdong, Chine. Personnalisation logo/dessin : à partir de 1 000 sets. Délai : 7 jours (1-500 sets), négociable au-delà. Livraison gratuite affichée jusqu'à un certain montant. (Description synthétisée à partir des caractéristiques techniques — page consultée en espagnol.)",
        "lien_1": "https://www.alibaba.com/product-detail/20W-Fast-Charge-Kit-with-Type_1601584879267.html",
        "prix_fournisseur": 12521,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hb9b024a8456d4628aa89983478cbc6ddV.jpg"
        ],
        "stock_disponible": 0,
        "moq": 100,
        "fournisseur": "Shenzhen Zhihuang Electronic Co., Ltd.",
        "supplierId": "281045560"
    },
    
    {
        "nom": "Hot Selling USB C 20W Charger & Cable Kits Combo for iPhone US EU Adapters Supports OEM Box Cardboard",
        "variantes": "Couleurs : blanc, noir ; prise : EU (autres normes en option) ; bundle : chargeur + câble ; personnalisation : emballage (à partir de 1 000 pcs) et norme de prise (à partir de 1 000 pcs)",
        "materiaux": "ABS (boîtier)",
        "dimensions": "Colis unitaire : 7,5 × 15 × 3 cm",
        "categorie": "Chargeur mural USB 20 W 2-en-1 avec câble (Multifunction Charger) — Consommables électroniques",
        "poids": "0,16 kg (poids brut unitaire)",
        "informations_fournisseur": "Abc (Shenzhen) Electronics Co., Ltd. (Shenzhen, Guangdong, Chine) — fabricant personnalisé (Custom Manufacturer), Gold Supplier 15 ans, vérifié par SGS (Supplier Assessment + Onsite Check) ; note boutique 4,8/5 (2 044 avis) ; temps de réponse ≤ 5 h ; expédition à temps 100 % ; taux de réachat 13 % ; 55 employés ; 2 000 m² ; 2 lignes de production ; 8 contrôleurs qualité ; fondée en 2011 ; 21 ans d'expérience export (travaille avec des grossistes Top 10 USA) ; certifications : CE, FCC, RoHS, déclaration de conformité ; 9 certificats, 1 brevet, 2 marques déposées ; revenu en ligne US$310 000+ ; marchés : Amérique du Nord, Moyen-Orient, Océanie, Amérique du Sud, Europe de l'Est ; #9 des plus populaires en chargeurs multifonctions (EU top-seller) ; 179 vendus ; ID Alibaba : 213643627",
        "description": "Chargeur mural USB-C 20 W avec câble inclus (combo), compatible iPhone 12 à 16 Pro. Entrée : 5 V/3 A, 9 V/2,2 A ; sortie : 9 V/2,2 A ; protocoles PD et QC3.0. Protections : court-circuit, surtension (OVP), surintensité, surcharge, basse tension, ignifuge. Matériau ABS durable, emballage boîte de marque (Brand Box Package). Marque MIUSB, modèle ABC-780, origine Guangdong, Chine. OEM/ODM bienvenus ; usine avec 19 ans d'expérience. Délai : 7 jours (1-100 pièces), négociable au-delà. Le vendeur déclare que le produit dispose des qualifications/licences requises dans certains pays applicables. (Description synthétisée à partir des caractéristiques techniques.)",
        "lien_1": "https://www.alibaba.com/product-detail/Hot-Selling-USB-C-20W-Charger_1601601313474.html",
        "prix_fournisseur": 2.08,
        "images": [
            "https://s.alicdn.com/@sc04/kf/Hd234baaf040e4f7db900c249bb44d01db.jpg"
        ],
        "stock_disponible": 0,
        "moq": 20,
        "fournisseur": "Abc (Shenzhen) Electronics Co., Ltd.",
        "supplierId": "213643627"
    }
]

    try:
        for index, data in enumerate(produits, start=1):
            try:
                nom = data.get("nom", "").strip()
                description = data.get("description", "")
                prix_fournisseur = float(
                    data.get("prix_fournisseur") or 0
                )
                stock_disponible = int(
                    data.get("stock_disponible") or 0
                )
                moq = int(
                    data.get("moq") or 0
                )
                fournisseur_id = data.get("fournisseur") or None
                lien_1 = data.get("lien_1", "")
                lien_2 = data.get("lien_2", "")
                
                if not nom:
                    raise ValueError(
                        "Le nom du produit est obligatoire"
                    )

                prix_vente = math.ceil(
                    prix_fournisseur * 1.25 / 10
                ) * 10
                image_urls = data.get("images") or []
                images = [
                    url.strip()
                    for url in image_urls
                    if isinstance(url, str) and url.strip()
                ]

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
                    images=json.dumps(images),
                )
                db.session.add(produit)
                produits_crees.append({
                    "nom": nom,
                    "prix_fournisseur": prix_fournisseur,
                    "prix_vente": prix_vente,
                    "moq": moq,
                    "images": images,
                    "produit_uid": produit.uid
                })

            except Exception as product_error:

                erreurs.append({
                    "index": index,
                    "nom": data.get("nom", ""),
                    "erreur": str(product_error)
                })
        db.session.commit()
        return jsonify({
            "status": "success",
            "message": f"{len(produits_crees)} produit(s) créé(s)",
            "produits_crees": produits_crees,
            "erreurs": erreurs
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



def CreateProduit1():
    try:
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
        files = request.files.getlist('images')
        files = [
                file for file in files
                if file and file.filename
            ]
        images = upload_to_cloudinary(files)
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
            images=json.dumps(images),
        )
        db.session.add(produit)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Produit créé avec succès",
            "produit_uid": produit.uid,
            "images": produit.images
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
            "lien_2": p.lien_2,
            "prix_vente": p.prix_vente, 
            "images": p.images, 
            "stock_disponible": p.stock_disponible, 
            "moq": p.moq, 
            "status": p.status, 
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
    try:
        produit_id = request.form.get('produit_id')
        # teller_id = request.form.get('teller_id')
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
        lien_2 = request.form.get('lien_2')
        
        produit.nom = nom
        produit.description = description
        produit.prix_fournisseur = prix_fournisseur
        produit.prix_vente = prix_vente
        produit.stock_disponible = stock_disponible
        produit.moq = moq
        produit.lien_1 = lien_1
        produit.lien_2 = lien_2
        
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
                    "fournisseur_id": product.fournisseur_id,
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
        # teller_id = data.get('teller_id')
        if not produit_id:
            return {
                "status": "error",
                "message": "Aucun produit sélectionné"
            }, 400
            
        produit = Produit.query.filter_by(
            uid=produit_id
        ).first()
        if not produit:
            return {
                "status": "error",
                "message": "Produit introuvable"
            }, 404

        commande_exist = Commande.query.filter_by(
            produit_id=produit_id
        ).first()
        if commande_exist:
            return {
                "status": "error",
                "message": "Impossible de supprimer ce produit (déjà utilisé dans des commandes)"
            }, 400

        images = []
        if produit.images:
            try:
                images = json.loads(produit.images)
            except Exception as e:
                print(
                    "Impossible de lire les images du produit :",
                    str(e)
                )
        if images:
            delete_cloudinary_images(images)

        db.session.delete(produit)
        db.session.commit()
        return {
            "status": "success",
            "message": "Produit et images supprimés avec succès"
        }, 200
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
                "lien_2": produit.lien_2,
                "prix_fournisseur": produit.prix_fournisseur,
                "prix_vente": produit.prix_vente,
                "images": produit.images,
                "stock_disponible": produit.stock_disponible,
                "moq": produit.moq,
                "fournisseur_id": produit.fournisseur_id,
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