// src/pages/StatistiquesTellerPage.tsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { StatistiquesTeller } from "../../services/order.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  // Récupérer le teller depuis sessionStorage
  const tellerStr = sessionStorage.getItem("teller");
  if (!tellerStr) return <div className="error-msg">Erreur : teller introuvable.</div>;
  const teller = JSON.parse(tellerStr);

  const loadStatistiques = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await StatistiquesTeller({ teller_id: teller.uid });
      if (res.data.status === "success") {
        setData(res.data);
      } else {
        setErrorMsg(res.data.message || "Erreur inconnue");
        Swal.fire("Erreur", res.data.message || "Erreur inconnue", "error");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Erreur serveur");
      Swal.fire("Erreur", err?.response?.data?.message || "Erreur serveur", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistiques();
  }, []);

  const formatMonth = (year: number, month: number) => {
    const date = new Date(year, month - 1);
    return date.toLocaleString("fr-FR", { month: "short", year: "numeric" });
  };

  if (errorMsg) return <div className="error-msg">{errorMsg}</div>;

  return (
    <div className="stat-page">
      {/* Bouton Retour */}
      <span className="back" onClick={() => navigate(-1)}>
            ←
        </span>

      <h2 className="page-title">Statistiques de vos commandes</h2>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      )}

      {!loading && data && (
        <>
          {/* Résumé */}
          <div className="summary-cards">
            <div className="card">
              <h3>Commandes livrées</h3>
              <p>{data.nombre_commandes_livrees}</p>
            </div>
            <div className="card">
              <h3>Revenu total</h3>
              <p>{data.revenu_total.toLocaleString()} FCFA</p>
            </div>
          </div>

          {/* Graphique */}
          <h3 className="table-title">Revenu par mois</h3>
          {data.revenu_par_mois.length === 0 ? (
            <div className="no-data">Aucun revenu disponible.</div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.revenu_par_mois.map(r => ({
                    month: formatMonth(r.year, r.month),
                    revenu: r.revenu
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
                  <Bar dataKey="revenu" fill="#16A34A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Styles */}
      <style>{`
        .stat-page {
          padding: 24px;
          background: #F9FAFB;
          min-height: 80vh;
          font-family: 'Inter', sans-serif;
        }

        .back-button {
          background-color: #fff;
          color: #16A34A;
          border: 2px solid #16A34A;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 16px;
          transition: all 0.2s;
        }
        .back-button:hover {
          background-color: #16A34A;
          color: #fff;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #111827;
        }
        .summary-cards {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .card {
          flex: 1;
          min-width: 180px;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          text-align: center;
          transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-5px); }
        .card h3 { font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 12px; }
        .card p { font-size: 22px; font-weight: 700; color: #16A34A; }

        .table-title { font-size: 20px; font-weight: 600; color: #374151; margin-bottom: 16px; }

        .chart-container { background:#fff; padding:16px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.05); }

        .loading-container {
          display:flex; flex-direction:column; align-items:center; justify-content:center; margin-top:40px;
          color:#6B7280;
        }
        .loading-spinner {
          border: 6px solid #F3F4F6;
          border-top: 6px solid #16A34A;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom:12px;
        }
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }

        .no-data, .error-msg {
          text-align:center;
          color:#EF4444;
          margin-top:24px;
          font-weight:600;
        }
      `}</style>
    </div>
  );
};

export default StatistiquesTellerPage;