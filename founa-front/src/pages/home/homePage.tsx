// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { GetAllProduits } from "../../services/product.service"; // chemin correct
import { SaveFavoris, DeleteFavoris } from "../../services/product.service"; // chemin correct
import { useNavigate } from "react-router-dom";
import { useActivity, type FavoriteItem } from "../../context/activityContext"; // 🔹 hook favoris


// 🔹 Typage des produits récupérés depuis l'API
interface Produit {
  id: number;
  uid: string;
  nom: string;
  description: string;
  prix_vente: number;
  stock_disponible: number;
  images: string[];
  fournisseur_id: string;
}

const HomePage: React.FC = () => {
  const nav = useNavigate();

  const [Allproduits, setProduits] = useState<Produit[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
    const { addFavorite, removeFavorite, isFavorite } = useActivity();


  useEffect(() => {
    GetAllProduits()
      .then((res) => {
        setProduits(res.data.produits); // récupère la clé "produits" de ton JSON Flask
        // setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération produits:", err);
        // setLoading(false);
      });
  }, []);

   // 🔹 gestion favoris
  // const handleToggleFavorite = (produit: Produit) => {
  //   if (isFavorite(produit.uid)) {
  //     removeFavorite(produit.uid);
  //   } else {
  //     const favItem: FavoriteItem = { uid: produit.uid, nom: produit.nom, image: produit.images[0] };
  //     addFavorite(favItem);
  //   }
  // };

const user = JSON.parse(sessionStorage.getItem("user") || "{}");
const clientId = user.uid;

const handleToggleFavorite = async (produit: Produit) => {
  try {
    if (isFavorite(produit.uid)) {
      // ❌ SUPPRESSION
      await DeleteFavoris(produit.uid, clientId);
      removeFavorite(produit.uid);
    } else {
      // ➕ AJOUT
      await SaveFavoris(produit.uid, clientId);

      const favItem: FavoriteItem = {
        uid: produit.uid,
        nom: produit.nom,
        image: produit.images[0],
      };

      addFavorite(favItem);
    }
  } catch (error) {
    console.error("Erreur favoris :", error);
  }
};


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
          {Allproduits.map((produit, index) => (
            <div
              key={index}
              style={styles.topProductCard}
              onClick={() => nav(`/singleproduct/${produit.uid}`)} // redirection fonctionnelle
            >
              <div style={styles.productImage}>
                <img
                  src={produit.images}
                  alt={produit.nom}
                  style={{ width: 130, height: 100, objectFit: "cover" }}
                />
              </div>
              <h3 style={styles.productName}>{produit.nom}</h3>
              <p style={styles.productPrice}>{produit.prix_vente}</p>
              {/* 🔹 Boutons en bas : Commander + Cœur */}
        <div style={styles.bottomButtons}>
          <button
            style={styles.commandButton}
            onClick={() => nav(`/singleproduct/${produit.uid}`)}
          >
            Commander
          </button>

          {/* <button
            style={{
              ...styles.favoriteButton,
              backgroundColor: isFavorite(produit.uid) ? "#ffffffff" : "#ffffffff",
            }}
            onClick={(e) => {
              e.stopPropagation(); // empêche la navigation
              handleToggleFavorite(produit);
            }}
          >
            {isFavorite(produit.uid) ? "❤️" : "🤍"}
          </button> */}
        </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.productsSection}>
  <h2 style={styles.sectionTitle}>Produits populaires</h2>
  <div style={styles.productList}>
    {Allproduits.slice(0, 4).map((produit, index) => (
      <div 
        key={index} 
        style={styles.productCard} 
        onClick={() => nav(`/singleproduct/${produit.uid}`)} // redirection fonctionnelle
      >
        <div style={styles.productImage}>
          <img src={produit.images} alt={produit.nom} style={{ width: 130, height: 100, objectFit: "cover" }} />
        </div>
        <h3 style={styles.productName}>{produit.nom}</h3>
        <p style={styles.productPrice}>{produit.prix_vente}</p>

        {/* 🔹 Boutons en bas : Commander + Cœur */}
        <div style={styles.bottomButtons}>
          <button
            style={styles.commandButton}
            onClick={() => nav(`/singleproduct/${produit.uid}`)}
          >
            Commander
          </button>

          {/* <button
            style={{
              ...styles.favoriteButton,
              backgroundColor: isFavorite(produit.uid) ? "#ffffffff" : "#ffffffff",
            }}
            onClick={(e) => {
              e.stopPropagation(); // empêche la navigation
              handleToggleFavorite(produit);
            }}
          >
            {isFavorite(produit.uid) ? "❤️" : "🤍"}
          </button> */}
        </div>
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
  bottomButtons: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
  gap: 10,
},
commandButton: {
  flex: 1,
  padding: "8px 5px",
  marginRight: "25px",
  marginLeft: "25px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  backgroundColor: "#00A4A6",
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14,
  transition: "all 0.2s",
},
favoriteButton: {
  width: 25,
  backgroundColor: "white",
  height: 25,
  borderRadius: 8,
  marginTop: "2px",
  border: "none",
  cursor: "pointer",
  color: "#fff",
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  // boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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
    padding: 10,
    minWidth: 150,
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    scrollSnapAlign: "start",
  },

  productsSection: { marginTop: 30, padding: "0 10px" },
  productList: {
    display: "flex",
    flexWrap: "wrap",
    margin: "-7.5px", // pour compenser le padding interne
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    minWidth: 150,
    padding: "15px 0px",
    width: "calc(50% - 15px)", // 50% moins le gap total
    margin: "7.5px", // espace entre cartes
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  productImage: { fontSize: 40, marginBottom: 10 },
  productName: { fontSize: 16, maxWidth: "100%", fontWeight: "bold", marginBottom: 5 },
  productPrice: { fontSize: 13, color: "#00A4A6" },
};

export default HomePage;
