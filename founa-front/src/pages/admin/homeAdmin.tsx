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
  LogOut,
  Plus,
  ArrowUpRight,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/auth/login");
  };

  const admin = true;

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
      description: "Consultez, modifiez et gérez les comptes Tellers.",
      icon: Users,
      color: "#2563EB",
      background: "#EFF6FF",
      path: "/admin/view-all-tellers",
    },
    {
      title: "Recherches sans résultat",
      description: "Analysez les recherches de produits introuvables.",
      icon: SearchX,
      color: "#F59E0B",
      background: "#FFFBEB",
      path: "/admin/search-no-results",
    },
    {
      title: "Gérer les produits",
      description: "Consultez, modifiez et gérez votre catalogue.",
      icon: Package,
      color: "#7C3AED",
      background: "#F5F3FF",
      path: "/admin/readall",
    },
    {
      title: "Gérer les commandes",
      description: "Suivez et gérez toutes les commandes clients.",
      icon: ShoppingCart,
      color: "#16A34A",
      background: "#F0FDF4",
      path: "/admin/allorders",
    },
  ];

  return (
    <div style={styles.container}>

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header style={styles.header}>

        <div style={styles.headerLeft}>

          <div style={styles.logo}>
            <ShieldCheck size={28} color="#FFFFFF" />
          </div>

          <div>
            <h1 style={styles.title}>
              Founa Admin
            </h1>

            <p style={styles.subtitle}>
              Tableau de bord administrateur
            </p>
          </div>

        </div>

        <div style={styles.headerRight}>

          <div style={styles.adminProfile}>

            <div style={styles.avatar}>
              A
            </div>

            <div>
              <strong style={styles.adminName}>
                Administrateur
              </strong>

              <span style={styles.online}>
                <span style={styles.onlineDot}></span>
                En ligne
              </span>
            </div>

          </div>

          <button
            type="button"
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Déconnexion
          </button>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}
      <section style={styles.hero}>

        <div style={styles.heroContent}>

          <div style={styles.heroIcon}>
            <BarChart3 size={34} color="#00A4A6" />
          </div>

          <div>
            <span style={styles.heroSmallTitle}>
              ESPACE ADMINISTRATION
            </span>

            <h2 style={styles.heroTitle}>
              Bienvenue dans votre espace de gestion 👋
            </h2>

            <p style={styles.heroText}>
              Gérez les utilisateurs, les produits, les commandes
              et les recherches de la plateforme Founa depuis un
              seul espace.
            </p>
          </div>

        </div>

        <div style={styles.heroStatus}>
          <span style={styles.statusDot}></span>
          Plateforme opérationnelle
        </div>

      </section>


      {/* =====================================================
          SECTION TITRE
      ===================================================== */}
      <div style={styles.sectionHeader}>

        <div>
          <h2 style={styles.sectionTitle}>
            Gestion de la plateforme
          </h2>

          <p style={styles.sectionDescription}>
            Accédez rapidement aux principales fonctionnalités
          </p>
        </div>

        <div style={styles.sectionBadge}>
          5 fonctionnalités
        </div>

      </div>


      {/* =====================================================
          CARDS
      ===================================================== */}
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
                  "0 16px 35px rgba(15,23,42,0.10)";
                e.currentTarget.style.borderColor = section.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(15,23,42,0.05)";
                e.currentTarget.style.borderColor = "#E8ECEF";
              }}
            >

              {/* ICON */}
              <div
                style={{
                  ...styles.iconContainer,
                  backgroundColor: section.background,
                }}
              >
                <Icon
                  size={28}
                  color={section.color}
                  strokeWidth={2}
                />
              </div>


              {/* CONTENT */}
              <div style={styles.cardContent}>

                <div style={styles.cardTop}>

                  <h3 style={styles.cardTitle}>
                    {section.title}
                  </h3>

                  <ArrowUpRight
                    size={18}
                    color="#9CA3AF"
                  />

                </div>

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
                  <ChevronRight size={16} />
                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}
      <section style={styles.quickSection}>

        <div style={styles.quickHeader}>

          <div>
            <h2 style={styles.quickTitle}>
              Accès rapide
            </h2>

            <p style={styles.quickDescription}>
              Les actions administratives les plus utilisées
            </p>
          </div>

        </div>


        <div style={styles.quickGrid}>

          <button
            type="button"
            style={styles.quickButton}
            onClick={() => navigate("/admin/readall")}
          >
            <div
              style={{
                ...styles.quickIcon,
                background: "#E6F7F7",
              }}
            >
              <Package
                size={21}
                color="#00A4A6"
              />
            </div>

            <div style={styles.quickContent}>
              <strong>Produits</strong>
              <span>Gérer le catalogue</span>
            </div>

            <ChevronRight
              size={18}
              color="#9CA3AF"
            />
          </button>


          <button
            type="button"
            style={styles.quickButton}
            onClick={() => navigate("/admin/allorders")}
          >
            <div
              style={{
                ...styles.quickIcon,
                background: "#F0FDF4",
              }}
            >
              <ShoppingCart
                size={21}
                color="#16A34A"
              />
            </div>

            <div style={styles.quickContent}>
              <strong>Commandes</strong>
              <span>Suivre les commandes</span>
            </div>

            <ChevronRight
              size={18}
              color="#9CA3AF"
            />
          </button>


          <button
            type="button"
            style={styles.quickButton}
            onClick={() => navigate("/admin/view-all-tellers")}
          >
            <div
              style={{
                ...styles.quickIcon,
                background: "#EFF6FF",
              }}
            >
              <Users
                size={21}
                color="#2563EB"
              />
            </div>

            <div style={styles.quickContent}>
              <strong>Tellers</strong>
              <span>Gérer votre équipe</span>
            </div>

            <ChevronRight
              size={18}
              color="#9CA3AF"
            />
          </button>


          <button
            type="button"
            style={styles.quickButton}
            onClick={() => navigate("/admin/create-teller")}
          >
            <div
              style={{
                ...styles.quickIcon,
                background: "#F5F3FF",
              }}
            >
              <Plus
                size={21}
                color="#7C3AED"
              />
            </div>

            <div style={styles.quickContent}>
              <strong>Nouveau Teller</strong>
              <span>Créer un compte</span>
            </div>

            <ChevronRight
              size={18}
              color="#9CA3AF"
            />
          </button>

        </div>

      </section>


      {/* =====================================================
          SECURITY INFO
      ===================================================== */}
      <section style={styles.securitySection}>

        <div style={styles.securityIcon}>
          <ShieldCheck
            size={24}
            color="#00A4A6"
          />
        </div>

        <div style={styles.securityContent}>

          <strong style={styles.securityTitle}>
            Espace administrateur sécurisé
          </strong>

          <p style={styles.securityText}>
            Vous disposez des droits nécessaires pour superviser
            les utilisateurs, les produits, les commandes et
            les opérations de la plateforme Founa.
          </p>

        </div>

        <div style={styles.securityBadge}>
          <span style={styles.securityDot}></span>
          Sécurisé
        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer style={styles.footer}>

        <span>
          Founa Administration
        </span>

        <span>
          •
        </span>

        <span>
          Tableau de bord
        </span>

      </footer>

    </div>
  );
};


const styles: {
  [key: string]: React.CSSProperties;
} = {

  /* =====================================================
     CONTAINER
  ===================================================== */

  container: {
    width: "100%",
    minHeight: "100vh",
    padding: "28px 35px 40px",
    background: "#F6F8FA",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },


  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 28,
    flexWrap: "wrap",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 15,
    background: "#00A4A6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 7px 18px rgba(0,164,166,0.22)",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 750,
    color: "#111827",
    letterSpacing: "-0.4px",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#7A8490",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },

  adminProfile: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#111827",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
  },

  adminName: {
    display: "block",
    fontSize: 13,
    color: "#1F2937",
  },

  online: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
    fontSize: 11,
    color: "#16A34A",
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#16A34A",
  },

  logoutButton: {
    height: 40,
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    border: "1px solid #E5E7EB",
    borderRadius: 9,
    background: "#FFFFFF",
    color: "#374151",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },


  /* =====================================================
     HERO
  ===================================================== */

  hero: {
    width: "100%",
    minHeight: 150,
    padding: "26px 30px",
    marginBottom: 32,
    borderRadius: 18,
    background:
      "linear-gradient(135deg, #FFFFFF 0%, #EFFBFB 100%)",
    border: "1px solid #DDEEEE",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 25,
    boxSizing: "border-box",
  },

  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    minWidth: 0,
  },

  heroIcon: {
    width: 64,
    height: 64,
    minWidth: 64,
    borderRadius: 17,
    background: "#E6F7F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  heroSmallTitle: {
    display: "block",
    marginBottom: 5,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1px",
    color: "#00A4A6",
  },

  heroTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 750,
    color: "#1F2937",
    letterSpacing: "-0.3px",
  },

  heroText: {
    maxWidth: 800,
    margin: "7px 0 0",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#6B7280",
  },

  heroStatus: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 13px",
    borderRadius: 30,
    background: "#FFFFFF",
    border: "1px solid #E1E8E8",
    color: "#374151",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#16A34A",
  },


  /* =====================================================
     SECTION HEADER
  ===================================================== */

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 17,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 700,
    color: "#1F2937",
  },

  sectionDescription: {
    margin: "4px 0 0",
    fontSize: 12,
    color: "#89929D",
  },

  sectionBadge: {
    padding: "7px 11px",
    borderRadius: 8,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    color: "#6B7280",
    fontSize: 11,
    fontWeight: 600,
  },


  /* =====================================================
     MAIN GRID
  ===================================================== */

  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 18,
    marginBottom: 30,
  },


  /* =====================================================
     CARD
  ===================================================== */

  card: {
    minHeight: 150,
    background: "#FFFFFF",
    border: "1px solid #E8ECEF",
    borderRadius: 16,
    padding: 21,
    display: "flex",
    alignItems: "flex-start",
    gap: 15,
    cursor: "pointer",
    boxSizing: "border-box",
    boxShadow: "0 6px 20px rgba(15,23,42,0.05)",
    transition: "all 0.25s ease",
  },

  iconContainer: {
    width: 54,
    height: 54,
    minWidth: 54,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    flex: 1,
    minWidth: 0,
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  cardTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: "#1F2937",
  },

  cardDescription: {
    margin: "7px 0 14px",
    fontSize: 12.5,
    lineHeight: 1.55,
    color: "#7A8490",
  },

  cardAction: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    fontSize: 12,
    fontWeight: 700,
  },


  /* =====================================================
     QUICK ACTIONS
  ===================================================== */

  quickSection: {
    width: "100%",
    padding: 22,
    marginBottom: 22,
    background: "#FFFFFF",
    border: "1px solid #E8ECEF",
    borderRadius: 16,
    boxSizing: "border-box",
  },

  quickHeader: {
    marginBottom: 18,
  },

  quickTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: "#1F2937",
  },

  quickDescription: {
    margin: "4px 0 0",
    fontSize: 12,
    color: "#8A939E",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 12,
  },

  quickButton: {
    width: "100%",
    minHeight: 68,
    padding: "10px 13px",
    border: "1px solid #EDF0F2",
    borderRadius: 11,
    background: "#FAFBFC",
    display: "flex",
    alignItems: "center",
    gap: 11,
    cursor: "pointer",
    textAlign: "left",
  },

  quickIcon: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  quickContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  /* =====================================================
     SECURITY
  ===================================================== */

  securitySection: {
    width: "100%",
    padding: 20,
    marginBottom: 25,
    background: "#F0FBFB",
    border: "1px solid #D9EEEE",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    gap: 13,
    boxSizing: "border-box",
  },

  securityIcon: {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: 11,
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    display: "block",
    fontSize: 13,
    color: "#374151",
  },

  securityText: {
    margin: "4px 0 0",
    fontSize: 11.5,
    lineHeight: 1.5,
    color: "#6B7280",
  },

  securityBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 11px",
    borderRadius: 20,
    background: "#FFFFFF",
    color: "#16A34A",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  securityDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#16A34A",
  },


  /* =====================================================
     FOOTER
  ===================================================== */

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 5,
    color: "#9CA3AF",
    fontSize: 11,
  },
};

export default AdminDashboard;