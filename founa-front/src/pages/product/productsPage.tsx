import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreateCommande } from "../../services/order.service";
import {
  GetSingleProduit,
  AllSimilarProducts,
} from "../../services/product.service";

import {
  ChevronDown,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  Package,
  AlertCircle,
} from "lucide-react";


declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      parameters?: Record<string, unknown>
    ) => void;
  }
}


interface Product {
  uid: string;
  name: string;
  price: number;
  description: string;
  categorie: string;
  images: string[];
  stock: number;
  moq: number;
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
    moq: 1,
  });

  const [similarProducts, setSimilarProducts] =
    useState<SimilarProduct[]>([]);

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);


useEffect(() => {
  if (!product.uid || !window.fbq) {
    return;
  }

  window.fbq("track", "ViewContent", {
    content_ids: [product.uid],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "XOF",
  });
}, [product.uid]);


  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const client_id = user.uid;

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

useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
  setLoadingProduct(true);
  setLoadingSimilar(false);
  setIsDescriptionExpanded(false);
  if (!uid) {
    setLoadingProduct(false);
    setLoadingSimilar(false);
    return;
  }

  const CACHE_KEY = `founa_product_${uid}`;
  let cancelled = false;

  const loadProduct = async () => {
    // 1. Vérifier le cache avant tout chargement
    try {
      const cachedData = sessionStorage.getItem(CACHE_KEY);

      if (cachedData) {
        const cached = JSON.parse(cachedData);

        if (cached.product?.uid === uid) {
          setProduct(cached.product);
          setSimilarProducts(cached.similarProducts || []);
          setSelectedImage(
            cached.selectedImage ||
              cached.product.images?.[0] ||
              ""
          );
          setQuantity(
            cached.quantity ?? cached.product.moq ?? 1
          );

          setLoadingProduct(false);
          setLoadingSimilar(false);
          return;
        }
      }
    } catch (error) {
      console.error("Erreur lecture cache produit :", error);
      sessionStorage.removeItem(CACHE_KEY);
    }

    // 2. Charger depuis l'API seulement si le cache est absent
    setLoadingProduct(true);
    setLoadingSimilar(false);

    try {
      const res = await GetSingleProduit({
        produit_id: uid,
      });

      if (cancelled) return;

      if (res.data.status !== "success") {
        console.error(
          "Erreur récupération produit :",
          res.data.message
        );
        setLoadingProduct(false);
        return;
      }

      const data = res.data.produit;

      // Convertir les images en tableau
      let imagesArray: string[] = [];

      try {
        if (typeof data.images === "string") {
          const parsed = JSON.parse(data.images);

          if (Array.isArray(parsed)) {
            imagesArray = parsed;
          } else if (data.images.startsWith("http")) {
            imagesArray = [data.images];
          }
        } else if (Array.isArray(data.images)) {
          imagesArray = data.images;
        }
      } catch {
        if (typeof data.images === "string" &&
            data.images.startsWith("http")) {
          imagesArray = [data.images];
        }
      }

      const moq = Number(data.moq) || 1;
      const stock = Number(data.stock_disponible) || 0;

      const currentProduct: Product = {
        uid: data.uid,
        name: data.nom || "",
        price: Number(data.prix_vente) || 0,
        description: data.description || "",
        categorie: data.categorie || "",
        images: imagesArray,
        stock,
        moq,
      };

      if (cancelled) return;

      setProduct(currentProduct);

      const initialImage = imagesArray[0] || "";
      setSelectedImage(initialImage);
      setQuantity(stock >= moq ? moq : 0);
      setLoadingProduct(false);

      // 3. Charger les produits similaires
      setLoadingSimilar(true);

      let currentSimilarProducts: SimilarProduct[] = [];

      try {
        const similarResponse = await AllSimilarProducts({
          uid: data.uid,
          nom: data.nom || "",
          description: data.description || "",
          categorie: data.categorie || "",
        });

        if (cancelled) return;

        if (similarResponse.data.status === "success") {
          currentSimilarProducts =
            similarResponse.data.products || [];
        }
      } catch (error) {
        console.error(
          "Erreur produits similaires :",
          error
        );
      } finally {
        if (!cancelled) {
          setSimilarProducts(currentSimilarProducts);
          setLoadingSimilar(false);

          // 4. Sauvegarder la fiche et ses produits similaires
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              product: currentProduct,
              similarProducts: currentSimilarProducts,
              selectedImage: initialImage,
              quantity: stock >= moq ? moq : 0,
            })
          );
        }
      }
    } catch (error) {
      if (!cancelled) {
        console.error(
          "Erreur récupération produit :",
          error
        );
        setLoadingProduct(false);
      }
    }
  };

  loadProduct();

  return () => {
    cancelled = true;
  };
}, [uid]);

  const handleQtyChange = (newQty: number) => {
    if (newQty < product.moq) {
      return;
    }

    if (newQty > product.stock) {
      return;
    }

    setQuantity(newQty);
  };

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

    if (product.stock < product.moq) {
      showToast(
        `Stock insuffisant pour respecter le MOQ de ${product.moq} unités`,
        "error"
      );

      return;
    }

    if (quantity < product.moq) {
      showToast(
        `La quantité minimale est de ${product.moq} unités`,
        "error"
      );

      return;
    }

    if (quantity > product.stock) {
      showToast(
        "La quantité demandée dépasse le stock disponible",
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

      
      if (response.data.status === "success") {
        if (window.fbq) {
          window.fbq("trackCustom", "OrderCreated", {
            content_ids: [uid],
            content_name: product.name,
            content_type: "product",
            value: product.price * quantity,
            currency: "XOF",
            quantity: quantity,
          });
        }

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

  const isOrderUnavailable =
    product.stock <= 0 ||
    product.stock < product.moq;

  
  if (loadingProduct) {
    return (
      <div className="product-page-loading">
        <div className="loading-spinner-large" />
        <p>Chargement du produit...</p>
      </div>
    );
  }


  return (
    <div className="product-page">

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

      <main className="product-container">

        <section className="product-main">

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

              {product.stock > 0 &&
                product.stock < product.moq && (
                  <span className="stock-badge">
                    Stock inférieur au MOQ
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

          <div className="details-section">

            {product.categorie && (
              <span className="category">
                {product.categorie}
              </span>
            )}

            <h1 className="product-title">
              {product.name}
            </h1>

            <div className="price-section">

              <span className="product-price">
                {product.price.toLocaleString(
                  "fr-FR"
                )}{" "}
                FCFA
              </span>

              <div className="product-moq">

                <Package size={15} />

                <span>
                  MOQ :{" "}
                  <strong>
                    {product.moq.toLocaleString(
                      "fr-FR"
                    )}
                  </strong>{" "}
                  {product.moq > 1
                    ? "unités minimum"
                    : "unité minimum"}
                </span>

              </div>

            </div>

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

            <div className="order-box">

              <div className="quantity-row">

                <div>
                  <span className="quantity-label">
                    Quantité
                  </span>

                  <span className="quantity-minimum">
                    Minimum :{" "}
                    {product.moq.toLocaleString(
                      "fr-FR"
                    )}{" "}
                    {product.moq > 1
                      ? "unités"
                      : "unité"}
                  </span>
                </div>

                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      handleQtyChange(
                        quantity - 1
                      )
                    }
                    disabled={
                      quantity <= product.moq ||
                      isOrderUnavailable
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
                      quantity >= product.stock ||
                      isOrderUnavailable
                    }
                  >
                    <Plus size={16} />
                  </button>

                </div>

              </div>

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

              <button
                className="order-button"
                onClick={
                  handleCreateCommande
                }
                disabled={
                  isOrderUnavailable ||
                  quantity < product.moq
                }
              >
                <ShoppingBag
                  size={20}
                />

                {product.stock === 0
                  ? "Rupture de stock"
                  : product.stock < product.moq
                  ? "Stock insuffisant pour le MOQ"
                  : "Passer commande"}
              </button>

            </div>

          </div>

        </section>

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

              <span>
                Chargement des produits similaires...
              </span>

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

                      <div className="similar-moq">

                        <Package size={13} />

                        <span>
                          MOQ{" "}
                          {Number(
                            similarProduct.moq
                          ) || 1}
                        </span>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </section>

      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

      <style>{`

        * {
          box-sizing: border-box;
        }

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

        
/* Chargement plein écran */
.product-page-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;

  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 15px;

  background: #f5f7f8;
  font-family: Arial, Helvetica, sans-serif;
}

/* Cercle animé */
.product-page-loading .loading-spinner-large {
  width: 45px;
  height: 45px;

  border: 4px solid #dfe7e7;
  border-top-color: #00a4a6;

  border-radius: 50%;

  animation: productLoadingSpin 0.8s linear infinite;
  flex-shrink: 0;
}

.product-page-loading p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
}

@keyframes productLoadingSpin {
  to {
    transform: rotate(360deg);
  }
}


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
            rgba(
              0,
              0,
              0,
              0.10
            );
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 5px;

          background:
            transparent;

          border: none;

          color: white;

          font-size: 14px;

          font-weight: 500;

          cursor: pointer;

          padding:
            8px 4px;
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

        .product-container {
          width: 100%;
          max-width: 1600px;

          margin:
            0 auto;

          padding:
            25px 30px;
        }

        .product-main {
          width: 100%;

          display: grid;

          grid-template-columns:
            minmax(
              0,
              1.1fr
            )
            minmax(
              400px,
              0.9fr
            );

          gap: 35px;

          background:
            #ffffff;

          border-radius: 18px;

          padding: 25px;

          box-shadow:
            0 5px 25px
            rgba(
              0,
              0,
              0,
              0.05
            );
        }

        .gallery-section {
          width: 100%;
          min-width: 0;
        }

        .main-image-wrapper {
          position: relative;

          width: 100%;

          height:
            min(
              600px,
              55vw
            );

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
          flex:
            0 0 76px;

          width: 76px;
          height: 76px;

          padding: 0;

          background:
            #ffffff;

          border:
            2px solid
            #e1e5e5;

          border-radius: 9px;

          overflow: hidden;

          cursor: pointer;

          transition:
            border-color
            0.2s ease,
            transform
            0.2s ease;
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

        .details-section {
          width: 100%;

          display: flex;

          flex-direction: column;

          padding:
            5px 10px;
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
            clamp(
              22px,
              2.2vw,
              32px
            );

          line-height: 1.25;

          font-weight: 550;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }

        .price-section {
          margin-top: 20px;
        }

        .product-price {
          color:
            #00a4a6;

          font-size:
            clamp(
              23px,
              2.5vw,
              31px
            );

          font-weight: 700;

          margin: 0;
        }

        .product-moq {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          margin-top: 8px;

          padding:
            5px 9px;

          width: fit-content;

          background:
            #eefafa;

          border:
            1px solid
            rgba(
              0,
              164,
              166,
              0.15
            );

          border-radius: 7px;

          color:
            #007f81;

          font-size: 11px;

          font-weight: 600;

          line-height: 1.3;

          transition:
            background
            0.2s ease,
            border-color
            0.2s ease,
            transform
            0.2s ease;
        }

        .product-moq svg {
          color:
            #00a4a6;

          flex-shrink: 0;
        }

        .product-moq strong {
          font-weight: 800;

          color:
            #006f71;
        }

        .product-moq:hover {
          background:
            #e4f7f7;

          border-color:
            rgba(
              0,
              164,
              166,
              0.28
            );

          transform:
            translateY(-1px);
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
            transform
            0.2s ease;
        }

        .description-button .rotate {
          transform:
            rotate(180deg);
        }

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

        .quantity-minimum {
          display: block;

          margin-top: 4px;

          color:
            #7b8787;

          font-size: 10px;

          font-weight: 500;
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
            background
            0.2s ease,
            transform
            0.2s ease;
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
            rgba(
              0,
              0,
              0,
              0.05
            );

          transition:
            transform
            0.2s ease,
            box-shadow
            0.2s ease;
        }

        .similar-card:hover {
          transform:
            translateY(-4px);

          box-shadow:
            0 9px 25px
            rgba(
              0,
              0,
              0,
              0.10
            );
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
            transform
            0.3s ease;
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

        .similar-moq {
          display: inline-flex;

          align-items: center;

          gap: 4px;

          margin-top: 5px;

          color:
            #718080;

          font-size: 10px;

          font-weight: 600;
        }

        .similar-moq svg {
          color:
            #00a4a6;

          flex-shrink: 0;
        }

        .similar-loading {
          min-height: 160px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          gap: 10px;

          color:
            #7b8787;

          font-size: 13px;
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
            productSpin
            0.8s
            linear
            infinite;
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
            rgba(
              0,
              0,
              0,
              0.18
            );
        }

        @media (max-width: 1000px) {

          .product-container {
            padding:
              20px;
          }

          .product-main {
            grid-template-columns:
              minmax(
                0,
                1fr
              )
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
                minmax(
                  0,
                  1fr
                )
              );
          }

        }

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
              0px;
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
            font-size: 20px;
          }

          .product-price {
            font-size: 23px;
          }

          .product-moq {
            margin-top: 7px;

            padding:
              5px 8px;

            font-size: 10px;
          }

          .product-moq svg {
            width: 14px;
            height: 14px;
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
                minmax(
                  0,
                  1fr
                )
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
            font-size: 20px;
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