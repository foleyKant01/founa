import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../../context/cartContext';

type Produit = {
  uid: string;
  nom: string;
  prix: number;
  image: string;
};

const mockProduits: Produit[] = [
  {
    uid: "p1",
    nom: "Sneakers Nike AirMax",
    prix: 45000,
    image: "https://via.placeholder.com/200",
  },
  {
    uid: "p2",
    nom: "Casque Audio Bluetooth",
    prix: 25000,
    image: "https://via.placeholder.com/200",
  },
  {
    uid: "p3",
    nom: "Montre Connectée",
    prix: 60000,
    image: "https://via.placeholder.com/200",
  },
];

const HomePage: React.FC = () => {
  const nav = useNavigate();
  const { add } = useCart();

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <header style={styles.header}>
        <h2>Bienvenue sur FOUNA 👋</h2>
        <button style={styles.cartBtn} onClick={() => nav("/cart")}>
          🛒 Panier
        </button>
      </header>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Rechercher un produit..."
        style={styles.search}
      />

      {/* PRODUCTS */}
      <h3 style={{ marginTop: 20 }}>Produits Populaires</h3>

      <div style={styles.grid}>
        {mockProduits.map((p) => (
          <div key={p.uid} style={styles.card}>
            <img src={p.image} style={styles.image} />

            <h4>{p.nom}</h4>
            <p style={styles.price}>{p.prix} FCFA</p>

            <button
              style={styles.btn}
              onClick={() =>
                add({ uid: p.uid, nom: p.nom, prix: p.prix, qty: 1, image: p.image })
              }
            >
              Ajouter au panier
            </button>

            <button
              style={styles.detailsBtn}
              onClick={() => nav(`/product/${p.uid}`)}
            >
              Voir détails
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 20,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartBtn: {
    background: "#0066CC",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
  search: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 15,
    marginTop: 20,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #eee",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 6,
  },
  price: {
    fontWeight: "bold",
    margin: "10px 0",
  },
  btn: {
    width: "100%",
    background: "#28a745",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 6,
  },
  detailsBtn: {
    width: "100%",
    background: "#0066CC",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default HomePage;
