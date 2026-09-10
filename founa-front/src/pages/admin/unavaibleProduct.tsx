import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  X,
  PackageX,
  Users,
  MessageSquareText,
  CalendarDays,
  UserRound,
  Hash,
  Clock3,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { GetAllUnavaibleProduct } from "../../services/product.service";

interface UnavaibleProduct {
  uid: string;
  text_search: string;
  client_id: string | null;
  created_date: string;
}

const ReadAllUnavaibleProductsPage: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<UnavaibleProduct[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

const loadUnavailableProducts = async () => {
  try {
    setLoading(true);

    const response = await GetAllUnavaibleProduct();

    if (response.data.status === "success") {
      setProducts(response.data.unavaible_product || []);
    } else {
      setProducts([]);

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text:
          response.data.motif ||
          "Impossible de récupérer les produits manquants.",
        confirmButtonColor: "#00A4A6",
      });
    }
  } catch (error: any) {
    console.error(
      "Erreur récupération produits manquants :",
      error
    );

    Swal.fire({
      icon: "error",
      title: "Erreur serveur",
      text:
        error?.response?.data?.error_description ||
        "Une erreur est survenue lors de la récupération des produits manquants.",
      confirmButtonColor: "#00A4A6",
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadUnavailableProducts();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadUnavailableProducts();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products.filter((product) =>
      [
        product.text_search,
        product.uid,
        product.client_id || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [products, searchText]);

  const uniqueClients = useMemo(() => {
    return new Set(
      products
        .map((product) => product.client_id)
        .filter(Boolean)
    ).size;
  }, [products]);

  const todayRequests = useMemo(() => {
    const today = new Date();

    return products.filter((product) => {
      const date = new Date(product.created_date);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [products]);

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

  const formatDateTime = (date: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (date: string) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const now = new Date();
    const diff = now.getTime() - parsedDate.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return "À l'instant";
    }

    if (minutes < 60) {
      return `Il y a ${minutes} min`;
    }

    if (hours < 24) {
      return `Il y a ${hours} h`;
    }

    if (days < 7) {
      return `Il y a ${days} j`;
    }

    return formatDate(date);
  };

  const truncateUid = (uid: string) => {
    if (!uid) {
      return "-";
    }

    if (uid.length <= 18) {
      return uid;
    }

    return `${uid.substring(0, 8)}...${uid.substring(uid.length - 6)}`;
  };

  return (
    <div className="unavailable-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .unavailable-page {
          min-height: 100vh;
          width: 100%;
          padding: 28px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(0, 164, 166, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 0% 100%,
              rgba(0, 164, 166, 0.05),
              transparent 25%
            ),
            #f5f7f9;
          color: #172033;
        }

        .unavailable-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        /* HEADER */

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
          background: #00a4a6;
          border-color: #00a4a6;
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

        .refresh-button {
          min-height: 45px;
          padding: 0 16px;
          border-radius: 11px;
          border: 1px solid #dfe4ea;
          background: #ffffff;
          color: #667085;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-button:hover {
          border-color: #00a4a6;
          color: #00a4a6;
          background: #f0fbfb;
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-spin {
          animation: spin 0.8s linear infinite;
        }

        /* STATS */

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
          color: #00a4a6;
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

        /* SEARCH */

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
          width: min(620px, 100%);
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
          border-color: #00a4a6;
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

        /* REQUEST CARDS */

        .requests-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .request-card {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e7ebef;
          border-radius: 18px;
          padding: 19px;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.045);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .request-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 164, 166, 0.25);
          box-shadow: 0 13px 32px rgba(15, 23, 42, 0.08);
        }

        .request-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: #00a4a6;
        }

        .request-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 17px;
        }

        .request-icon {
          width: 45px;
          height: 45px;
          min-width: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eafafa;
          color: #00a4a6;
        }

        .request-date {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #98a2b3;
          font-size: 10px;
          font-weight: 700;
          text-align: right;
        }

        .request-date svg {
          color: #00a4a6;
        }

        .request-title {
          margin: 0;
          color: #172033;
          font-size: 15px;
          line-height: 1.5;
          font-weight: 800;
          word-break: break-word;
        }

        .request-label {
          margin: 5px 0 0;
          color: #98a2b3;
          font-size: 10px;
          font-weight: 700;
        }

        .request-info {
          margin-top: 18px;
          padding-top: 15px;
          border-top: 1px solid #eef1f3;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .info-row-icon {
          width: 30px;
          height: 30px;
          min-width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f5f7f9;
          color: #7b8494;
        }

        .info-content {
          min-width: 0;
        }

        .info-label {
          display: block;
          color: #98a2b3;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .info-value {
          display: block;
          margin-top: 2px;
          color: #475467;
          font-size: 10px;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .uid-value {
          font-family: monospace;
          color: #667085;
        }

        .request-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 16px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 20px;
          background: #fff5e6;
          color: #b76e00;
          font-size: 9px;
          font-weight: 800;
        }

        .relative-time {
          color: #98a2b3;
          font-size: 9px;
          font-weight: 700;
        }

        /* LOADING */

        .loading-state {
          min-height: 430px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #ffffff;
          border: 1px solid #e7ebef;
          border-radius: 18px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #dceff0;
          border-top-color: #00a4a6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-text {
          color: #98a2b3;
          font-size: 12px;
          font-weight: 700;
        }

        /* EMPTY */

        .empty-state {
          min-height: 430px;
          padding: 75px 20px;
          background: #ffffff;
          border: 1px solid #e7ebef;
          border-radius: 18px;
          text-align: center;
        }

        .empty-icon {
          width: 68px;
          height: 68px;
          margin: 0 auto 16px;
          border-radius: 19px;
          background: #edfafa;
          color: #00a4a6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-title {
          margin: 0;
          color: #344054;
          font-size: 18px;
          font-weight: 800;
        }

        .empty-text {
          max-width: 450px;
          margin: 8px auto 0;
          color: #98a2b3;
          font-size: 12px;
          line-height: 1.6;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .requests-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 900px) {
          .unavailable-page {
            padding: 20px;
          }

          .page-header {
            align-items: flex-start;
          }

          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
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
          .unavailable-page {
            padding: 14px;
          }

          .page-header {
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
          }

          .refresh-button {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .requests-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .unavailable-page {
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

          .stat-card {
            padding: 15px;
          }

          .request-card {
            padding: 16px;
            border-radius: 15px;
          }

          .request-title {
            font-size: 14px;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="unavailable-container">

        {/* HEADER */}

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
                Produits manquants
              </div>

              <h1 className="page-title">
                Produits manquants
              </h1>

              <p className="page-subtitle">
                Consultez les recherches de produits qui ne sont
                actuellement pas disponibles sur Founa.
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
                className={refreshing ? "refresh-spin" : ""}
              />
              Actualiser
            </button>
          </div>
        </header>

        {/* STATISTIQUES */}

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              <PackageX size={22} />
            </div>

            <div>
              <span className="stat-value">
                {products.length}
              </span>

              <span className="stat-label">
                Demandes de produits
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Users size={22} />
            </div>

            <div>
              <span className="stat-value">
                {uniqueClients}
              </span>

              <span className="stat-label">
                Clients concernés
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Clock3 size={22} />
            </div>

            <div>
              <span className="stat-value">
                {todayRequests}
              </span>

              <span className="stat-label">
                Demandes aujourd'hui
              </span>
            </div>
          </div>

        </div>

        {/* RECHERCHE */}

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
              placeholder="Rechercher un produit, un client ou un UID..."
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
              {filteredProducts.length}
            </strong>{" "}
            demande
            {filteredProducts.length > 1 ? "s" : ""} affichée
            {filteredProducts.length > 1 ? "s" : ""}
          </div>

        </div>

        {/* CONTENU */}

        {loading ? (

          <div className="loading-state">
            <div className="loading-spinner" />

            <span className="loading-text">
              Chargement des demandes...
            </span>
          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              <PackageX size={30} />
            </div>

            <h2 className="empty-title">
              {searchText.trim()
                ? "Aucune demande trouvée"
                : "Aucun produit manquant"}
            </h2>

            <p className="empty-text">
              {searchText.trim()
                ? "Aucune demande ne correspond à votre recherche. Essayez avec un autre terme."
                : "Les clients n'ont actuellement formulé aucune demande concernant un produit indisponible."}
            </p>

          </div>

        ) : (

          <div className="requests-grid">

            {filteredProducts.map((product) => (

              <article
                className="request-card"
                key={product.uid}
              >

                <div className="request-top">

                  <div className="request-icon">
                    <MessageSquareText size={22} />
                  </div>

                  <div className="request-date">
                    <CalendarDays size={12} />
                    {getRelativeTime(product.created_date)}
                  </div>

                </div>

                <h2 className="request-title">
                  {product.text_search}
                </h2>

                <p className="request-label">
                  Produit recherché par le client
                </p>

                <div className="request-info">

                  <div className="info-row">

                    <div className="info-row-icon">
                      <UserRound size={15} />
                    </div>

                    <div className="info-content">
                      <span className="info-label">
                        Client
                      </span>

                      <span
                        className="info-value"
                        title={
                          product.client_id || "Non associé"
                        }
                      >
                        {product.client_id
                          ? product.client_id
                          : "Client non associé"}
                      </span>
                    </div>

                  </div>

                  <div className="info-row">

                    <div className="info-row-icon">
                      <Hash size={15} />
                    </div>

                    <div className="info-content">
                      <span className="info-label">
                        Identifiant
                      </span>

                      <span
                        className="info-value uid-value"
                        title={product.uid}
                      >
                        {truncateUid(product.uid)}
                      </span>
                    </div>

                  </div>

                  <div className="info-row">

                    <div className="info-row-icon">
                      <CalendarDays size={15} />
                    </div>

                    <div className="info-content">
                      <span className="info-label">
                        Date de demande
                      </span>

                      <span
                        className="info-value"
                        title={formatDateTime(
                          product.created_date
                        )}
                      >
                        {formatDate(
                          product.created_date
                        )}
                      </span>
                    </div>

                  </div>

                  <div className="info-row">

                    <div className="info-row-icon">
                      <Clock3 size={15} />
                    </div>

                    <div className="info-content">
                      <span className="info-label">
                        Dernière modification
                      </span>

                      <span
                        className="info-value"
                        title={formatDateTime(
                          product.updated_date
                        )}
                      >
                        {formatDate(
                          product.updated_date
                        )}
                      </span>
                    </div>

                  </div>

                </div>

                <div className="request-footer">

                  <span className="status-badge">
                    <AlertCircle size={11} />
                    Produit indisponible
                  </span>

                  <span className="relative-time">
                    {formatDateTime(
                      product.created_date
                    )}
                  </span>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>
    </div>
  );
};

export default ReadAllUnavaibleProductsPage;