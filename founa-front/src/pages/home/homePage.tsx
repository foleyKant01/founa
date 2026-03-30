// src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { GetAllProduits, SearchProduct } from "../../services/product.service";
import { useNavigate } from "react-router-dom";
import { useActivity, type FavoriteItem } from "../../context/activityContext";

interface Produit {
  id: number;
  uid: string;
  nom: string;
  description: string;
  status: string;
  prix_vente: number;
  stock_disponible: number;
  images: string | string[];
  fournisseur_id: string;
}

const HomePage: React.FC = () => {
  const nav = useNavigate();
  const [Allproduits, setProduits] = useState<Produit[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Produit[]>([]);
  const { addFavorite, removeFavorite, isFavorite } = useActivity();

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const clientId = user.uid;

  // 🔹 Récupération produits
  useEffect(() => {
    GetAllProduits()
      .then((res) => setProduits(res.data.produits))
      .catch((err) => console.error("Erreur récupération produits:", err));
  }, []);

  // 🔹 Gestion recherche
  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (!text || text.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await SearchProduct({ textSearch: text });
      setSearchResults(res.data.status === "success" ? res.data.products : []);
    } catch (err) {
      console.error("Erreur recherche produits :", err);
      setSearchResults([]);
    }
  };

  // 🔹 Helper image
  const getFirstImage = (images: string | string[]): string => {
    if (!images) return "/default-image.png";
    let imgArray: string[] = [];
    if (typeof images === "string") {
      try { imgArray = JSON.parse(images); } catch { imgArray = []; }
    } else { imgArray = images; }
    return imgArray.length > 0 ? imgArray[0] : "/default-image.png";
  };

  // 🔹 Choix produits à afficher
  const displayedProducts = searchText.trim() ? searchResults : Allproduits;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.searchWrapper}>
          <img src="/logo-founa2.png" alt="FOUNA Logo" style={styles.searchLogo} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <Bell size={24} style={{ cursor: "pointer", marginRight: 35 }} />
      </header>

      {/* PRODUITS */}
      <section style={styles.productsSection}>
        {searchText.trim() ? (
          <>
            <h2 style={styles.sectionTitle}>Résultats de la recherche</h2>
            {displayedProducts.length === 0 ? (
              <p style={styles.noResults}>Aucun produit trouvé pour "{searchText}"</p>
            ) : (
              <div style={styles.productList}>
                {displayedProducts.map((produit, index) => (
                  <div
                    key={index}
                    style={styles.productCard}
                    onClick={() => nav(`/singleproduct/${produit.uid}`)}
                  >
                    <div style={styles.productImage}>
                      <img
                        src={getFirstImage(produit.images)}
                        alt={produit.nom}
                        style={{ width: 130, height: 100, objectFit: "cover" }}
                      />
                    </div>
                    <h3 style={styles.productName}>{produit.nom}</h3>
                    <p style={styles.productPrice}>{produit.prix_vente}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 style={styles.sectionTitle}>Produits au top du classement</h2>
            <div style={styles.slider}>
              {Allproduits.filter(p => p.status === "Top").map((produit, i) => (
                <div
                  key={i}
                  style={styles.topProductCard}
                  onClick={() => nav(`/singleproduct/${produit.uid}`)}
                >
                  <div style={styles.productImage}>
                    <img
                      src={getFirstImage(produit.images)}
                      alt={produit.nom}
                      style={{ width: 130, height: 100, objectFit: "cover" }}
                    />
                  </div>
                  <h3 style={styles.productName}>{produit.nom}</h3>
                  <p style={styles.productPrice}>{produit.prix_vente}</p>
                </div>
              ))}
            </div>

            <h2 style={{ ...styles.sectionTitle, marginTop: 30 }}>Produits populaires</h2>
            <div style={styles.productList}>
              {Allproduits.slice(0, 4).map((produit, i) => (
                <div
                  key={i}
                  style={styles.productCard}
                  onClick={() => nav(`/singleproduct/${produit.uid}`)}
                >
                  <div style={styles.productImage}>
                    <img
                      src={getFirstImage(produit.images)}
                      alt={produit.nom}
                      style={{ width: 130, height: 100, objectFit: "cover" }}
                    />
                  </div>
                  <h3 style={styles.productName}>{produit.nom}</h3>
                  <p style={styles.productPrice}>{produit.prix_vente}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CSS global */}
      <style>{`
        .slider::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

/* 🎨 Styles */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    paddingTop: 70,
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
    padding: "1px",
    flex: 1,
    maxWidth: 300,
  },
  searchLogo: { height: 50, width: 70, marginLeft: 0, objectFit: "cover", objectPosition: "center"},
  searchInput: { border: "none", outline: "none", flex: 1, fontSize: 16, borderRadius: 25 },

  productsSection: { marginTop: 20, padding: "0 10px" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  noResults: { color: "#999", fontStyle: "italic" },

  slider: {
    display: "flex",
    overflowX: "auto",
    gap: 10,
    paddingBottom: 10,
    scrollbarWidth: "none" as any,
    msOverflowStyle: "none",
  },
  topProductCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    minWidth: 150,
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    scrollSnapAlign: "start",
    cursor: "pointer",
  },

  productList: {
    display: "flex",
    flexWrap: "wrap",
    margin: "-7.5px",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    minWidth: 150,
    padding: "15px 0px",
    width: "calc(50% - 15px)",
    margin: "7.5px",
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


// // src/pages/HomePage.tsx
// import React, { useEffect, useState } from "react";
// import { Bell } from "lucide-react";
// import { GetAllProduits } from "../../services/product.service"; // chemin correct
// import { SaveFavoris, DeleteFavoris } from "../../services/product.service"; // chemin correct
// import { useNavigate } from "react-router-dom";
// import { useActivity, type FavoriteItem } from "../../context/activityContext"; // 🔹 hook favoris

// // 🔹 Typage des produits récupérés depuis l'API
// interface Produit {
//   id: number;
//   uid: string;
//   nom: string;
//   description: string;
//   status: string;
//   prix_vente: number;
//   stock_disponible: number;
//   images: string | string[]; // 🔹 peut être string JSON ou déjà un tableau
//   fournisseur_id: string;
// }

// const HomePage: React.FC = () => {
//   const nav = useNavigate();

//   const [Allproduits, setProduits] = useState<Produit[]>([]);
//   const { addFavorite, removeFavorite, isFavorite } = useActivity();

//   useEffect(() => {
//     GetAllProduits()
//       .then((res) => {
//         setProduits(res.data.produits); // récupère la clé "produits" de ton JSON Flask
//       })
//       .catch((err) => {
//         console.error("Erreur récupération produits:", err);
//       });
//   }, []);

//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const clientId = user.uid;

//   // 🔹 Gestion des favoris
//   const handleToggleFavorite = async (produit: Produit) => {
//     try {
//       if (isFavorite(produit.uid)) {
//         await DeleteFavoris(produit.uid, clientId);
//         removeFavorite(produit.uid);
//       } else {
//         await SaveFavoris(produit.uid, clientId);
//         const imagesArray = typeof produit.images === "string" ? JSON.parse(produit.images) : produit.images;
//         const favItem: FavoriteItem = {
//           uid: produit.uid,
//           nom: produit.nom,
//           image: imagesArray && imagesArray.length > 0 ? imagesArray[0] : "/default-image.png",
//         };
//         addFavorite(favItem);
//       }
//     } catch (error) {
//       console.error("Erreur favoris :", error);
//     }
//   };

//   // 🔹 Helper pour récupérer la première image
//   const getFirstImage = (images: string | string[]): string => {
//     if (!images) return "/default-image.png";
//     let imgArray: string[] = [];
//     if (typeof images === "string") {
//       try {
//         imgArray = JSON.parse(images);
//       } catch {
//         imgArray = [];
//       }
//     } else {
//       imgArray = images;
//     }
//     return imgArray.length > 0 ? imgArray[0] : "/default-image.png";
//   };

//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       <header style={styles.header}>
//         <div style={styles.searchWrapper}>
//           <img src="/logo-founa.png" alt="FOUNA Logo" style={styles.searchLogo} />
//           <input
//             type="text"
//             placeholder="Rechercher un produit..."
//             style={styles.searchInput}
//           />
//         </div>
//         <Bell size={24} style={{ cursor: "pointer", marginRight: 35 }} />
//       </header>

//       {/* PRODUITS AU TOP */}
//       <section style={styles.topProductsSection}>
//         <h2 style={styles.sectionTitle}>Produits au top du classement</h2>
//         <div style={styles.slider}>
//           {Allproduits
//             .filter((produit) => produit.status === "Top")
//             .map((produit, index) => (
//               <div
//                 key={index}
//                 style={styles.topProductCard}
//                 onClick={() => nav(`/singleproduct/${produit.uid}`)}
//               >
//                 <div style={styles.productImage}>
//                   <img
//                     src={getFirstImage(produit.images)}
//                     alt={produit.nom}
//                     style={{ width: 130, height: 100, objectFit: "cover" }}
//                   />
//                 </div>
//                 <h3 style={styles.productName}>{produit.nom}</h3>
//                 <p style={styles.productPrice}>{produit.prix_vente}</p>

//                 <div style={styles.bottomButtons}>
//                   <button
//                     style={styles.commandButton}
//                     onClick={() => nav(`/singleproduct/${produit.uid}`)}
//                   >
//                     Commander
//                   </button>

//                   {/* Bouton favoris */}
//                   {/* <button
//                     style={{
//                       ...styles.favoriteButton,
//                       backgroundColor: isFavorite(produit.uid) ? "#ffdddd" : "#fff",
//                     }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleToggleFavorite(produit);
//                     }}
//                   >
//                     {isFavorite(produit.uid) ? "❤️" : "🤍"}
//                   </button> */}
//                 </div>
//               </div>
//             ))}
//         </div>
//       </section>

//       {/* PRODUITS POPULAIRES */}
//       <section style={styles.productsSection}>
//         <h2 style={styles.sectionTitle}>Produits populaires</h2>
//         <div style={styles.productList}>
//           {Allproduits.slice(0, 4).map((produit, index) => (
//             <div
//               key={index}
//               style={styles.productCard}
//               onClick={() => nav(`/singleproduct/${produit.uid}`)}
//             >
//               <div style={styles.productImage}>
//                 <img
//                   src={getFirstImage(produit.images)}
//                   alt={produit.nom}
//                   style={{ width: 130, height: 100, objectFit: "cover" }}
//                 />
//               </div>
//               <h3 style={styles.productName}>{produit.nom}</h3>
//               <p style={styles.productPrice}>{produit.prix_vente}</p>

//               <div style={styles.bottomButtons}>
//                 <button
//                   style={styles.commandButton}
//                   onClick={() => nav(`/singleproduct/${produit.uid}`)}
//                 >
//                   Commander
//                 </button>

//                 {/* Bouton favoris */}
//                 {/* <button
//                   style={{
//                     ...styles.favoriteButton,
//                     backgroundColor: isFavorite(produit.uid) ? "#ffdddd" : "#fff",
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleToggleFavorite(produit);
//                   }}
//                 >
//                   {isFavorite(produit.uid) ? "❤️" : "🤍"}
//                 </button> */}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* STYLES GLOBAUX */}
//       <style>{`
//         .slider::-webkit-scrollbar { display: none; }
//       `}</style>
//     </div>
//   );
// };

// /* 🎨 Styles */
// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     paddingTop: 70,
//     paddingBottom: 80,
//     background: "#F5F5F5",
//     minHeight: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   header: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     zIndex: 1000,
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "10px 15px",
//     backgroundColor: "#00A4A6",
//     color: "#fff",
//   },
//   bottomButtons: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//     gap: 10,
//   },
//   commandButton: {
//     flex: 1,
//     padding: "8px 5px",
//     marginRight: "25px",
//     marginLeft: "25px",
//     borderRadius: 8,
//     border: "none",
//     cursor: "pointer",
//     backgroundColor: "#00A4A6",
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 14,
//     transition: "all 0.2s",
//   },
//   // favoriteButton: {
//   //   width: 25,
//   //   backgroundColor: "white",
//   //   height: 25,
//   //   borderRadius: 8,
//   //   marginTop: "2px",
//   //   border: "none",
//   //   cursor: "pointer",
//   //   color: "#fff",
//   //   fontSize: 14,
//   //   display: "flex",
//   //   alignItems: "center",
//   //   justifyContent: "center",
//   //   transition: "all 0.2s",
//   // },

//   searchWrapper: {
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 25,
//     padding: "10px",
//     flex: 1,
//     maxWidth: 300,
//   },
//   searchLogo: { height: 30, width: 30, marginRight: 8, objectFit: "contain" },
//   searchInput: { border: "none", outline: "none", flex: 1, fontSize: 16 },

//   topProductsSection: { marginTop: 20, padding: "0 10px" },
//   sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },

//   slider: {
//     display: "flex",
//     overflowX: "auto",
//     gap: 10,
//     paddingBottom: 10,
//     scrollbarWidth: "none" as any,
//     msOverflowStyle: "none",
//   },
//   topProductCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 10,
//     minWidth: 150,
//     textAlign: "center",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
//     scrollSnapAlign: "start",
//   },

//   productsSection: { marginTop: 30, padding: "0 10px" },
//   productList: {
//     display: "flex",
//     flexWrap: "wrap",
//     margin: "-7.5px",
//   },
//   productCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     minWidth: 150,
//     padding: "15px 0px",
//     width: "calc(50% - 15px)",
//     margin: "7.5px",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
//     textAlign: "center",
//     cursor: "pointer",
//     transition: "transform 0.2s, box-shadow 0.2s",
//   },
//   productImage: { fontSize: 40, marginBottom: 10 },
//   productName: { fontSize: 16, maxWidth: "100%", fontWeight: "bold", marginBottom: 5 },
//   productPrice: { fontSize: 13, color: "#00A4A6" },
// };

// export default HomePage;