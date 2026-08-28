// src/pages/ProductPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreateCommande } from "../../services/order.service";
import { GetSingleProduit, AllSimilarProducts } from "../../services/product.service";

interface Product {
  uid: string;
  name: string;
  price: number;
  description: string;
  categorie: string;
  images: string[];
  stock: number;
}

// 🔹 Composant Toast
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
      style={{
        position: "fixed",
        top: 20,
        left: 0,
        right: 0,
        width: "100%",
        background: colors[type],
        color: "#fff",
        padding: "14px 18px",
        fontSize: 17,
        textAlign: "center",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

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

const ProductPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const nav = useNavigate();

  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const [product, setProduct] = useState<Product>({
    uid: "",
    name: "",
    price: 0,
    description: "",
    categorie: "",
    images: [],
    stock: 0,
  });
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const client_id = user.uid;

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // 🔹 Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
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
        imgArray = [];
      }
    } else {
      imgArray = images;
    }

    return imgArray.length > 0
      ? imgArray[0]
      : "/default-image.png";
  };

  useEffect(() => {
    if (!uid) return;

    GetSingleProduit({ produit_id: uid })
      .then(async (res) => {
        if (res.data.status !== "success") {
          console.error(
            "Erreur récupération produit :",
            res.data.message
          );
          return;
        }

        const data = res.data.produit;

        // 🔹 Parsing des images
        let imagesArray: string[] = [];

        try {
          if (typeof data.images === "string") {
            imagesArray = JSON.parse(data.images);
          } else if (Array.isArray(data.images)) {
            imagesArray = data.images;
          }
        } catch (err) {
          console.error("Erreur parsing images :", err);
          imagesArray = [];
        }

        // 🔹 Produit actuel
        const currentProduct: Product = {
          uid: data.uid,
          name: data.nom,
          price: Number(data.prix_vente) || 0,
          description: data.description || "",
          categorie: data.categorie || "",
          images: imagesArray,
          stock: Number(data.stock_disponible) || 0,
        };

        setProduct(currentProduct);

        if (imagesArray.length > 0) {
          setSelectedImage(imagesArray[0]);}
        try {
          setLoadingSimilar(true);

          const similarResponse = await AllSimilarProducts({
            uid: data.uid,
            nom: data.nom || "",
            description: data.description || "",
            categorie: data.categorie || "",
          });

          if (similarResponse.data.status === "success") {
            setSimilarProducts(
              similarResponse.data.products || []
            );

            console.log(
              "Produits similaires :",
              similarResponse.data.products
            );
          } else {
            console.error(
              "Erreur produits similaires :",
              similarResponse.data.message
            );
            setSimilarProducts([]);
          }
        } catch (error) {
          console.error(
            "Erreur récupération produits similaires :",
            error
          );
          setSimilarProducts([]);
        } finally {
          setLoadingSimilar(false);
        }
      })
      .catch((err) => {
        console.error(
          "Erreur récupération produit :",
          err
        );
      });
  }, [uid]);

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1 || newQty > product.stock) return;
    setQuantity(newQty);
  };

  const handleCreateCommande = async () => {
    if (!client_id) {
      showToast("Veuillez vous connecter pour passer une commande", "error");
      return;
    }
    if (!uid) {
      showToast("Produit inValider", "error");
      return;
    }
    try {
      const payload = {
        client_id: client_id,
        produit_id: uid,
        quantite: quantity,
        details: `Commande de ${quantity} x ${product.name}`,
      };

      const response = await CreateCommande(payload);

      if (response.data.status === "success") {
        showToast("✅ Commande envoyée avec succès !", "success");
        setTimeout(() => {
          nav("/home");
        }, 2500);
      } else {
        showToast(response.data.message || "Erreur lors de la commande", "error");
      }
    } catch (error) {
      console.error("Erreur création commande :", error);
      showToast("❌ Erreur serveur, veuillez réessayer", "error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainSection}>
        {/* Images */}
        <div style={styles.imageSection}>
          {selectedImage && (
            <img src={selectedImage} alt={product.name} style={styles.mainImage} />
          )}
          <div style={styles.thumbnailWrapper}>
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                style={{
                  ...styles.thumbnail,
                  border: selectedImage === img ? "2px solid #00A4A6" : "1px solid #ccc",
                }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Détails */}
        <div style={styles.detailsSection}>
          <div style={styles.descriptionWrapper}>
            <div
              style={{
                ...styles.productName,
                ...(isDescriptionExpanded
                  ? {}
                  : styles.productNameCollapsed),
              }}
            >
              {product.description}
            </div>

            <button
              type="button"
              onClick={() =>
                setIsDescriptionExpanded(!isDescriptionExpanded)
              }
              style={styles.descriptionToggle}
              aria-label={
                isDescriptionExpanded
                  ? "Réduire la description"
                  : "Afficher la description complète"
              }
            >
              <span>
                {isDescriptionExpanded
                  ? "Réduire"
                  : "Voir plus"}
              </span>

              <span
                style={{
                  ...styles.arrow,
                  transform: isDescriptionExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>
          </div>
          <p style={styles.productPrice}>{product.price.toLocaleString()} FCFA</p>
          {/* <p style={styles.productDescription}>{product.description}</p> */}

          <div style={styles.qtyWrapper}>
            <span>Quantité :</span>
            <div style={styles.qtyControls}>
              <button style={styles.qtyButton} onClick={() => handleQtyChange(quantity - 1)}>
                -
              </button>
              <span style={styles.qtyText}>{quantity}</span>
              <button style={styles.qtyButton} onClick={() => handleQtyChange(quantity + 1)}>
                +
              </button>
            </div>
          </div>

          <div style={styles.infoAlert}>
            <span style={styles.infoIcon}>⚠️</span>
            <p style={styles.infoText}>
              Veuillez seulement choisir le nombre de pièces pour ce produit et cliquer sur
              <strong> « Passer Commande »</strong>.  
              Un conseiller vous contactera pour les détails.
            </p>
          </div>

          <button
            style={styles.addToCartButton}
            onClick={handleCreateCommande}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Rupture de stock" : "Passer Commande"}
          </button>
        </div>
      </div>

      {/* Produits similaires */}
      <section style={styles.similarSection}>
        <h2 style={styles.sectionTitle}>
          Produits similaires
        </h2>

        {loadingSimilar ? (
          <p style={styles.similarLoading}>
            Recherche de produits similaires...
          </p>
        ) : similarProducts.length === 0 ? (
          <p style={styles.similarEmpty}>
            Aucun produit similaire trouvé.
          </p>
        ) : (
          <div style={styles.similarProducts}>
  {similarProducts.map((similarProduct) => (
    <div
      key={similarProduct.uid}
      style={styles.similarCard}
      onClick={() =>
        nav(`/singleproduct/${similarProduct.uid}`)
      }
    >
      <img
        src={getFirstImage(similarProduct.images)}
        alt={similarProduct.nom}
        style={styles.similarImage}
      />

      <p style={styles.similarName}>
        {similarProduct.nom}
      </p>

      <p style={styles.similarPrice}>
        {Number(
          similarProduct.prix_vente
        ).toLocaleString()} FCFA
      </p>
    </div>
  ))}
</div>
        )}
      </section>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 0,
    paddingBottom: 100,
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },

  /* ==============================
     PRODUIT PRINCIPAL
  ============================== */

  mainSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: 25,
    backgroundColor: "#fff",
    padding: 0,
    margin: 0,
  },

  imageSection: {
    flex: "1 1 420px",
    minWidth: 0,
    padding: 0,
    margin: 0,
  },

  mainImage: {
    display: "block",
    width: "100%",
    height: 420,
    margin: 0,
    padding: 0,
    border: "none",
    borderRadius: 0,
    objectFit: "contain",
    backgroundColor: "#fff",
  },

  thumbnailWrapper: {
    display: "flex",
    gap: 8,
    // padding: "10px",
    overflowX: "auto",
    backgroundColor: "#fff",
  },

  thumbnail: {
    width: 65,
    height: 65,
    borderRadius: 5,
    objectFit: "cover",
    cursor: "pointer",
    flexShrink: 0,
  },

  /* ==============================
     INFORMATIONS PRODUIT
  ============================== */

  detailsSection: {
    flex: "1 1 420px",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    padding: "0px 0px 0px 0px",
  },

  productName: {
    fontSize: 16,
    fontWeight: 400,
    color: "#222",
    margin: 0,
    lineHeight: 1.4,
  },

  productNameCollapsed: {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
},

descriptionWrapper: {
  width: "100%",
},

descriptionToggle: {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 5,
  width: "100%",
  marginTop: 5,
  padding: 0,
  border: "none",
  background: "transparent",
  color: "#00A4A6",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
},

arrow: {
  fontSize: 10,
  display: "inline-block",
  transition: "transform 0.2s ease",
},

  productPrice: {
    fontSize: 22,
    color: "#00A4A6",
    fontWeight: 700,
    margin: "0px 0",
  },

  productDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 1.6,
    margin: 0,
  },

  /* ==============================
     QUANTITÉ
  ============================== */

  qtyWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    // paddingTop: 10,
  },

  qtyControls: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #dcdcdc",
    borderRadius: 5,
    overflow: "hidden",
  },

  qtyButton: {
    width: 38,
    height: 36,
    border: "none",
    backgroundColor: "#f7f7f7",
    cursor: "pointer",
    fontSize: 18,
    color: "#333",
  },

  qtyText: {
    width: 45,
    textAlign: "center",
    fontSize: 15,
    fontWeight: 500,
  },

  /* ==============================
     INFORMATION
  ============================== */

  infoAlert: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: "#fff8e6",
    border: "1px solid #f0d98a",
    borderRadius: 5,
    padding: 12,
    fontSize: 13,
    color: "#765f20",
  },

  infoIcon: {
    fontSize: 18,
    lineHeight: "20px",
  },

  infoText: {
    margin: 0,
    lineHeight: 1.5,
  },

  /* ==============================
     BOUTON COMMANDE
  ============================== */

  addToCartButton: {
    width: "100%",
    marginTop: 0,
    padding: "14px 20px",
    backgroundColor: "#00A4A6",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },

  /* ==============================
     PRODUITS SIMILAIRES
  ============================== */

  similarSection: {
    marginTop: 10,
    padding: "20px 10px",
    backgroundColor: "#f5f5f5",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 500,
    color: "#222",
    margin: "0 0 15px",
  },

  similarProducts: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    width: "100%",
    boxSizing: "border-box",
  },

  similarCard: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 0,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    cursor: "pointer",
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
  },

  similarImage: {
    width: "100%",
    height: 170,
    objectFit: "cover",
    display: "block",
    backgroundColor: "#fff",
  },

  similarName: {
    fontSize: 14,
    fontWeight: 400,
    color: "#333",
    margin: "9px 7px 4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    lineHeight: 1.4,
  },

  similarPrice: {
    fontSize: 16,
    fontWeight: 700,
    color: "#00A4A6",
    margin: "0 7px 10px",
    textAlign: "left",
  },

  similarLoading: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
  },

  similarEmpty: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    padding: "15px 0",
  },
};

export default ProductPage;