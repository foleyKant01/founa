import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  StatistiquesTeller,
  RevenuTellerPeriode,
} from "../../services/order.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  RefreshCw,
  TrendingUp,
  Wallet,
  CalendarRange,
  Clock3,
} from "lucide-react";

interface StatistiquesData {
  revenu_total: number;
}

interface PeriodeData {
  revenu: number;
  date_debut: string;
  date_fin: string;
}

interface ChartData {
  name: string;
  value: number;
}

const StatistiquesTellerPage: React.FC = () => {
  const navigate = useNavigate();

  const [statistics, setStatistics] =
    useState<StatistiquesData | null>(null);

  const [periode, setPeriode] =
    useState<PeriodeData | null>(null);

  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingPeriode, setLoadingPeriode] = useState(false);

  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);

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

  const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getToday = () => {
    return formatDateInput(new Date());
  };

  const getDateBefore = (days: number) => {
    const date = new Date();

    date.setDate(date.getDate() - days);

    return formatDateInput(date);
  };

  const getStartOfMonth = () => {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    return formatDateInput(date);
  };

  const getEndOfMonth = () => {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    return formatDateInput(date);
  };

  const loadStatistiques = async (
    isRefresh = false
  ) => {
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
      const response = await StatistiquesTeller({
        teller_id: teller.uid,
      });

      if (response.data.status === "success") {
        setStatistics({
          revenu_total:
            Number(response.data.revenu_total) || 0,
        });
      } else {
        const message =
          response.data.message ||
          "Impossible de récupérer les statistiques.";

        setErrorMsg(message);

        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: message,
          confirmButtonColor: "#00A4A6",
        });
      }
    } catch (error: any) {
      console.error(
        "Erreur chargement statistiques teller :",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Erreur serveur lors du chargement des statistiques.";

      setErrorMsg(message);

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: message,
        confirmButtonColor: "#00A4A6",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadRevenuPeriode = async (
    startDate = dateDebut,
    endDate = dateFin
  ) => {
    if (!teller?.uid) {
      return;
    }

    if (!startDate || !endDate) {
      return;
    }

    if (startDate > endDate) {
      Swal.fire({
        icon: "warning",
        title: "Période invalide",
        text: "La date de début doit être antérieure ou égale à la date de fin.",
        confirmButtonColor: "#00A4A6",
      });

      return;
    }

    setLoadingPeriode(true);

    try {
      const response = await RevenuTellerPeriode({
        teller_id: teller.uid,
        date_debut: startDate,
        date_fin: endDate,
      });

      if (response.data.status === "success") {
        setPeriode({
          revenu: Number(response.data.revenu) || 0,
          date_debut: response.data.date_debut,
          date_fin: response.data.date_fin,
        });
      } else {
        const message =
          response.data.message ||
          "Impossible de récupérer le revenu de cette période.";

        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: message,
          confirmButtonColor: "#00A4A6",
        });
      }
    } catch (error: any) {
      console.error(
        "Erreur revenu période :",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Erreur serveur lors du calcul du revenu de la période.";

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: message,
        confirmButtonColor: "#00A4A6",
      });
    } finally {
      setLoadingPeriode(false);
    }
  };

  useEffect(() => {
    const today = getToday();

    setDateDebut(getStartOfMonth());
    setDateFin(today);

    loadStatistiques();
  }, []);

  useEffect(() => {
    if (!teller?.uid) {
      return;
    }

    if (!dateDebut || !dateFin) {
      return;
    }

    loadRevenuPeriode(dateDebut, dateFin);
  }, [dateDebut, dateFin]);

  const handleRefresh = async () => {
    await loadStatistiques(true);

    if (dateDebut && dateFin) {
      await loadRevenuPeriode(dateDebut, dateFin);
    }

    Swal.fire({
      icon: "success",
      title: "Actualisé",
      text: "Les statistiques ont été actualisées.",
      timer: 1400,
      showConfirmButton: false,
    });
  };

  const handleApplyPeriod = () => {
    if (!dateDebut || !dateFin) {
      Swal.fire({
        icon: "warning",
        title: "Dates requises",
        text: "Veuillez sélectionner une date de début et une date de fin.",
        confirmButtonColor: "#00A4A6",
      });

      return;
    }

    if (dateDebut > dateFin) {
      Swal.fire({
        icon: "warning",
        title: "Période invalide",
        text: "La date de début doit être antérieure ou égale à la date de fin.",
        confirmButtonColor: "#00A4A6",
      });

      return;
    }

    loadRevenuPeriode(dateDebut, dateFin);
  };

  const handleToday = () => {
    const today = getToday();

    setDateDebut(today);
    setDateFin(today);
  };

  const handleLast7Days = () => {
    setDateDebut(getDateBefore(6));
    setDateFin(getToday());
  };

  const handleLast30Days = () => {
    setDateDebut(getDateBefore(29));
    setDateFin(getToday());
  };

  const handleCurrentMonth = () => {
    setDateDebut(getStartOfMonth());
    setDateFin(getEndOfMonth());
  };

  const formatPrice = (
    value: number | string
  ) => {
    return Number(value || 0).toLocaleString("fr-FR", {
      maximumFractionDigits: 0,
    });
  };

  const formatDisplayDate = (
    value: string
  ) => {
    if (!value) {
      return "";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const nombreJoursPeriode = useMemo(() => {
    if (!dateDebut || !dateFin) {
      return 0;
    }

    const debut = new Date(`${dateDebut}T00:00:00`);
    const fin = new Date(`${dateFin}T00:00:00`);

    const difference =
      fin.getTime() - debut.getTime();

    return Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1;
  }, [dateDebut, dateFin]);

  const pourcentagePeriode = useMemo(() => {
    if (
      !statistics ||
      statistics.revenu_total <= 0 ||
      !periode
    ) {
      return 0;
    }

    return Math.min(
      (periode.revenu /
        statistics.revenu_total) *
        100,
      100
    );
  }, [statistics, periode]);

  const chartData = useMemo<ChartData[]>(() => {
    return [
      {
        name: "Revenu total",
        value: statistics?.revenu_total || 0,
      },
      {
        name: "Période sélectionnée",
        value: periode?.revenu || 0,
      },
    ];
  }, [statistics, periode]);

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <div className="loader-content">
          <div className="spinner"></div>
          <span>Chargement des statistiques...</span>
        </div>
      </div>
    );
  }

  if (errorMsg && !statistics) {
    return (
      <>
        <div className="error-page">
          <div className="error-icon">
            <BarChart3 size={42} />
          </div>

          <h2>
            Impossible de charger les statistiques
          </h2>

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
            max-width: 500px;
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
            font-size: 13px;
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

  if (!statistics) {
    return null;
  }

  return (
    <div className="statistics-page">
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
              Suivez vos revenus et analysez votre activité.
            </p>
          </div>
        </div>

        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "rotating" : ""
            }
          />

          <span>
            {refreshing
              ? "Actualisation..."
              : "Actualiser"}
          </span>
        </button>
      </header>

      <main className="main-content">
        <section className="welcome-card">
          <div className="welcome-icon">
            <BarChart3 size={29} />
          </div>

          <div className="welcome-content">
            <span>TABLEAU DE BORD</span>

            <h2>
              Vue d'ensemble de vos revenus
            </h2>

            <p>
              Consultez votre revenu total et analysez
              les revenus générés sur une période précise.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card total-card">
            <div className="stat-top">
              <div className="stat-icon revenue">
                <Wallet size={22} />
              </div>

              <span className="stat-label">
                REVENU TOTAL
              </span>
            </div>

            <div className="stat-value">
              {formatPrice(
                statistics.revenu_total
              )}

              <small> FCFA</small>
            </div>

            <div className="stat-footer">
              <TrendingUp size={15} />
              <span>
                Total généré depuis le début
              </span>
            </div>
          </div>

          <div className="stat-card period-card">
            <div className="stat-top">
              <div className="stat-icon period">
                <CalendarRange size={22} />
              </div>

              <span className="stat-label">
                PÉRIODE
              </span>
            </div>

            <div className="stat-value">
              {loadingPeriode ? (
                <span className="mini-loader"></span>
              ) : (
                <>
                  {formatPrice(
                    periode?.revenu || 0
                  )}

                  <small> FCFA</small>
                </>
              )}
            </div>

            <div className="stat-footer">
              <CalendarDays size={15} />

              <span>
                {nombreJoursPeriode > 0
                  ? `${nombreJoursPeriode} ${
                      nombreJoursPeriode > 1
                        ? "jours"
                        : "jour"
                    } sélectionné${
                      nombreJoursPeriode > 1
                        ? "s"
                        : ""
                    }`
                  : "Aucune période"}
              </span>
            </div>
          </div>

          <div className="stat-card share-card">
            <div className="stat-top">
              <div className="stat-icon share">
                <BarChart3 size={22} />
              </div>

              <span className="stat-label">
                PART DE LA PÉRIODE
              </span>
            </div>

            <div className="stat-value">
              {pourcentagePeriode.toFixed(1)}
              <small> %</small>
            </div>

            <div className="stat-footer">
              <TrendingUp size={15} />
              <span>
                Du revenu total
              </span>
            </div>
          </div>

          <div className="stat-card date-card">
            <div className="stat-top">
              <div className="stat-icon date">
                <Clock3 size={22} />
              </div>

              <span className="stat-label">
                PÉRIODE ACTIVE
              </span>
            </div>

            <div className="date-value">
              {dateDebut && dateFin ? (
                <>
                  <strong>
                    {formatDisplayDate(dateDebut)}
                  </strong>

                  <span>
                    au
                  </span>

                  <strong>
                    {formatDisplayDate(dateFin)}
                  </strong>
                </>
              ) : (
                "Aucune période"
              )}
            </div>

            <div className="stat-footer">
              <CalendarDays size={15} />
              <span>
                Analyse en cours
              </span>
            </div>
          </div>
        </section>

        <section className="period-card-main">
          <div className="period-header">
            <div>
              <div className="section-title-row">
                <div className="section-icon">
                  <CalendarRange size={19} />
                </div>

                <h2>
                  Analyser une période
                </h2>
              </div>

              <p>
                Sélectionnez les dates pour calculer
                le revenu généré.
              </p>
            </div>

            <div className="period-status">
              {loadingPeriode ? (
                <>
                  <span className="status-dot loading"></span>
                  Calcul en cours...
                </>
              ) : (
                <>
                  <span className="status-dot"></span>
                  Données à jour
                </>
              )}
            </div>
          </div>

          <div className="quick-periods">
            <button
              type="button"
              onClick={handleToday}
            >
              Aujourd'hui
            </button>

            <button
              type="button"
              onClick={handleLast7Days}
            >
              7 derniers jours
            </button>

            <button
              type="button"
              onClick={handleLast30Days}
            >
              30 derniers jours
            </button>

            <button
              type="button"
              onClick={handleCurrentMonth}
            >
              Ce mois
            </button>
          </div>

          <div className="date-form">
            <div className="date-field">
              <label htmlFor="dateDebut">
                Date de début
              </label>

              <div className="input-wrapper">
                <CalendarDays size={18} />

                <input
                  id="dateDebut"
                  type="date"
                  value={dateDebut}
                  max={dateFin || undefined}
                  onChange={(event) =>
                    setDateDebut(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="date-separator">
              →
            </div>

            <div className="date-field">
              <label htmlFor="dateFin">
                Date de fin
              </label>

              <div className="input-wrapper">
                <CalendarDays size={18} />

                <input
                  id="dateFin"
                  type="date"
                  value={dateFin}
                  min={dateDebut || undefined}
                  onChange={(event) =>
                    setDateFin(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <button
              type="button"
              className="apply-period-button"
              onClick={handleApplyPeriod}
              disabled={loadingPeriode}
            >
              <BarChart3 size={17} />

              {loadingPeriode
                ? "Calcul..."
                : "Analyser"}
            </button>
          </div>

          {periode && (
            <div className="period-result">
              <div className="period-result-icon">
                <TrendingUp size={22} />
              </div>

              <div className="period-result-content">
                <span>
                  REVENU GÉNÉRÉ SUR LA PÉRIODE
                </span>

                <strong>
                  {formatPrice(periode.revenu)}
                  <small> FCFA</small>
                </strong>

                <p>
                  Du{" "}
                  <b>
                    {formatDisplayDate(
                      periode.date_debut
                    )}
                  </b>{" "}
                  au{" "}
                  <b>
                    {formatDisplayDate(
                      periode.date_fin
                    )}
                  </b>
                </p>
              </div>

              <div className="period-progress">
                <div className="progress-header">
                  <span>
                    Part du revenu total
                  </span>

                  <strong>
                    {pourcentagePeriode.toFixed(1)}%
                  </strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pourcentagePeriode}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="chart-card">
          <div className="chart-header">
            <div>
              <div className="section-title-row">
                <div className="section-icon">
                  <BarChart3 size={19} />
                </div>

                <h2>
                  Comparaison des revenus
                </h2>
              </div>

              <p>
                Comparaison entre le revenu total
                et la période sélectionnée.
              </p>
            </div>

            <div className="chart-total">
              <span>
                Revenu total
              </span>

              <strong>
                {formatPrice(
                  statistics.revenu_total
                )}{" "}
                FCFA
              </strong>
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
                barCategoryGap="28%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="name"
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
                    Number(value).toLocaleString(
                      "fr-FR"
                    )
                  }
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(0,164,166,0.05)",
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
                    marginBottom: "5px",
                  }}
                  formatter={(value) =>
                    `${Number(
                      value ?? 0
                    ).toLocaleString(
                      "fr-FR"
                    )} FCFA`
                  }
                />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={90}
                >
                  {chartData.map(
                    (_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#00A4A6"
                            : "#2563EB"
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="information-card">
          <div className="information-icon">
            <Wallet size={21} />
          </div>

          <div className="information-content">
            <h3>
              Comprendre vos revenus
            </h3>

            <p>
              Le revenu du teller correspond à
              <strong> 3% </strong>
              du montant total des commandes livrées
              qui lui sont associées.
            </p>
          </div>

          <div className="information-value">
            <span>
              TAUX
            </span>

            <strong>
              3%
            </strong>
          </div>
        </section>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #F5F7F8;
        }

        .statistics-page {
          min-height: 100vh;
          width: 100%;
          background: #F5F7F8;
          color: #111827;
        }

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
          flex-shrink: 0;
        }

        .back-button:hover {
          background: #F3F4F6;
          transform: translateX(-2px);
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
          flex-shrink: 0;
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

        .main-content {
          width: 100%;
          max-width: 1550px;
          margin: auto;
          padding: 28px 32px 60px;
        }

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
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 7px 20px rgba(0,0,0,.06);
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
          flex-shrink: 0;
        }

        .stat-icon.revenue {
          background: #F0FDFA;
          color: #00A4A6;
        }

        .stat-icon.period {
          background: #EFF6FF;
          color: #2563EB;
        }

        .stat-icon.share {
          background: #FFF7ED;
          color: #EA580C;
        }

        .stat-icon.date {
          background: #F5F3FF;
          color: #7C3AED;
        }

        .stat-label {
          color: #9CA3AF;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .5px;
          text-align: right;
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

        .date-value {
          min-height: 58px;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
        }

        .date-value strong {
          color: #111827;
          font-size: 12px;
          font-weight: 700;
        }

        .date-value span {
          color: #9CA3AF;
          font-size: 10px;
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
          flex-shrink: 0;
        }

        .mini-loader {
          width: 23px;
          height: 23px;
          display: inline-block;
          border: 3px solid #E5E7EB;
          border-top-color: #00A4A6;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        .period-card-main {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 15px;
          padding: 22px;
          box-shadow: 0 2px 10px rgba(0,0,0,.025);
          margin-bottom: 20px;
        }

        .period-header {
          display: flex;
          align-items: flex-start;
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
          flex-shrink: 0;
        }

        .period-header h2 {
          margin: 0;
          color: #1F2937;
          font-size: 17px;
        }

        .period-header p {
          margin: 7px 0 0;
          color: #9CA3AF;
          font-size: 12px;
        }

        .period-status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #6B7280;
          font-size: 11px;
          white-space: nowrap;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16A34A;
          box-shadow: 0 0 0 4px #DCFCE7;
        }

        .status-dot.loading {
          background: #F59E0B;
          box-shadow: 0 0 0 4px #FEF3C7;
        }

        .quick-periods {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .quick-periods button {
          height: 34px;
          padding: 0 12px;
          border: 1px solid #D1D5DB;
          background: #FFFFFF;
          border-radius: 8px;
          color: #4B5563;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
        }

        .quick-periods button:hover {
          border-color: #00A4A6;
          color: #008B8D;
          background: #F0FDFA;
        }

        .date-form {
          display: grid;
          grid-template-columns: minmax(180px, 1fr) 35px minmax(180px, 1fr) auto;
          align-items: end;
          gap: 12px;
        }

        .date-field label {
          display: block;
          color: #4B5563;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .input-wrapper {
          height: 44px;
          border: 1px solid #D1D5DB;
          border-radius: 9px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #00A4A6;
          box-shadow:
            0 0 0 3px rgba(0,164,166,.08);
        }

        .input-wrapper svg {
          color: #00A4A6;
          flex-shrink: 0;
        }

        .input-wrapper input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #374151;
          font-size: 12px;
          font-family: Arial, sans-serif;
        }

        .date-separator {
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9CA3AF;
          font-size: 18px;
        }

        .apply-period-button {
          height: 44px;
          padding: 0 17px;
          border: none;
          border-radius: 9px;
          background: #00A4A6;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all .2s ease;
          white-space: nowrap;
        }

        .apply-period-button:hover {
          background: #008B8D;
          transform: translateY(-1px);
        }

        .apply-period-button:disabled {
          opacity: .6;
          cursor: not-allowed;
          transform: none;
        }

        .period-result {
          margin-top: 20px;
          padding: 18px;
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              #F0FDFA 0%,
              #F8FAFC 100%
            );
          border: 1px solid #CCFBF1;
          display: grid;
          grid-template-columns: auto 1fr minmax(230px, 320px);
          align-items: center;
          gap: 15px;
        }

        .period-result-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #00A4A6;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .period-result-content span {
          display: block;
          color: #6B7280;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .7px;
          margin-bottom: 5px;
        }

        .period-result-content strong {
          display: block;
          color: #111827;
          font-size: 22px;
          font-weight: 800;
        }

        .period-result-content strong small {
          color: #6B7280;
          font-size: 11px;
          font-weight: 600;
        }

        .period-result-content p {
          margin: 5px 0 0;
          color: #9CA3AF;
          font-size: 11px;
        }

        .period-result-content b {
          color: #6B7280;
        }

        .period-progress {
          width: 100%;
        }

        .progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
        }

        .progress-header span {
          color: #6B7280;
          font-size: 10px;
        }

        .progress-header strong {
          color: #008B8D;
          font-size: 11px;
        }

        .progress-track {
          width: 100%;
          height: 7px;
          border-radius: 999px;
          background: #D1FAE5;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: #00A4A6;
          transition: width .5s ease;
        }

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
          font-size: 10px;
          margin-bottom: 4px;
        }

        .chart-total strong {
          color: #00A4A6;
          font-size: 15px;
        }

        .chart-wrapper {
          width: 100%;
          height: 380px;
        }

        .information-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 15px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,.025);
        }

        .information-icon {
          width: 45px;
          height: 45px;
          border-radius: 11px;
          background: #F0FDFA;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .information-content {
          flex: 1;
        }

        .information-content h3 {
          margin: 0 0 5px;
          color: #374151;
          font-size: 14px;
        }

        .information-content p {
          margin: 0;
          color: #9CA3AF;
          font-size: 11px;
          line-height: 1.6;
        }

        .information-content strong {
          color: #008B8D;
        }

        .information-value {
          min-width: 70px;
          text-align: center;
          padding-left: 15px;
          border-left: 1px solid #E5E7EB;
        }

        .information-value span {
          display: block;
          color: #9CA3AF;
          font-size: 9px;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .information-value strong {
          color: #00A4A6;
          font-size: 22px;
        }

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

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6B7280;
          font-size: 12px;
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

          .date-form {
            grid-template-columns: 1fr 25px 1fr;
          }

          .apply-period-button {
            grid-column: 1 / -1;
            width: 100%;
          }

          .period-result {
            grid-template-columns: auto 1fr;
          }

          .period-progress {
            grid-column: 1 / -1;
          }
        }

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

          .page-header p,
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
            line-height: 1.5;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .period-card-main,
          .chart-card {
            padding: 15px;
            border-radius: 12px;
          }

          .period-header {
            flex-direction: column;
            gap: 12px;
          }

          .period-status {
            align-self: flex-start;
          }

          .quick-periods {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-periods button {
            width: 100%;
          }

          .date-form {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .date-separator {
            display: none;
          }

          .apply-period-button {
            grid-column: auto;
          }

          .period-result {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .period-result-icon {
            width: 43px;
            height: 43px;
          }

          .chart-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .chart-total {
            text-align: left;
          }

          .chart-wrapper {
            height: 320px;
          }

          .information-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .information-content {
            min-width: 0;
            width: calc(100% - 60px);
          }

          .information-value {
            width: 100%;
            border-left: none;
            border-top: 1px solid #E5E7EB;
            padding: 12px 0 0;
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

          .quick-periods {
            grid-template-columns: 1fr 1fr;
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