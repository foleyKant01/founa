import React from "react";
import {
  XCircle,
  RefreshCw,
  ShoppingBag,
  Home,
  AlertTriangle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface PaymentErrorState {
  commande_id?: string;
  transaction_id?: string;
  amount?: number;
  currency?: string;
  message?: string;
}

const PaymentErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as PaymentErrorState;

  const commandeId = state.commande_id;
  const transactionId = state.transaction_id;
  const amount = state.amount;
  const currency = state.currency || "XOF";

  const errorMessage =
    state.message ||
    "Le paiement n'a pas pu être finalisé. Aucun paiement confirmé n'a été enregistré pour cette transaction.";

  const formatAmount = (value?: number) => {
    if (value === undefined || value === null) {
      return null;
    }

    return new Intl.NumberFormat("fr-FR").format(value);
  };

  const handleRetry = () => {
    if (commandeId) {
      navigate("/payment", {
        state: {
          commande_id: commandeId,
          amount,
          currency,
        },
      });
      return;
    }

    navigate("/orders");
  };

  return (
    <div className="payment-error-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .payment-error-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(0, 164, 166, 0.10),
              transparent 40%
            ),
            #f7fbfb;
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

        .payment-error-container {
          width: 100%;
          max-width: 620px;
          text-align: center;
        }

        .brand {
          margin-bottom: 22px;
          color: #00a4a6;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .error-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 48px 40px;
          box-shadow:
            0 20px 60px rgba(0, 70, 72, 0.08),
            0 4px 18px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 164, 166, 0.08);
        }

        .error-icon-wrapper {
          width: 94px;
          height: 94px;
          margin: 0 auto 28px;
          border-radius: 50%;
          background: #fff4f4;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .error-icon-wrapper::before {
          content: "";
          position: absolute;
          inset: -9px;
          border: 1px solid rgba(220, 70, 70, 0.14);
          border-radius: 50%;
        }

        .error-icon {
          color: #dc4b4b;
        }

        .error-title {
          margin: 0;
          font-size: 32px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.7px;
          color: #26383a;
        }

        .error-description {
          margin: 15px auto 0;
          max-width: 500px;
          color: #687b7d;
          font-size: 16px;
          line-height: 1.65;
        }

        .error-message {
          margin-top: 28px;
          padding: 17px 20px;
          border-radius: 16px;
          background: #fff8f8;
          border: 1px solid #f5dddd;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
        }

        .error-message-icon {
          flex-shrink: 0;
          color: #dc4b4b;
          margin-top: 2px;
        }

        .error-message-text {
          color: #754545;
          font-size: 14px;
          line-height: 1.55;
        }

        .payment-details {
          margin-top: 22px;
          background: #f7fbfb;
          border: 1px solid #e6f0f0;
          border-radius: 18px;
          overflow: hidden;
          text-align: left;
        }

        .detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 20px;
          border-bottom: 1px solid #e7eeee;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: #718385;
          font-size: 14px;
        }

        .detail-value {
          color: #173638;
          font-size: 14px;
          font-weight: 700;
          text-align: right;
          word-break: break-word;
        }

        .failed-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 999px;
          background: #fff0f0;
          color: #c13f3f;
          font-size: 13px;
          font-weight: 700;
        }

        .actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .primary-button,
        .secondary-button {
          flex: 1;
          min-height: 52px;
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
          box-shadow: 0 8px 20px rgba(0, 164, 166, 0.20);
        }

        .primary-button:hover {
          background: #008f91;
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(0, 164, 166, 0.25);
        }

        .secondary-button {
          border: 1px solid #dbe8e8;
          color: #315254;
          background: #ffffff;
        }

        .secondary-button:hover {
          background: #f6fafa;
          transform: translateY(-2px);
        }

        .footer-message {
          margin-top: 25px;
          color: #8a9a9c;
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .payment-error-page {
            padding: 18px 14px;
          }

          .error-card {
            padding: 36px 20px;
            border-radius: 22px;
          }

          .error-title {
            font-size: 27px;
          }

          .error-description {
            font-size: 15px;
          }

          .actions {
            flex-direction: column;
          }

          .detail-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 6px;
          }

          .detail-value {
            text-align: left;
          }
        }
      `}</style>

      <div className="payment-error-container">
        <div className="brand">FOUNA</div>

        <div className="error-card">
          <div className="error-icon-wrapper">
            <XCircle
              className="error-icon"
              size={58}
              strokeWidth={2.2}
            />
          </div>

          <h1 className="error-title">
            Paiement non effectué
          </h1>

          <p className="error-description">
            Nous n'avons pas pu finaliser votre paiement.
            Vous pouvez réessayer ou consulter vos commandes.
          </p>

          <div className="error-message">
            <AlertTriangle
              className="error-message-icon"
              size={20}
            />

            <div className="error-message-text">
              {errorMessage}
            </div>
          </div>

          {(commandeId || transactionId || amount !== undefined) && (
            <div className="payment-details">
              <div className="detail-row">
                <span className="detail-label">
                  Statut
                </span>

                <span className="failed-badge">
                  <XCircle size={15} />
                  Paiement échoué
                </span>
              </div>

              {commandeId && (
                <div className="detail-row">
                  <span className="detail-label">
                    Commande
                  </span>

                  <span className="detail-value">
                    {commandeId}
                  </span>
                </div>
              )}

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

              {amount !== undefined && (
                <div className="detail-row">
                  <span className="detail-label">
                    Montant
                  </span>

                  <span className="detail-value">
                    {formatAmount(amount)} {currency}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="actions">
            <button
              className="primary-button"
              onClick={handleRetry}
            >
              <RefreshCw size={19} />
              Réessayer le paiement
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/orders")}
            >
              <ShoppingBag size={18} />
              Mes commandes
            </button>
          </div>

          <button
            className="secondary-button"
            style={{
              width: "100%",
              marginTop: "12px",
            }}
            onClick={() => navigate("/home")}
          >
            <Home size={18} />
            Retour à l'accueil
          </button>

          <p className="footer-message">
            Si le montant a été débité malgré cette erreur,
            ne relancez pas immédiatement le paiement.
            Vérifiez d'abord le statut de votre transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPage;