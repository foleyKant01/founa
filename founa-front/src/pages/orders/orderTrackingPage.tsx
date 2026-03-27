// src/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import BottomBar from "../../components/layout/bottomBar";
import { GetAllCommandeByClient } from "../../services/order.service"; // 🔹 service API commandes
import { useNavigate } from "react-router-dom";


interface Order {
  commande_id: string;
  client_id: string;
  client: string;
  produit_id: string;
  produit: string;
  teller_id: string;
  teller: string;
  quantite: string;
  prix_total: string;
  statut: string; // "Livré" | "En cours" | "Annulé"
  details: string;
  nom: string;
  created_date: string;
  updated_date?: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const clientId = user.uid;

  useEffect(() => {
    if (clientId) {
      GetAllCommandeByClient({ client_id: clientId })
        .then((res) => {
          if (res.data.status === "success") {
            const commandes: Order[] = res.data.commandes.map((c: any) => ({
              commande_id: c.commande_id,
              client_id: c.client_id,
              client: c.client,
              produit_id: c.produit_id,
              produit: c.produit,
              teller_id: c.teller_id,
              teller: c.teller,
              quantite: c.quantite,
              prix_total: c.prix_total,
              statut: c.statut,
              details: c.details,
              nom: c.nom,
              created_date: c.created_date,
              updated_date: c.updated_date,
            }));
            setOrders(commandes);
          } else {
            console.error("Erreur récupération commandes:", res.data.message);
          }
        })
        .catch((err) => console.error("Erreur récupération commandes :", err));
    }
  }, [clientId]);

  const getStatusColor = (status: Order["statut"]) => {
    switch (status) {
    case "Initié":
      return "#9E9E9E"; // gris
    case "Prise en charge":
      return "#2196F3"; // bleu
    case "Validé":
      return "#3F51B5"; // indigo
    case "Payé":
      return "#FFC107"; // jaune
    case "Expédition":
      return "#FF9800"; // orange
    case "Livraison":
      return "#00BCD4"; // cyan
    case "Livré":
      return "#4CAF50"; // vert
    default:
      return "#000"; // noir pour inconnu
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mes Commandes</h2>

      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        orders.map((order) => (
          <div key={order.commande_id} style={styles.orderCard} onClick={() => navigate(`/order/${order.commande_id}`)}>
            <div style={styles.orderDetails}>
              <span style={styles.orderId}>{order.commande_id}</span>
              <span style={styles.orderDate}>Date: {order.created_date}</span>
              <span style={styles.orderProduit}>Produit: {order.nom}</span>
              <span style={styles.orderTotal}>
                Total: {Number(order.prix_total).toLocaleString()} FCFA
              </span>
            </div>
            <span
              style={{
                ...styles.orderStatus,
                backgroundColor: getStatusColor(order.statut),
              }}
            >
              {order.statut}
            </span>
          </div>
        ))
      )}

      <BottomBar />
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  orderCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
    cursor: "pointer",
    flexWrap: "wrap",
  },
  orderDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    flex: 1,
  },
  orderId: { fontWeight: "bold", fontSize: 16 },
  orderDate: { fontSize: 14, color: "#757575" },
  orderProduit: { fontSize: 14, color: "#333" },
  orderQuantite: { fontSize: 14, color: "#333" },
  orderTotal: { fontSize: 16, fontWeight: "bold", color: "#00A4A6" },
  orderStatus: {
    padding: "5px 12px",
    borderRadius: 20,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    minWidth: 80,
    textAlign: "center",
    alignSelf: "center",
  },
};

export default OrdersPage;