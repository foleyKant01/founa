// src/pages/ProductPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CreateCommande,
} from "../../services/order.service";
import {
  GetSingleProduit,
  AllSimilarProducts,
} from "../../services/product.service";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Package,
  AlertCircle,
} from "lucide-react";

interface Product {
  uid: string;
  name: string;
  price: number;
  description: string;
  categorie: string;
  images: string[];
  stock: number;
}

interface SimilarProduct {
  id: number;
  uid: string;
  nom: string;
  description: string;
  prix_fournisseur: number;
  prix_vente: number;
  stock_disponible: number;
  moq: number;
  fournisseur_id: string;
  teller_id: string;
  images: string | string[];
}

/* =========================================================
   TOAST
========================================================= */

const Toast: React.FC<{
  message: string;
  type: "success" | "error" | "info";
}> = ({ message, type }) => {
  const colors = {
    success: "#00A884",
    error: "#D9534F",
    info: "#007BFF",
  };

  return (
    <div
      className="product-toast"
      style={{
        backgroundColor: colors[type],
      }}
    >
      {message}
    </div>
  );
};

/* =========================================================
   PAGE
========================================================= */

const ProductPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const nav = useNavigate();

  const [product, setProduct] = useState<Product>({
    uid: "",
    name: "",
    price: 0,
    description: "",
    categorie: "",
    images: [],
    stock: 0,
  });

  const [similarProducts, setSimilarProducts] =
    useState<SimilarProduct[]>([]);

  const [loadingProduct, setLoadingProduct] =
    useState(true);

  const [loadingSimilar, setLoadingSimilar] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const client_id = user.uid;

  /* =========================================================
     TOAST
  ========================================================= */

  const showToast = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  /* =========================================================
     IMAGE
  ========================================================= */

  const getFirstImage = (
    images?: string | string[]
  ): string => {
    if (!images) {
      return "/default-image.png";
    }

    let imgArray: string[] = [];

    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);

        if (Array.isArray(parsed)) {
          imgArray = parsed;
        }
      } catch {
        if (images.startsWith("http")) {
          return images;
        }
      }
    } else {
      imgArray = images;
    }

    return imgArray.length > 0
      ? imgArray[0]
      : "/default-image.png";
  };

  /* =========================================================
     CHARGEMENT PRODUIT
  ========================================================= */

  useEffect(() => {
    if (!uid) {
      setLoadingProduct(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoadingProduct(true);

        const res = await GetSingleProduit({
          produit_id: uid,
        });

        if (res.data.status !== "success") {
          console.error(
            "Erreur récupération produit :",
            res.data.message
          );

          return;
        }

        const data = res.data.produit;

        /* -------------------------
           Images
        ------------------------- */

        let imagesArray: string[] = [];

        try {
          if (typeof data.images === "string") {
            const parsed = JSON.parse(data.images);

            if (Array.isArray(parsed)) {
              imagesArray = parsed;
            }
          } else if (Array.isArray(data.images)) {
            imagesArray = data.images;
          }
        } catch (error) {
          console.error(
            "Erreur parsing images :",
            error
          );

          imagesArray = [];
        }

        /* -------------------------
           Produit
        ------------------------- */

        const currentProduct: Product = {
          uid: data.uid,
          name: data.nom,
          price: Number(data.prix_vente) || 0,
          description: data.description || "",
          categorie: data.categorie || "",
          images: imagesArray,
          stock:
            Number(data.stock_disponible) || 0,
        };

        setProduct(currentProduct);

        if (imagesArray.length > 0) {
          setSelectedImage(imagesArray[0]);
        }

        /* -------------------------
           Produits similaires
        ------------------------- */

        try {
          setLoadingSimilar(true);

          const similarResponse =
            await AllSimilarProducts({
              uid: data.uid,
              nom: data.nom || "",
              description: data.description || "",
              categorie: data.categorie || "",
            });

          if (
            similarResponse.data.status ===
            "success"
          ) {
            setSimilarProducts(
              similarResponse.data.products || []
            );
          } else {
            setSimilarProducts([]);
          }
        } catch (error) {
          console.error(
            "Erreur produits similaires :",
            error
          );

          setSimilarProducts([]);
        } finally {
          setLoadingSimilar(false);
        }
      } catch (error) {
        console.error(
          "Erreur récupération produit :",
          error
        );
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [uid]);

  /* =========================================================
     QUANTITE
  ========================================================= */

  const handleQtyChange = (
    newQty: number
  ) => {
    if (newQty < 1) return;

    if (newQty > product.stock) {
      return;
    }

    setQuantity(newQty);
  };

  /* =========================================================
     COMMANDE
  ========================================================= */

  const handleCreateCommande = async () => {
    if (!client_id) {
      showToast(
        "Veuillez vous connecter pour passer une commande",
        "error"
      );

      return;
    }

    if (!uid) {
      showToast(
        "Produit invalide",
        "error"
      );

      return;
    }

    if (product.stock <= 0) {
      showToast(
        "Ce produit est en rupture de stock",
        "error"
      );

      return;
    }

    try {
      const payload = {
        client_id: client_id,
        produit_id: uid,
        quantite: quantity,
        details: `Commande de ${quantity} x ${product.name}`,
      };

      const response =
        await CreateCommande(payload);

      if (
        response.data.status === "success"
      ) {
        showToast(
          "Commande envoyée avec succès !",
          "success"
        );

        setTimeout(() => {
          nav("/home");
        }, 2500);
      } else {
        showToast(
          response.data.message ||
            "Erreur lors de la commande",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Erreur création commande :",
        error
      );

      showToast(
        "Erreur serveur, veuillez réessayer",
        "error"
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loadingProduct) {
    return (
      <div className="product-page-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="product-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="product-header">

        <button
          className="back-button"
          onClick={() => nav("/home")}
        >
          <ChevronLeft size={20} />

          <span>
            Retour
          </span>
        </button>

        <img
          src="/logo-founa2.png"
          alt="FOUNA"
          className="product-logo"
        />

      </header>

      {/* =====================================================
          CONTENU PRINCIPAL
      ===================================================== */}

      <main className="product-container">

        {/* ===================================================
            PRODUIT PRINCIPAL
        =================================================== */}

        <section className="product-main">

          {/* =========================
              GALERIE
          ========================= */}

          <div className="gallery-section">

            <div className="main-image-wrapper">

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="main-product-image"
                />
              ) : (
                <img
                  src="/default-image.png"
                  alt={product.name}
                  className="main-product-image"
                />
              )}

              {product.stock <= 0 && (
                <span className="stock-badge">
                  Rupture de stock
                </span>
              )}

            </div>

            {product.images.length > 1 && (
              <div className="thumbnail-wrapper">

                {product.images.map(
                  (img, index) => (
                    <button
                      key={index}
                      className={
                        selectedImage === img
                          ? "thumbnail active"
                          : "thumbnail"
                      }
                      onClick={() =>
                        setSelectedImage(img)
                      }
                    >
                      <img
                        src={img}
                        alt={`Produit ${index + 1}`}
                      />
                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* =========================
              DETAILS
          ========================= */}

          <div className="details-section">

            {/* CATEGORIE */}

            {product.categorie && (
              <span className="category">
                {product.categorie}
              </span>
            )}

            {/* NOM */}

            <h1 className="product-title">
              {product.name}
            </h1>

            {/* PRIX */}

            <div className="price-section">

              <span className="product-price">
                {product.price.toLocaleString(
                  "fr-FR"
                )}{" "}
                FCFA
              </span>

            </div>

            {/* STOCK */}

            <div className="stock-info">

              <Package size={18} />

              <span>
                {product.stock > 0
                  ? `${product.stock} pièce${
                      product.stock > 1
                        ? "s"
                        : ""
                    } disponible${
                      product.stock > 1
                        ? "s"
                        : ""
                    }`
                  : "Produit indisponible"}
              </span>

            </div>

            <div className="separator" />

            {/* DESCRIPTION */}

            <div className="description-section">

              <h2>
                Description
              </h2>

              <div
                className={
                  isDescriptionExpanded
                    ? "description expanded"
                    : "description"
                }
              >
                {product.description ||
                  "Aucune description disponible pour ce produit."}
              </div>

              {product.description &&
                product.description.length >
                  180 && (
                  <button
                    className="description-button"
                    onClick={() =>
                      setIsDescriptionExpanded(
                        !isDescriptionExpanded
                      )
                    }
                  >
                    {isDescriptionExpanded
                      ? "Voir moins"
                      : "Voir plus"}

                    <ChevronDown
                      size={16}
                      className={
                        isDescriptionExpanded
                          ? "rotate"
                          : ""
                      }
                    />
                  </button>
                )}

            </div>

            {/* COMMANDE */}

            <div className="order-box">

              <div className="quantity-row">

                <span className="quantity-label">
                  Quantité
                </span>

                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      handleQtyChange(
                        quantity - 1
                      )
                    }
                    disabled={
                      quantity <= 1
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      handleQtyChange(
                        quantity + 1
                      )
                    }
                    disabled={
                      quantity >=
                      product.stock
                    }
                  >
                    <Plus size={16} />
                  </button>

                </div>

              </div>

              {/* INFORMATION */}

              <div className="order-info">

                <AlertCircle
                  size={19}
                />

                <p>
                  Choisissez simplement la
                  quantité souhaitée puis
                  cliquez sur{" "}
                  <strong>
                    « Passer commande »
                  </strong>
                  . Un conseiller Founa vous
                  contactera ensuite pour
                  finaliser les détails.
                </p>

              </div>

              {/* BOUTON */}

              <button
                className="order-button"
                onClick={
                  handleCreateCommande
                }
                disabled={
                  product.stock === 0
                }
              >
                <ShoppingBag
                  size={20}
                />

                {product.stock === 0
                  ? "Rupture de stock"
                  : "Passer commande"}
              </button>

            </div>

          </div>

        </section>

        {/* ===================================================
            PRODUITS SIMILAIRES
        =================================================== */}

        <section className="similar-section">

          <div className="similar-header">

            <div>
              <span className="section-kicker">
                DÉCOUVREZ AUSSI
              </span>

              <h2>
                Produits similaires
              </h2>
            </div>

          </div>

          {loadingSimilar ? (

            <div className="similar-loading">
              <div className="small-spinner" />
            </div>

          ) : similarProducts.length === 0 ? (

            <div className="similar-empty">
              <Package size={40} />

              <p>
                Aucun produit similaire
                trouvé.
              </p>
            </div>

          ) : (

            <div className="similar-grid">

              {similarProducts.map(
                (similarProduct) => (
                  <div
                    key={similarProduct.uid}
                    className="similar-card"
                    onClick={() =>
                      nav(
                        `/singleproduct/${similarProduct.uid}`
                      )
                    }
                  >

                    <div className="similar-image-wrapper">

                      <img
                        src={getFirstImage(
                          similarProduct.images
                        )}
                        alt={
                          similarProduct.nom
                        }
                        className="similar-image"
                      />

                    </div>

                    <div className="similar-content">

                      <p className="similar-name">
                        {
                          similarProduct.nom
                        }
                      </p>

                      <p className="similar-price">
                        {Number(
                          similarProduct.prix_vente
                        ).toLocaleString(
                          "fr-FR"
                        )}{" "}
                        FCFA
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .product-page {
          min-height: 100vh;
          width: 100%;
          background: #f5f7f8;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #1f2937;
          padding-bottom: 80px;
        }

        /* =====================================================
           LOADING
        ===================================================== */

        .product-page-loading {
          width: 100%;
          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #f5f7f8;
        }

        .loading-spinner {
          width: 46px;
          height: 46px;

          border:
            4px solid
            #dce8e8;

          border-top-color:
            #00a4a6;

          border-radius: 50%;

          animation:
            productSpin 0.8s
            linear infinite;
        }

        @keyframes productSpin {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .product-header {
          position: sticky;
          top: 0;
          z-index: 1000;

          width: 100%;
          height: 64px;

          background:
            #00a4a6;

          display: flex;
          align-items: center;

          padding:
            0 30px;

          box-shadow:
            0 2px 12px
            rgba(0, 0, 0, 0.10);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 5px;

          background: transparent;
          border: none;

          color: white;

          font-size: 14px;
          font-weight: 500;

          cursor: pointer;

          padding: 8px 4px;
        }

        .back-button:hover {
          opacity: 0.8;
        }

        .product-logo {
          position: absolute;

          left: 50%;

          transform:
            translateX(-50%);

          width: 75px;
          height: 45px;

          object-fit: contain;
        }

        /* =====================================================
           CONTAINER
        ===================================================== */

        .product-container {
          width: 100%;
          max-width: 1600px;

          margin:
            0 auto;

          padding:
            25px 30px;
        }

        /* =====================================================
           PRODUIT PRINCIPAL
        ===================================================== */

        .product-main {
          width: 100%;

          display: grid;

          grid-template-columns:
            minmax(0, 1.1fr)
            minmax(400px, 0.9fr);

          gap: 35px;

          background: #ffffff;

          border-radius: 18px;

          padding: 25px;

          box-shadow:
            0 5px 25px
            rgba(0, 0, 0, 0.05);
        }

        /* =====================================================
           GALERIE
        ===================================================== */

        .gallery-section {
          width: 100%;
          min-width: 0;
        }

        .main-image-wrapper {
          position: relative;

          width: 100%;

          height:
            min(600px, 55vw);

          min-height: 420px;

          background:
            #f7f8f8;

          border-radius: 14px;

          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-product-image {
          width: 100%;
          height: 100%;

          object-fit: contain;

          display: block;
        }

        .stock-badge {
          position: absolute;

          top: 15px;
          left: 15px;

          background:
            #dc3545;

          color: white;

          padding:
            7px 12px;

          border-radius: 7px;

          font-size: 12px;
          font-weight: 600;
        }

        /* =====================================================
           THUMBNAILS
        ===================================================== */

        .thumbnail-wrapper {
          display: flex;

          gap: 10px;

          overflow-x: auto;

          padding:
            14px 2px 3px;

          scrollbar-width: none;
        }

        .thumbnail-wrapper::-webkit-scrollbar {
          display: none;
        }

        .thumbnail {
          flex: 0 0 76px;

          width: 76px;
          height: 76px;

          padding: 0;

          background: #ffffff;

          border:
            2px solid
            #e1e5e5;

          border-radius: 9px;

          overflow: hidden;

          cursor: pointer;

          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .thumbnail:hover {
          transform:
            translateY(-2px);
        }

        .thumbnail.active {
          border-color:
            #00a4a6;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;
        }

        /* =====================================================
           DETAILS
        ===================================================== */

        .details-section {
          width: 100%;

          display: flex;
          flex-direction: column;

          padding:
            5px
            10px;
        }

        .category {
          display: inline-flex;

          align-self: flex-start;

          background:
            #e8f7f7;

          color:
            #008486;

          padding:
            6px 10px;

          border-radius: 6px;

          font-size: 11px;
          font-weight: 700;

          text-transform:
            uppercase;

          letter-spacing:
            0.5px;

          margin-bottom: 12px;
        }

        .product-title {
          margin: 0;

          color:
            #111827;

          font-size:
            clamp(22px, 2.2vw, 32px);

          line-height: 1.25;

          font-weight: 600;
        }

        .price-section {
          margin-top: 20px;
        }

        .product-price {
          color:
            #00a4a6;

          font-size:
            clamp(23px, 2.5vw, 31px);

          font-weight: 700;

          margin: 0;
        }

        .stock-info {
          display: flex;
          align-items: center;

          gap: 8px;

          color:
            #5f6b6b;

          font-size: 13px;

          margin-top: 12px;
        }

        .stock-info svg {
          color:
            #00a4a6;
        }

        .separator {
          width: 100%;
          height: 1px;

          background:
            #e9eded;

          margin:
            22px 0;
        }

        /* =====================================================
           DESCRIPTION
        ===================================================== */

        .description-section h2 {
          font-size: 17px;

          color:
            #222;

          margin:
            0 0 10px;

          font-weight: 600;
        }

        .description {
          color:
            #667070;

          font-size: 14px;

          line-height: 1.65;

          display:
            -webkit-box;

          -webkit-line-clamp: 5;

          -webkit-box-orient:
            vertical;

          overflow:
            hidden;
        }

        .description.expanded {
          display: block;

          overflow: visible;
        }

        .description-button {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 5px;

          width: 100%;

          border: none;

          background:
            transparent;

          color:
            #00a4a6;

          font-size: 13px;
          font-weight: 600;

          cursor: pointer;

          margin-top: 7px;

          padding: 4px;
        }

        .description-button svg {
          transition:
            transform 0.2s ease;
        }

        .description-button .rotate {
          transform:
            rotate(180deg);
        }

        /* =====================================================
           COMMANDE
        ===================================================== */

        .order-box {
          margin-top: 25px;

          padding: 18px;

          background:
            #f8faf9;

          border:
            1px solid
            #e5eeee;

          border-radius: 12px;
        }

        .quantity-row {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 15px;

          margin-bottom: 15px;
        }

        .quantity-label {
          font-size: 14px;

          font-weight: 600;

          color:
            #333;
        }

        .quantity-controls {
          display: flex;

          align-items: center;

          height: 40px;

          border:
            1px solid
            #d8e0e0;

          background:
            white;

          border-radius: 8px;

          overflow: hidden;
        }

        .quantity-controls button {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;

          background:
            #f5f7f7;

          color:
            #333;

          cursor: pointer;
        }

        .quantity-controls button:hover:not(:disabled) {
          background:
            #e8f6f6;

          color:
            #00a4a6;
        }

        .quantity-controls button:disabled {
          opacity: 0.35;

          cursor: not-allowed;
        }

        .quantity-controls span {
          width: 45px;

          text-align: center;

          font-size: 15px;
          font-weight: 600;
        }

        /* =====================================================
           INFO COMMANDE
        ===================================================== */

        .order-info {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          padding: 12px;

          margin-bottom: 15px;

          background:
            #fff9e8;

          border:
            1px solid
            #f1dda0;

          border-radius: 8px;

          color:
            #756323;
        }

        .order-info svg {
          flex-shrink: 0;

          margin-top: 1px;
        }

        .order-info p {
          margin: 0;

          font-size: 12px;

          line-height: 1.55;
        }

        /* =====================================================
           BOUTON
        ===================================================== */

        .order-button {
          width: 100%;

          min-height: 50px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          border: none;

          border-radius: 9px;

          background:
            #00a4a6;

          color: white;

          font-size: 15px;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .order-button:hover:not(:disabled) {
          background:
            #008f91;

          transform:
            translateY(-1px);
        }

        .order-button:disabled {
          background:
            #b7c1c1;

          cursor: not-allowed;
        }

        /* =====================================================
           PRODUITS SIMILAIRES
        ===================================================== */

        .similar-section {
          margin-top: 40px;
        }

        .similar-header {
          display: flex;

          align-items: flex-end;
          justify-content: space-between;

          margin-bottom: 18px;
        }

        .section-kicker {
          display: block;

          color:
            #00a4a6;

          font-size: 11px;

          font-weight: 700;

          letter-spacing:
            1px;

          margin-bottom: 5px;
        }

        .similar-header h2 {
          margin: 0;

          color:
            #1f2937;

          font-size: 23px;

          font-weight: 600;
        }

        .similar-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fill,
              minmax(
                180px,
                1fr
              )
            );

          gap: 16px;
        }

        .similar-card {
          min-width: 0;

          background:
            white;

          border-radius: 13px;

          overflow: hidden;

          cursor: pointer;

          box-shadow:
            0 3px 15px
            rgba(0, 0, 0, 0.05);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .similar-card:hover {
          transform:
            translateY(-4px);

          box-shadow:
            0 9px 25px
            rgba(0, 0, 0, 0.10);
        }

        .similar-image-wrapper {
          width: 100%;

          aspect-ratio: 1 / 1;

          background:
            #f5f6f6;

          overflow: hidden;
        }

        .similar-image {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          transition:
            transform 0.3s ease;
        }

        .similar-card:hover
        .similar-image {
          transform:
            scale(1.04);
        }

        .similar-content {
          padding:
            11px 12px 14px;
        }

        .similar-name {
          margin:
            0 0 7px;

          color:
            #333;

          font-size: 13px;

          line-height: 1.4;

          display:
            -webkit-box;

          -webkit-line-clamp: 2;

          -webkit-box-orient:
            vertical;

          overflow:
            hidden;

          min-height: 36px;
        }

        .similar-price {
          margin: 0;

          color:
            #00a4a6;

          font-size: 15px;

          font-weight: 700;
        }

        /* =====================================================
           LOADING SIMILAIRES
        ===================================================== */

        .similar-loading {
          min-height: 160px;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .small-spinner {
          width: 32px;
          height: 32px;

          border:
            3px solid
            #dce8e8;

          border-top-color:
            #00a4a6;

          border-radius: 50%;

          animation:
            productSpin 0.8s
            linear infinite;
        }

        .similar-empty {
          min-height: 160px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          color:
            #9ca3af;

          background:
            white;

          border-radius: 12px;

          border:
            1px dashed
            #d5dddd;
        }

        .similar-empty p {
          margin:
            10px 0 0;

          font-size: 14px;
        }

        /* =====================================================
           TOAST
        ===================================================== */

        .product-toast {
          position: fixed;

          top: 20px;
          left: 50%;

          transform:
            translateX(-50%);

          min-width: 280px;

          max-width: 90%;

          padding:
            13px 20px;

          color:
            white;

          border-radius: 8px;

          text-align: center;

          font-size: 14px;

          font-weight: 500;

          z-index: 9999;

          box-shadow:
            0 5px 20px
            rgba(0, 0, 0, 0.18);
        }

        /* =====================================================
           TABLETTE
        ===================================================== */

        @media (max-width: 1000px) {

          .product-container {
            padding:
              20px;
          }

          .product-main {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(
                340px,
                0.9fr
              );

            gap: 25px;

            padding: 20px;
          }

          .main-image-wrapper {
            min-height: 380px;

            height:
              48vw;
          }

          .similar-grid {
            grid-template-columns:
              repeat(
                4,
                minmax(0, 1fr)
              );
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {

          .product-page {
            padding-bottom: 40px;
          }

          .product-header {
            height: 58px;

            padding:
              0 12px;
          }

          .product-logo {
            width: 65px;
            height: 40px;
          }

          .back-button {
            font-size: 13px;
          }

          .product-container {
            padding:
              10px;
          }

          .product-main {
            display: block;

            padding: 0;

            border-radius: 12px;

            overflow: hidden;
          }

          .gallery-section {
            width: 100%;
          }

          .main-image-wrapper {
            width: 100%;

            height:
              100vw;

            min-height: 280px;

            max-height: 500px;

            border-radius: 0;
          }

          .thumbnail-wrapper {
            padding:
              10px;
          }

          .thumbnail {
            flex-basis: 62px;

            width: 62px;
            height: 62px;
          }

          .details-section {
            padding:
              20px 15px 18px;
          }

          .product-title {
            font-size: 21px;
          }

          .product-price {
            font-size: 23px;
          }

          .separator {
            margin:
              18px 0;
          }

          .order-box {
            padding: 14px;

            margin-top: 20px;
          }

          .similar-section {
            margin-top: 25px;
          }

          .similar-header h2 {
            font-size: 20px;
          }

          .similar-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 9px;
          }

          .similar-content {
            padding:
              9px 9px 11px;
          }

          .similar-name {
            font-size: 12px;

            min-height: 34px;
          }

          .similar-price {
            font-size: 14px;
          }

        }

        /* =====================================================
           PETIT TELEPHONE
        ===================================================== */

        @media (max-width: 380px) {

          .product-container {
            padding:
              7px;
          }

          .main-image-wrapper {
            min-height: 260px;
          }

          .details-section {
            padding:
              17px 12px;
          }

          .product-title {
            font-size: 19px;
          }

          .product-price {
            font-size: 21px;
          }

          .quantity-controls {
            height: 37px;
          }

          .quantity-controls button {
            width: 37px;
            height: 37px;
          }

          .quantity-controls span {
            width: 40px;
          }

        }

      `}</style>
    </div>
  );
};

export default ProductPage;