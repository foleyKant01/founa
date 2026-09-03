import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  Package,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  Clock3,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Store,
  RefreshCw,
} from "lucide-react";

const TellerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [teller, setTeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // RECUPERATION DU TELLER
  // =========================================================

  useEffect(() => {
    const storedTeller = localStorage.getItem("teller");

    if (!storedTeller) {
      navigate("/auth/login");
      return;
    }

    try {
      const parsedTeller = JSON.parse(storedTeller);
      setTeller(parsedTeller);
    } catch (error) {
      console.error("Erreur lecture teller :", error);
      localStorage.removeItem("teller");
      navigate("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =========================================================
  // STATISTIQUES
  // =========================================================
  //
  // Pour l'instant ce sont des valeurs d'affichage.
  // Elles pourront ensuite être remplacées par tes APIs.
  //

  const statistics = useMemo(
    () => ({
      produits: 0,
      commandes: 0,
      commandesEnCours: 0,
      commandesLivrees: 0,
    }),
    []
  );

  // =========================================================
  // DECONNEXION
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("teller");
    navigate("/auth/login");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes tellerSpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            .teller-loader {
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

            .teller-spinner {
              width: 48px;
              height: 48px;
              border: 4px solid #E5E7EB;
              border-top-color: #00A4A6;
              border-radius: 50%;
              animation: tellerSpin 0.8s linear infinite;
            }
          `}
        </style>

        <div className="teller-loader">
          <div className="teller-spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .teller-page {
            min-height: 100vh;
            width: 100%;
            background: #F5F7F8;
            padding: 24px 24px 100px;
            font-family: Arial, Helvetica, sans-serif;
          }

          .teller-wrapper {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
          }

          /* =========================================
             HEADER
          ========================================= */

          .teller-header {
            background: linear-gradient(
              135deg,
              #00A4A6 0%,
              #00898B 100%
            );
            border-radius: 22px;
            padding: 30px;
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 25px;
            margin-bottom: 24px;
            box-shadow: 0 12px 35px rgba(0,164,166,0.18);
          }

          .teller-header-left {
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .teller-logo {
            width: 68px;
            height: 68px;
            border-radius: 18px;
            background: rgba(255,255,255,0.18);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .teller-header h1 {
            margin: 0;
            font-size: 27px;
            font-weight: 700;
          }

          .teller-header p {
            margin: 7px 0 0;
            font-size: 14px;
            opacity: 0.9;
          }

          .teller-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            border-radius: 30px;
            background: rgba(255,255,255,0.16);
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
          }

          /* =========================================
             STATISTIQUES
          ========================================= */

          .teller-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 25px;
          }

          .teller-stat {
            background: #ffffff;
            border-radius: 17px;
            padding: 21px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.04);
            transition: 0.2s;
          }

          .teller-stat:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 22px rgba(0,0,0,0.07);
          }

          .teller-stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .stat-teal {
            background: #E8F8F8;
            color: #00A4A6;
          }

          .stat-blue {
            background: #EFF6FF;
            color: #2563EB;
          }

          .stat-orange {
            background: #FFF7ED;
            color: #EA580C;
          }

          .stat-green {
            background: #F0FDF4;
            color: #16A34A;
          }

          .teller-stat-info span {
            display: block;
            color: #6B7280;
            font-size: 12px;
            margin-bottom: 5px;
          }

          .teller-stat-info strong {
            font-size: 22px;
            color: #111827;
          }

          /* =========================================
             SECTION TITLE
          ========================================= */

          .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
          }

          .section-header h2 {
            margin: 0;
            font-size: 19px;
            color: #111827;
          }

          .section-header p {
            margin: 4px 0 0;
            color: #9CA3AF;
            font-size: 13px;
          }

          /* =========================================
             ACTIONS
          ========================================= */

          .teller-actions {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 25px;
          }

          .teller-action-card {
            position: relative;
            overflow: hidden;
            background: #ffffff;
            border-radius: 17px;
            padding: 23px;
            cursor: pointer;
            border: 1px solid transparent;
            box-shadow: 0 4px 15px rgba(0,0,0,0.04);
            transition: all 0.22s ease;
          }

          .teller-action-card:hover {
            transform: translateY(-4px);
            border-color: #BFE9E9;
            box-shadow: 0 12px 28px rgba(0,164,166,0.10);
          }

          .action-icon {
            width: 48px;
            height: 48px;
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 18px;
          }

          .action-teal {
            background: #E8F8F8;
            color: #00A4A6;
          }

          .action-blue {
            background: #EFF6FF;
            color: #2563EB;
          }

          .action-orange {
            background: #FFF7ED;
            color: #EA580C;
          }

          .action-purple {
            background: #F5F3FF;
            color: #7C3AED;
          }

          .action-content {
            padding-right: 25px;
          }

          .action-content h3 {
            margin: 0 0 7px;
            font-size: 17px;
            color: #111827;
          }

          .action-content p {
            margin: 0;
            color: #6B7280;
            font-size: 13px;
            line-height: 1.5;
          }

          .action-arrow {
            position: absolute;
            right: 18px;
            bottom: 18px;
            color: #9CA3AF;
            transition: 0.2s;
          }

          .teller-action-card:hover .action-arrow {
            color: #00A4A6;
            transform: translateX(3px);
          }

          /* =========================================
             LOWER GRID
          ========================================= */

          .teller-lower {
            display: grid;
            grid-template-columns: 1.4fr 0.8fr;
            gap: 20px;
          }

          .teller-panel {
            background: #ffffff;
            border-radius: 18px;
            padding: 24px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          }

          /* =========================================
             ACTIVITE
          ========================================= */

          .activity-item {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 14px 0;
            border-bottom: 1px solid #F0F2F3;
          }

          .activity-item:last-child {
            border-bottom: none;
          }

          .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 11px;
            background: #E8F8F8;
            color: #00A4A6;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .activity-info {
            flex: 1;
          }

          .activity-info strong {
            display: block;
            color: #374151;
            font-size: 14px;
            margin-bottom: 4px;
          }

          .activity-info span {
            color: #9CA3AF;
            font-size: 12px;
          }

          /* =========================================
             INFO
          ========================================= */

          .info-box {
            border-radius: 14px;
            background: #F8FFFF;
            border: 1px solid #D8F1F1;
            padding: 18px;
          }

          .info-box-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            color: #00A4A6;
          }

          .info-box-header strong {
            color: #111827;
            font-size: 15px;
          }

          .info-box p {
            margin: 0;
            color: #6B7280;
            font-size: 13px;
            line-height: 1.6;
          }

          /* =========================================
             LOGOUT
          ========================================= */

          .logout-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 22px;
          }

          .logout-button {
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid #FECACA;
            background: #FFF8F8;
            color: #DC2626;
            padding: 11px 17px;
            border-radius: 11px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
          }

          .logout-button:hover {
            background: #FEE2E2;
          }

          /* =========================================
             RESPONSIVE
          ========================================= */

          @media (max-width: 1200px) {
            .teller-actions {
              grid-template-columns: repeat(2, 1fr);
            }

            .teller-lower {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 900px) {
            .teller-stats {
              grid-template-columns: repeat(2, 1fr);
            }

            .teller-header {
              padding: 24px;
            }
          }

          @media (max-width: 650px) {
            .teller-page {
              padding: 15px 13px 90px;
            }

            .teller-header {
              flex-direction: column;
              align-items: flex-start;
              padding: 21px;
              border-radius: 17px;
            }

            .teller-header-left {
              align-items: flex-start;
            }

            .teller-logo {
              width: 55px;
              height: 55px;
            }

            .teller-header h1 {
              font-size: 22px;
            }

            .teller-header p {
              font-size: 12px;
            }

            .teller-badge {
              width: 100%;
              justify-content: center;
            }

            .teller-stats {
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }

            .teller-stat {
              padding: 15px;
              gap: 10px;
            }

            .teller-stat-icon {
              width: 42px;
              height: 42px;
            }

            .teller-stat-info strong {
              font-size: 18px;
            }

            .teller-actions {
              grid-template-columns: 1fr;
            }

            .teller-action-card {
              padding: 19px;
            }

            .teller-panel {
              padding: 18px;
            }

            .logout-container {
              justify-content: center;
            }
          }

          @media (max-width: 420px) {
            .teller-stats {
              grid-template-columns: 1fr;
            }

            .teller-header-left {
              gap: 12px;
            }

            .teller-heading {
              min-width: 0;
            }

            .teller-heading h1 {
              font-size: 20px;
            }
          }
        `}
      </style>

      <div className="teller-page">
        <div className="teller-wrapper">

          {/* =========================================
              HEADER
          ========================================= */}

          <header className="teller-header">

            <div className="teller-header-left">

              <div className="teller-logo">
                <Store size={34} />
              </div>

              <div className="teller-heading">
                <h1>
                  Bonjour
                  {teller?.fullname
                    ? `, ${teller.fullname}`
                    : ""}
                </h1>

                <p>
                  Bienvenue dans votre espace de gestion Founa.
                </p>
              </div>

            </div>

            <div className="teller-badge">
              <Store size={16} />
              Espace Marchand
            </div>

          </header>

          {/* =========================================
              STATISTIQUES
          ========================================= */}

          <div className="teller-stats">

            <div className="teller-stat">
              <div className="teller-stat-icon stat-teal">
                <Package size={23} />
              </div>

              <div className="teller-stat-info">
                <span>Produits</span>
                <strong>{statistics.produits}</strong>
              </div>
            </div>

            <div className="teller-stat">
              <div className="teller-stat-icon stat-blue">
                <ShoppingCart size={23} />
              </div>

              <div className="teller-stat-info">
                <span>Commandes</span>
                <strong>{statistics.commandes}</strong>
              </div>
            </div>

            <div className="teller-stat">
              <div className="teller-stat-icon stat-orange">
                <Clock3 size={23} />
              </div>

              <div className="teller-stat-info">
                <span>En cours</span>
                <strong>{statistics.commandesEnCours}</strong>
              </div>
            </div>

            <div className="teller-stat">
              <div className="teller-stat-icon stat-green">
                <CheckCircle2 size={23} />
              </div>

              <div className="teller-stat-info">
                <span>Livrées</span>
                <strong>{statistics.commandesLivrees}</strong>
              </div>
            </div>

          </div>

          {/* =========================================
              ACTIONS RAPIDES
          ========================================= */}

          <div className="section-header">
            <div>
              <h2>Actions rapides</h2>
              <p>
                Accédez rapidement aux principales fonctions.
              </p>
            </div>
          </div>

          <div className="teller-actions">

            {/* <div
              className="teller-action-card"
              onClick={() => navigate("/teller/create")}
            >
              <div className="action-icon action-teal">
                <PackagePlus size={24} />
              </div>

              <div className="action-content">
                <h3>Créer un produit</h3>

                <p>
                  Ajoutez un nouveau produit à votre catalogue.
                </p>
              </div>

              <ArrowRight
                className="action-arrow"
                size={19}
              />
            </div> */}

            <div
              className="teller-action-card"
              onClick={() => navigate("/teller/readall")}
            >
              <div className="action-icon action-blue">
                <Package size={24} />
              </div>

              <div className="action-content">
                <h3>Produits</h3>

                <p>
                  Consultez et gérez les produits disponibles.
                </p>
              </div>

              <ArrowRight
                className="action-arrow"
                size={19}
              />
            </div>

            <div
              className="teller-action-card"
              onClick={() =>
                navigate("/teller/allorderteller")
              }
            >
              <div className="action-icon action-orange">
                <ShoppingCart size={24} />
              </div>

              <div className="action-content">
                <h3>Commandes</h3>

                <p>
                  Consultez et gérez les commandes des clients.
                </p>
              </div>

              <ArrowRight
                className="action-arrow"
                size={19}
              />
            </div>

            <div
              className="teller-action-card"
              onClick={() =>
                navigate("/teller/stateteller")
              }
            >
              <div className="action-icon action-purple">
                <BarChart3 size={24} />
              </div>

              <div className="action-content">
                <h3>Statistiques</h3>

                <p>
                  Analysez les performances de votre activité.
                </p>
              </div>

              <ArrowRight
                className="action-arrow"
                size={19}
              />
            </div>

          </div>

          {/* =========================================
              PARTIE BASSE
          ========================================= */}

          <div className="teller-lower">

            {/* ACTIVITE */}
            <div className="teller-panel">

              <div className="section-header">
                <div>
                  <h2>Activité récente</h2>

                  <p>
                    Suivez les dernières opérations.
                  </p>
                </div>

                <RefreshCw
                  size={18}
                  color="#9CA3AF"
                />
              </div>

              <div className="activity-item">

                <div className="activity-icon">
                  <PackagePlus size={18} />
                </div>

                <div className="activity-info">
                  <strong>
                    Gestion des produits
                  </strong>

                  <span>
                    Consultez votre catalogue de produits.
                  </span>
                </div>

              </div>

              <div className="activity-item">

                <div className="activity-icon">
                  <ShoppingCart size={18} />
                </div>

                <div className="activity-info">
                  <strong>
                    Gestion des commandes
                  </strong>

                  <span>
                    Consultez les commandes reçues.
                  </span>
                </div>

              </div>

              <div className="activity-item">

                <div className="activity-icon">
                  <TrendingUp size={18} />
                </div>

                <div className="activity-info">
                  <strong>
                    Suivi des performances
                  </strong>

                  <span>
                    Consultez vos statistiques commerciales.
                  </span>
                </div>

              </div>

            </div>

            {/* INFORMATION */}
            <div className="teller-panel">

              <div className="section-header">
                <div>
                  <h2>Information</h2>

                  <p>
                    Votre espace marchand
                  </p>
                </div>
              </div>

              <div className="info-box">

                <div className="info-box-header">
                  <Store size={19} />

                  <strong>
                    Espace Teller Founa
                  </strong>
                </div>

                <p>
                  Depuis cet espace, vous pouvez gérer
                  vos produits, suivre les commandes
                  clients et consulter les performances
                  de votre activité.
                </p>

              </div>

            </div>

          </div>

          {/* =========================================
              DECONNEXION
          ========================================= */}

          <div className="logout-container">

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Déconnexion
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

export default TellerDashboard;
