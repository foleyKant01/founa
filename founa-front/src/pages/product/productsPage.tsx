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
          <h1 style={styles.productName}>{product.name}</h1>
          <p style={styles.productPrice}>{product.price.toLocaleString()} FCFA</p>
          <p style={styles.productDescription}>{product.description}</p>

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
  container: { padding: 15, paddingBottom: 100, minHeight: "100vh", backgroundColor: "#F5F5F5", fontFamily: "Arial, sans-serif" },
  mainSection: { display: "flex", flexWrap: "wrap", gap: 20 },
  imageSection: { flex: "1 1 300px" },
  mainImage: { width: "100%", borderRadius: 12, marginBottom: 10 },
  thumbnailWrapper: { display: "flex", gap: 10 },
  thumbnail: { width: 60, height: 60, borderRadius: 8, objectFit: "cover", cursor: "pointer" },
  detailsSection: { flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 15 },
  productName: { fontSize: 22, fontWeight: "bold" },
  productPrice: { fontSize: 20, color: "#00A4A6", fontWeight: "bold", margin: 0 },
  productDescription: { fontSize: 14, color: "#555", lineHeight: 1.5 },
  qtyWrapper: { display: "flex", alignItems: "center", gap: 10 },
  qtyControls: { display: "flex", alignItems: "center", gap: 5 },
  qtyButton: { padding: "4px 10px", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" },
  qtyText: { minWidth: 25, textAlign: "center" },
  addToCartButton: { marginTop: 10, padding: 12, backgroundColor: "#00A4A6", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer" },
  infoAlert: { display: "flex", gap: 10, alignItems: "flex-start", backgroundColor: "#FFF8E1", border: "1px solid #FFD54F", borderRadius: 10, padding: 12, fontSize: 13, color: "#795548" },
  infoIcon: { fontSize: 18, lineHeight: "20px" },
  infoText: { margin: 0, lineHeight: 1.4 },
  similarSection: {
  marginTop: 30,
  padding: "0 10px",
},

similarProducts: {
  display: "flex",
  gap: 12,
  overflowX: "auto",
  paddingBottom: 10,
  scrollbarWidth: "none" as any,
},

similarCard: {
  minWidth: 150,
  maxWidth: 150,
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 10,
  boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  flexShrink: 0,
},

similarImage: {
  width: "100%",
  height: 120,
  objectFit: "cover",
  borderRadius: 10,
  backgroundColor: "#F5F5F5",
},

similarName: {
  fontSize: 14,
  fontWeight: 600,
  margin: "8px 0 4px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
},

similarPrice: {
  fontSize: 13,
  fontWeight: "bold",
  color: "#00A4A6",
  margin: 0,
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