// src/pages/activity/HistoryPage.tsx
import React from "react";
import { useActivity } from "../../context/activityContext";
import BottomBar from "../../components/layout/bottomBar";

const HistoryPage: React.FC = () => {
  const { history } = useActivity(); // Hook pour récupérer l'historique

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Historique</h2>

      {history.length === 0 ? (
        <p style={styles.emptyText}>Aucune activité récente pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {history.map((item) => (
            <div key={item.id} style={styles.card}>
              <span style={styles.titleText}>{item.title}</span>
              <small style={styles.dateText}>{item.date}</small>
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  titleText: { fontSize: 16, fontWeight: 500 },
  dateText: { fontSize: 12, color: "#888" },
};

export default HistoryPage;
