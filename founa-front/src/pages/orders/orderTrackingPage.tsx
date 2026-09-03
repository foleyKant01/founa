// src/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import BottomBar from "../../components/layout/bottomBar";
import { GetAllCommandeByClient } from "../../services/order.service";
import { useNavigate } from "react-router-dom";

interface Order {
  commande_id: string;
  client_id: string;
  client: string;
  produit_id: string;
  produit: string;
  teller_id: string;
  teller: string;
  quantite: string;
  prix_total: string;
  statut: string;
  details: string;
  nom: string;
  view: string;
  created_date: string;
  updated_date?: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const clientId = user.uid;

  useEffect(() => {
    const loadOrders = async () => {
      if (!clientId) {
        setLoading(false);
        return;
      }

      try {
        const res = await GetAllCommandeByClient({
          client_id: clientId,
        });

        if (res.data.status === "success") {
          const commandes: Order[] = res.data.commandes.map((c: any) => ({
            commande_id: c.commande_id,
            client_id: c.client_id,
            client: c.client,
            produit_id: c.produit_id,
            produit: c.produit,
            teller_id: c.teller_id,
            teller: c.teller,
            quantite: c.quantite,
            prix_total: c.prix_total,
            statut: c.statut,
            details: c.details,
            nom: c.nom,
            view: c.view,
            created_date: c.created_date,
            updated_date: c.updated_date,
          }));

          setOrders(commandes);
        } else {
          console.error(
            "Erreur récupération commandes:",
            res.data.message
          );
        }
      } catch (err) {
        console.error("Erreur récupération commandes :", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [clientId]);

  const getStatusColor = (status: string) => {
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
        return "#757575";
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case "Initier":
        return "#F3F4F6";

      case "Prise en charge":
        return "#EFF6FF";

      case "Valider":
        return "#EEF2FF";

      case "Payer":
        return "#FFFBEB";

      case "Expedition":
        return "#FFF7ED";

      case "Livraison":
        return "#ECFEFF";

      case "Livrer":
        return "#F0FDF4";

      default:
        return "#F5F5F5";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "Initier":
        return "Commande en attente de prise en charge";

      case "Prise en charge":
        return "Commande en attente de validation";

      case "Valider":
        return "Commande validée — paiement disponible";

      case "Payer":
        return "Paiement effectué — préparation de l'expédition";

      case "Expedition":
        return "Commande en cours de transport";

      case "Livraison":
        return "Commande en cours de livraison";

      case "Livrer":
        return "Commande livrée avec succès";

      default:
        return "Statut de la commande";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Initier":
        return "○";

      case "Prise en charge":
        return "◉";

      case "Valider":
        return "✓";

      case "Payer":
        return "●";

      case "Expedition":
        return "→";

      case "Livraison":
        return "↗";

      case "Livrer":
        return "✓";

      default:
        return "•";
    }
  };

  const totalCommandes = orders.length;

  const commandesEnCours = orders.filter(
    (order) => order.statut !== "Livrer"
  ).length;

  const commandesLivrees = orders.filter(
    (order) => order.statut === "Livrer"
  ).length;

  const commandesAAction = orders.filter(
    (order) => order.statut === "Valider"
  ).length;

  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes ordersSpinner {
              0% {
                transform: rotate(0deg);
              }

              100% {
                transform: rotate(360deg);
              }
            }

            .orders-loading {
              position: fixed;
              inset: 0;
              width: 100vw;
              height: 100vh;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 99999;
            }

            .orders-spinner {
              width: 46px;
              height: 46px;
              border: 4px solid #e5e7eb;
              border-top-color: #00a4a6;
              border-radius: 50%;
              animation: ordersSpinner 0.75s linear infinite;
            }
          `}
        </style>

        <div className="orders-loading">
          <div className="orders-spinner" />
        </div>
      </>
    );
  }

  return (
    <div style={styles.page}>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .orders-main {
            width: 100%;
            max-width: 1450px;
            margin: 0 auto;
          }

          .orders-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 24px;
          }

          .orders-title-area {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .orders-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }

          .orders-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .order-card {
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease,
              border-color 0.2s ease;
          }

          .order-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08) !important;
          }

          .order-card-unread {
            position: relative;
          }

          .order-card-unread::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #00a4a6;
            border-radius: 16px 0 0 16px;
          }

          .order-card-read {
            opacity: 0.78;
          }

          .order-card-read:hover {
            opacity: 1;
          }

          .order-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
          }

          .order-info {
            min-width: 0;
            flex: 1;
          }

          .order-status-area {
            flex-shrink: 0;
          }

          .order-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
          }

          .empty-state {
            min-height: 420px;
          }

          @media (max-width: 1100px) {
            .orders-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .orders-list {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 700px) {
            .orders-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .orders-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 10px;
            }

            .orders-list {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .order-top {
              flex-direction: column;
            }

            .order-status-area {
              width: 100%;
            }

            .order-bottom {
              flex-direction: column;
              align-items: stretch;
            }

            .empty-state {
              min-height: 350px;
            }
          }

          @media (max-width: 450px) {
            .orders-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <main className="orders-main">

        {/* HEADER */}
        <div className="orders-header">
          <div className="orders-title-area">
            <div style={styles.breadcrumb}>
              Accueil <span style={styles.breadcrumbSeparator}>/</span>{" "}
              Mes commandes
            </div>

            <h1 style={styles.title}>Mes commandes</h1>

            <p style={styles.subtitle}>
              Consultez et suivez l'évolution de toutes vos commandes.
            </p>
          </div>
        </div>

        {/* STATISTIQUES */}
        <div className="orders-grid">

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#ECFEFF",
                color: "#00A4A6",
              }}
            >
              🛍
            </div>

            <div>
              <div style={styles.statLabel}>Total commandes</div>
              <div style={styles.statValue}>{totalCommandes}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#EFF6FF",
                color: "#2196F3",
              }}
            >
              ◉
            </div>

            <div>
              <div style={styles.statLabel}>En cours</div>
              <div style={styles.statValue}>{commandesEnCours}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#F0FDF4",
                color: "#4CAF50",
              }}
            >
              ✓
            </div>

            <div>
              <div style={styles.statLabel}>Livrées</div>
              <div style={styles.statValue}>{commandesLivrees}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: "#FFFBEB",
                color: "#D89B00",
              }}
            >
              !
            </div>

            <div>
              <div style={styles.statLabel}>Action requise</div>
              <div style={styles.statValue}>{commandesAAction}</div>
            </div>
          </div>
        </div>

        {/* TITRE LISTE */}
        <div style={styles.listHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Historique des commandes</h2>

            <p style={styles.sectionSubtitle}>
              {totalCommandes} commande
              {totalCommandes > 1 ? "s" : ""} enregistrée
              {totalCommandes > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* COMMANDES */}
        {orders.length === 0 ? (
          <div className="empty-state" style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🛍</div>

            <h3 style={styles.emptyTitle}>
              Aucune commande
            </h3>

            <p style={styles.emptyText}>
              Vous n'avez pas encore passé de commande.
            </p>

            <button
              onClick={() => navigate("/")}
              style={styles.shopButton}
            >
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => {
              const statusColor = getStatusColor(order.statut);
              const statusBackground = getStatusBackground(order.statut);

              return (
                <div
                  key={order.commande_id}
                  className={`order-card ${
                    order.view === "1"
                      ? "order-card-unread"
                      : "order-card-read"
                  }`}
                  style={{
                    ...styles.orderCard,
                    borderColor:
                      order.view === "1"
                        ? "rgba(0, 164, 166, 0.25)"
                        : "#E5E7EB",
                  }}
                  onClick={() =>
                    navigate(`/order/${order.commande_id}`)
                  }
                >

                  {/* PARTIE HAUTE */}
                  <div className="order-top">

                    <div className="order-info">

                      <div style={styles.orderIdRow}>
                        <span style={styles.orderId}>
                          #{order.commande_id}
                        </span>

                        {order.view === "1" && (
                          <span style={styles.newBadge}>
                            Nouveau
                          </span>
                        )}
                      </div>

                      <h3 style={styles.productName}>
                        {order.nom || "Produit"}
                      </h3>

                      <div style={styles.orderMeta}>
                        <span>
                          📅 {order.created_date}
                        </span>

                        <span style={styles.metaSeparator}>
                          •
                        </span>

                        <span>
                          Quantité : {order.quantite}
                        </span>
                      </div>

                    </div>

                    {/* STATUT */}
                    <div className="order-status-area">

                      <div
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusBackground,
                          color: statusColor,
                          borderColor: `${statusColor}35`,
                        }}
                      >
                        <span
                          style={{
                            ...styles.statusIcon,
                            color: statusColor,
                          }}
                        >
                          {getStatusIcon(order.statut)}
                        </span>

                        {order.statut}
                      </div>

                    </div>

                  </div>

                  {/* SEPARATION */}
                  <div style={styles.divider} />

                  {/* BAS DE CARTE */}
                  <div className="order-bottom">

                    <div>
                      <div style={styles.totalLabel}>
                        Montant de la commande
                      </div>

                      <div style={styles.totalPrice}>
                        {Number(order.prix_total).toLocaleString()} FCFA
                      </div>
                    </div>

                    <div style={styles.detailsButton}>
                      Voir les détails
                      <span style={styles.arrow}>
                        →
                      </span>
                    </div>

                  </div>

                  {/* MESSAGE DE STATUT */}
                  <div
                    style={{
                      ...styles.statusMessage,
                      backgroundColor: statusBackground,
                      borderColor: `${statusColor}25`,
                      color: statusColor,
                    }}
                  >
                    <span style={styles.statusMessageIcon}>
                      {getStatusIcon(order.statut)}
                    </span>

                    <span>
                      {getStatusMessage(order.statut)}
                    </span>

                    {order.statut === "Valider" && (
                      <span style={styles.actionLabel}>
                        Payer →
                      </span>
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>

      <BottomBar />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {

  page: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F5F7F8",
    padding: "24px 24px 120px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  breadcrumb: {
    fontSize: 13,
    color: "#8A8F98",
    marginBottom: 7,
    fontWeight: 500,
  },

  breadcrumbSeparator: {
    margin: "0 6px",
    color: "#C5C9CE",
  },

  title: {
    margin: 0,
    fontSize: 30,
    lineHeight: 1.2,
    fontWeight: 800,
    color: "#172026",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "7px 0 0",
    fontSize: 14,
    color: "#737B84",
  },

  backButton: {
    border: "1px solid #DDE3E6",
    backgroundColor: "#FFFFFF",
    color: "#333A40",
    borderRadius: 10,
    padding: "11px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  statCard: {
    minHeight: 100,
    backgroundColor: "#FFFFFF",
    border: "1px solid #E7EBED",
    borderRadius: 15,
    padding: "17px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    boxShadow:
      "0 4px 15px rgba(0, 0, 0, 0.035)",
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },

  statLabel: {
    fontSize: 13,
    color: "#7A8289",
    marginBottom: 5,
  },

  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: "#20272D",
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 750,
    color: "#20272D",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    fontSize: 13,
    color: "#8A9299",
  },

  orderCard: {
    position: "relative",
    width: "100%",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 16,
    padding: 20,
    cursor: "pointer",
    boxShadow:
      "0 5px 18px rgba(0, 0, 0, 0.045)",
  },

  orderIdRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  orderId: {
    fontSize: 12,
    fontWeight: 700,
    color: "#7A8289",
    letterSpacing: "0.2px",
  },

  newBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#E8FAFA",
    color: "#008E91",
    borderRadius: 20,
    padding: "3px 8px",
    fontSize: 10,
    fontWeight: 700,
  },

  productName: {
    margin: 0,
    fontSize: 17,
    fontWeight: 750,
    color: "#1F272D",
    lineHeight: 1.35,
  },

  orderMeta: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 9,
    color: "#858D94",
    fontSize: 12,
  },

  metaSeparator: {
    color: "#C6CBD0",
  },

  statusBadge: {
    minHeight: 34,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "7px 11px",
    borderRadius: 30,
    border: "1px solid",
    fontSize: 11,
    fontWeight: 750,
    whiteSpace: "nowrap",
  },

  statusIcon: {
    fontSize: 13,
    fontWeight: 800,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF0F2",
    margin: "17px 0",
  },

  totalLabel: {
    fontSize: 11,
    color: "#8A9299",
    marginBottom: 3,
  },

  totalPrice: {
    fontSize: 19,
    fontWeight: 800,
    color: "#00A4A6",
  },

  detailsButton: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "#00A4A6",
    fontSize: 13,
    fontWeight: 700,
  },

  arrow: {
    fontSize: 17,
  },

  statusMessage: {
    width: "100%",
    minHeight: 38,
    marginTop: 16,
    padding: "8px 11px",
    border: "1px solid",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 11,
    fontWeight: 600,
  },

  statusMessageIcon: {
    fontSize: 13,
    fontWeight: 800,
    flexShrink: 0,
  },

  actionLabel: {
    marginLeft: "auto",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  emptyCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    border: "1px solid #E5E7EB",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 30,
    boxShadow:
      "0 5px 20px rgba(0, 0, 0, 0.04)",
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    backgroundColor: "#E8FAFA",
    color: "#00A4A6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    marginBottom: 18,
  },

  emptyTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 750,
    color: "#20272D",
  },

  emptyText: {
    margin: "8px 0 20px",
    fontSize: 14,
    color: "#7A8289",
  },

  shopButton: {
    border: "none",
    backgroundColor: "#00A4A6",
    color: "#FFFFFF",
    padding: "11px 20px",
    borderRadius: 9,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default OrdersPage;