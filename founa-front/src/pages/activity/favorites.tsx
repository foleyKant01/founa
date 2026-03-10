import React, { useEffect, useState } from "react";
import BottomBar from "../../components/layout/bottomBar";
import { ReadAllFavorisByUser } from "../../services/product.service";

interface Favorite {
  uid: string;
  produit_id: string;
  nom: string;
  image?: string;
  price?: string;
  creation_date: string;
}

const API_URL = "http://localhost:5000";

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");

    if (!userStr) {
      console.warn("Aucun utilisateur en session");
      // setLoading(false);
      return;
    }

    const user = JSON.parse(userStr);
    const client_id = user.uid;

    console.log("CLIENT_ID:", client_id);

    ReadAllFavorisByUser(client_id)
      .then((res) => {
        console.log("API RESPONSE:", res.data);

        if (res.data.status === "success") {
          setFavorites(res.data.favs_informations);
        }
      })
      .catch((err) => console.error("API ERROR:", err))
      // .finally(() => setLoading(false));
  }, []);

  // if (loading) {
  //   return <p style={{ textAlign: "center" }}>Chargement...</p>;
  // }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mes Favoris</h2>

      {favorites.length === 0 ? (
        <p style={styles.emptyText}>Aucun favori pour le moment</p>
      ) : (
        <div style={styles.list}>
          {favorites.map((item) => (
            <div key={item.uid} style={styles.card}>
              <img
                src={
                  item.image
                    ? `${API_URL}/${item.image}`
                    : "/no-image.png"
                }
                alt={item.nom}
                style={styles.image}
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = "/no-image.png")
                }
              />
              <span style={styles.name}>{item.nom}</span>
            </div>
          ))}
        </div>
      )}

      <BottomBar />
    </div>
  );
};



const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 15,
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
    fontFamily: "Arial, sans-serif",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#555" },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    objectFit: "cover",
  },

  name: { fontSize: 16, fontWeight: 500 },
};

export default FavoritesPage;
