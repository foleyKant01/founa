import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  House,
  User,
  Activity,
  Package,
} from "lucide-react";

import { useApp } from "../../context/appContext";

interface BottomBarItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const BottomBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { commandeCount } = useApp();

  const items: BottomBarItem[] = [
    {
      name: "Accueil",
      path: "/home",
      icon: <House size={22} />,
    },
    {
      name: "Activité",
      path: "/activity",
      icon: <Activity size={22} />,
    },
    {
      name: "Commandes",
      path: "/orders",
      icon: <Package size={22} />,
      badge: commandeCount,
    },
    {
      name: "Profil",
      path: "/profile",
      icon: <User size={22} />,
    },
  ];

  // Vérifie si un utilisateur est connecté
  const isUserConnected = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      return false;
    }

    try {
      const parsedUser = JSON.parse(user);
      return !!parsedUser?.uid;
    } catch (error) {
      console.error("Erreur lecture utilisateur :", error);
      return false;
    }
  };

  // Gestion de la navigation
  const handleNavigation = (path: string) => {
    const connected = isUserConnected();

    // Activité et Commandes nécessitent une connexion
    if (
      (path === "/activity" || path === "/orders") &&
      !connected
    ) {
      navigate("/profile");
      return;
    }

    navigate(path);
  };

  return (
    <nav style={styles.container}>
      {items.map((item) => {
        const isActive =
          location.pathname === item.path;

        return (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            style={{
              ...styles.item,
              color: isActive
                ? "#00A4A6"
                : "#555",
            }}
          >
            <div style={styles.iconWrapper}>
              {item.icon}

              {item.badge !== undefined &&
                item.badge > 0 && (
                  <span style={styles.badge}>
                    {item.badge > 99
                      ? "99+"
                      : item.badge}
                  </span>
                )}
            </div>

            <span style={styles.label}>
              {item.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

const styles: {
  [key: string]: React.CSSProperties;
} = {
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
    boxShadow:
      "0 -2px 10px rgba(0,0,0,0.1)",
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

  iconWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    position: "absolute",
    top: -8,
    right: -12,
    minWidth: 18,
    height: 18,
    padding: "0 5px",
    borderRadius: 20,
    backgroundColor: "#e53935",
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
    boxSizing: "border-box",
  },

  label: {
    marginTop: 2,
    fontWeight: 500,
  },
};

export default BottomBar;