import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Users,
  SearchX,
  Package,
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const admin = true; // À remplacer par ton système d'authentification

  if (!admin) return null;

  const sections = [
    {
      title: "Créer un Teller",
      description: "Ajoutez un nouveau Teller à votre équipe.",
      icon: UserPlus,
      color: "#00A4A6",
      background: "#E6F7F7",
      path: "/admin/create-teller",
    },
    {
      title: "Gérer les Tellers",
      description: "Consultez, modifiez et gérez vos Tellers.",
      icon: Users,
      color: "#2563EB",
      background: "#EFF6FF",
      path: "/admin/view-all-tellers",
    },
    {
      title: "Recherches sans résultat",
      description: "Consultez les produits recherchés mais introuvables.",
      icon: SearchX,
      color: "#F59E0B",
      background: "#FFFBEB",
      path: "/admin/search-no-results",
    },
    {
      title: "Gérer les produits",
      description: "Consultez et gérez l'ensemble des produits.",
      icon: Package,
      color: "#7C3AED",
      background: "#F5F3FF",
      path: "/admin/view-all-products",
    },
    {
      title: "Gérer les commandes",
      description: "Suivez et gérez toutes les commandes clients.",
      icon: ShoppingCart,
      color: "#16A34A",
      background: "#F0FDF4",
      path: "/admin/orders",
    },
  ];

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <header style={styles.header}>

        <div style={styles.headerLeft}>
          <div style={styles.logoContainer}>
            <ShieldCheck size={30} color="#00A4A6" />
          </div>

          <div>
            <h1 style={styles.title}>Founa Admin</h1>
            <p style={styles.subtitle}>
              Tableau de bord administrateur
            </p>
          </div>
        </div>

        <div style={styles.adminBadge}>
          <div style={styles.adminDot}></div>
          Administrateur
        </div>

      </header>

      {/* WELCOME */}
      <section style={styles.welcomeSection}>

        <div>
          <h2 style={styles.welcomeTitle}>
            Bienvenue dans votre espace de gestion 👋
          </h2>

          <p style={styles.welcomeText}>
            Gérez vos Tellers, produits, commandes et recherches
            depuis votre tableau de bord.
          </p>
        </div>

        <div style={styles.dashboardIcon}>
          <BarChart3 size={42} color="#00A4A6" />
        </div>

      </section>

      {/* SECTION TITLE */}
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>
            Gestion de la plateforme
          </h2>

          <p style={styles.sectionDescription}>
            Sélectionnez une action pour continuer
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div style={styles.grid}>

        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <div
              key={section.title}
              style={styles.card}
              onClick={() => navigate(section.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0,0,0,0.06)";
              }}
            >

              {/* ICON */}
              <div
                style={{
                  ...styles.iconContainer,
                  backgroundColor: section.background,
                }}
              >
                <Icon size={30} color={section.color} />
              </div>

              {/* CONTENT */}
              <div style={styles.cardContent}>

                <h3 style={styles.cardTitle}>
                  {section.title}
                </h3>

                <p style={styles.cardDescription}>
                  {section.description}
                </p>

                <div
                  style={{
                    ...styles.cardAction,
                    color: section.color,
                  }}
                >
                  Accéder
                  <ChevronRight size={17} />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* QUICK SUMMARY */}
      <section style={styles.infoSection}>

        <div style={styles.infoIcon}>
          <ShieldCheck size={24} color="#00A4A6" />
        </div>

        <div>
          <h3 style={styles.infoTitle}>
            Espace administrateur sécurisé
          </h3>

          <p style={styles.infoText}>
            Cet espace vous permet de superviser les principaux
            éléments de la plateforme Founa : utilisateurs,
            produits, commandes et demandes de recherche.
          </p>
        </div>

      </section>

    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {

  container: {
    minHeight: "100vh",
    padding: "35px 30px 60px",
    background: "#F6F8FA",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  /* HEADER */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 35,
    gap: 20,
    flexWrap: "wrap",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "#E6F7F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    margin: 0,
    fontSize: 27,
    fontWeight: 750,
    color: "#17202A",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: 14,
    color: "#7A8591",
  },

  adminBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 15px",
    borderRadius: 30,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    color: "#374151",
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  adminDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#16A34A",
  },

  /* WELCOME */

  welcomeSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: "28px 30px",
    marginBottom: 35,
    borderRadius: 18,
    background:
      "linear-gradient(135deg, #FFFFFF 0%, #F0FBFB 100%)",
    border: "1px solid #E5EEEE",
    boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
  },

  welcomeTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#1F2937",
  },

  welcomeText: {
    margin: "8px 0 0",
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 1.6,
  },

  dashboardIcon: {
    minWidth: 70,
    height: 70,
    borderRadius: 18,
    background: "#E6F7F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* SECTION */

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 700,
    color: "#1F2937",
  },

  sectionDescription: {
    margin: "5px 0 0",
    fontSize: 13,
    color: "#8A939E",
  },

  /* GRID */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
    marginBottom: 35,
  },

  /* CARD */

  card: {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    border: "1px solid #E8ECEF",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    cursor: "pointer",
    display: "flex",
    gap: 17,
    alignItems: "flex-start",
    transition: "all 0.25s ease",
  },

  iconContainer: {
    width: 55,
    height: 55,
    minWidth: 55,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 700,
    color: "#1F2937",
  },

  cardDescription: {
    margin: "7px 0 13px",
    fontSize: 13,
    lineHeight: 1.5,
    color: "#7A8490",
  },

  cardAction: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    fontSize: 13,
    fontWeight: 700,
  },

  /* INFO */

  infoSection: {
    display: "flex",
    alignItems: "flex-start",
    gap: 15,
    background: "#FFFFFF",
    // border: "1px solid #E5E7EB",
    borderRadius: 16,
    padding: 22,
    // boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
  },

  infoIcon: {
    width: 45,
    height: 45,
    minWidth: 45,
    borderRadius: 12,
    background: "#E6F7F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  infoTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: "#374151",
  },

  infoText: {
    margin: "5px 0 0",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#6B7280",
  },
};

export default AdminDashboard;