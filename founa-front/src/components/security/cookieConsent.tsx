import React, { useEffect, useState } from "react";
import {
  Cookie,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

export interface CookieConsentState {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const STORAGE_KEY = "founa_cookie_consent";

const DEFAULT_CONSENT: CookieConsentState = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [preferences, setPreferences] =
    useState<CookieConsentState>(DEFAULT_CONSENT);

  /**
   * ---------------------------------------------------------
   * CHARGEMENT DU CONSENTEMENT EXISTANT
   * ---------------------------------------------------------
   */
  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem(STORAGE_KEY);

      if (savedConsent) {
        const parsedConsent: CookieConsentState =
          JSON.parse(savedConsent);

        const consent: CookieConsentState = {
          necessary: true,
          preferences: Boolean(parsedConsent.preferences),
          analytics: Boolean(parsedConsent.analytics),
          marketing: Boolean(parsedConsent.marketing),
          updatedAt: parsedConsent.updatedAt || "",
        };

        setPreferences(consent);

        // Le consentement existe déjà :
        // on n'affiche pas la bannière.
        setVisible(false);
      } else {
        // Aucun consentement enregistré :
        // on affiche la bannière.
        setVisible(true);
        setShowSettings(false);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement du consentement cookies :",
        error
      );

      // En cas d'erreur, on affiche quand même
      // la bannière de consentement.
      setVisible(true);
      setShowSettings(false);
    }
  }, []);

  /**
   * ---------------------------------------------------------
   * OUVRIR LE GESTIONNAIRE DE COOKIES
   * ---------------------------------------------------------
   *
   * Permet au Footer, par exemple, d'ouvrir directement
   * les préférences via :
   *
   * window.dispatchEvent(
   *   new Event("founa-open-cookie-settings")
   * );
   */
  useEffect(() => {
    const handleOpenCookieSettings = () => {
      setVisible(true);
      setShowSettings(true);
    };

    window.addEventListener(
      "founa-open-cookie-settings",
      handleOpenCookieSettings
    );

    return () => {
      window.removeEventListener(
        "founa-open-cookie-settings",
        handleOpenCookieSettings
      );
    };
  }, []);

  /**
   * ---------------------------------------------------------
   * ENREGISTRER LE CONSENTEMENT
   * ---------------------------------------------------------
   */
  const saveConsent = (
    consent: CookieConsentState
  ) => {
    const finalConsent: CookieConsentState = {
      ...consent,
      necessary: true,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(finalConsent)
      );
    } catch (error) {
      console.error(
        "Impossible d'enregistrer le consentement cookies :",
        error
      );
    }

    setPreferences(finalConsent);
    setVisible(false);
    setShowSettings(false);

    /**
     * Permet aux autres parties de l'application
     * de savoir que le consentement vient de changer.
     */
    window.dispatchEvent(
      new CustomEvent(
        "founa-cookie-consent-changed",
        {
          detail: finalConsent,
        }
      )
    );
  };

  /**
   * ---------------------------------------------------------
   * ACCEPTER TOUS LES COOKIES
   * ---------------------------------------------------------
   */
  const acceptAll = () => {
    saveConsent({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
      updatedAt: "",
    });
  };

  /**
   * ---------------------------------------------------------
   * REFUSER LES COOKIES NON NÉCESSAIRES
   * ---------------------------------------------------------
   */
  const rejectAll = () => {
    saveConsent({
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
      updatedAt: "",
    });
  };

  /**
   * ---------------------------------------------------------
   * ENREGISTRER LES CHOIX PERSONNALISÉS
   * ---------------------------------------------------------
   */
  const savePreferences = () => {
    saveConsent(preferences);
  };

  /**
   * ---------------------------------------------------------
   * OUVRIR LES PRÉFÉRENCES
   * ---------------------------------------------------------
   */
  const openPreferences = () => {
    setShowSettings(true);
  };

  /**
   * ---------------------------------------------------------
   * FERMER LE GESTIONNAIRE
   * ---------------------------------------------------------
   *
   * Si l'utilisateur ouvre les paramètres depuis le Footer,
   * il peut simplement fermer la fenêtre.
   *
   * Si aucun consentement n'a encore été enregistré,
   * on revient à la bannière.
   */
  const closeSettings = () => {
    const savedConsent =
      localStorage.getItem(STORAGE_KEY);

    if (savedConsent) {
      setVisible(false);
      setShowSettings(false);
    } else {
      setShowSettings(false);
    }
  };

  /**
   * Si la bannière n'est pas visible,
   * on ne rend rien.
   */
  if (!visible) {
    return null;
  }

  return (
    <>
      <style>{`
        .founa-cookie-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 30, 32, 0.22);
          backdrop-filter: blur(2px);
          z-index: 99990;
        }

        .founa-cookie-banner {
          position: fixed;
          left: 20px;
          right: 20px;
          bottom: 20px;
          z-index: 99991;
          background: #ffffff;
          border: 1px solid #dceeee;
          border-radius: 18px;
          box-shadow: 0 20px 60px rgba(0, 60, 62, 0.20);
          padding: 22px;
          max-width: 900px;
          margin: auto;
        }

        .founa-cookie-top {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .founa-cookie-icon {
          flex: 0 0 auto;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #e9fafa;
          color: #00a4a6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .founa-cookie-content {
          flex: 1;
        }

        .founa-cookie-content h3 {
          margin: 0 0 7px;
          font-size: 18px;
          color: #162326;
        }

        .founa-cookie-content p {
          margin: 0;
          color: #58666a;
          font-size: 14px;
          line-height: 1.6;
        }

        .founa-cookie-content a {
          color: #00888a;
          font-weight: 600;
          text-decoration: none;
        }

        .founa-cookie-content a:hover {
          text-decoration: underline;
        }

        .founa-cookie-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .founa-cookie-btn {
          border: 0;
          border-radius: 10px;
          padding: 11px 16px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
          font-size: 14px;
        }

        .founa-cookie-btn:hover {
          transform: translateY(-1px);
        }

        .founa-cookie-btn-secondary {
          background: #eef5f5;
          color: #334346;
        }

        .founa-cookie-btn-secondary:hover {
          background: #e3eeee;
        }

        .founa-cookie-btn-primary {
          background: #00a4a6;
          color: white;
        }

        .founa-cookie-btn-primary:hover {
          background: #008f91;
        }

        .founa-cookie-btn-outline {
          background: white;
          color: #00888a;
          border: 1px solid #00a4a6;
        }

        .founa-cookie-btn-outline:hover {
          background: #f1fbfb;
        }

        .founa-cookie-settings {
          max-width: 620px;
          max-height: 90vh;
          overflow-y: auto;
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% - 30px);
          z-index: 99992;
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
        }

        .founa-cookie-settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .founa-cookie-settings-header h3 {
          margin: 0;
          font-size: 21px;
          color: #162326;
        }

        .founa-cookie-close {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 10px;
          background: #f2f5f5;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #344447;
          transition: 0.2s;
        }

        .founa-cookie-close:hover {
          background: #e7eeee;
        }

        .founa-cookie-category {
          padding: 17px 0;
          border-bottom: 1px solid #edf1f1;
        }

        .founa-cookie-category:last-of-type {
          border-bottom: 0;
        }

        .founa-cookie-category-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .founa-cookie-category-title {
          font-weight: 700;
          color: #263538;
        }

        .founa-cookie-category-description {
          margin: 6px 0 0;
          color: #667477;
          font-size: 13px;
          line-height: 1.5;
        }

        .founa-cookie-toggle {
          width: 48px;
          height: 26px;
          border-radius: 30px;
          border: 0;
          padding: 3px;
          background: #d7e0e0;
          cursor: pointer;
          flex: 0 0 auto;
        }

        .founa-cookie-toggle.active {
          background: #00a4a6;
        }

        .founa-cookie-toggle span {
          display: block;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: 0.2s;
        }

        .founa-cookie-toggle.active span {
          transform: translateX(22px);
        }

        .founa-cookie-required {
          font-size: 12px;
          color: #00888a;
          font-weight: 700;
          white-space: nowrap;
        }

        @media (max-width: 600px) {
          .founa-cookie-banner {
            left: 10px;
            right: 10px;
            bottom: 10px;
            padding: 18px;
          }

          .founa-cookie-top {
            gap: 12px;
          }

          .founa-cookie-icon {
            width: 40px;
            height: 40px;
          }

          .founa-cookie-content h3 {
            font-size: 16px;
          }

          .founa-cookie-content p {
            font-size: 13px;
          }

          .founa-cookie-actions {
            flex-direction: column;
          }

          .founa-cookie-btn {
            width: 100%;
          }

          .founa-cookie-settings {
            width: calc(100% - 20px);
            padding: 20px;
            border-radius: 16px;
          }

          .founa-cookie-category-row {
            align-items: flex-start;
          }

          .founa-cookie-category-description {
            max-width: 90%;
          }

          .founa-cookie-required {
            font-size: 11px;
          }
        }
      `}</style>

      {/* Overlay */}
      <div className="founa-cookie-overlay" />

      {/* =====================================================
          BANNIÈRE PRINCIPALE
          ===================================================== */}
      {!showSettings ? (
        <div className="founa-cookie-banner">

          <div className="founa-cookie-top">

            <div className="founa-cookie-icon">
              <Cookie size={23} />
            </div>

            <div className="founa-cookie-content">

              <h3>
                Votre confidentialité compte
              </h3>

              <p>
                FOUNA utilise des technologies nécessaires
                au fonctionnement du service et peut utiliser,
                avec votre accord, certaines technologies
                permettant d'améliorer votre expérience.
                <br />

                <a href="/cookie-policy">
                  En savoir plus sur les cookies
                </a>
              </p>

            </div>

          </div>

          <div className="founa-cookie-actions">

            <button
              type="button"
              className="founa-cookie-btn founa-cookie-btn-secondary"
              onClick={rejectAll}
            >
              Tout refuser
            </button>

            <button
              type="button"
              className="founa-cookie-btn founa-cookie-btn-outline"
              onClick={openPreferences}
            >
              <Settings
                size={15}
                style={{
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              />

              Personnaliser
            </button>

            <button
              type="button"
              className="founa-cookie-btn founa-cookie-btn-primary"
              onClick={acceptAll}
            >
              Tout accepter
            </button>

          </div>

        </div>
      ) : (

        /* =====================================================
           PARAMÈTRES DES COOKIES
           ===================================================== */

        <div className="founa-cookie-settings">

          <div className="founa-cookie-settings-header">

            <h3>
              Préférences cookies
            </h3>

            <button
              type="button"
              className="founa-cookie-close"
              onClick={closeSettings}
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

          </div>

          {/* =================================================
              COOKIES NÉCESSAIRES
              ================================================= */}

          <div className="founa-cookie-category">

            <div className="founa-cookie-category-row">

              <div>
                <div className="founa-cookie-category-title">
                  Cookies nécessaires
                </div>

                <p className="founa-cookie-category-description">
                  Nécessaires au fonctionnement et à la sécurité
                  de FOUNA.
                </p>
              </div>

              <span className="founa-cookie-required">
                Toujours actifs
              </span>

            </div>

          </div>

          {/* =================================================
              PRÉFÉRENCES
              ================================================= */}

          <div className="founa-cookie-category">

            <div className="founa-cookie-category-row">

              <div>
                <div className="founa-cookie-category-title">
                  Préférences
                </div>

                <p className="founa-cookie-category-description">
                  Permettent de mémoriser certaines préférences.
                </p>
              </div>

              <button
                type="button"
                aria-label="Activer ou désactiver les préférences"
                className={
                  preferences.preferences
                    ? "founa-cookie-toggle active"
                    : "founa-cookie-toggle"
                }
                onClick={() =>
                  setPreferences((previous) => ({
                    ...previous,
                    preferences:
                      !previous.preferences,
                  }))
                }
              >
                <span />
              </button>

            </div>

          </div>

          {/* =================================================
              ANALYTICS
              ================================================= */}

          <div className="founa-cookie-category">

            <div className="founa-cookie-category-row">

              <div>
                <div className="founa-cookie-category-title">
                  Mesure d'audience
                </div>

                <p className="founa-cookie-category-description">
                  Permet de mesurer l'utilisation de FOUNA
                  lorsque ce traitement est activé.
                </p>
              </div>

              <button
                type="button"
                aria-label="Activer ou désactiver la mesure d'audience"
                className={
                  preferences.analytics
                    ? "founa-cookie-toggle active"
                    : "founa-cookie-toggle"
                }
                onClick={() =>
                  setPreferences((previous) => ({
                    ...previous,
                    analytics:
                      !previous.analytics,
                  }))
                }
              >
                <span />
              </button>

            </div>

          </div>

          {/* =================================================
              MARKETING
              ================================================= */}

          <div className="founa-cookie-category">

            <div className="founa-cookie-category-row">

              <div>
                <div className="founa-cookie-category-title">
                  Marketing
                </div>

                <p className="founa-cookie-category-description">
                  Destiné aux fonctionnalités marketing
                  lorsqu'elles sont utilisées.
                </p>
              </div>

              <button
                type="button"
                aria-label="Activer ou désactiver le marketing"
                className={
                  preferences.marketing
                    ? "founa-cookie-toggle active"
                    : "founa-cookie-toggle"
                }
                onClick={() =>
                  setPreferences((previous) => ({
                    ...previous,
                    marketing:
                      !previous.marketing,
                  }))
                }
              >
                <span />
              </button>

            </div>

          </div>

          {/* =================================================
              ACTIONS
              ================================================= */}

          <div className="founa-cookie-actions">

            <button
              type="button"
              className="founa-cookie-btn founa-cookie-btn-secondary"
              onClick={rejectAll}
            >
              Tout refuser
            </button>

            <button
              type="button"
              className="founa-cookie-btn founa-cookie-btn-primary"
              onClick={savePreferences}
            >
              <ShieldCheck
                size={15}
                style={{
                  verticalAlign: "middle",
                  marginRight: 5,
                }}
              />

              Enregistrer mes choix
            </button>

          </div>

        </div>
      )}
    </>
  );
};

export default CookieConsent;