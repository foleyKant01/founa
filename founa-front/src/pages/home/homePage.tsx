// src/pages/HomePage.tsx
import React from "react";
import { Bell } from "lucide-react";

// 🔹 Typage des produits
interface Product {
  name: string;
  price: string;
  emoji: string;
}

// 🔹 Produits au top
const topProducts: Product[] = [
  { name: "Smartphone Samsung", price: "350 000 FCFA", emoji: "📱" },
  { name: "Robe élégante", price: "80 000 FCFA", emoji: "👗" },
  { name: "Poulet frais", price: "3 500 FCFA", emoji: "🍗" },
  { name: "Lampe design", price: "12 000 FCFA", emoji: "💡" },
  { name: "Casque audio", price: "25 000 FCFA", emoji: "🎧" },
  { name: "Sac à main", price: "45 000 FCFA", emoji: "👜" },
];

const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.searchWrapper}>
          <img src="/logo-founa.png" alt="FOUNA Logo" style={styles.searchLogo} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            style={styles.searchInput}
          />
        </div>
        <Bell size={24} style={{ cursor: "pointer", marginRight: 35 }} />
      </header>

      {/* PRODUITS AU TOP */}
      <section style={styles.topProductsSection}>
        <h2 style={styles.sectionTitle}>Produits au top du classement</h2>
        <div style={styles.slider}>
          {topProducts.map((prod, index) => (
            <div key={index} style={styles.topProductCard}>
              <div style={styles.productImage}>{prod.emoji}</div>
              <h3 style={styles.productName}>{prod.name}</h3>
              <p style={styles.productPrice}>{prod.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>Produits populaires</h2>
        <div style={styles.productList}>
          {topProducts.slice(0, 4).map((prod, index) => (
            <div key={index} style={styles.productCard}>
              <div style={styles.productImage}>{prod.emoji}</div>
              <h3 style={styles.productName}>{prod.name}</h3>
              <p style={styles.productPrice}>{prod.price}</p>
            </div>
          ))}
        </div>
      </section>


      {/* STYLES GLOBAUX */}
      <style>{`
        .slider::-webkit-scrollbar { display: none; } /* Masquer scrollbar Chrome/Safari */
      `}</style>
    </div>
  );
};

/* 🎨 Styles */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    paddingTop: 70,  // <-- AJOUT ESSENTIEL
    paddingBottom: 80,
    background: "#F5F5F5",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    backgroundColor: "#00A4A6",
    color: "#fff",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: "10px",
    flex: 1,
    maxWidth: 300,
  },
  searchLogo: { height: 30, width: 30, marginRight: 8, objectFit: "contain" },
  searchInput: { border: "none", outline: "none", flex: 1, fontSize: 16 },

  topProductsSection: { marginTop: 20, padding: "0 10px" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },

  slider: {
    display: "flex",
    overflowX: "auto",
    gap: 10,
    paddingBottom: 10,
    scrollbarWidth: "none" as any, // Firefox
    msOverflowStyle: "none", // IE/Edge
  },
  topProductCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    minWidth: 150,
    textAlign: "center",
    flexShrink: 0,
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    scrollSnapAlign: "start",
  },

  productsSection: { marginTop: 30, padding: "0 15px" },
  productList: {
    display: "flex",
    flexWrap: "wrap",
    margin: "-7.5px", // pour compenser le padding interne
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    // maxWidth: 150,
    padding: "15px 0px",
    width: "calc(50% - 15px)", // 50% moins le gap total
    margin: "7.5px", // espace entre cartes
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  productImage: { fontSize: 40, marginBottom: 10 },
  productName: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  productPrice: { fontSize: 13, color: "#00A4A6" },
};

export default HomePage;
