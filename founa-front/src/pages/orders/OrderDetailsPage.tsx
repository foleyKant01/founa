import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetSingleCommande, OptionEnvoie } from "../../services/order.service";
import { useApp } from "../../context//appContext";

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
  images?: string;

  // Nouveaux champs
  cout_envoie_maritime: number;
  cout_envoie_aérienne: number;
}

type ModeExpedition = "maritime" | "aérienne";

const OrderDetailsPage: React.FC = () => {
  const { commande_id } = useParams();

  const { refreshCommandeCount } = useApp();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Mode d'expédition choisi par le client
  const [modeExpedition, setModeExpedition] =
    useState<ModeExpedition | null>(null);

    useEffect(() => {
    if (!commande_id) return;

    const loadCommande = async () => {
      try {
        const res = await GetSingleCommande({
          commande_id,
        });

        if (res.data.status === "success") {
          const commande = res.data.commande;

          setOrder(commande);

          // 🔔 Si la commande était non lue
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
      case "Livrer":
        return "#4CAF50";
      default:
        return "#000";
    }
  };

  // Récupérer la première image
  const getFirstImage = (images?: string | string[]): string => {
    if (!images) return "/default-image.png";

    let imgArray: string[] = [];

    if (typeof images === "string") {
      try {
        imgArray = JSON.parse(images);
      } catch {
        imgArray = [];
      }
    } else {
      imgArray = images;
    }

    return imgArray.length > 0
      ? imgArray[0]
      : "/default-image.png";
  };

  if (loading) {
    return <div style={styles.center}>Chargement...</div>;
  }

  if (!order) {
    return <div style={styles.center}>Commande introuvable</div>;
  }

  // Prix des articles
  const prixArticles = Number(order.prix_total) || 0;

  // Coûts d'expédition
  const coutMaritime =
    Number(order.cout_envoie_maritime) || 0;

  const coutAerienne =
    Number(order.cout_envoie_aérienne) || 0;

  // Coût choisi
  const coutExpedition =
    modeExpedition === "maritime"
      ? coutMaritime
      : modeExpedition === "aérienne"
      ? coutAerienne
      : 0;

  // Total final
  const totalAPayer = prixArticles + coutExpedition;

  const handleOptionEnvoie = async (
    option: ModeExpedition
  ) => {
    // Mise à jour immédiate de l'affichage
    setModeExpedition(option);

    if (!commande_id) {
      console.error("Commande ID introuvable");
      return;
    }

    try {
      const response = await OptionEnvoie({
        commande_id: commande_id,
        option_envoie: option,
      });

      if (response.data.status === "success") {
        console.log("Option d'envoi enregistrée avec succès");
      } else {
        console.error(
          response.data.message || "Erreur lors de la mise à jour"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de l'option d'envoi :",
        error
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        <h2 style={styles.title}>
          Détails de la commande
        </h2>

        {/* Bannière statut */}
        <div
          style={{
            ...styles.statusBanner,
            backgroundColor: getStatusColor(order.statut),
          }}
        >
          {order.statut}
        </div>

        {/* Carte principale */}
        <div style={styles.card}>
          <div style={styles.row}>

            {/* Image */}
            <div style={styles.imageContainer}>
              <img
                src={getFirstImage(order.images)}
                alt={order.nom}
                style={styles.image}
              />
            </div>

            {/* Infos */}
            <div style={styles.infoContainer}>
              <p>
                <strong>ID :</strong>{" "}
                {order.commande_id}
              </p>

              <p>
                <strong>Date :</strong>{" "}
                {order.created_date}
              </p>

              <p>
                <strong>Produit :</strong>{" "}
                {order.nom}
              </p>

              <p>
                <strong>Quantité :</strong>{" "}
                {order.quantite}
              </p>

              <p style={styles.price}>
                {prixArticles.toLocaleString()} FCFA
              </p>
            </div>

          </div>
        </div>

        {/* Détails */}
        <div style={styles.card}>
          <h3 style={styles.subtitle}>
            Détails
          </h3>

          <p style={styles.detailsText}>
            {order.details ||
              "Aucun détail disponible."}
          </p>
        </div>

        {/* Alerte avant paiement */}
        <div style={styles.paymentAlert}>
          <span style={styles.alertIcon}>⚠️</span>
          <span>
            <strong>Avant de continuer :</strong> veuillez bien lire les détails de votre
            commande avant de procéder au paiement.
          </span>
        </div>

        {/* EXPÉDITION */}
        {order.statut === "Valider" && (
          <div style={styles.card}>

            <h3 style={styles.subtitle}>
              Mode d'expédition
            </h3>

            <p style={styles.shippingDescription}>
              Choisissez votre mode de livraison :
            </p>

            {/* Maritime */}
            <div
              style={{
                ...styles.shippingOption,
                ...(modeExpedition === "maritime"
                  ? styles.shippingOptionSelected
                  : {}),
              }}
              onClick={() =>
                handleOptionEnvoie("maritime")
              }
            >
              <div style={styles.shippingLeft}>

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

                <div>
                  <strong>
                    🚢 Expédition maritime
                  </strong>

                  <div style={styles.shippingSubtext}>
                    Transport par voie maritime
                  </div>
                </div>

              </div>

              <strong style={styles.shippingPrice}>
                {coutMaritime.toLocaleString()} FCFA
              </strong>
            </div>

            {/* Aérienne */}
            <div
              style={{
                ...styles.shippingOption,
                ...(modeExpedition === "aérienne"
                  ? styles.shippingOptionSelected
                  : {}),
              }}
              onClick={() =>
                handleOptionEnvoie("aérienne")
              }
            >
              <div style={styles.shippingLeft}>

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

                <div>
                  <strong>
                    ✈️ Expédition aérienne
                  </strong>

                  <div style={styles.shippingSubtext}>
                    Transport par voie aérienne
                  </div>
                </div>

              </div>

              <strong style={styles.shippingPrice}>
                {coutAerienne.toLocaleString()} FCFA
              </strong>
            </div>

          </div>
        )}

        {/* RÉCAPITULATIF */}
        {modeExpedition && (
          <div style={styles.totalCard}>

            <h3 style={styles.subtitle}>
              Récapitulatif du paiement
            </h3>

            <div style={styles.totalRow}>
              <span>
                Prix des articles
              </span>

              <strong>
                {prixArticles.toLocaleString()} FCFA
              </strong>
            </div>

            <div style={styles.totalRow}>
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

            <div style={styles.separator} />

            <div style={styles.finalTotal}>
              <span>
                Total à payer
              </span>

              <strong>
                {totalAPayer.toLocaleString()} FCFA
              </strong>
            </div>

          </div>
        )}

        {/* PAIEMENT */}
        {order.statut === "Valider" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <a
              href={
                modeExpedition
                  ? `https://pay.wave.com/m/M_ci_0GTnAxYCJ8tW/c/ci/?amount=${totalAPayer}&return_url=https://google.com`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.payButton,
                opacity: modeExpedition ? 1 : 0.5,
                pointerEvents: modeExpedition
                  ? "auto"
                  : "none",
              }}
            >
              Payer maintenant
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {

  container: {
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
    padding: 10,
    display: "flex",
    justifyContent: "center",
  },

  wrapper: {
    width: "100%",
    maxWidth: 500,
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  statusBanner: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 15,
    boxSizing: "border-box",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },

  row: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },

  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    maxWidth: 120,
    height: 120,
    objectFit: "cover",
    borderRadius: 10,
  },

  infoContainer: {
    flex: 1.5,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    wordBreak: "break-word",
  },

  price: {
    fontWeight: "bold",
    color: "#00A4A6",
    fontSize: 16,
  },

  subtitle: {
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 0,
  },

  detailsText: {
    color: "#555",
    lineHeight: 1.5,
    wordBreak: "break-word",
    margin: 0,
  },

  shippingDescription: {
    color: "#777",
    fontSize: 14,
    marginTop: 0,
    marginBottom: 12,
  },

  shippingOption: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 12px",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    marginBottom: 10,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  shippingOptionSelected: {
    border: "2px solid #00A4A6",
    backgroundColor: "#F0FFFF",
  },

  shippingLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  shippingSubtext: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  shippingPrice: {
    color: "#00A4A6",
    whiteSpace: "nowrap",
  },

  totalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    fontSize: 14,
  },

  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    margin: "12px 0",
  },

  finalTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#00A4A6",
  },

  payButton: {
    padding: "12px 25px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: 8,
    fontWeight: "bold",
    textDecoration: "none",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  paymentAlert: {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  backgroundColor: "#FFF8E1",
  border: "1px solid #FFE082",
  color: "#795548",
  borderRadius: 8,
  padding: "8px 10px",
  marginBottom: 15,
  fontSize: 12,
  lineHeight: 1.4,
},

alertIcon: {
  fontSize: 13,
  lineHeight: 1.4,
},
};

export default OrderDetailsPage;