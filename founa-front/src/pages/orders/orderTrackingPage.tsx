import React from "react";
import BottomBar from "../../components/layout/bottomBar";

interface Order {
  id: string;
  date: string;
  status: "Livré" | "En cours" | "Annulé";
  total: number;
}

const OrdersPage: React.FC = () => {
  const orders: Order[] = [
    { id: "ORD001", date: "01/12/2025", status: "Livré", total: 430000 },
    { id: "ORD002", date: "28/11/2025", status: "En cours", total: 120000 },
    { id: "ORD003", date: "25/11/2025", status: "Annulé", total: 75000 },
  ];

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Livré":
        return "#4CAF50"; // vert
      case "En cours":
        return "#FF9800"; // orange
      case "Annulé":
        return "#F44336"; // rouge
      default:
        return "#000";
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mes Commandes</h2>

      {orders.map((order) => (
        <div key={order.id} style={styles.orderCard}>
          <div style={styles.orderDetails}>
            <span style={styles.orderId}>{order.id}</span>
            <span style={styles.orderDate}>{order.date}</span>
            <span style={styles.orderTotal}>{order.total.toLocaleString()} FCFA</span>
          </div>
          <span
            style={{
              ...styles.orderStatus,
              backgroundColor: getStatusColor(order.status),
            }}
          >
            {order.status}
          </span>
        </div>
      ))}

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
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  orderCardHover: {
    transform: "scale(1.02)",
  },
  orderDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  orderId: { fontWeight: "bold", fontSize: 16 },
  orderDate: { fontSize: 14, color: "#757575" },
  orderTotal: { fontSize: 16, fontWeight: "bold", color: "#00A4A6" },
  orderStatus: {
    padding: "5px 12px",
    borderRadius: 20,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    minWidth: 80,
    textAlign: "center",
  },
};

export default OrdersPage;
