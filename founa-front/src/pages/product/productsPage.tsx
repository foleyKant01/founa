// src/pages/ProductPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetSingleProduit } from "../../services/product.service"; // chemin correct

interface Product {
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
}

const ProductPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    description: "",
    images: [],
    stock: 0,
  });
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (uid) {
      GetSingleProduit({ produit_id: uid })
        .then((res) => {
          const data = res.data.produit; // adapte selon la structure de ta réponse
          const imagesArray = data.images ? data.images.split(",") : [];
          setProduct({
            name: data.nom,
            price: data.prix_vente,
            description: data.description,
            images: imagesArray,
            stock: data.stock_disponible,
          });
          if (imagesArray.length > 0) setSelectedImage(imagesArray[0]);
        })
        .catch((err) => console.error("Erreur récupération produit :", err));
    }
  }, [uid]);

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1 || newQty > product.stock) return;
    setQuantity(newQty);
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

          <button style={styles.addToCartButton}>Ajouter au panier</button>
        </div>
      </div>

      {/* Produits similaires (exemple statique) */}
      <section style={styles.similarSection}>
        <h2 style={styles.sectionTitle}>Produits similaires</h2>
        <div style={styles.similarProducts}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={styles.similarCard}>
              <img
                src={`https://via.placeholder.com/120x120.png?text=Produit+${i}`}
                alt={`Produit similaire ${i}`}
                style={styles.similarImage}
              />
              <p style={styles.similarName}>Produit similaire {i}</p>
              <p style={styles.similarPrice}>{(100000 + i * 50000).toLocaleString()} FCFA</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 15,
    paddingBottom: 100,
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
    fontFamily: "Arial, sans-serif",
  },
  mainSection: { display: "flex", flexWrap: "wrap", gap: 20 },
  imageSection: { flex: "1 1 300px" },
  mainImage: { width: "100%", borderRadius: 12, marginBottom: 10 },
  thumbnailWrapper: { display: "flex", gap: 10 },
  thumbnail: { width: 60, height: 60, borderRadius: 8, objectFit: "cover", cursor: "pointer" },

  detailsSection: { flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 15 },
  productName: { fontSize: 22, fontWeight: "bold" },
  productPrice: { fontSize: 20, color: "#00A4A6", fontWeight: "bold" },
  productDescription: { fontSize: 14, color: "#555", lineHeight: 1.5 },

  qtyWrapper: { display: "flex", alignItems: "center", gap: 10 },
  qtyControls: { display: "flex", alignItems: "center", gap: 5 },
  qtyButton: { padding: "4px 10px", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" },
  qtyText: { minWidth: 25, textAlign: "center" },
  addToCartButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#00A4A6",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },

  similarSection: { marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  similarProducts: { display: "flex", gap: 15, flexWrap: "wrap" },
  similarCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: "calc(50% - 7.5px)",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    cursor: "pointer",
  },
  similarImage: { width: "100%", borderRadius: 8, marginBottom: 5 },
  similarName: { fontSize: 14, fontWeight: "bold", marginBottom: 3 },
  similarPrice: { fontSize: 13, color: "#00A4A6" },
};

export default ProductPage;
