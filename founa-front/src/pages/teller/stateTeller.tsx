// src/pages/StatistiquesTellerPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { StatistiquesTeller } from "../../services/order.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  PackageCheck,
  CalendarDays,
} from "lucide-react";

interface RevenuMois {
  year: number;
  month: number;
  revenu: number;
}

interface StatistiquesData {
  nombre_commandes_livrees: number;
  revenu_total: number;
  revenu_par_mois: RevenuMois[];
}

const StatistiquesTellerPage: React.FC = () => {
  const [data, setData] = useState<StatistiquesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  /* =========================================================
     TELLER
  ========================================================= */

  const getTeller = () => {
    try {
      const tellerStr = localStorage.getItem("teller");

      if (!tellerStr) {
        return null;
      }

      return JSON.parse(tellerStr);
    } catch (error) {
      console.error("Erreur lecture teller :", error);
      return null;
    }
  };

  const teller = getTeller();

  /* =========================================================
     CHARGEMENT DES STATISTIQUES
  ========================================================= */

  const loadStatistiques = async (isRefresh = false) => {
    if (!teller?.uid) {
      setErrorMsg("Teller introuvable.");
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrorMsg(null);

    try {
      const res = await StatistiquesTeller({
        teller_id: teller.uid,
      });

      if (res.data.status === "success") {
        setData({
          nombre_commandes_livrees:
            Number(res.data.nombre_commandes_livrees) || 0,

          revenu_total:
            Number(res.data.revenu_total) || 0,

          revenu_par_mois:
            Array.isArray(res.data.revenu_par_mois)
              ? res.data.revenu_par_mois
              : [],
        });
      } else {
        const message =
          res.data.message || "Impossible de récupérer les statistiques.";

        setErrorMsg(message);

        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: message,
        });
      }
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Erreur serveur lors du chargement des statistiques.";

      setErrorMsg(message);

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStatistiques();
  }, []);

  /* =========================================================
     FORMATAGE
  ========================================================= */

  const formatPrice = (value: number | string) => {
    return Number(value || 0).toLocaleString("fr-FR");
  };

  const formatMonth = (year: number, month: number) => {
    const date = new Date(year, month - 1);

    return date.toLocaleString("fr-FR", {
      month: "short",
      year: "numeric",
    });
  };

  const formatMonthLong = (year: number, month: number) => {
    const date = new Date(year, month - 1);

    return date.toLocaleString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  };

  /* =========================================================
     DONNÉES GRAPHIQUE
  ========================================================= */

  const chartData = useMemo(() => {
    if (!data?.revenu_par_mois) return [];

    return data.revenu_par_mois.map((item) => ({
      month: formatMonth(item.year, item.month),
      monthLong: formatMonthLong(item.year, item.month),
      revenu: Number(item.revenu) || 0,
    }));
  }, [data]);

  /* =========================================================
     MOYENNE MENSUELLE
  ========================================================= */

  const revenuMoyen = useMemo(() => {
    if (!data?.revenu_par_mois?.length) return 0;

    const total = data.revenu_par_mois.reduce(
      (sum, item) => sum + (Number(item.revenu) || 0),
      0
    );

    return total / data.revenu_par_mois.length;
  }, [data]);

  /* =========================================================
     MEILLEUR MOIS
  ========================================================= */

  const meilleurMois = useMemo(() => {
    if (!data?.revenu_par_mois?.length) return null;

    return data.revenu_par_mois.reduce((max, current) => {
      return Number(current.revenu) > Number(max.revenu)
        ? current
        : max;
    });
  }, [data]);

  /* =========================================================
     LOADER PLEIN ÉCRAN
  ========================================================= */

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  /* =========================================================
     ERREUR
  ========================================================= */

  if (errorMsg && !data) {
    return (
      <>
        <div className="error-page">

          <div className="error-icon">
            <BarChart3 size={42} />
          </div>

          <h2>Impossible de charger les statistiques</h2>

          <p>{errorMsg}</p>

          <div className="error-actions">

            <button
              className="secondary-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Retour
            </button>

            <button
              className="primary-button"
              onClick={() => loadStatistiques()}
            >
              <RefreshCw size={18} />
              Réessayer
            </button>

          </div>

        </div>

        <style>{`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
          }

          .error-page {
            min-height: 100vh;
            width: 100%;
            background: #F5F7F8;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 30px;
            font-family: Arial, sans-serif;
          }

          .error-icon {
            width: 82px;
            height: 82px;
            border-radius: 50%;
            background: #FEF2F2;
            color: #DC2626;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .error-page h2 {
            margin: 0 0 8px;
            color: #111827;
          }

          .error-page p {
            color: #6B7280;
            margin: 0 0 24px;
          }

          .error-actions {
            display: flex;
            gap: 10px;
          }

          .primary-button,
          .secondary-button {
            height: 42px;
            padding: 0 16px;
            border-radius: 9px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-weight: 600;
          }

          .primary-button {
            border: none;
            background: #00A4A6;
            color: white;
          }

          .secondary-button {
            border: 1px solid #D1D5DB;
            background: white;
            color: #374151;
          }
        `}</style>
      </>
    );
  }

  if (!data) return null;

  return (
    <div className="statistics-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="page-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </button>

          <div>

            <div className="breadcrumb">
              Teller
              <span>/</span>
              Statistiques
            </div>

            <h1>Statistiques</h1>

            <p>
              Analysez les performances de vos commandes et vos revenus.
            </p>

          </div>

        </div>

        <button
          className="refresh-button"
          onClick={() => loadStatistiques(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "rotating" : ""}
          />

          <span>
            {refreshing ? "Actualisation..." : "Actualiser"}
          </span>
        </button>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main-content">

        {/* ===================================================
            WELCOME BANNER
        =================================================== */}

        <section className="welcome-card">

          <div className="welcome-icon">
            <BarChart3 size={28} />
          </div>

          <div className="welcome-content">

            <span>TABLEAU DE BORD</span>

            <h2>
              Vue d'ensemble de votre activité
            </h2>

            <p>
              Suivez vos commandes livrées et l'évolution
              de vos revenus mois après mois.
            </p>

          </div>

        </section>

        {/* ===================================================
            KPI
        =================================================== */}

        <section className="stats-grid">

          {/* COMMANDES */}

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon orders">
                <PackageCheck size={22} />
              </div>

              <span className="stat-label">
                COMMANDES
              </span>

            </div>

            <div className="stat-value">
              {data.nombre_commandes_livrees.toLocaleString("fr-FR")}
            </div>

            <div className="stat-footer">
              <CheckCircle2 size={15} />
              <span>Commandes livrées</span>
            </div>

          </div>

          {/* REVENU TOTAL */}

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon revenue">
                <TrendingUp size={22} />
              </div>

              <span className="stat-label">
                REVENU TOTAL
              </span>

            </div>

            <div className="stat-value">
              {formatPrice(data.revenu_total)}
              <small> FCFA</small>
            </div>

            <div className="stat-footer">
              <TrendingUp size={15} />
              <span>Revenus générés</span>
            </div>

          </div>

          {/* MOYENNE */}

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon average">
                <BarChart3 size={22} />
              </div>

              <span className="stat-label">
                MOYENNE
              </span>

            </div>

            <div className="stat-value">
              {formatPrice(revenuMoyen)}
              <small> FCFA</small>
            </div>

            <div className="stat-footer">
              <CalendarDays size={15} />
              <span>Revenu mensuel moyen</span>
            </div>

          </div>

          {/* MEILLEUR MOIS */}

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon best">
                <CalendarDays size={22} />
              </div>

              <span className="stat-label">
                MEILLEUR MOIS
              </span>

            </div>

            <div className="stat-value best-value">

              {meilleurMois
                ? formatPrice(meilleurMois.revenu)
                : "0"}

              <small> FCFA</small>

            </div>

            <div className="stat-footer">

              <span>
                {meilleurMois
                  ? formatMonthLong(
                      meilleurMois.year,
                      meilleurMois.month
                    )
                  : "Aucune donnée"}
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            GRAPH CARD
        =================================================== */}

        <section className="chart-card">

          <div className="chart-header">

            <div>

              <div className="section-title-row">

                <div className="section-icon">
                  <BarChart3 size={19} />
                </div>

                <h2>Évolution des revenus</h2>

              </div>

              <p>
                Revenus générés par mois
              </p>

            </div>

            {chartData.length > 0 && (
              <div className="chart-total">

                <span>Total affiché</span>

                <strong>
                  {formatPrice(
                    chartData.reduce(
                      (sum, item) => sum + item.revenu,
                      0
                    )
                  )} FCFA
                </strong>

              </div>
            )}

          </div>

          {chartData.length === 0 ? (

            <div className="empty-chart">

              <div className="empty-chart-icon">
                <BarChart3 size={35} />
              </div>

              <h3>Aucun revenu disponible</h3>

              <p>
                Les revenus mensuels apparaîtront ici
                lorsque des commandes seront livrées.
              </p>

            </div>

          ) : (

            <div className="chart-wrapper">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={chartData}
                  margin={{
                    top: 15,
                    right: 20,
                    left: 10,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#6B7280",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#6B7280",
                    }}
                    tickFormatter={(value) =>
                      `${Number(value).toLocaleString("fr-FR")}`
                    }
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(0,164,166,0.06)",
                    }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.08)",
                    }}
                    labelStyle={{
                      color: "#111827",
                      fontWeight: 700,
                    }}
                    formatter={(value) =>
                      `${Number(value ?? 0).toLocaleString("fr-FR")} FCFA`
                    }
                  />

                  <Bar
                    dataKey="revenu"
                    fill="#00A4A6"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={55}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </section>

        {/* ===================================================
            MONTHLY DETAILS
        =================================================== */}

        {chartData.length > 0 && (

          <section className="monthly-card">

            <div className="monthly-header">

              <div>

                <h2>Détail des revenus</h2>

                <p>
                  Historique mensuel de vos revenus
                </p>

              </div>

              <span className="months-count">
                {chartData.length} mois
              </span>

            </div>

            <div className="monthly-list">

              {chartData.map((item, index) => (

                <div
                  className="monthly-row"
                  key={`${item.month}-${index}`}
                >

                  <div className="monthly-date">

                    <div className="calendar-icon">
                      <CalendarDays size={17} />
                    </div>

                    <div>
                      <strong>
                        {item.monthLong}
                      </strong>

                      <span>
                        Revenu mensuel
                      </span>
                    </div>

                  </div>

                  <div className="monthly-revenue">

                    <strong>
                      {formatPrice(item.revenu)} FCFA
                    </strong>

                    <div className="revenue-bar">

                      <div
                        className="revenue-bar-fill"
                        style={{
                          width: `${
                            data.revenu_total > 0
                              ? Math.min(
                                  (item.revenu /
                                    data.revenu_total) *
                                    100,
                                  100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

      </main>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #F5F7F8;
        }

        /* =========================================
           PAGE
        ========================================= */

        .statistics-page {
          min-height: 100vh;
          width: 100%;
          background: #F5F7F8;
          color: #111827;
        }

        /* =========================================
           HEADER
        ========================================= */

        .page-header {
          width: 100%;
          min-height: 84px;
          padding: 16px 32px;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .back-button {
          width: 42px;
          height: 42px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          border-radius: 10px;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .2s ease;
        }

        .back-button:hover {
          background: #F3F4F6;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9CA3AF;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .breadcrumb span {
          color: #D1D5DB;
        }

        .page-header h1 {
          margin: 0;
          font-size: 23px;
          color: #111827;
        }

        .page-header p {
          margin: 4px 0 0;
          color: #9CA3AF;
          font-size: 12px;
        }

        .refresh-button {
          height: 41px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #D1D5DB;
          border-radius: 9px;
          background: #FFFFFF;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
        }

        .refresh-button:hover {
          background: #F9FAFB;
          border-color: #9CA3AF;
        }

        .refresh-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .rotating {
          animation: spin .8s linear infinite;
        }

        /* =========================================
           MAIN
        ========================================= */

        .main-content {
          width: 100%;
          max-width: 1550px;
          margin: auto;
          padding: 28px 32px 60px;
        }

        /* =========================================
           WELCOME
        ========================================= */

        .welcome-card {
          width: 100%;
          background: linear-gradient(
            135deg,
            #00A4A6 0%,
            #008B8D 100%
          );
          border-radius: 16px;
          padding: 24px 26px;
          display: flex;
          align-items: center;
          gap: 18px;
          color: white;
          margin-bottom: 20px;
          box-shadow:
            0 8px 25px rgba(0,164,166,.15);
        }

        .welcome-icon {
          width: 55px;
          height: 55px;
          border-radius: 14px;
          background: rgba(255,255,255,.16);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .welcome-content span {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          opacity: .8;
        }

        .welcome-content h2 {
          margin: 5px 0 5px;
          font-size: 20px;
        }

        .welcome-content p {
          margin: 0;
          font-size: 13px;
          opacity: .85;
        }

        /* =========================================
           STATS
        ========================================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 18px;
          min-width: 0;
          box-shadow: 0 2px 9px rgba(0,0,0,.025);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 20px rgba(0,0,0,.06);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.orders {
          background: #ECFDF5;
          color: #16A34A;
        }

        .stat-icon.revenue {
          background: #F0FDFA;
          color: #00A4A6;
        }

        .stat-icon.average {
          background: #EFF6FF;
          color: #2563EB;
        }

        .stat-icon.best {
          background: #FFF7ED;
          color: #EA580C;
        }

        .stat-label {
          color: #9CA3AF;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .5px;
        }

        .stat-value {
          margin-top: 16px;
          color: #111827;
          font-size: 24px;
          font-weight: 800;
          line-height: 1.2;
        }

        .stat-value small {
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
        }

        .best-value {
          font-size: 20px;
        }

        .stat-footer {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #9CA3AF;
          font-size: 11px;
        }

        .stat-footer svg {
          color: #00A4A6;
        }

        /* =========================================
           CHART
        ========================================= */

        .chart-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 15px;
          padding: 22px;
          box-shadow: 0 2px 10px rgba(0,0,0,.025);
          margin-bottom: 20px;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .section-title-row {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .section-icon {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          background: #F0FDFA;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-header h2 {
          margin: 0;
          color: #1F2937;
          font-size: 17px;
        }

        .chart-header p {
          margin: 7px 0 0;
          color: #9CA3AF;
          font-size: 12px;
        }

        .chart-total {
          text-align: right;
        }

        .chart-total span {
          display: block;
          color: #9CA3AF;
          font-size: 11px;
          margin-bottom: 4px;
        }

        .chart-total strong {
          color: #00A4A6;
          font-size: 16px;
        }

        .chart-wrapper {
          width: 100%;
          height: 430px;
        }

        .empty-chart {
          min-height: 330px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-chart-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #F0FDFA;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .empty-chart h3 {
          margin: 0 0 7px;
          color: #374151;
          font-size: 16px;
        }

        .empty-chart p {
          margin: 0;
          max-width: 400px;
          color: #9CA3AF;
          font-size: 12px;
          line-height: 1.6;
        }

        /* =========================================
           MONTHLY DETAILS
        ========================================= */

        .monthly-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 15px;
          padding: 22px;
          box-shadow: 0 2px 10px rgba(0,0,0,.025);
        }

        .monthly-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 15px;
        }

        .monthly-header h2 {
          margin: 0 0 5px;
          color: #1F2937;
          font-size: 17px;
        }

        .monthly-header p {
          margin: 0;
          color: #9CA3AF;
          font-size: 12px;
        }

        .months-count {
          padding: 6px 10px;
          border-radius: 999px;
          background: #F0FDFA;
          color: #008B8D;
          font-size: 11px;
          font-weight: 700;
        }

        .monthly-list {
          display: flex;
          flex-direction: column;
        }

        .monthly-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 14px 4px;
          border-bottom: 1px solid #F1F5F9;
        }

        .monthly-row:last-child {
          border-bottom: none;
        }

        .monthly-date {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 220px;
        }

        .calendar-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: #F0FDFA;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .monthly-date strong {
          display: block;
          color: #374151;
          font-size: 13px;
          margin-bottom: 3px;
        }

        .monthly-date span {
          display: block;
          color: #9CA3AF;
          font-size: 11px;
        }

        .monthly-revenue {
          width: 48%;
          text-align: right;
        }

        .monthly-revenue strong {
          display: block;
          color: #111827;
          font-size: 13px;
          margin-bottom: 7px;
        }

        .revenue-bar {
          width: 100%;
          height: 5px;
          border-radius: 999px;
          background: #E5E7EB;
          overflow: hidden;
        }

        .revenue-bar-fill {
          height: 100%;
          background: #00A4A6;
          border-radius: 999px;
          transition: width .4s ease;
        }

        /* =========================================
           LOADER
        ========================================= */

        .fullscreen-loader {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #E5E7EB;
          border-top-color: #00A4A6;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1150px) {

          .main-content {
            padding: 24px;
          }

          .page-header {
            padding: 16px 24px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 700px) {

          .page-header {
            padding: 14px 16px;
            min-height: auto;
          }

          .header-left {
            gap: 10px;
          }

          .page-header h1 {
            font-size: 18px;
          }

          .page-header p {
            display: none;
          }

          .breadcrumb {
            display: none;
          }

          .refresh-button {
            width: 40px;
            height: 40px;
            padding: 0;
            justify-content: center;
          }

          .refresh-button span {
            display: none;
          }

          .main-content {
            padding: 16px 13px 40px;
          }

          .welcome-card {
            padding: 18px;
            gap: 13px;
          }

          .welcome-icon {
            width: 45px;
            height: 45px;
          }

          .welcome-content h2 {
            font-size: 17px;
          }

          .welcome-content p {
            font-size: 11px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .chart-card,
          .monthly-card {
            padding: 15px;
            border-radius: 12px;
          }

          .chart-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .chart-total {
            text-align: left;
          }

          .chart-wrapper {
            height: 330px;
          }

          .monthly-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .monthly-date {
            min-width: 0;
          }

          .monthly-revenue {
            width: 100%;
            text-align: left;
          }

        }

        @media (max-width: 430px) {

          .page-header {
            padding: 12px;
          }

          .back-button {
            width: 38px;
            height: 38px;
          }

          .page-header h1 {
            font-size: 16px;
          }

          .welcome-card {
            padding: 15px;
          }

          .welcome-content h2 {
            font-size: 15px;
          }

          .welcome-content span {
            font-size: 9px;
          }

          .stat-value {
            font-size: 22px;
          }

          .chart-wrapper {
            height: 290px;
          }

        }

      `}</style>
    </div>
  );
};

export default StatistiquesTellerPage;