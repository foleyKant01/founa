import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Home,
  Loader2,
  AlertCircle,
  PackageCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetSingleCommandeForSuccessPage } from "../../services/order.service";

interface PaymentSuccessState {
  commande_id?: string;
  transaction_id?: string;
  amount?: number;
  currency?: string;
}

interface Commande {
  commande_id: string;
  client_id: string;
  produit_id: string;
  nom: string;
  images: string | string[];
  quantite: number;
  prix_total: number;
  statut: string;
  details?: string;
  option_envoie?: string;
  cout_envoie_maritime?: number;
  temps_envoie_maritime?: string;
  cout_envoie_aérienne?: number;
  temps_envoie_aérienne?: string;
  view?: string;
  created_date?: string;
  updated_date?: string;
}

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ============================================================
   * RÉCUPÉRATION DES INFORMATIONS DE NAVIGATION
   * ============================================================
   */

  const state = (location.state || {}) as PaymentSuccessState;

  /*
   * Exemple d'URL :
   *
   * https://founa.ci/payment/success?commande_id=COM20260927301
   */
  const searchParams = new URLSearchParams(location.search);

  const commandeIdFromUrl = searchParams.get("commande_id");

  /*
   * L'ID présent dans l'URL est prioritaire.
   * Le state est conservé comme solution de secours.
   */
  const commandeId =
    commandeIdFromUrl || state.commande_id || "";

  const transactionId = state.transaction_id;
  const currency = state.currency || "XOF";

  /*
   * ============================================================
   * RÉCUPÉRATION DE LA COMMANDE
   * ============================================================
   */

  useEffect(() => {
    const fetchCommande = async () => {
      if (!commandeId) {
        setError(
          "L'identifiant de la commande est absent de l'URL."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await GetSingleCommandeForSuccessPage({
          commande_id: commandeId,
        });

        console.log(
          "Réponse GetSingleCommandeForSuccessPage :",
          response.data
        );

        /*
         * On affiche la page de succès uniquement si
         * l'API confirme que la récupération a réussi.
         */
        if (response.data?.status !== "success") {
          setError(
            response.data?.message ||
              "Impossible de récupérer les informations de la commande."
          );
          return;
        }

        if (!response.data?.commande) {
          setError(
            "Les informations de la commande sont introuvables."
          );
          return;
        }

        setCommande(response.data.commande);
      } catch (err: any) {
        console.error(
          "Erreur GetSingleCommandeForSuccessPage :",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Une erreur est survenue lors de la récupération de votre commande."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [commandeId]);

  /*
   * ============================================================
   * FORMATAGE DU MONTANT
   * ============================================================
   */

  const formatAmount = (value?: number) => {
    if (
      value === undefined ||
      value === null
    ) {
      return "0";
    }

    return new Intl.NumberFormat("fr-FR").format(
      value
    );
  };

  /*
   * ============================================================
   * ÉCRAN DE CHARGEMENT
   * ============================================================
   */

  if (loading) {
    return (
      <div className="payment-page">
        <style>{`
          * {
            box-sizing: border-box;
          }

          .payment-page {
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(0, 164, 166, 0.15),
                transparent 42%
              ),
              linear-gradient(
                180deg,
                #f9fdfd 0%,
                #f3fafa 100%
              );
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          .loading-wrapper {
            width: 100%;
            max-width: 470px;
            text-align: center;
          }

          .loading-brand {
            margin-bottom: 22px;
            color: #00a4a6;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -1px;
          }

          .loading-card {
            background: #ffffff;
            border: 1px solid rgba(0, 164, 166, 0.09);
            border-radius: 28px;
            padding: 48px 30px;
            box-shadow:
              0 25px 70px rgba(0, 70, 72, 0.08),
              0 5px 20px rgba(0, 0, 0, 0.035);
          }

          .loading-icon {
            color: #00a4a6;
            animation: founa-spin 1.15s linear infinite;
            margin-bottom: 22px;
          }

          .loading-title {
            margin: 0;
            color: #163638;
            font-size: 25px;
            font-weight: 800;
          }

          .loading-text {
            margin: 12px auto 0;
            max-width: 390px;
            color: #718385;
            font-size: 15px;
            line-height: 1.65;
          }

          .loading-order {
            margin-top: 22px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 15px;
            border-radius: 999px;
            background: rgba(0, 164, 166, 0.07);
            color: #008b8d;
            font-size: 13px;
            font-weight: 700;
          }

          @keyframes founa-spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 600px) {
            .payment-page {
              padding: 16px;
            }

            .loading-card {
              padding: 40px 22px;
              border-radius: 23px;
            }

            .loading-title {
              font-size: 22px;
            }
          }
        `}</style>

        <div className="loading-wrapper">
          <div className="loading-brand">
            FOUNA
          </div>

          <div className="loading-card">
            <Loader2
              className="loading-icon"
              size={54}
              strokeWidth={2}
            />

            <h1 className="loading-title">
              Vérification de votre paiement
            </h1>

            <p className="loading-text">
              Nous récupérons les informations de votre
              commande. Veuillez patienter quelques instants.
            </p>

            {commandeId && (
              <div className="loading-order">
                <PackageCheck size={15} />
                {commandeId}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * ÉCRAN D'ERREUR
   * ============================================================
   */

  if (error || !commande) {
    return (
      <div className="payment-page">
        <style>{`
          * {
            box-sizing: border-box;
          }

          .payment-page {
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(0, 164, 166, 0.10),
                transparent 42%
              ),
              #f7fbfb;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          .error-wrapper {
            width: 100%;
            max-width: 530px;
            text-align: center;
          }

          .error-brand {
            margin-bottom: 22px;
            color: #00a4a6;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -1px;
          }

          .error-card {
            background: #ffffff;
            border-radius: 28px;
            padding: 46px 32px;
            border: 1px solid rgba(0, 164, 166, 0.08);
            box-shadow:
              0 25px 70px rgba(0, 70, 72, 0.08),
              0 5px 20px rgba(0, 0, 0, 0.035);
          }

          .error-icon-wrapper {
            width: 84px;
            height: 84px;
            margin: 0 auto 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(220, 53, 69, 0.08);
          }

          .error-icon {
            color: #dc3545;
          }

          .error-title {
            margin: 0;
            color: #163638;
            font-size: 28px;
            font-weight: 800;
          }

          .error-text {
            margin: 14px auto 0;
            max-width: 430px;
            color: #718385;
            font-size: 15px;
            line-height: 1.65;
          }

          .error-order {
            margin-top: 20px;
            padding: 14px 18px;
            border-radius: 14px;
            background: #f7fbfb;
            border: 1px solid #e5eeee;
            color: #173638;
            font-size: 14px;
            font-weight: 800;
          }

          .error-button {
            margin-top: 28px;
            min-height: 51px;
            padding: 0 25px;
            border: none;
            border-radius: 14px;
            background: #00a4a6;
            color: #ffffff;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition:
              transform 0.2s ease,
              background 0.2s ease,
              box-shadow 0.2s ease;
            box-shadow:
              0 8px 20px rgba(0, 164, 166, 0.18);
          }

          .error-button:hover {
            background: #008f91;
            transform: translateY(-2px);
          }

          @media (max-width: 600px) {
            .payment-page {
              padding: 16px;
            }

            .error-card {
              padding: 38px 22px;
              border-radius: 23px;
            }

            .error-title {
              font-size: 24px;
            }
          }
        `}</style>

        <div className="error-wrapper">
          <div className="error-brand">
            FOUNA
          </div>

          <div className="error-card">
            <div className="error-icon-wrapper">
              <AlertCircle
                className="error-icon"
                size={48}
                strokeWidth={2}
              />
            </div>

            <h1 className="error-title">
              Vérification impossible
            </h1>

            <p className="error-text">
              {error ||
                "Nous n'avons pas pu récupérer les informations de votre commande."}
            </p>

            {commandeId && (
              <div className="error-order">
                Commande : {commandeId}
              </div>
            )}

            <button
              className="error-button"
              onClick={() => navigate("/orders")}
            >
              Voir mes commandes
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * PAGE DE SUCCÈS
   * ============================================================
   */

  return (
    <div className="payment-success-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .payment-success-page {
          min-height: 100vh;
          width: 100%;

          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(0, 164, 166, 0.14),
              transparent 42%
            ),
            linear-gradient(
              180deg,
              #f9fdfd 0%,
              #f3fafa 100%
            );

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 30px 20px;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color: #172b2d;
        }

        .success-container {
          width: 100%;
          max-width: 650px;
          text-align: center;
        }

        .brand {
          margin-bottom: 22px;

          color: #00a4a6;

          font-size: 27px;

          font-weight: 900;

          letter-spacing: -1px;
        }

        .success-card {
          position: relative;

          background: #ffffff;

          border-radius: 30px;

          padding: 48px 42px;

          border: 1px solid rgba(0, 164, 166, 0.09);

          box-shadow:
            0 25px 70px rgba(0, 70, 72, 0.09),
            0 5px 20px rgba(0, 0, 0, 0.035);

          overflow: hidden;
        }

        .success-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 4px;

          background:
            linear-gradient(
              90deg,
              #00a4a6,
              #42c7c9,
              #00a4a6
            );
        }

        .success-icon-wrapper {
          width: 98px;
          height: 98px;

          margin: 4px auto 28px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(0, 164, 166, 0.13),
              rgba(0, 164, 166, 0.04)
            );

          display: flex;

          align-items: center;

          justify-content: center;

          position: relative;

          animation: success-pop 0.55s ease-out;
        }

        .success-icon-wrapper::before {
          content: "";

          position: absolute;

          inset: -9px;

          border:
            1px solid rgba(0, 164, 166, 0.15);

          border-radius: 50%;
        }

        .success-icon-wrapper::after {
          content: "";

          position: absolute;

          inset: -18px;

          border:
            1px dashed rgba(0, 164, 166, 0.10);

          border-radius: 50%;
        }

        .success-icon {
          color: #00a4a6;
        }

        .success-title {
          margin: 0;

          color: #153638;

          font-size: 32px;

          line-height: 1.2;

          font-weight: 800;

          letter-spacing: -0.8px;
        }

        .success-description {
          margin: 15px auto 0;

          max-width: 500px;

          color: #687b7d;

          font-size: 16px;

          line-height: 1.65;
        }

        .confirmed-order {
          margin-top: 25px;

          padding: 17px 20px;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              rgba(0, 164, 166, 0.08),
              rgba(0, 164, 166, 0.035)
            );

          border:
            1px solid rgba(0, 164, 166, 0.15);

          color: #007f81;

          font-size: 14px;

          font-weight: 700;

          line-height: 1.5;
        }

        .confirmed-order-id {
          display: block;

          margin-top: 4px;

          color: #153638;

          font-size: 17px;

          font-weight: 900;

          letter-spacing: 0.2px;

          word-break: break-word;
        }

        .payment-details {
          margin-top: 30px;

          background: #f8fcfc;

          border:
            1px solid #e3eeee;

          border-radius: 18px;

          overflow: hidden;

          text-align: left;
        }

        .detail-row {
          min-height: 58px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          padding: 14px 20px;

          border-bottom:
            1px solid #e7eeee;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: #718385;

          font-size: 14px;

          font-weight: 500;
        }

        .detail-value {
          color: #173638;

          font-size: 14px;

          font-weight: 750;

          text-align: right;

          word-break: break-word;
        }

        .status-badge {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 7px 12px;

          border-radius: 999px;

          background:
            rgba(0, 164, 166, 0.10);

          color: #008b8d;

          font-size: 12px;

          font-weight: 800;

          white-space: nowrap;
        }

        .product-highlight {
          margin-top: 18px;

          display: flex;

          align-items: center;

          gap: 13px;

          padding: 15px;

          border-radius: 16px;

          background: #ffffff;

          border:
            1px solid #e4eeee;

          text-align: left;
        }

        .product-icon {
          width: 43px;
          height: 43px;

          flex-shrink: 0;

          border-radius: 12px;

          display: flex;

          align-items: center;

          justify-content: center;

          background:
            rgba(0, 164, 166, 0.09);

          color: #00a4a6;
        }

        .product-info {
          min-width: 0;
        }

        .product-label {
          color: #8a9a9c;

          font-size: 11px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.6px;
        }

        .product-name {
          margin-top: 3px;

          color: #173638;

          font-size: 14px;

          font-weight: 750;

          line-height: 1.4;

          word-break: break-word;
        }

        .actions {
          display: flex;

          gap: 12px;

          margin-top: 30px;
        }

        .primary-button,
        .secondary-button {
          flex: 1;

          min-height: 53px;

          border-radius: 14px;

          padding: 0 20px;

          font-size: 15px;

          font-weight: 700;

          cursor: pointer;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .primary-button {
          border: none;

          color: #ffffff;

          background: #00a4a6;

          box-shadow:
            0 9px 22px
            rgba(0, 164, 166, 0.21);
        }

        .primary-button:hover {
          background: #008f91;

          transform: translateY(-2px);

          box-shadow:
            0 13px 27px
            rgba(0, 164, 166, 0.25);
        }

        .secondary-button {
          border:
            1px solid #dbe8e8;

          color: #315254;

          background: #ffffff;
        }

        .secondary-button:hover {
          background: #f6fafa;

          transform: translateY(-2px);
        }

        .footer-message {
          margin: 24px auto 0;

          max-width: 480px;

          color: #8a9a9c;

          font-size: 13px;

          line-height: 1.6;
        }

        @keyframes success-pop {
          0% {
            opacity: 0;
            transform: scale(0.75);
          }

          70% {
            transform: scale(1.06);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 600px) {
          .payment-success-page {
            padding: 18px 14px;
          }

          .success-card {
            padding: 39px 20px;

            border-radius: 23px;
          }

          .success-title {
            font-size: 27px;
          }

          .success-description {
            font-size: 15px;
          }

          .success-icon-wrapper {
            width: 88px;
            height: 88px;
          }

          .confirmed-order {
            padding: 15px;
          }

          .detail-row {
            min-height: auto;

            align-items: flex-start;

            flex-direction: column;

            gap: 7px;
          }

          .detail-value {
            width: 100%;

            text-align: left;
          }

          .status-badge {
            align-self: flex-start;
          }

          .actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="success-container">
        <div className="brand">
          FOUNA
        </div>

        <div className="success-card">
          {/* Icône succès */}
          <div className="success-icon-wrapper">
            <CheckCircle2
              className="success-icon"
              size={58}
              strokeWidth={2.2}
            />
          </div>

          {/* Titre */}
          <h1 className="success-title">
            Paiement effectué avec succès
          </h1>

          <p className="success-description">
            Votre paiement a bien été enregistré.
            Votre commande est maintenant prise en compte
            par FOUNA.
          </p>

          {/* Commande confirmée */}
          <div className="confirmed-order">
            <span>
              Paiement confirmé pour la commande :
            </span>

            <span className="confirmed-order-id">
              {commande.commande_id}
            </span>
          </div>

          {/* Produit */}
          <div className="product-highlight">
            <div className="product-icon">
              <PackageCheck size={23} />
            </div>

            <div className="product-info">
              <div className="product-label">
                Produit commandé
              </div>

              <div className="product-name">
                {commande.nom}
              </div>
            </div>
          </div>

          {/* Informations paiement */}
          <div className="payment-details">
            {/* Statut */}
            <div className="detail-row">
              <span className="detail-label">
                Statut
              </span>

              <span className="status-badge">
                <CheckCircle2 size={14} />

                Paiement confirmé
              </span>
            </div>

            {/* Commande */}
            <div className="detail-row">
              <span className="detail-label">
                Commande
              </span>

              <span className="detail-value">
                {commande.commande_id}
              </span>
            </div>

            {/* Transaction si disponible */}
            {transactionId && (
              <div className="detail-row">
                <span className="detail-label">
                  Transaction
                </span>

                <span className="detail-value">
                  {transactionId}
                </span>
              </div>
            )}

            {/* Quantité */}
            <div className="detail-row">
              <span className="detail-label">
                Quantité
              </span>

              <span className="detail-value">
                {commande.quantite}
              </span>
            </div>

            {/* Montant */}
            <div className="detail-row">
              <span className="detail-label">
                Montant payé
              </span>

              <span className="detail-value">
                {formatAmount(
                  commande.prix_total
                )}{" "}
                {currency}
              </span>
            </div>

            {/* Mode d'expédition */}
            {commande.option_envoie && (
              <div className="detail-row">
                <span className="detail-label">
                  Expédition
                </span>

                <span className="detail-value">
                  {commande.option_envoie ===
                  "aérienne"
                    ? "Expédition aérienne"
                    : "Expédition maritime"}
                </span>
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="actions">
            <button
              className="primary-button"
              onClick={() =>
                navigate("/orders")
              }
            >
              <ShoppingBag size={19} />

              Voir mes commandes

              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/home")
              }
            >
              <Home size={18} />

              Accueil
            </button>
          </div>

          <p className="footer-message">
            Vous pouvez suivre l'évolution de votre
            commande depuis votre espace FOUNA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

