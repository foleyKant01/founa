import React, { useState } from "react";
import BottomBar from "../../components/layout/bottomBar";

// 🔹 Typage d’un produit dans le panier
interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: "Smartphone Samsung", qty: 1, price: 350000, image: "https://via.placeholder.com/80" },
    { id: 2, name: "Robe élégante", qty: 2, price: 80000, image: "https://via.placeholder.com/80" },
    { id: 3, name: "Poulet frais", qty: 5, price: 3500, image: "https://via.placeholder.com/80" },
  ]);

  // Modifier la quantité
  const handleQtyChange = (id: number, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  // Supprimer un produit
  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calcul du total
  const totalPrice: number = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mon Panier</h2>

      <div style={styles.cartList}>
        {cartItems.map((item) => (
          <div key={item.id} style={styles.cartItem}>
            <img
              src={item.image}
              alt={item.name}
              style={styles.itemImage}
            />
            <div style={styles.itemDetails}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.itemPrice}>
                {item.price.toLocaleString()} FCFA
              </p>
              <div style={styles.qtyWrapper}>
                <button
                  style={styles.qtyButton}
                  onClick={() => handleQtyChange(item.id, item.qty - 1)}
                >
                  -
                </button>
                <span style={styles.qtyText}>{item.qty}</span>
                <button
                  style={styles.qtyButton}
                  onClick={() => handleQtyChange(item.id, item.qty + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <button
              style={styles.removeButton}
              onClick={() => handleRemove(item.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div style={styles.totalCard}>
        <div style={styles.totalRow}>
          <span>Total</span>
          <span>{totalPrice.toLocaleString()} FCFA</span>
        </div>
        <button style={styles.checkoutButton}>Passer à la caisse</button>
      </div>

      <BottomBar />
    </div>
  );
};

/* 🎨 Styles */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 15,
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
    fontFamily: "Arial, sans-serif",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  cartList: { display: "flex", flexDirection: "column", gap: 15 },
  cartItem: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    position: "relative",
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, objectFit: "cover", marginRight: 10 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  itemPrice: { fontSize: 14, color: "#00A4A6", marginBottom: 8 },
  qtyWrapper: { display: "flex", alignItems: "center", gap: 8 },
  qtyButton: { padding: "4px 10px", border: "1px solid #00A4A6", borderRadius: 6, cursor: "pointer", background: "#00A4A6", color: "#fff", fontSize: "15px"},
  qtyText: { minWidth: 20, textAlign: "center" },
  removeButton: { position: "absolute", top: 5, right: 5, border: "none", background: "transparent", color: "#FF6B6B", cursor: "pointer" },
  totalCard: { marginTop: 20, backgroundColor: "#fff", padding: 15, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  totalRow: { display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 16, marginBottom: 15 },
  checkoutButton: { width: "100%", padding: 12, backgroundColor: "#00A4A6", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, cursor: "pointer" },
};

export default CartPage;
