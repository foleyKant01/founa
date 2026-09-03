import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetSingleCommande,
  OptionEnvoie,
} from "../../services/order.service";
import { useApp } from "../../context/appContext";

interface Order {
  commande_id: string;
  client_id: string;
  produit_id: string;
  nom: string;
  quantite: number;
  prix_total: number;
  statut: string;
  details: string;
  created_date: string;
  updated_date?: string;
  images?: string;
  cout_envoie_maritime: number;
  cout_envoie_aérienne: number;
  view?: string;
}

type ModeExpedition = "maritime" | "aérienne";

const OrderDetailsPage: React.FC = () => {
  const { commande_id } = useParams();
  const navigate = useNavigate();
  const { refreshCommandeCount } = useApp();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] =
    useState(false);

  const [modeExpedition, setModeExpedition] =
    useState<ModeExpedition | null>(null);

  const [shippingLoading, setShippingLoading] = useState(false);

  const client = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const clientStatus = client?.status;

  useEffect(() => {
    if (!commande_id) {
      setLoading(false);
      return;
    }

    const loadCommande = async () => {
      try {
        const res = await GetSingleCommande({
          commande_id,
        });

        if (res.data.status === "success") {
          const commande = res.data.commande;

          setOrder(commande);

          if (commande.view === "0") {
            await refreshCommandeCount();
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de la commande :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadCommande();
  }, [commande_id, refreshCommandeCount]);

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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "Initier":
        return "Votre commande a bien été enregistrée et est en attente de prise en charge.";

      case "Prise en charge":
        return "Votre commande est actuellement prise en charge par notre équipe.";

      case "Valider":
        return "Votre commande a été validée. Vous pouvez maintenant choisir le mode d'expédition et effectuer le paiement.";

      case "Payer":
        return "Votre paiement a été enregistré. Votre commande est en préparation pour l'expédition.";

      case "Expedition":
        return "Votre commande a été expédiée et est actuellement en cours de transport.";

      case "Livraison":
        return "Votre commande est actuellement en cours de livraison.";

      case "Livrer":
        return "Votre commande a été livrée avec succès.";

      default:
        return "Consultez les informations de votre commande.";
    }
  };

  const getFirstImage = (
    images?: string | string[]
  ): string => {
    if (!images) return "/default-image.png";

    let imgArray: string[] = [];

    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);

        if (Array.isArray(parsed)) {
          imgArray = parsed;
        } else if (typeof parsed === "string") {
          imgArray = [parsed];
        }
      } catch {
        if (images.trim() !== "") {
          imgArray = [images];
        }
      }
    } else {
      imgArray = images;
    }

    return imgArray.length > 0
      ? imgArray[0]
      : "/default-image.png";
  };

  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes orderDetailsSpinner {
              0% {
                transform: rotate(0deg);
              }

              100% {
                transform: rotate(360deg);
              }
            }

            .order-details-loading {
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

            .order-details-spinner {
              width: 48px;
              height: 48px;
              border: 4px solid #e5e7eb;
              border-top-color: #00a4a6;
              border-radius: 50%;
              animation: orderDetailsSpinner 0.75s linear infinite;
            }
          `}
        </style>

        <div className="order-details-loading">
          <div className="order-details-spinner" />
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <div style={styles.notFound}>
        <div style={styles.notFoundIcon}>📦</div>

        <h2 style={styles.notFoundTitle}>
          Commande introuvable
        </h2>

        <p style={styles.notFoundText}>
          Cette commande n'existe pas ou n'est plus disponible.
        </p>

        <button
          style={styles.primaryButton}
          onClick={() => navigate(-1)}
        >
          ← Retour aux commandes
        </button>
      </div>
    );
  }

  const prixArticles =
    Number(order.prix_total) || 0;

  const coutMaritime =
    Number(order.cout_envoie_maritime) || 0;

  const coutAerienne =
    Number(order.cout_envoie_aérienne) || 0;

  const coutExpedition =
    modeExpedition === "maritime"
      ? coutMaritime
      : modeExpedition === "aérienne"
      ? coutAerienne
      : 0;

  const totalAPayer =
    prixArticles + coutExpedition;

  const handleOptionEnvoie = async (
    option: ModeExpedition
  ) => {
    if (!commande_id) return;

    setModeExpedition(option);
    setShippingLoading(true);

    try {
      const response = await OptionEnvoie({
        commande_id,
        option_envoie: option,
      });

      if (response.data.status === "success") {
        console.log(
          "Option d'envoi enregistrée avec succès"
        );
      } else {
        console.error(
          response.data.message ||
            "Erreur lors de la mise à jour"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de l'option :",
        error
      );
    } finally {
      setShippingLoading(false);
    }
  };

  const handlePayment = () => {
    if (clientStatus !== "verifier") {
      setShowVerificationModal(true);
      return;
    }

    window.open(
      `https://pay.wave.com/m/M_ci_0GTnAxYCJ8tW/c/ci/?amount=${totalAPayer}&return_url=https://google.com`,
      "_blank"
    );
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .order-details-main {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
          }

          .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 24px;
          }

          .order-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.6fr) minmax(330px, 0.9fr);
            gap: 22px;
            align-items: start;
          }

          .order-left {
            min-width: 0;
          }

          .order-right {
            min-width: 0;
            position: sticky;
            top: 20px;
          }

          .product-section {
            display: grid;
            grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
            gap: 28px;
            align-items: center;
          }

          .shipping-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .payment-summary-row {
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }

          .status-progress {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
          }

          .status-progress-item {
            text-align: center;
            min-width: 0;
          }

          .status-progress-line {
            height: 4px;
            margin-top: 11px;
            border-radius: 10px;
            background: #e5e7eb;
          }

          .status-progress-dot {
            width: 28px;
            height: 28px;
            margin: 0 auto;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
          }

          .shipping-option {
            transition:
              border-color 0.2s ease,
              background-color 0.2s ease,
              transform 0.2s ease;
          }

          .shipping-option:hover {
            transform: translateY(-2px);
          }

          @media (max-width: 1000px) {
            .order-layout {
              grid-template-columns: 1fr;
            }

            .order-right {
              position: static;
            }

            .product-section {
              grid-template-columns: 280px minmax(0, 1fr);
            }
          }

          @media (max-width: 700px) {
            .order-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .product-section {
              grid-template-columns: 1fr;
            }

            .product-image-wrapper {
              max-width: 330px !important;
              margin: 0 auto;
            }

            .shipping-options {
              grid-template-columns: 1fr;
            }

            .status-progress {
              overflow-x: auto;
              grid-template-columns: repeat(7, 105px);
              padding-bottom: 8px;
            }

            .order-details-page-padding {
              padding: 15px 12px 110px !important;
            }
          }

          @media (max-width: 480px) {
            .product-image-wrapper {
              max-width: 100% !important;
            }

            .payment-summary-row {
              font-size: 13px;
            }
          }
        `}
      </style>

      <main
        className="order-details-main order-details-page-padding"
        style={styles.main}
      >
        {/* HEADER */}
        <div className="order-header">
          <div>
            <div style={styles.breadcrumb}>
              Mes commandes
              <span style={styles.breadcrumbSeparator}>
                /
              </span>
              Détails
            </div>

            <h1 style={styles.title}>
              Détails de la commande
            </h1>

            <p style={styles.subtitle}>
              Consultez les informations et l'état actuel
              de votre commande.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            style={styles.backButton}
          >
            ← Mes commandes
          </button>
        </div>

        {/* ID + STATUT */}
        <div style={styles.orderIdentityCard}>
          <div>
            <div style={styles.identityLabel}>
              Numéro de commande
            </div>

            <div style={styles.commandeId}>
              #{order.commande_id}
            </div>
          </div>

          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: getStatusBackground(
                order.statut
              ),
              color: getStatusColor(order.statut),
              borderColor: `${getStatusColor(
                order.statut
              )}40`,
            }}
          >
            <span style={styles.statusBadgeIcon}>
              {getStatusIcon(order.statut)}
            </span>

            {order.statut}
          </div>
        </div>

        {/* PROGRESSION */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Suivi de la commande
              </h2>

              <p style={styles.cardSubtitle}>
                {getStatusDescription(order.statut)}
              </p>
            </div>
          </div>

          <OrderProgress currentStatus={order.statut} />
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="order-layout">
          {/* COLONNE GAUCHE */}
          <div className="order-left">

            {/* PRODUIT */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Produit commandé
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Informations relatives à votre achat
                  </p>
                </div>
              </div>

              <div className="product-section">
                {/* IMAGE */}
                <div
                  className="product-image-wrapper"
                  style={styles.productImageWrapper}
                >
                  <img
                    src={getFirstImage(order.images)}
                    alt={order.nom}
                    style={styles.productImage}
                  />
                </div>

                {/* INFOS */}
                <div style={styles.productInfo}>
                  <div style={styles.productTag}>
                    PRODUIT
                  </div>

                  <h2 style={styles.productName}>
                    {order.nom}
                  </h2>

                  <div style={styles.infoGrid}>
                    <InfoItem
                      label="Quantité"
                      value={`${order.quantite}`}
                    />

                    <InfoItem
                      label="Date de commande"
                      value={order.created_date}
                    />

                    <InfoItem
                      label="Référence"
                      value={order.produit_id}
                    />

                    <InfoItem
                      label="Montant"
                      value={`${prixArticles.toLocaleString()} FCFA`}
                      highlight
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Détails de la commande
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Informations complémentaires
                  </p>
                </div>
              </div>

              <div style={styles.detailsBox}>
                {order.details ||
                  "Aucun détail disponible pour cette commande."}
              </div>
            </div>

            {/* INFORMATION */}
            <div style={styles.infoNotice}>
              <div style={styles.noticeIcon}>
                ⚠️
              </div>

              <div>
                <div style={styles.noticeTitle}>
                  Important
                </div>

                <div style={styles.noticeText}>
                  Veuillez vérifier attentivement les
                  informations de votre commande avant
                  d'effectuer le paiement.
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE */}
          <aside className="order-right">

            {/* STATUT */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    État de la commande
                  </h2>
                </div>
              </div>

              <div
                style={{
                  ...styles.largeStatus,
                  backgroundColor: getStatusBackground(
                    order.statut
                  ),
                  color: getStatusColor(order.statut),
                  borderColor: `${getStatusColor(
                    order.statut
                  )}35`,
                }}
              >
                <div style={styles.largeStatusIcon}>
                  {getStatusIcon(order.statut)}
                </div>

                <div>
                  <div style={styles.largeStatusLabel}>
                    Statut actuel
                  </div>

                  <div style={styles.largeStatusValue}>
                    {order.statut}
                  </div>
                </div>
              </div>
            </div>

            {/* EXPEDITION */}
            {order.statut === "Valider" && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>
                      Mode d'expédition
                    </h2>

                    <p style={styles.cardSubtitle}>
                      Sélectionnez votre mode de transport
                    </p>
                  </div>
                </div>

                <div className="shipping-options">

                  {/* MARITIME */}
                  <div
                    className="shipping-option"
                    style={{
                      ...styles.shippingOption,
                      ...(modeExpedition === "maritime"
                        ? styles.shippingSelected
                        : {}),
                    }}
                    onClick={() =>
                      handleOptionEnvoie("maritime")
                    }
                  >
                    <div style={styles.shippingIcon}>
                      🚢
                    </div>

                    <div style={styles.shippingContent}>
                      <div style={styles.shippingName}>
                        Maritime
                      </div>

                      <div style={styles.shippingDescription}>
                        Transport maritime
                      </div>

                      <div style={styles.shippingPrice}>
                        {coutMaritime.toLocaleString()} FCFA
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="expedition"
                      checked={
                        modeExpedition === "maritime"
                      }
                      onChange={() =>
                        handleOptionEnvoie("maritime")
                      }
                    />
                  </div>

                  {/* AERIENNE */}
                  <div
                    className="shipping-option"
                    style={{
                      ...styles.shippingOption,
                      ...(modeExpedition === "aérienne"
                        ? styles.shippingSelected
                        : {}),
                    }}
                    onClick={() =>
                      handleOptionEnvoie("aérienne")
                    }
                  >
                    <div style={styles.shippingIcon}>
                      ✈️
                    </div>

                    <div style={styles.shippingContent}>
                      <div style={styles.shippingName}>
                        Aérienne
                      </div>

                      <div style={styles.shippingDescription}>
                        Transport aérien
                      </div>

                      <div style={styles.shippingPrice}>
                        {coutAerienne.toLocaleString()} FCFA
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="expedition"
                      checked={
                        modeExpedition === "aérienne"
                      }
                      onChange={() =>
                        handleOptionEnvoie("aérienne")
                      }
                    />
                  </div>

                </div>

                {shippingLoading && (
                  <div style={styles.shippingSaving}>
                    Enregistrement du mode d'expédition...
                  </div>
                )}
              </div>
            )}

            {/* RECAPITULATIF */}
            {modeExpedition && (
              <div style={styles.paymentCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.cardTitle}>
                      Récapitulatif
                    </h2>

                    <p style={styles.cardSubtitle}>
                      Montant total de votre commande
                    </p>
                  </div>
                </div>

                <div className="payment-summary-row" style={styles.paymentRow}>
                  <span>Prix des articles</span>

                  <strong>
                    {prixArticles.toLocaleString()} FCFA
                  </strong>
                </div>

                <div
                  className="payment-summary-row"
                  style={styles.paymentRow}
                >
                  <span>
                    Expédition{" "}
                    {modeExpedition === "maritime"
                      ? "maritime"
                      : "aérienne"}
                  </span>

                  <strong>
                    {coutExpedition.toLocaleString()} FCFA
                  </strong>
                </div>

                <div style={styles.paymentSeparator} />

                <div
                  className="payment-summary-row"
                  style={styles.finalPaymentRow}
                >
                  <span>Total à payer</span>

                  <strong>
                    {totalAPayer.toLocaleString()} FCFA
                  </strong>
                </div>
              </div>
            )}

            {/* PAIEMENT */}
            {order.statut === "Valider" && (
              <div style={styles.paymentActionCard}>
                {!modeExpedition && (
                  <div style={styles.selectShippingMessage}>
                    Sélectionnez d'abord un mode d'expédition
                    pour continuer.
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={!modeExpedition}
                  style={{
                    ...styles.payButton,
                    opacity: modeExpedition ? 1 : 0.45,
                    cursor: modeExpedition
                      ? "pointer"
                      : "not-allowed",
                  }}
                >
                  <span>💳</span>
                  Payer maintenant
                </button>

                <div style={styles.paymentSecure}>
                  🔒 Paiement sécurisé
                </div>

                <div style={styles.paymentDeadline}>
                  ⚠️ La commande sera automatiquement
                  supprimée si elle n'est pas payée dans
                  les 7 prochains jours à compter de la
                  date à laquelle elle a été initiée.
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* MODAL VERIFICATION */}
      {showVerificationModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.verificationModal}>

            <div style={styles.verificationIcon}>
              ⚠️
            </div>

            <h2 style={styles.verificationTitle}>
              Compte non vérifié
            </h2>

            <p style={styles.verificationText}>
              Vous devez vérifier votre compte avant de
              pouvoir effectuer le paiement de cette
              commande.
            </p>

            <div style={styles.modalActions}>
              <button
                style={styles.verifyButton}
                onClick={() => {
                  setShowVerificationModal(false);
                  navigate("/auth/sendotp");
                }}
              >
                Vérifier mon compte
              </button>

              <button
                style={styles.closeModalButton}
                onClick={() =>
                  setShowVerificationModal(false)
                }
              >
                Plus tard
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   COMPOSANT INFO
========================================================= */

interface InfoItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  highlight,
}) => {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoItemLabel}>
        {label}
      </div>

      <div
        style={{
          ...styles.infoItemValue,
          ...(highlight
            ? styles.infoItemHighlight
            : {}),
        }}
      >
        {value}
      </div>
    </div>
  );
};

/* =========================================================
   PROGRESSION DE COMMANDE
========================================================= */

const OrderProgress: React.FC<{
  currentStatus: string;
}> = ({ currentStatus }) => {
  const statuses = [
    "Initier",
    "Prise en charge",
    "Valider",
    "Payer",
    "Expedition",
    "Livraison",
    "Livrer",
  ];

  const currentIndex = statuses.indexOf(
    currentStatus
  );

  return (
    <div className="status-progress">
      {statuses.map((status, index) => {
        const completed =
          currentIndex >= 0 &&
          index <= currentIndex;

        const active = index === currentIndex;

        const color = getProgressColor(status);

        return (
          <div
            key={status}
            className="status-progress-item"
          >
            <div
              className="status-progress-dot"
              style={{
                backgroundColor: completed
                  ? color
                  : "#F0F2F4",
                color: completed
                  ? "#FFFFFF"
                  : "#A0A7AD",
              }}
            >
              {completed ? "✓" : index + 1}
            </div>

            <div
              className="status-progress-line"
              style={{
                backgroundColor:
                  active || index < currentIndex
                    ? color
                    : "#E5E7EB",
              }}
            />

            <div
              style={{
                marginTop: 8,
                fontSize: 10,
                lineHeight: 1.25,
                fontWeight: active ? 800 : 600,
                color: active
                  ? color
                  : "#7D858C",
              }}
            >
              {status}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getProgressColor = (status: string) => {
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
      return "#00A4A6";
  }
};

/* =========================================================
   STYLES
========================================================= */

const styles: {
  [key: string]: React.CSSProperties;
} = {
  page: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F5F7F8",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  main: {
    width: "100%",
    padding:
      "25px 24px 120px",
  },

  breadcrumb: {
    fontSize: 13,
    color: "#8A9299",
    marginBottom: 7,
    fontWeight: 600,
  },

  breadcrumbSeparator: {
    margin: "0 8px",
    color: "#C6CBD0",
  },

  title: {
    margin: 0,
    fontSize: 30,
    lineHeight: 1.2,
    color: "#20272D",
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin:
      "7px 0 0",
    color: "#7A838A",
    fontSize: 14,
  },

  backButton: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDE3E6",
    borderRadius: 10,
    padding:
      "11px 17px",
    color: "#333B41",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  orderIdentityCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    border:
      "1px solid #E4E8EA",
    borderRadius: 16,
    padding:
      "17px 20px",
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.035)",
  },

  identityLabel: {
    fontSize: 11,
    color: "#8A9299",
    marginBottom: 5,
  },

  commandeId: {
    fontSize: 18,
    fontWeight: 800,
    color: "#252D33",
  },

  statusBadge: {
    minHeight: 38,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    border:
      "1px solid",
    borderRadius: 30,
    padding:
      "8px 14px",
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  statusBadgeIcon: {
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    border:
      "1px solid #E5E9EB",
    borderRadius: 17,
    padding: 22,
    marginBottom: 20,
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.035)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  cardTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "#20272D",
  },

  cardSubtitle: {
    margin:
      "5px 0 0",
    fontSize: 12,
    lineHeight: 1.5,
    color: "#858D94",
  },

  productImageWrapper: {
    width: "100%",
    height: 330,
    borderRadius: 15,
    backgroundColor: "#F7F8F8",
    border:
      "1px solid #EDF0F1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: 15,
  },

  productInfo: {
    minWidth: 0,
  },

  productTag: {
    display: "inline-block",
    padding:
      "5px 9px",
    backgroundColor: "#E8FAFA",
    color: "#008E91",
    borderRadius: 6,
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.7px",
    marginBottom: 10,
  },

  productName: {
    margin:
      "0 0 20px",
    fontSize: 25,
    lineHeight: 1.25,
    fontWeight: 800,
    color: "#20272D",
    wordBreak: "break-word",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },

  infoItem: {
    backgroundColor: "#F8FAFA",
    border:
      "1px solid #EDF0F1",
    borderRadius: 10,
    padding: 12,
  },

  infoItemLabel: {
    fontSize: 10,
    color: "#8B9399",
    marginBottom: 5,
  },

  infoItemValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#333B41",
    wordBreak: "break-word",
  },

  infoItemHighlight: {
    color: "#00A4A6",
    fontSize: 14,
  },

  detailsBox: {
    width: "100%",
    minHeight: 100,
    padding: 16,
    backgroundColor: "#F8FAFA",
    border:
      "1px solid #EDF0F1",
    borderRadius: 11,
    color: "#555E65",
    fontSize: 14,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  infoNotice: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: 15,
    backgroundColor: "#FFF8E1",
    border:
      "1px solid #FFE082",
    borderRadius: 13,
    marginBottom: 20,
  },

  noticeIcon: {
    fontSize: 18,
    flexShrink: 0,
  },

  noticeTitle: {
    color: "#795548",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 4,
  },

  noticeText: {
    color: "#796A61",
    fontSize: 12,
    lineHeight: 1.5,
  },

  largeStatus: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    padding: 16,
    border:
      "1px solid",
    borderRadius: 13,
  },

  largeStatusIcon: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    fontSize: 20,
    fontWeight: 800,
    flexShrink: 0,
  },

  largeStatusLabel: {
    fontSize: 10,
    opacity: 0.75,
    marginBottom: 3,
  },

  largeStatusValue: {
    fontSize: 17,
    fontWeight: 800,
  },

  shippingOption: {
    position: "relative",
    minHeight: 150,
    padding: 15,
    border:
      "1px solid #E3E7E9",
    borderRadius: 13,
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    backgroundColor: "#FFFFFF",
  },

  shippingSelected: {
    border:
      "2px solid #00A4A6",
    backgroundColor: "#F0FFFF",
  },

  shippingIcon: {
    fontSize: 25,
    marginBottom: 9,
  },

  shippingContent: {
    flex: 1,
  },

  shippingName: {
    fontSize: 14,
    fontWeight: 800,
    color: "#293137",
  },

  shippingDescription: {
    marginTop: 4,
    fontSize: 11,
    color: "#858D94",
    lineHeight: 1.4,
  },

  shippingPrice: {
    marginTop: 10,
    color: "#00A4A6",
    fontSize: 14,
    fontWeight: 800,
  },

  shippingSaving: {
    marginTop: 12,
    fontSize: 11,
    color: "#00A4A6",
    textAlign: "center",
  },

  paymentCard: {
    background:
      "linear-gradient(145deg, #FFFFFF, #F8FFFF)",
    border:
      "1px solid rgba(0,164,166,0.18)",
    borderRadius: 17,
    padding: 22,
    marginBottom: 20,
    boxShadow:
      "0 6px 25px rgba(0,164,166,0.06)",
  },

  paymentRow: {
    fontSize: 13,
    color: "#616A71",
    marginBottom: 13,
  },

  paymentSeparator: {
    height: 1,
    backgroundColor: "#E3E8E9",
    margin:
      "15px 0",
  },

  finalPaymentRow: {
    fontSize: 16,
    color: "#20272D",
    fontWeight: 800,
  },

  finalTotal: {
    color: "#00A4A6",
  },

  finalPaymentRowStrong: {
    color: "#00A4A6",
  },

  paymentActionCard: {
    backgroundColor: "#FFFFFF",
    border:
      "1px solid #E5E9EB",
    borderRadius: 17,
    padding: 20,
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.035)",
  },

  selectShippingMessage: {
    padding: 11,
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 9,
    color: "#7B8389",
    textAlign: "center",
    fontSize: 11,
    lineHeight: 1.4,
  },

  payButton: {
    width: "100%",
    minHeight: 48,
    border: "none",
    borderRadius: 11,
    backgroundColor: "#00A4A6",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow:
      "0 6px 16px rgba(0,164,166,0.2)",
  },

  paymentSecure: {
    textAlign: "center",
    marginTop: 9,
    color: "#7C858B",
    fontSize: 10,
  },

  paymentDeadline: {
    marginTop: 14,
    padding: 11,
    backgroundColor: "#FFF3F3",
    border:
      "1px solid #FFD6D6",
    color: "#C62828",
    borderRadius: 9,
    fontSize: 10,
    lineHeight: 1.5,
  },

  primaryButton: {
    border: "none",
    backgroundColor: "#00A4A6",
    color: "#FFFFFF",
    borderRadius: 10,
    padding:
      "11px 18px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },

  notFound: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7F8",
    textAlign: "center",
    padding: 20,
  },

  notFoundIcon: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    backgroundColor: "#E8FAFA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    marginBottom: 18,
  },

  notFoundTitle: {
    margin: 0,
    fontSize: 22,
    color: "#20272D",
  },

  notFoundText: {
    margin:
      "8px 0 20px",
    color: "#7A8289",
    fontSize: 14,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor:
      "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: 20,
  },

  verificationModal: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.25)",
  },

  verificationIcon: {
    width: 65,
    height: 65,
    borderRadius: "50%",
    backgroundColor: "#FFF8E1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    margin:
      "0 auto 15px",
  },

  verificationTitle: {
    margin:
      "0 0 10px",
    fontSize: 21,
    color: "#292F33",
  },

  verificationText: {
    margin:
      "0 0 22px",
    color: "#6F777D",
    fontSize: 13,
    lineHeight: 1.6,
  },

  modalActions: {
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },

  verifyButton: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    padding: 13,
    backgroundColor: "#00A4A6",
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  closeModalButton: {
    width: "100%",
    border: "none",
    borderRadius: 10,
    padding: 13,
    backgroundColor: "#F1F3F4",
    color: "#555E65",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default OrderDetailsPage;