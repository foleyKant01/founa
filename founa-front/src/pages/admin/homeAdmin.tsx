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



// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Package,
//     ShoppingCart,
//     Users,
//     Plus,
//     ArrowRight,
//     TrendingUp,
//     Clock,
//     CheckCircle,
//     AlertCircle,
//     LogOut,
//     LayoutDashboard,
// } from "lucide-react";

// const AdminDashboard: React.FC = () => {
//     const navigate = useNavigate();

//     const admin = true; // À remplacer par ton système d'authentification

//     if (!admin) return null;

//     const handleLogout = () => {
//         localStorage.removeItem("admin");
//         navigate("/auth/login");
//     };

//     return (
//         <div style={styles.container}>

//             {/* HEADER */}
//             <header style={styles.header}>

//                 <div style={styles.headerLeft}>

//                     <div style={styles.logo}>
//                         <LayoutDashboard size={26} />
//                     </div>

//                     <div>
//                         <h1 style={styles.title}>
//                             Tableau de bord
//                         </h1>

//                         <p style={styles.subtitle}>
//                             Administration de la plateforme Founa
//                         </p>
//                     </div>

//                 </div>

//                 <div style={styles.headerRight}>

//                     <div style={styles.adminProfile}>

//                         <div style={styles.avatar}>
//                             A
//                         </div>

//                         <div>
//                             <strong style={styles.adminName}>
//                                 Administrateur
//                             </strong>

//                             <span style={styles.adminStatus}>
//                                 ● En ligne
//                             </span>
//                         </div>

//                     </div>

//                     <button
//                         style={styles.logoutButton}
//                         onClick={handleLogout}
//                     >
//                         <LogOut size={17} />
//                         Déconnexion
//                     </button>

//                 </div>

//             </header>


//             {/* STATISTIQUES */}
//             <section style={styles.statsGrid}>

//                 <div style={styles.statCard}>

//                     <div style={{
//                         ...styles.statIcon,
//                         background: "#e0f7f7",
//                         color: "#00a4a6"
//                     }}>
//                         <Package size={25} />
//                     </div>

//                     <div style={styles.statContent}>
//                         <span style={styles.statLabel}>
//                             Produits
//                         </span>

//                         <strong style={styles.statValue}>
//                             248
//                         </strong>

//                         <span style={styles.statEvolution}>
//                             <TrendingUp size={14} />
//                             +12% ce mois
//                         </span>
//                     </div>

//                 </div>


//                 <div style={styles.statCard}>

//                     <div style={{
//                         ...styles.statIcon,
//                         background: "#eef2ff",
//                         color: "#4f46e5"
//                     }}>
//                         <ShoppingCart size={25} />
//                     </div>

//                     <div style={styles.statContent}>
//                         <span style={styles.statLabel}>
//                             Commandes
//                         </span>

//                         <strong style={styles.statValue}>
//                             126
//                         </strong>

//                         <span style={styles.statEvolution}>
//                             <TrendingUp size={14} />
//                             +8% ce mois
//                         </span>
//                     </div>

//                 </div>


//                 <div style={styles.statCard}>

//                     <div style={{
//                         ...styles.statIcon,
//                         background: "#ecfdf5",
//                         color: "#10b981"
//                     }}>
//                         <Users size={25} />
//                     </div>

//                     <div style={styles.statContent}>
//                         <span style={styles.statLabel}>
//                             Tellers
//                         </span>

//                         <strong style={styles.statValue}>
//                             14
//                         </strong>

//                         <span style={styles.statEvolution}>
//                             11 actifs
//                         </span>
//                     </div>

//                 </div>


//                 <div style={styles.statCard}>

//                     <div style={{
//                         ...styles.statIcon,
//                         background: "#fff7ed",
//                         color: "#f97316"
//                     }}>
//                         <Clock size={25} />
//                     </div>

//                     <div style={styles.statContent}>
//                         <span style={styles.statLabel}>
//                             En attente
//                         </span>

//                         <strong style={styles.statValue}>
//                             18
//                         </strong>

//                         <span style={styles.statWarning}>
//                             À traiter
//                         </span>
//                     </div>

//                 </div>

//             </section>


//             {/* ACTIONS PRINCIPALES */}
//             <section>

//                 <div style={styles.sectionHeader}>

//                     <div>
//                         <h2 style={styles.sectionTitle}>
//                             Gestion de la plateforme
//                         </h2>

//                         <p style={styles.sectionSubtitle}>
//                             Accédez rapidement aux principales fonctionnalités
//                         </p>
//                     </div>

//                 </div>


//                 <div style={styles.actionsGrid}>

//                     {/* AJOUTER PRODUIT */}
//                     <div
//                         style={{
//                             ...styles.actionCard,
//                             borderTop: "4px solid #00a4a6"
//                         }}
//                         onClick={() => navigate("/admin/create")}
//                     >

//                         <div style={{
//                             ...styles.actionIcon,
//                             background: "#e0f7f7",
//                             color: "#00a4a6"
//                         }}>
//                             <Plus size={30} />
//                         </div>

//                         <div style={styles.actionBody}>

//                             <h3 style={styles.actionTitle}>
//                                 Ajouter un produit
//                             </h3>

//                             <p style={styles.actionText}>
//                                 Ajoutez de nouveaux produits au catalogue Founa.
//                             </p>

//                         </div>

//                         <ArrowRight
//                             size={21}
//                             style={styles.arrow}
//                         />

//                     </div>


//                     {/* PRODUITS */}
//                     <div
//                         style={{
//                             ...styles.actionCard,
//                             borderTop: "4px solid #4f46e5"
//                         }}
//                         onClick={() => navigate("/admin/readall")}
//                     >

//                         <div style={{
//                             ...styles.actionIcon,
//                             background: "#eef2ff",
//                             color: "#4f46e5"
//                         }}>
//                             <Package size={30} />
//                         </div>

//                         <div style={styles.actionBody}>

//                             <h3 style={styles.actionTitle}>
//                                 Voir les produits
//                             </h3>

//                             <p style={styles.actionText}>
//                                 Consultez, modifiez et gérez tous les produits.
//                             </p>

//                         </div>

//                         <ArrowRight
//                             size={21}
//                             style={styles.arrow}
//                         />

//                     </div>


//                     {/* COMMANDES */}
//                     <div
//                         style={{
//                             ...styles.actionCard,
//                             borderTop: "4px solid #f97316"
//                         }}
//                         onClick={() => navigate("/admin/orders")}
//                     >

//                         <div style={{
//                             ...styles.actionIcon,
//                             background: "#fff7ed",
//                             color: "#f97316"
//                         }}>
//                             <ShoppingCart size={30} />
//                         </div>

//                         <div style={styles.actionBody}>

//                             <h3 style={styles.actionTitle}>
//                                 Voir les commandes
//                             </h3>

//                             <p style={styles.actionText}>
//                                 Suivez et gérez toutes les commandes clients.
//                             </p>

//                         </div>

//                         <ArrowRight
//                             size={21}
//                             style={styles.arrow}
//                         />

//                     </div>


//                     {/* TELLERS */}
//                     <div
//                         style={{
//                             ...styles.actionCard,
//                             borderTop: "4px solid #10b981"
//                         }}
//                         onClick={() => navigate("/admin/tellers")}
//                     >

//                         <div style={{
//                             ...styles.actionIcon,
//                             background: "#ecfdf5",
//                             color: "#10b981"
//                         }}>
//                             <Users size={30} />
//                         </div>

//                         <div style={styles.actionBody}>

//                             <h3 style={styles.actionTitle}>
//                                 Voir les Tellers
//                             </h3>

//                             <p style={styles.actionText}>
//                                 Gérez les comptes et l'activité des Tellers.
//                             </p>

//                         </div>

//                         <ArrowRight
//                             size={21}
//                             style={styles.arrow}
//                         />

//                     </div>

//                 </div>

//             </section>


//             {/* BAS DU DASHBOARD */}
//             <section style={styles.bottomGrid}>

//                 {/* ACTIVITÉ */}
//                 <div style={styles.panel}>

//                     <div style={styles.panelHeader}>

//                         <div>
//                             <h2 style={styles.panelTitle}>
//                                 Activité récente
//                             </h2>

//                             <p style={styles.panelSubtitle}>
//                                 Dernières actions sur la plateforme
//                             </p>
//                         </div>

//                         <button
//                             style={styles.viewButton}
//                             onClick={() => navigate("/admin/activity")}
//                         >
//                             Voir tout
//                         </button>

//                     </div>


//                     <div style={styles.activityList}>

//                         <div style={styles.activityItem}>

//                             <div style={{
//                                 ...styles.activityIcon,
//                                 background: "#e0f7f7",
//                                 color: "#00a4a6"
//                             }}>
//                                 <Plus size={17} />
//                             </div>

//                             <div style={styles.activityInfo}>

//                                 <strong>
//                                     Nouveau produit ajouté
//                                 </strong>

//                                 <span>
//                                     Il y a 5 minutes
//                                 </span>

//                             </div>

//                         </div>


//                         <div style={styles.activityItem}>

//                             <div style={{
//                                 ...styles.activityIcon,
//                                 background: "#eef2ff",
//                                 color: "#4f46e5"
//                             }}>
//                                 <ShoppingCart size={17} />
//                             </div>

//                             <div style={styles.activityInfo}>

//                                 <strong>
//                                     Nouvelle commande
//                                 </strong>

//                                 <span>
//                                     Il y a 12 minutes
//                                 </span>

//                             </div>

//                         </div>


//                         <div style={styles.activityItem}>

//                             <div style={{
//                                 ...styles.activityIcon,
//                                 background: "#ecfdf5",
//                                 color: "#10b981"
//                             }}>
//                                 <Users size={17} />
//                             </div>

//                             <div style={styles.activityInfo}>

//                                 <strong>
//                                     Nouveau Teller connecté
//                                 </strong>

//                                 <span>
//                                     Il y a 24 minutes
//                                 </span>

//                             </div>

//                         </div>

//                     </div>

//                 </div>


//                 {/* COMMANDES */}
//                 <div style={styles.panel}>

//                     <div style={styles.panelHeader}>

//                         <div>
//                             <h2 style={styles.panelTitle}>
//                                 État des commandes
//                             </h2>

//                             <p style={styles.panelSubtitle}>
//                                 Vue rapide
//                             </p>
//                         </div>

//                         <button
//                             style={styles.viewButton}
//                             onClick={() => navigate("/admin/orders")}
//                         >
//                             Commandes
//                         </button>

//                     </div>


//                     <div style={styles.orderStats}>

//                         <div style={styles.orderRow}>

//                             <div style={styles.orderLabel}>
//                                 <span style={{
//                                     ...styles.dot,
//                                     background: "#f59e0b"
//                                 }} />

//                                 En attente
//                             </div>

//                             <strong>18</strong>

//                         </div>


//                         <div style={styles.orderRow}>

//                             <div style={styles.orderLabel}>
//                                 <span style={{
//                                     ...styles.dot,
//                                     background: "#3b82f6"
//                                 }} />

//                                 En traitement
//                             </div>

//                             <strong>32</strong>

//                         </div>


//                         <div style={styles.orderRow}>

//                             <div style={styles.orderLabel}>
//                                 <span style={{
//                                     ...styles.dot,
//                                     background: "#10b981"
//                                 }} />

//                                 Livrées
//                             </div>

//                             <strong>64</strong>

//                         </div>


//                         <div style={styles.orderRow}>

//                             <div style={styles.orderLabel}>
//                                 <span style={{
//                                     ...styles.dot,
//                                     background: "#ef4444"
//                                 }} />

//                                 Annulées
//                             </div>

//                             <strong>12</strong>

//                         </div>

//                     </div>

//                 </div>

//             </section>


//             {/* MESSAGE */}
//             <div style={styles.infoBox}>

//                 <div style={styles.infoIcon}>
//                     <CheckCircle size={22} />
//                 </div>

//                 <div>
//                     <strong>
//                         Plateforme opérationnelle
//                     </strong>

//                     <p>
//                         Tous les services de Founa fonctionnent normalement.
//                     </p>
//                 </div>

//             </div>

//         </div>
//     );
// };


// const styles: { [key: string]: React.CSSProperties } = {

//     container: {
//         minHeight: "100vh",
//         padding: "30px",
//         background: "#f5f7fb",
//         fontFamily: "Segoe UI, Arial, sans-serif",
//         boxSizing: "border-box",
//     },

//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 35,
//         gap: 20,
//         flexWrap: "wrap",
//     },

//     headerLeft: {
//         display: "flex",
//         alignItems: "center",
//         gap: 15,
//     },

//     logo: {
//         width: 52,
//         height: 52,
//         borderRadius: 14,
//         background: "#00a4a6",
//         color: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         boxShadow: "0 8px 20px rgba(0,164,166,0.25)",
//     },

//     title: {
//         margin: 0,
//         fontSize: 30,
//         fontWeight: 700,
//         color: "#111827",
//     },

//     subtitle: {
//         margin: "5px 0 0",
//         color: "#6b7280",
//         fontSize: 14,
//     },

//     headerRight: {
//         display: "flex",
//         alignItems: "center",
//         gap: 20,
//     },

//     adminProfile: {
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//     },

//     avatar: {
//         width: 42,
//         height: 42,
//         borderRadius: "50%",
//         background: "#111827",
//         color: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontWeight: 700,
//     },

//     adminName: {
//         display: "block",
//         color: "#1f2937",
//         fontSize: 14,
//     },

//     adminStatus: {
//         display: "block",
//         color: "#10b981",
//         fontSize: 12,
//         marginTop: 2,
//     },

//     logoutButton: {
//         border: "1px solid #e5e7eb",
//         background: "#fff",
//         color: "#374151",
//         padding: "10px 15px",
//         borderRadius: 10,
//         cursor: "pointer",
//         display: "flex",
//         alignItems: "center",
//         gap: 7,
//         fontWeight: 600,
//     },

//     statsGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//         gap: 20,
//         marginBottom: 40,
//     },

//     statCard: {
//         background: "#fff",
//         borderRadius: 16,
//         padding: 22,
//         display: "flex",
//         alignItems: "center",
//         gap: 16,
//         boxShadow: "0 5px 20px rgba(15,23,42,0.05)",
//         border: "1px solid #eef0f4",
//     },

//     statIcon: {
//         width: 50,
//         height: 50,
//         borderRadius: 13,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexShrink: 0,
//     },

//     statContent: {
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//     },

//     statLabel: {
//         color: "#6b7280",
//         fontSize: 13,
//     },

//     statValue: {
//         color: "#111827",
//         fontSize: 25,
//     },

//     statEvolution: {
//         color: "#10b981",
//         fontSize: 12,
//         display: "flex",
//         alignItems: "center",
//         gap: 3,
//     },

//     statWarning: {
//         color: "#f97316",
//         fontSize: 12,
//     },

//     sectionHeader: {
//         marginBottom: 20,
//     },

//     sectionTitle: {
//         margin: 0,
//         fontSize: 21,
//         color: "#111827",
//     },

//     sectionSubtitle: {
//         margin: "5px 0 0",
//         color: "#6b7280",
//         fontSize: 13,
//     },

//     actionsGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//         gap: 20,
//         marginBottom: 35,
//     },

//     actionCard: {
//         background: "#fff",
//         borderRadius: 15,
//         padding: 22,
//         display: "flex",
//         alignItems: "center",
//         gap: 17,
//         cursor: "pointer",
//         boxShadow: "0 5px 18px rgba(15,23,42,0.05)",
//         transition: "all 0.2s ease",
//         minHeight: 130,
//         boxSizing: "border-box",
//     },

//     actionIcon: {
//         width: 56,
//         height: 56,
//         borderRadius: 14,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexShrink: 0,
//     },

//     actionBody: {
//         flex: 1,
//     },

//     actionTitle: {
//         margin: 0,
//         fontSize: 17,
//         color: "#111827",
//     },

//     actionText: {
//         margin: "7px 0 0",
//         color: "#6b7280",
//         fontSize: 13,
//         lineHeight: 1.5,
//     },

//     arrow: {
//         color: "#9ca3af",
//     },

//     bottomGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//         gap: 20,
//     },

//     panel: {
//         background: "#fff",
//         borderRadius: 16,
//         padding: 23,
//         boxShadow: "0 5px 18px rgba(15,23,42,0.05)",
//         border: "1px solid #eef0f4",
//     },

//     panelHeader: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 20,
//         gap: 10,
//     },

//     panelTitle: {
//         margin: 0,
//         fontSize: 17,
//         color: "#111827",
//     },

//     panelSubtitle: {
//         margin: "5px 0 0",
//         color: "#9ca3af",
//         fontSize: 12,
//     },

//     viewButton: {
//         border: "none",
//         background: "#f3f4f6",
//         color: "#374151",
//         padding: "8px 12px",
//         borderRadius: 8,
//         cursor: "pointer",
//         fontSize: 12,
//         fontWeight: 600,
//     },

//     activityList: {
//         display: "flex",
//         flexDirection: "column",
//         gap: 17,
//     },

//     activityItem: {
//         display: "flex",
//         alignItems: "center",
//         gap: 12,
//     },

//     activityIcon: {
//         width: 36,
//         height: 36,
//         borderRadius: 10,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexShrink: 0,
//     },

//     activityInfo: {
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//         fontSize: 13,
//         color: "#374151",
//     },

//     orderStats: {
//         display: "flex",
//         flexDirection: "column",
//         gap: 17,
//     },

//     orderRow: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         color: "#374151",
//         fontSize: 14,
//         paddingBottom: 12,
//         borderBottom: "1px solid #f1f5f9",
//     },

//     orderLabel: {
//         display: "flex",
//         alignItems: "center",
//         gap: 9,
//     },

//     dot: {
//         width: 9,
//         height: 9,
//         borderRadius: "50%",
//     },

//     infoBox: {
//         marginTop: 25,
//         background: "#ecfdf5",
//         border: "1px solid #d1fae5",
//         borderRadius: 14,
//         padding: 18,
//         display: "flex",
//         alignItems: "center",
//         gap: 12,
//         color: "#065f46",
//     },

//     infoIcon: {
//         display: "flex",
//         alignItems: "center",
//     },
// };

// export default AdminDashboard;