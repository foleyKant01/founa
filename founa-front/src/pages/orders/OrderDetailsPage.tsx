import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetSingleCommande } from "../../services/order.service";

interface Order {
  commande_id: string;
  client_id: string;
  produit_id: string;
  nom: string;
  quantite: number;
  prix_total: number;
  statut: string;
  details: string;
  created_date: string;
  images?: string;
}

const OrderDetailsPage: React.FC = () => {
  const { commande_id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (commande_id) {
      GetSingleCommande({ commande_id })
        .then((res) => {
          if (res.data.status === "success") {
            setOrder(res.data.commande);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [commande_id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Initié": return "#9E9E9E";
      case "Prise en charge": return "#2196F3";
      case "Validé": return "#3F51B5";
      case "Payé": return "#FFC107";
      case "Expédition": return "#FF9800";
      case "Livraison": return "#00BCD4";
      case "Livré": return "#4CAF50";
      default: return "#000";
    }
  };

  if (loading) {
    return <div style={styles.center}>Chargement...</div>;
  }

  if (!order) {
    return <div style={styles.center}>Commande introuvable</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Détails de la commande</h2>

        {/* Bannière statut */}
        <div
          style={{
            ...styles.statusBanner,
            backgroundColor: getStatusColor(order.statut),
          }}
        >
          {order.statut}
        </div>

        {/* Carte principale */}
        <div style={styles.card}>
          <div style={styles.row}>

            {/* Image */}
            <div style={styles.imageContainer}>
              <img
                src={order.images || "https://via.placeholder.com/150"}
                alt={order.nom}
                style={styles.image}
              />
            </div>

            {/* Infos */}
            <div style={styles.infoContainer}>
              <p><strong>ID :</strong> {order.commande_id}</p>
              <p><strong>Date :</strong> {order.created_date}</p>
              <p><strong>Produit :</strong> {order.nom}</p>
              <p><strong>Quantité :</strong> {order.quantite}</p>
              <p style={styles.price}>
                {order.prix_total.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        {/* Détails */}
        <div style={styles.card}>
          <h3 style={styles.subtitle}>Détails</h3>
          <p style={styles.detailsText}>
            {order.details || "Aucun détail disponible."}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
    padding: 10,
    display: "flex",
    justifyContent: "center",
  },
  wrapper: {
    width: "100%",
    maxWidth: 500,
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  statusBanner: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 15,
    boxSizing: "border-box"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 5,
    marginBottom: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden", // empêche débordement
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    maxWidth: 120,
    height: 120,
    objectFit: "cover",
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1.5,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    wordBreak: "break-word",
  },
  price: {
    fontWeight: "bold",
    color: "#00A4A6",
    fontSize: 16,
  },
  subtitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailsText: {
    color: "#555",
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
};

export default OrderDetailsPage;
