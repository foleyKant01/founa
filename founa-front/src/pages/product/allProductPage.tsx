import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  pr_uid: string;
  name: string;
  type: string;
  price: number;
  inventory_level: number;
  image_file: string[]; // liste des images
}

const ViewAllProducts: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products"); // adapte l'URL à ton API
      setData(res.data.products || []);
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    } finally {
      setLoading(false);
    }
  };

  const viewSingleProduct = (uid: string) => {
    navigate(`/teller/product/${uid}`);
  };

  const deleteProduct = async (uid: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await axios.delete(`/api/products/${uid}`);
      setData((prev) => prev.filter((p) => p.pr_uid !== uid));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit", error);
      alert("Impossible de supprimer le produit");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate("/teller/home")} style={styles.backBtn}>
          ← Retour
        </button>
        <div>
          <h2 style={styles.title}>Produits</h2>
          <p style={styles.subtitle}>Gérez vos produits facilement</p>
        </div>
      </div>

      {/* GRID */}
      {data.length > 0 ? (
        <div style={styles.grid}>
          {data.map((product) => (
            <div key={product.pr_uid} style={styles.card}>
              {/* IMAGE */}
              <div style={styles.imageBox}>
                <img
                  src={product.image_file[0] || "/placeholder.png"}
                  alt={product.name}
                  style={styles.image}
                />
                <span
                  style={{
                    ...styles.stockBadge,
                    ...(product.inventory_level < 5 ? styles.lowStock : {}),
                  }}
                >
                  {product.inventory_level}
                </span>
              </div>

              {/* INFOS */}
              <div style={styles.info}>
                <h4>{product.name}</h4>
                <p style={styles.type}>{product.type}</p>
                <p style={styles.price}>{product.price.toLocaleString()} FCFA</p>
                <p style={styles.ref}>Ref: {product.pr_uid}</p>
              </div>

              {/* ACTIONS */}
              <div style={styles.actions}>
                <button
                  style={styles.viewBtn}
                  onClick={() => viewSingleProduct(product.pr_uid)}
                >
                  👁️
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteProduct(product.pr_uid)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>📦 Aucun produit disponible</p>
        </div>
      )}
    </div>
  );
};

// STYLES
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1000,
    margin: "30px auto",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 30,
    gap: 15,
  },
  backBtn: {
    padding: "6px 12px",
    background: "#ccc",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  title: { margin: 0, fontSize: 28, color: "#1f2937" },
  subtitle: { marginTop: 5, color: "#6b7280" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 25,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 15,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  imageBox: { position: "relative" },
  image: { width: "100%", height: 180, objectFit: "cover", borderRadius: 12 },
  stockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#00A4A6",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 12,
    fontSize: 12,
  },
  lowStock: { background: "#f59e0b" },
  info: { flex: 1 },
  type: { color: "#6b7280", margin: 2 },
  price: { fontWeight: "bold", margin: 2 },
  ref: { fontSize: 12, color: "#9ca3af", margin: 2 },
  actions: { display: "flex", gap: 10, marginTop: 10 },
  viewBtn: {
    flex: 1,
    padding: 8,
    background: "#00A4A6",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: 8,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: 40,
    color: "#6b7280",
  },
};

export default ViewAllProducts;