import React from "react";
import { CheckCircle2, ArrowRight, ShoppingBag, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface PaymentSuccessState {
  commande_id?: string;
  transaction_id?: string;
  amount?: number;
  currency?: string;
}

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as PaymentSuccessState;

  const commandeId = state.commande_id;
  const transactionId = state.transaction_id;
  const amount = state.amount;
  const currency = state.currency || "XOF";

  const formatAmount = (value?: number) => {
    if (value === undefined || value === null) {
      return null;
    }

    return new Intl.NumberFormat("fr-FR").format(value);
  };

  return (
    <div className="payment-success-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .payment-success-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(0, 164, 166, 0.12),
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

        .success-container {
          width: 100%;
          max-width: 620px;
          text-align: center;
        }

        .success-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 48px 40px;
          box-shadow:
            0 20px 60px rgba(0, 70, 72, 0.08),
            0 4px 18px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 164, 166, 0.08);
        }

        .success-icon-wrapper {
          width: 94px;
          height: 94px;
          margin: 0 auto 28px;
          border-radius: 50%;
          background: rgba(0, 164, 166, 0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .success-icon-wrapper::before {
          content: "";
          position: absolute;
          inset: -9px;
          border: 1px solid rgba(0, 164, 166, 0.15);
          border-radius: 50%;
        }

        .success-icon {
          color: #00a4a6;
        }

        .success-title {
          margin: 0;
          font-size: 32px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.7px;
          color: #153638;
        }

        .success-description {
          margin: 15px auto 0;
          max-width: 480px;
          color: #687b7d;
          font-size: 16px;
          line-height: 1.65;
        }

        .payment-details {
          margin-top: 32px;
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
          padding: 17px 20px;
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

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(0, 164, 166, 0.10);
          color: #008b8d;
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

        .brand {
          margin-bottom: 22px;
          color: #00a4a6;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        @media (max-width: 600px) {
          .payment-success-page {
            padding: 18px 14px;
          }

          .success-card {
            padding: 36px 20px;
            border-radius: 22px;
          }

          .success-title {
            font-size: 27px;
          }

          .success-description {
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

      <div className="success-container">
        <div className="brand">FOUNA</div>

        <div className="success-card">
          <div className="success-icon-wrapper">
            <CheckCircle2
              className="success-icon"
              size={58}
              strokeWidth={2.2}
            />
          </div>

          <h1 className="success-title">
            Paiement effectué avec succès
          </h1>

          <p className="success-description">
            Votre paiement a bien été enregistré. Votre commande est
            maintenant prise en compte par FOUNA.
          </p>

          <div className="payment-details">
            <div className="detail-row">
              <span className="detail-label">
                Statut
              </span>

              <span className="status-badge">
                <CheckCircle2 size={15} />
                Paiement confirmé
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
                  Montant payé
                </span>

                <span className="detail-value">
                  {formatAmount(amount)} {currency}
                </span>
              </div>
            )}
          </div>

          <div className="actions">
            <button
              className="primary-button"
              onClick={() => navigate("/orders")}
            >
              <ShoppingBag size={19} />
              Voir mes commandes
              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/home")}
            >
              <Home size={18} />
              Accueil
            </button>
          </div>

          <p className="footer-message">
            Vous pouvez suivre l'évolution de votre commande depuis
            votre espace FOUNA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;