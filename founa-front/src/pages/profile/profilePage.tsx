// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { ReadSingleClient } from "../../services/auth.service";
import { GetAllCommandeByClient } from "../../services/order.service";
import { useNavigate } from "react-router-dom";

interface User {
  fullname: string;
  email: string;
  phone: string;
  adresse_livraison: string;
  uid: string;
}

interface Order {
  commande_id: string;
  client_id: string;
  produit_id: string;
  nom: string;
  teller_id: string;
  fournisseur_id: string;
  quantite: number;
  prix_total: number;
  statut: string; // "Initier", "Prise en charge", "Validerr", "Payerr", "Expedition", "Livraison", "Livrer"
  details: string;
  created_date: string; 
  updated_date?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([]);
  const client = JSON.parse(sessionStorage.getItem("user") || "{}");
  const uid = client.uid;

  useEffect(() => {
    if (uid) {
      // Récupérer les infos du client
      ReadSingleClient({ uid })
        .then((res) => {
          if (res.data.status === "success") {
            setUser(res.data.client);
          }
        })
        .catch((err) => console.error("Erreur récupération client :", err));

      // Récupérer les commandes du client
      GetAllCommandeByClient({ client_id: uid })
        .then((res) => {
          if (res.data.status === "success") {
            setOrders(res.data.commandes);
          }
        })
        .catch((err) => console.error("Erreur récupération commandes :", err));
    }
  }, [uid]);

  const getStatusColor = (status: Order["statut"]) => {
    switch (status) {
      case "Initier":
        return "#9E9E9E";
      case "Prise en charge":
        return "#2196F3";
      case "Valider":
        return "#3F51B5";
      case "Payer":
        return "#FFC107";
      case "Expedition":
        return "#FF9800";
      case "Livraison":
        return "#00BCD4";
      case "Livrer":
        return "#4CAF50";
      default:
        return "#000";
    }
  };

  const paidOrders = orders.filter((order) => order.statut === "Payer");
  const totalCartItems = paidOrders.reduce((acc, item) => acc + item.quantite, 0);
  const totalCartPrice = paidOrders.reduce((acc, item) => acc + item.prix_total, 0);

  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mon Profil</h2>

      {/* Infos personnelles */}
      <div style={styles.profileCard}>
        <p><strong>Nom :</strong> {user.fullname}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Téléphone :</strong> {user.phone}</p>
        <p><strong>Adresse :</strong> {user.adresse_livraison}</p>
      </div>

      {/* Actions */}
      <button style={styles.editButton} onClick={() => navigate(`/update`)}>Modifier le profil</button>
      <button style={styles.settingsButton} onClick={() => navigate(`/updatepassword`)}>Changer le mot de passe</button>

      {/* Panier / dépenses */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Dépense actuel</h3>
        <div style={styles.cartCard}>
          <p><strong>Articles :</strong> {totalCartItems}</p>
          <p><strong>Total :</strong> {totalCartPrice.toLocaleString()} FCFA</p>
        </div>
      </div>

      {/* Commandes récentes */}
      <h3 style={styles.sectionTitle}>Commandes récentes</h3>
      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        orders
          .sort(
            (a, b) =>
              new Date(b.created_date).getTime() -
              new Date(a.created_date).getTime()
          )
          .slice(0, 5)
          .map((order) => (
            <div key={order.commande_id} style={styles.orderCard} onClick={() => navigate(`/order/${order.commande_id}`)}
>
              <div style={styles.orderDetails}>
                <span style={styles.orderId}>{order.commande_id}</span>
                <span style={styles.orderProduit}>{order.nom}</span>
                <span style={styles.orderDate}>{order.created_date}</span>
                <span style={styles.orderTotal}>
                  {order.prix_total.toLocaleString()} FCFA
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
      <button
        style={styles.logoutButton}
        onClick={() => {
          sessionStorage.removeItem("user"); // supprime les infos du client
          window.location.href = "/auth/login";   // redirige vers la page de connexion
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: 5, paddingBottom: 100, minHeight: "100vh", backgroundColor: "#F5F5F5", fontFamily: "Arial, sans-serif" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  profileCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", lineHeight: 1.6 },
  editButton: { width: "100%", padding: 12, backgroundColor: "#00A4A6", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer", marginBottom: 10 },
  settingsButton: { width: "100%", padding: 12, backgroundColor: "#4ECDC4", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer", marginBottom: 10 },
  logoutButton: { width: "100%", padding: 12, backgroundColor: "#ff0000ff", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer", marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  cartCard: { backgroundColor: "#fff", borderRadius: 12, padding: 15, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between" },
  orderCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: "#fff", borderRadius: 12, marginBottom: 15, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer" },
  orderDetails: { display: "flex", flexDirection: "column", gap: 5 },
  orderId: { fontWeight: "bold", fontSize: 16 },
  orderDate: { fontSize: 14, color: "#757575" },
  orderProduit: { fontSize: 14, color: "#333" },
  orderTotal: { fontSize: 16, fontWeight: "bold", color: "#00A4A6" },
  orderStatus: { padding: "5px 12px", borderRadius: 20, color: "#fff", fontWeight: "bold", fontSize: 12, minWidth: 80, textAlign: "center" },
  section: { marginBottom: 20 },
};

export default ProfilePage;