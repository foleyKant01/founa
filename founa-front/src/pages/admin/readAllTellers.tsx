import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  Mail,
  Phone,
  CalendarDays,
  UserPlus,
  RefreshCw,
  X,
  ShieldCheck,
} from "lucide-react";
import Swal from "sweetalert2";
import { ReadAllTellers } from "../../services/teller.service";

interface Teller {
  uid: string;
  fullname: string;
  email: string;
  phone: string;
  creation_date: string;
}

const ReadAllTellersPage: React.FC = () => {
  const navigate = useNavigate();

  const [tellers, setTellers] = useState<Teller[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTellers = async () => {
    try {
      setLoading(true);

      const response = await ReadAllTellers();

      if (response.data.status === "success") {
        setTellers(response.data.all_teller || []);
      } else if (response.data.status === "erreur") {
        setTellers([]);
      } else {
        setTellers([]);

        Swal.fire({
          icon: "error",
          title: "Erreur",
          text:
            response.data.motif ||
            response.data.error_description ||
            "Impossible de récupérer les Tellers.",
          confirmButtonColor: "#00A4A6",
        });
      }
    } catch (error: any) {
      console.error(
        "Erreur récupération Tellers :",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Erreur serveur",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error_description ||
          "Une erreur est survenue lors de la récupération des Tellers.",
        confirmButtonColor: "#00A4A6",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTellers();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadTellers();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredTellers = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return tellers;
    }

    return tellers.filter((teller) =>
      [
        teller.fullname,
        teller.email,
        teller.phone,
        teller.uid,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [tellers, searchText]);

  const getInitials = (fullname: string) => {
    if (!fullname) {
      return "T";
    }

    const parts = fullname
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="tellers-page">
      <style>{`

        * {
          box-sizing: border-box;
        }

        .tellers-page {
          min-height: 100vh;
          width: 100%;
          padding: 28px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(0, 164, 166, 0.09),
              transparent 30%
            ),
            #f5f7f9;
          color: #172033;
        }

        .tellers-container {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
        }

        /* ================= HEADER ================= */

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .back-button {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border: 1px solid #e1e6eb;
          border-radius: 13px;
          background: #ffffff;
          color: #475467;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
        }

        .back-button:hover {
          background: #00A4A6;
          border-color: #00A4A6;
          color: #ffffff;
          transform: translateX(-2px);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #98a2b3;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .breadcrumb span {
          color: #cbd2d9;
        }

        .page-title {
          margin: 0;
          color: #101828;
          font-size: clamp(24px, 3vw, 34px);
          line-height: 1.15;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .page-subtitle {
          margin: 7px 0 0;
          color: #7b8494;
          font-size: 14px;
          line-height: 1.5;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .refresh-button,
        .create-button {
          min-height: 45px;
          padding: 0 16px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-button {
          border: 1px solid #dfe4ea;
          background: #ffffff;
          color: #667085;
        }

        .refresh-button:hover {
          border-color: #00A4A6;
          color: #00A4A6;
          background: #f0fbfb;
        }

        .create-button {
          border: 0;
          background: #00A4A6;
          color: #ffffff;
          box-shadow: 0 7px 18px rgba(0, 164, 166, 0.20);
        }

        .create-button:hover {
          background: #008f91;
          transform: translateY(-1px);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ================= STATS ================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 19px;
          background: #ffffff;
          border: 1px solid #e7ebef;
          border-radius: 17px;
          box-shadow: 0 7px 22px rgba(15, 23, 42, 0.045);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #eafafa;
          color: #00A4A6;
        }

        .stat-value {
          display: block;
          color: #101828;
          font-size: 23px;
          font-weight: 850;
          line-height: 1;
        }

        .stat-label {
          display: block;
          margin-top: 5px;
          color: #98a2b3;
          font-size: 11px;
          font-weight: 700;
        }

        /* ================= TOOLBAR ================= */

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 17px;
          margin-bottom: 16px;
          background: #ffffff;
          border: 1px solid #e7ebef;
          border-radius: 17px;
          box-shadow: 0 7px 22px rgba(15, 23, 42, 0.04);
        }

        .search-wrapper {
          position: relative;
          width: min(520px, 100%);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #98a2b3;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 45px;
          padding: 0 42px;
          border: 1px solid #dfe4ea;
          border-radius: 10px;
          outline: none;
          background: #fbfcfd;
          color: #172033;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          background: #ffffff;
          border-color: #00A4A6;
          box-shadow: 0 0 0 4px rgba(0, 164, 166, 0.08);
        }

        .search-input::placeholder {
          color: #a8b0bb;
        }

        .clear-search {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 31px;
          height: 31px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #98a2b3;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .clear-search:hover {
          background: #f1f3f5;
          color: #475467;
        }

        .result-count {
          color: #98a2b3;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .result-count strong {
          color: #344054;
        }

        /* ================= TABLE ================= */

        .table-card {
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e7ebef;
          border-radius: 18px;
          box-shadow: 0 9px 28px rgba(15, 23, 42, 0.045);
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }

        thead {
          background: #f8fafb;
        }

        th {
          padding: 15px 18px;
          text-align: left;
          color: #667085;
          border-bottom: 1px solid #e8edf1;
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        td {
          padding: 15px 18px;
          border-bottom: 1px solid #f0f2f4;
          color: #475467;
          font-size: 12px;
          vertical-align: middle;
        }

        tbody tr {
          transition: background 0.15s ease;
        }

        tbody tr:hover {
          background: #fbfefe;
        }

        tbody tr:last-child td {
          border-bottom: 0;
        }

        /* ================= TELLER ================= */

        .teller-cell {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 220px;
        }

        .teller-avatar {
          width: 42px;
          height: 42px;
          min-width: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #00A4A6,
            #007d80
          );
          color: #ffffff;
          font-size: 12px;
          font-weight: 850;
          box-shadow: 0 5px 12px rgba(0, 164, 166, 0.15);
        }

        .teller-name {
          display: block;
          color: #172033;
          font-size: 12px;
          font-weight: 800;
        }

        .teller-role {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
          color: #00A4A6;
          font-size: 9px;
          font-weight: 750;
        }

        .email-cell,
        .phone-cell,
        .date-cell {
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
        }

        .email-cell svg,
        .phone-cell svg,
        .date-cell svg {
          color: #98a2b3;
          min-width: 14px;
        }

        .uid-badge {
          display: inline-block;
          max-width: 190px;
          padding: 6px 9px;
          border-radius: 7px;
          background: #f4f6f8;
          color: #667085;
          font-family: monospace;
          font-size: 9px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ================= EMPTY ================= */

        .empty-state {
          padding: 75px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 66px;
          height: 66px;
          margin: 0 auto 16px;
          border-radius: 19px;
          background: #edfafa;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-title {
          margin: 0;
          color: #344054;
          font-size: 17px;
          font-weight: 800;
        }

        .empty-text {
          max-width: 430px;
          margin: 7px auto 0;
          color: #98a2b3;
          font-size: 12px;
          line-height: 1.6;
        }

        /* ================= LOADING ================= */

        .loading-state {
          min-height: 370px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #dceff0;
          border-top-color: #00A4A6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-text {
          color: #98a2b3;
          font-size: 12px;
          font-weight: 700;
        }

        .refresh-spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 900px) {

          .tellers-page {
            padding: 20px;
          }

          .page-header {
            align-items: flex-start;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-wrapper {
            width: 100%;
          }

          .result-count {
            text-align: right;
          }
        }

        @media (max-width: 700px) {

          .tellers-page {
            padding: 14px;
          }

          .page-header {
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
          }

          .refresh-button,
          .create-button {
            flex: 1;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {

          .tellers-page {
            padding: 9px;
          }

          .header-left {
            gap: 10px;
          }

          .back-button {
            width: 40px;
            height: 40px;
            min-width: 40px;
          }

          .breadcrumb {
            font-size: 9px;
          }

          .page-title {
            font-size: 22px;
          }

          .page-subtitle {
            font-size: 11px;
          }

          .header-actions {
            gap: 7px;
          }

          .refresh-button,
          .create-button {
            min-height: 42px;
            padding: 0 10px;
            font-size: 10px;
          }

          .stat-card {
            padding: 15px;
          }

          .table-card {
            border-radius: 14px;
          }
        }

      `}</style>

      <div className="tellers-container">

        {/* ================= HEADER ================= */}

        <header className="page-header">

          <div className="header-left">

            <button
              type="button"
              className="back-button"
              onClick={() => navigate(-1)}
              title="Retour"
            >
              <ArrowLeft size={20} />
            </button>

            <div>

              <div className="breadcrumb">
                Administration
                <span>/</span>
                Tellers
              </div>

              <h1 className="page-title">
                Gestion des Tellers
              </h1>

              <p className="page-subtitle">
                Consultez et gérez les collaborateurs
                disposant d'un accès Teller.
              </p>

            </div>

          </div>

          <div className="header-actions">

            <button
              type="button"
              className="refresh-button"
              onClick={handleRefresh}
              disabled={loading || refreshing}
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "refresh-spin"
                    : ""
                }
              />

              Actualiser
            </button>

            <button
              type="button"
              className="create-button"
              onClick={() =>
                navigate("/admin/createteller")
              }
            >
              <UserPlus size={16} />

              Créer un Teller
            </button>

          </div>

        </header>

        {/* ================= STATISTIQUES ================= */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              <Users size={22} />
            </div>

            <div>
              <span className="stat-value">
                {tellers.length}
              </span>

              <span className="stat-label">
                Total Tellers
              </span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <Search size={21} />
            </div>

            <div>
              <span className="stat-value">
                {filteredTellers.length}
              </span>

              <span className="stat-label">
                Résultats affichés
              </span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <span className="stat-value">
                {searchText.trim()
                  ? "Filtré"
                  : "Actif"}
              </span>

              <span className="stat-label">
                État de la liste
              </span>
            </div>

          </div>

        </div>

        {/* ================= RECHERCHE ================= */}

        <div className="toolbar">

          <div className="search-wrapper">

            <Search
              size={17}
              className="search-icon"
            />

            <input
              type="text"
              className="search-input"
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
              placeholder="Rechercher par nom, email, téléphone ou UID..."
            />

            {searchText && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchText("")}
                title="Effacer la recherche"
              >
                <X size={15} />
              </button>
            )}

          </div>

          <div className="result-count">
            <strong>
              {filteredTellers.length}
            </strong>{" "}
            Teller
            {filteredTellers.length > 1
              ? "s"
              : ""}{" "}
            affiché
            {filteredTellers.length > 1
              ? "s"
              : ""}
          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="table-card">

          {loading ? (

            <div className="loading-state">

              <div className="loading-spinner" />

              <span className="loading-text">
                Chargement des Tellers...
              </span>

            </div>

          ) : filteredTellers.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                <Users size={29} />
              </div>

              <h2 className="empty-title">
                {searchText.trim()
                  ? "Aucun Teller trouvé"
                  : "Aucun Teller enregistré"}
              </h2>

              <p className="empty-text">
                {searchText.trim()
                  ? "Aucun Teller ne correspond à votre recherche. Essayez un autre nom, email ou numéro."
                  : "Aucun collaborateur Teller n'est actuellement enregistré."}
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>Teller</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>UID</th>
                    <th>Date de création</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredTellers.map(
                    (teller) => (

                      <tr key={teller.uid}>

                        <td>

                          <div className="teller-cell">

                            <div className="teller-avatar">
                              {getInitials(
                                teller.fullname
                              )}
                            </div>

                            <div>

                              <span className="teller-name">
                                {teller.fullname ||
                                  "Teller sans nom"}
                              </span>

                              <span className="teller-role">
                                <ShieldCheck size={11} />
                                Collaborateur Teller
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>

                          <div className="email-cell">

                            <Mail size={14} />

                            {teller.email || "-"}

                          </div>

                        </td>

                        <td>

                          <div className="phone-cell">

                            <Phone size={14} />

                            {teller.phone || "-"}

                          </div>

                        </td>

                        <td>

                          <span
                            className="uid-badge"
                            title={teller.uid}
                          >
                            {teller.uid}
                          </span>

                        </td>

                        <td>

                          <div className="date-cell">

                            <CalendarDays size={14} />

                            {formatDate(
                              teller.creation_date
                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default ReadAllTellersPage;