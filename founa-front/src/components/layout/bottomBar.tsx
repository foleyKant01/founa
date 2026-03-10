// src/components/BottomBar.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { House, User, Activity, Package } from "lucide-react";

interface BottomBarItem {
  name: string;
  icon: React.ReactNode;
  path: string; // plus besoin de children ici
}

const BottomBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items: BottomBarItem[] = [
    { name: "Accueil", path: "/home", icon: <House size={22} /> },
    { name: "Activité", path: "/activity", icon: <Activity size={22} /> }, // <-- vers ActivityPage
    { name: "Commandes", path: "/orders", icon: <Package size={22} /> },
    { name: "Profil", path: "/profile", icon: <User size={22} /> },
  ];

  return (
    <nav style={styles.container}>
      {items.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.item,
              color: isActive ? "#00A4A6" : "#555",
            }}
          >
            {item.icon}
            <span style={styles.label}>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

/* 🎨 Styles */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: 60,
    width: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 12,
    cursor: "pointer",
    border: "none",
    background: "transparent",
    padding: 0,
    transition: "color 0.2s",
  },
  label: {
    marginTop: 2,
    fontWeight: 500,
  },
};

export default BottomBar;
