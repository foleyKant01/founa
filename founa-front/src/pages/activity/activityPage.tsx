// src/pages/activity/ActivityPage.tsx
import React, { useState } from "react";
import { Heart, History } from "lucide-react";
import BottomBar from "../../components/layout/bottomBar";
import { useActivity } from "../../context/activityContext";

type TabType = "favorites" | "history";

const ActivityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("favorites");

  // 🔹 Récupération des données du contexte
  const { favorites, history } = useActivity();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Activités</h2>

      {/* 🔀 Onglets Favoris / Historique */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("favorites")}
          style={{
            ...styles.tabButton,
            ...(activeTab === "favorites" ? styles.activeTab : {}),
          }}
        >
          <Heart size={16} /> Favoris
        </button>

        <button
          onClick={() => setActiveTab("history")}
          style={{
            ...styles.tabButton,
            ...(activeTab === "history" ? styles.activeTab : {}),
          }}
        >
          <History size={16} /> Historique
        </button>
      </div>

      {/* 📄 Contenu selon onglet actif */}
      <div style={styles.list}>
        {activeTab === "favorites" ? (
          favorites.length === 0 ? (
            <p>Aucun favori pour le moment</p>
          ) : (
            favorites.map((item) => (
              <div key={item.uid} style={styles.card}>
                {item.image && <img src={item.image} alt={item.nom} style={styles.image} />}
                <span>{item.nom}</span>
              </div>
            ))
          )
        ) : history.length === 0 ? (
          <p>Aucune activité récente</p>
        ) : (
          history.map((item) => (
            <div key={item.id} style={styles.historyItem}>
              <span>{item.title}</span>
              <small>{item.date}</small>
            </div>
          ))
        )}
      </div>

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

  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #00A4A6",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  activeTab: {
    backgroundColor: "#00A4A6",
    color: "#fff",
  },

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
    padding: 10,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    objectFit: "cover",
  },

  historyItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
};

export default ActivityPage;
