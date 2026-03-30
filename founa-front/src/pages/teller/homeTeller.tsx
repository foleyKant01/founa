import React from "react";
import { useNavigate } from "react-router-dom";

const TellerDashboard: React.FC = () => {
    const navigate = useNavigate();

    const admin = true; // à remplacer par ton auth

    if (!admin) return null;

    const handleLogout = () => {
        sessionStorage.removeItem("teller"); // supprime le teller
        navigate("/auth/login"); // redirige vers la page login
    };

    return (
        <div style={styles.container}>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Founa - Marchand</h1>
                    <p style={styles.subtitle}>Bienvenue sur le panneau de gestion des produits</p>
                </div>

                <div>
                    <span style={styles.badge}>Marchand</span>
                </div>
            </div>

            {/* Actions */}
            <div style={styles.grid}>

                <div
                    style={styles.card}
                    onClick={() => navigate("/teller/create")}
                >
                    <div style={styles.icon}>➕</div>
                    <h3 style={styles.cardTitle}>Créer un produit</h3>
                    <p style={styles.cardText}>
                        Ajoutez de nouveaux produits à votre boutique
                    </p>
                </div>

                <div
                    style={styles.card}
                    onClick={() => navigate("/teller/readall")}
                >
                    <div style={styles.icon}>📦</div>
                    <h3 style={styles.cardTitle}>Voir les produits</h3>
                    <p style={styles.cardText}>
                        Consultez et gérez tous les produits
                    </p>
                </div>

                <div
                    style={styles.card}
                    onClick={() => navigate("/teller/allorderteller")}
                >
                    <div style={styles.icon}>🛒</div>
                    <h3 style={styles.cardTitle}>Commandes</h3>
                    <p style={styles.cardText}>
                        Voir toutes les commandes passées par les utilisateurs
                    </p>
                </div> 

                <div style={styles.card} onClick={() => navigate("/teller/stateteller")}>
                    <div style={styles.icon}>📊</div>
                    <h3 style={styles.cardTitle}>Statistiques</h3>
                    <p style={styles.cardText}>Bientôt disponible</p>
                </div>

            </div>

            {/* Info */}
            <div style={styles.info}>
                <h2 style={styles.infoTitle}>📢 Information</h2>
                <p style={styles.infoText}>
                    Vous êtes connecté à l’espace administrateur.<br />
                    Utilisez les cartes ci-dessus pour gérer efficacement votre plateforme.
                </p>
            </div>

            {/* Bouton Déconnexion */}
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <button style={styles.logoutButton} onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>

        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {

    container: {
        minHeight: "80vh",
        padding: "30px 20px",
        background: "linear-gradient(135deg, #f4f7fb, #eaeef5)",
        fontFamily: "Segoe UI, sans-serif",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
        flexWrap: "wrap",
        gap: 15,
    },

    title: {
        margin: 0,
        fontSize: 28,
        color: "#1f2937",
    },

    subtitle: {
        marginTop: 5,
        color: "#6b7280",
    },

    badge: {
        background: "#00a4a6",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: 20,
        fontWeight: 600,
        fontSize: 14,
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 25,
        marginBottom: 40,
    },

    card: {
        background: "#fff",
        borderRadius: 16,
        padding: 25,
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        transition: "0.3s",
    },

    disabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },

    icon: {
        fontSize: 40,
        marginBottom: 15,
    },

    cardTitle: {
        margin: 0,
        fontSize: 20,
        color: "#111827",
    },

    cardText: {
        marginTop: 8,
        fontSize: 14,
        color: "#6b7280",
    },

    info: {
        background: "#fff",
        borderRadius: 16,
        padding: 25,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    },

    infoTitle: {
        marginTop: 0,
        color: "#1f2937",
    },

    infoText: {
        color: "#4b5563",
        lineHeight: 1.6,
    },

    logoutButton: {
        backgroundColor: "#EF4444",
        color: "#fff",
        border: "none",
        padding: "12px 28px",
        borderRadius: 12,
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        transition: "0.2s",
    }
};

export default TellerDashboard;