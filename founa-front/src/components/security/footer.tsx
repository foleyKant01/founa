import React from "react";
import { Cookie, Mail, ShieldCheck, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const openCookieSettings = () => {
    window.dispatchEvent(
      new Event("founa-open-cookie-settings")
    );
  };

  return (
    <footer className="founa-footer">
      <style>{`
        .founa-footer {
          background: #ffffff;
          border-top: 1px solid #e6eeee;
          padding: 45px 20px 25px;
          color: #526064;
        }

        .founa-footer-inner {
          width: min(1180px, 100%);
          margin: auto;
        }

        .founa-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 45px;
        }

        .founa-footer-logo {
          height: 42px;
          margin-bottom: 15px;
        }

        .founa-footer-description {
          max-width: 430px;
          line-height: 1.7;
          font-size: 14px;
        }

        .founa-footer h4 {
          color: #1f3033;
          margin: 0 0 15px;
        }

        .founa-footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .founa-footer-link {
          border: 0;
          padding: 0;
          background: transparent;
          text-align: left;
          color: #58676a;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .founa-footer-link:hover {
          color: #00a4a6;
        }

        .founa-footer-bottom {
          border-top: 1px solid #edf1f1;
          margin-top: 35px;
          padding-top: 20px;
          font-size: 13px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        @media (max-width: 750px) {
          .founa-footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .founa-footer-bottom {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="founa-footer-inner">

        <div className="founa-footer-grid">

          <div>
            <img
              src="/logo-founa2.png"
              alt="FOUNA"
              className="founa-footer-logo"
            />

            <p className="founa-footer-description">
              FOUNA facilite la recherche et la commande de
              produits proposés par des fournisseurs internationaux.
            </p>
          </div>

          <div>
            <h4>Informations</h4>

            <div className="founa-footer-links">

              <button
                className="founa-footer-link"
                onClick={() => navigate("/privacy-policy")}
              >
                <ShieldCheck size={16} />
                Politique de confidentialité
              </button>

              <button
                className="founa-footer-link"
                onClick={() => navigate("/terms")}
              >
                <FileText size={16} />
                Conditions d'utilisation
              </button>

              <button
                className="founa-footer-link"
                onClick={() => navigate("/cookie-policy")}
              >
                <Cookie size={16} />
                Politique de cookies
              </button>

            </div>
          </div>

          <div>
            <h4>Confidentialité</h4>

            <div className="founa-footer-links">

              <button
                className="founa-footer-link"
                onClick={openCookieSettings}
              >
                <Cookie size={16} />
                Gérer mes cookies
              </button>

              <button
                className="founa-footer-link"
                onClick={() =>
                  window.location.href =
                    "mailto:[EMAIL PROFESSIONNEL FOUNA]"
                }
              >
                <Mail size={16} />
                Nous contacter
              </button>

            </div>
          </div>

        </div>

        <div className="founa-footer-bottom">
          <span>
            © {new Date().getFullYear()} FOUNA. Tous droits réservés.
          </span>

          <span>
            founa.ci
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;