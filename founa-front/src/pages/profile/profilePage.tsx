import React from "react";

interface User {
  fullname: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  date: string;
  status: "Livré" | "En cours" | "Annulé";
  total: number;
}

interface CartItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

const user: User = {
  fullname: "Jean Kouadio",
  email: "jean.kouadio@example.com",
  phone: "0574530290",
  address: "Yopougon, Abidjan",
};

const recentOrders: Order[] = [
  { id: "ORD001", date: "01/12/2025", status: "Livré", total: 430000 },
  { id: "ORD002", date: "28/11/2025", status: "En cours", total: 120000 },
];

const cartItems: CartItem[] = [
  { id: 1, name: "Smartphone Samsung", qty: 1, price: 350000 },
  { id: 2, name: "Robe élégante", qty: 2, price: 80000 },
  { id: 3, name: "Poulet frais", qty: 5, price: 3500 },
];

const ProfilePage: React.FC = () => {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Livré":
        return "#4CAF50";
      case "En cours":
        return "#FF9800";
      case "Annulé":
        return "#F44336";
      default:
        return "#000";
    }
  };

    const totalCartItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalCartPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mon Profil</h2>

      {/* Infos personnelles */}
      <div style={styles.profileCard}>
        <p><strong>Nom :</strong> {user.fullname}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Téléphone :</strong> {user.phone}</p>
        <p><strong>Adresse :</strong> {user.address}</p>
      </div>

      {/* Actions */}
      <button style={styles.editButton}>Modifier le profil</button>
      <button style={styles.settingsButton}>Changer le mot de passe</button>

      {/* Panier */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Panier actuel</h3>
        <div style={styles.cartCard}>
          <p><strong>Articles :</strong> {totalCartItems}</p>
          <p><strong>Total :</strong> {totalCartPrice.toLocaleString()} FCFA</p>
        </div>
      </div>

      {/* Commandes récentes */}
      <h3 style={styles.sectionTitle}>Commandes récentes</h3>
      {recentOrders.map((order) => (
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
      <button style={styles.logoutButton}>Se déconnecter</button>
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    lineHeight: 1.6,
  },
  editButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#00A4A6",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 10,
  },
  settingsButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#4ECDC4",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 10,
  },
  logoutButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#FF6B6B",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  cartCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
  },
  orderCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    cursor: "pointer",
  },
  orderDetails: { display: "flex", flexDirection: "column", gap: 5 },
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

export default ProfilePage;

