// src/pages/OrderTellerPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  GetAllCommandeByTeller,
  UpdateCommande,
  DeleteExpiredCommandes,
} from "../../services/order.service";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Search,
  X,
  RefreshCw,
  ShoppingCart,
  Clock3,
  CreditCard,
  PackageCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
  Phone,
  User,
  Package,
  CalendarDays,
  Plane,
  Ship,
  FileText,
} from "lucide-react";

interface Commande {
  commande_id: string;
  produit: {
    nom: string;
  };
  client: {
    nom: string;
    phone: string;
  };
  quantite: number;
  prix_total: number;
  statut: string;
  details: string;
  teller_id: string;
  created_date: string;

  cout_envoie_maritime?: number;
  cout_envoie_aérienne?: number;
}

const OrderTellerPage: React.FC = () => {
  const [data, setData] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Commande | null>(null);
  const [searchText, setSearchText] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // =========================================================
  // TELLER
  // =========================================================

  const teller = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("teller") || "{}");
    } catch {
      return {};
    }
  }, []);

  // =========================================================
  // CHARGER LES COMMANDES
  // =========================================================

  const loadCommandes = async () => {
    setLoading(true);

    try {
      const res = await GetAllCommandeByTeller({
        teller_id: teller.uid,
      });

      setData(res.data.commandes || []);
    } catch (err) {
      console.error(err);

      Swal.fire(
        "Erreur",
        "Impossible de charger les commandes",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommandes();
  }, []);

  // =========================================================
  // STATUTS
  // =========================================================

  const statuts = [
    {
      key: "Initier",
      label: "Initiées",
      color: "#6B7280",
      background: "#F3F4F6",
      icon: <ShoppingCart size={20} />,
    },
    {
      key: "Prise en charge",
      label: "Prise en charge",
      color: "#2196F3",
      background: "#EFF6FF",
      icon: <Clock3 size={20} />,
    },
    {
      key: "Valider",
      label: "Validées",
      color: "#3F51B5",
      background: "#EEF2FF",
      icon: <CheckCircle2 size={20} />,
    },
    {
      key: "Payer",
      label: "Payées",
      color: "#D97706",
      background: "#FFFBEB",
      icon: <CreditCard size={20} />,
    },
    {
      key: "Expedition",
      label: "Expédiées",
      color: "#EA580C",
      background: "#FFF7ED",
      icon: <PackageCheck size={20} />,
    },
    {
      key: "Livraison",
      label: "En livraison",
      color: "#0891B2",
      background: "#ECFEFF",
      icon: <Truck size={20} />,
    },
    {
      key: "Livrer",
      label: "Livrées",
      color: "#16A34A",
      background: "#F0FDF4",
      icon: <CheckCircle2 size={20} />,
    },
  ];

  // =========================================================
  // COULEUR STATUT
  // =========================================================

  const getStatutConfig = (statut: string) => {
    return (
      statuts.find((item) => item.key === statut) || {
        key: statut,
        label: statut,
        color: "#6B7280",
        background: "#F3F4F6",
        icon: <AlertTriangle size={17} />,
      }
    );
  };

  // =========================================================
  // RECHERCHE
  // =========================================================

  const filteredCommandes = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return data;
    }

    return data.filter((commande) => {
      return (
        commande.client?.nom
          ?.toLowerCase()
          .includes(search) ||
        commande.client?.phone
          ?.toLowerCase()
          .includes(search) ||
        commande.commande_id
          ?.toLowerCase()
          .includes(search) ||
        commande.produit?.nom
          ?.toLowerCase()
          .includes(search) ||
        commande.statut
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [data, searchText]);

  // =========================================================
  // STATISTIQUES
  // =========================================================

  const getCount = (statut: string) => {
    return data.filter(
      (commande) => commande.statut === statut
    ).length;
  };

  const totalCommandes = data.length;

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (dateStr: string) => {
    if (!dateStr) {
      return "-";
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) {
      return "";
    }

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // PRIX
  // =========================================================

  const formatPrice = (price: number) => {
    return Number(price || 0).toLocaleString("fr-FR");
  };

  // =========================================================
  // UPDATE
  // =========================================================

  const handleUpdate = async () => {
    if (!editing) {
      return;
    }

    const payload = {
      commande_id: editing.commande_id,
      statut: editing.statut,
      details: editing.details || "",
      teller_id: teller.uid,
      cout_envoie_maritime:
        Number(editing.cout_envoie_maritime) || 0,
      cout_envoie_aérienne:
        Number(editing.cout_envoie_aérienne) || 0,
    };

    try {
      setSaving(true);

      const res = await UpdateCommande(payload);

      if (res.data.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Commande mise à jour",
          text: "Les informations ont été enregistrées.",
          timer: 1500,
          showConfirmButton: false,
        });

        setEditing(null);

        await loadCommandes();
      } else {
        Swal.fire(
          "Erreur",
          res.data.message || "Impossible de modifier la commande.",
          "error"
        );
      }
    } catch (err: any) {
      console.error(err);

      Swal.fire(
        "Erreur",
        err?.response?.data?.message ||
          "Une erreur serveur est survenue.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE EXPIRED
  // =========================================================

  const handleDeleteExpiredCommandes = async () => {
    const confirmation = await Swal.fire({
      title: "Supprimer les commandes expirées ?",
      text: "Cette action supprimera définitivement les commandes non payées ayant dépassé le délai de 7 jours.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      setLoading(true);

      const res = await DeleteExpiredCommandes();

      if (
        res.data.success ||
        res.data.status === "success"
      ) {
        await Swal.fire({
          icon: "success",
          title: "Suppression terminée",
          text:
            res.data.message ||
            "Les commandes expirées ont été supprimées.",
          timer: 1800,
          showConfirmButton: false,
        });

        await loadCommandes();
      } else {
        Swal.fire(
          "Erreur",
          res.data.message ||
            "Impossible de supprimer les commandes.",
          "error"
        );
      }
    } catch (err: any) {
      console.error(err);

      Swal.fire(
        "Erreur",
        err?.response?.data?.message ||
          "Une erreur est survenue lors de la suppression.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADER
  // =========================================================

  if (loading) {
    return (
      <>
        <div className="fullscreen-loader">
          <div className="spinner"></div>
        </div>

        <style>{`
          * {
            box-sizing: border-box;
          }

          html,
          body,
          #root {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
          }

          .fullscreen-loader {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
          }

          .spinner {
            width: 52px;
            height: 52px;
            border: 4px solid #e5e7eb;
            border-top-color: #00A4A6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <div className="order-page">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="top-header">

          <div className="header-left">

            <button
              className="back-button"
              onClick={() => navigate(-1)}
              title="Retour"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="header-icon">
              <ShoppingCart size={23} />
            </div>

            <div>
              <h1>Commandes</h1>

              <p>
                Gestion des commandes clients
              </p>
            </div>

          </div>

          <button
            className="delete-expired-button"
            onClick={handleDeleteExpiredCommandes}
            disabled={loading}
          >
            <Trash2 size={17} />

            <span>
              Supprimer les expirées
            </span>
          </button>

        </header>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <main className="main-content">

          {/* TITLE */}

          <section className="intro">

            <div>
              <h2>
                Tableau des commandes
              </h2>

              <p>
                Suivez et gérez l'évolution des commandes
                qui vous sont attribuées.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={loadCommandes}
            >
              <RefreshCw size={17} />

              <span>
                Actualiser
              </span>
            </button>

          </section>

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <section className="stats-grid">

            {/* TOTAL */}

            <div className="stat-card total-card">

              <div className="stat-icon total-icon">
                <ShoppingCart size={21} />
              </div>

              <div className="stat-info">
                <span>Total</span>
                <strong>{totalCommandes}</strong>
              </div>

            </div>

            {statuts.map((statut) => (

              <div
                className="stat-card"
                key={statut.key}
              >

                <div
                  className="stat-icon"
                  style={{
                    backgroundColor: statut.background,
                    color: statut.color,
                  }}
                >
                  {statut.icon}
                </div>

                <div className="stat-info">

                  <span>
                    {statut.label}
                  </span>

                  <strong>
                    {getCount(statut.key)}
                  </strong>

                </div>

              </div>

            ))}

          </section>

          {/* ================================================= */}
          {/* SEARCH TOOLBAR */}
          {/* ================================================= */}

          <section className="toolbar">

            <div className="search-box">

              <Search
                size={19}
                className="search-icon"
              />

              <input
                type="text"
                placeholder="Rechercher par client, téléphone, produit, ID ou statut..."
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />

              {searchText && (
                <button
                  className="clear-search"
                  onClick={() => setSearchText("")}
                >
                  <X size={17} />
                </button>
              )}

            </div>

            <div className="result-counter">

              <strong>
                {filteredCommandes.length}
              </strong>

              commande
              {filteredCommandes.length > 1 ? "s" : ""}

            </div>

          </section>

          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          {data.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                <ShoppingCart size={38} />
              </div>

              <h3>
                Aucune commande
              </h3>

              <p>
                Vous n'avez actuellement aucune commande
                attribuée.
              </p>

            </div>

          ) : filteredCommandes.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                <Search size={38} />
              </div>

              <h3>
                Aucun résultat
              </h3>

              <p>
                Aucune commande ne correspond à
                <strong> "{searchText}"</strong>.
              </p>

              <button
                className="clear-result-button"
                onClick={() => setSearchText("")}
              >
                Effacer la recherche
              </button>

            </div>

          ) : (

            <section className="table-card">

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>Commande</th>
                      <th>Client</th>
                      <th>Produit</th>
                      <th>Qté</th>
                      <th>Total</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredCommandes.map((cmd) => {

                      const status =
                        getStatutConfig(cmd.statut);

                      return (

                        <tr key={cmd.commande_id}>

                          {/* COMMANDE */}

                          <td>

                            <div className="commande-id">

                              <span>
                                #{cmd.commande_id}
                              </span>

                              <small>
                                Commande
                              </small>

                            </div>

                          </td>

                          {/* CLIENT */}

                          <td>

                            <div className="client-cell">

                              <div className="client-avatar">
                                <User size={17} />
                              </div>

                              <div>

                                <strong>
                                  {cmd.client?.nom ||
                                    "Client"}
                                </strong>

                                <span>
                                  <Phone size={12} />

                                  {cmd.client?.phone ||
                                    "Téléphone inconnu"}
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* PRODUIT */}

                          <td>

                            <div className="product-cell">

                              <div className="product-icon">
                                <Package size={17} />
                              </div>

                              <span>
                                {cmd.produit?.nom ||
                                  "Produit"}
                              </span>

                            </div>

                          </td>

                          {/* QUANTITE */}

                          <td>

                            <span className="quantity">
                              {cmd.quantite}
                            </span>

                          </td>

                          {/* PRIX */}

                          <td>

                            <strong className="price">
                              {formatPrice(
                                cmd.prix_total
                              )}{" "}
                              FCFA
                            </strong>

                          </td>

                          {/* STATUT */}

                          <td>

                            <span
                              className="status-badge"
                              style={{
                                color: status.color,
                                backgroundColor:
                                  status.background,
                              }}
                            >

                              <span
                                className="status-dot"
                                style={{
                                  backgroundColor:
                                    status.color,
                                }}
                              ></span>

                              {status.label}

                            </span>

                          </td>

                          {/* DATE */}

                          <td>

                            <div className="date-cell">

                              <span>
                                <CalendarDays
                                  size={14}
                                />

                                {formatDate(
                                  cmd.created_date
                                )}
                              </span>

                              <small>
                                {formatTime(
                                  cmd.created_date
                                )}
                              </small>

                            </div>

                          </td>

                          {/* ACTION */}

                          <td>

                            <button
                              className="edit-button"
                              onClick={() =>
                                setEditing(cmd)
                              }
                              title="Modifier la commande"
                            >
                              <Pencil size={16} />

                              <span>
                                Modifier
                              </span>

                            </button>

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              </div>

            </section>

          )}

        </main>

      </div>

      {/* ===================================================== */}
      {/* MODAL */}
      {/* ===================================================== */}

      {editing && (

        <div
          className="modal-overlay"
          onClick={() => {
            if (!saving) {
              setEditing(null);
            }
          }}
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <span className="modal-kicker">
                  Gestion commande
                </span>

                <h3>
                  #{editing.commande_id}
                </h3>

              </div>

              <button
                className="close-modal"
                onClick={() => setEditing(null)}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            {/* ================================================= */}
            {/* CLIENT / PRODUIT */}
            {/* ================================================= */}

            <div className="modal-summary">

              <div className="summary-item">

                <User size={17} />

                <div>
                  <span>Client</span>

                  <strong>
                    {editing.client?.nom}
                  </strong>
                </div>

              </div>

              <div className="summary-item">

                <Package size={17} />

                <div>
                  <span>Produit</span>

                  <strong>
                    {editing.produit?.nom}
                  </strong>
                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* STATUT */}
            {/* ================================================= */}

            <div className="form-section">

              <label>
                Statut de la commande
              </label>

              <select
                value={editing.statut}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    statut: e.target.value,
                  })
                }
                disabled={saving}
              >

                {editing.statut === "Initier" && (
                  <option value="Initier">
                    Initier
                  </option>
                )}

                <option value="Prise en charge">
                  Prise en charge
                </option>

                <option value="Valider">
                  Valider
                </option>

                <option value="Payer">
                  Payer
                </option>

                <option value="Expedition">
                  Expedition
                </option>

                <option value="Livraison">
                  Livraison
                </option>

                <option value="Livrer">
                  Livrer
                </option>

              </select>

            </div>

            {/* ================================================= */}
            {/* PROGRESSION */}
            {/* ================================================= */}

            <div className="progress-section">

              <span className="progress-label">
                Progression
              </span>

              <div className="progress-line">

                {statuts.map((statut, index) => {

                  const currentIndex =
                    statuts.findIndex(
                      (item) =>
                        item.key === editing.statut
                    );

                  const active =
                    index <= currentIndex;

                  return (

                    <div
                      key={statut.key}
                      className={`progress-item ${
                        active ? "active" : ""
                      }`}
                    >

                      <div
                        className="progress-dot"
                        style={{
                          backgroundColor: active
                            ? statut.color
                            : "#E5E7EB",
                        }}
                      ></div>

                      {index <
                        statuts.length - 1 && (

                        <div
                          className="progress-connector"
                          style={{
                            backgroundColor:
                              index < currentIndex
                                ? statut.color
                                : "#E5E7EB",
                          }}
                        ></div>

                      )}

                    </div>

                  );

                })}

              </div>

              <div className="progress-status">
                {getStatutConfig(editing.statut).label}
              </div>

            </div>

            {/* ================================================= */}
            {/* FRAIS EXPEDITION */}
            {/* ================================================= */}

            {editing.statut === "Valider" && (

              <div className="shipping-section">

                <div className="section-title">

                  <Truck size={18} />

                  <div>

                    <strong>
                      Frais d'expédition
                    </strong>

                    <span>
                      Définissez les deux options
                      disponibles pour le client.
                    </span>

                  </div>

                </div>

                {/* MARITIME */}

                <div className="shipping-input">

                  <div className="shipping-icon maritime">
                    <Ship size={18} />
                  </div>

                  <div className="shipping-field">

                    <label>
                      Expédition maritime
                    </label>

                    <div className="input-wrapper">

                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Ex : 5000"
                        value={
                          editing.cout_envoie_maritime ??
                          ""
                        }
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            cout_envoie_maritime:
                              e.target.value === ""
                                ? undefined
                                : Number(
                                    e.target.value
                                  ),
                          })
                        }
                        disabled={saving}
                      />

                      <span>
                        FCFA
                      </span>

                    </div>

                  </div>

                </div>

                {/* AERIENNE */}

                <div className="shipping-input">

                  <div className="shipping-icon air">
                    <Plane size={18} />
                  </div>

                  <div className="shipping-field">

                    <label>
                      Expédition aérienne
                    </label>

                    <div className="input-wrapper">

                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Ex : 10000"
                        value={
                          editing.cout_envoie_aérienne ??
                          ""
                        }
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            cout_envoie_aérienne:
                              e.target.value === ""
                                ? undefined
                                : Number(
                                    e.target.value
                                  ),
                          })
                        }
                        disabled={saving}
                      />

                      <span>
                        FCFA
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            )}

            {/* ================================================= */}
            {/* DETAILS */}
            {/* ================================================= */}

            <div className="form-section">

              <label>
                <FileText size={15} />

                Détails / commentaire
              </label>

              <textarea
                value={editing.details || ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    details: e.target.value,
                  })
                }
                rows={4}
                placeholder="Ajouter une information concernant cette commande..."
                disabled={saving}
              />

            </div>

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <div className="modal-actions">

              <button
                className="cancel-button"
                onClick={() => setEditing(null)}
                disabled={saving}
              >
                Annuler
              </button>

              <button
                className="save-button"
                onClick={handleUpdate}
                disabled={saving}
              >

                {saving ? (
                  <>
                    <span className="button-spinner"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Enregistrer
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================== */}
      {/* STYLE */}
      {/* ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          background: #F5F7F8;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          color: #172033;
        }

        button,
        input,
        select,
        textarea {
          font-family: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        /* ================================================= */
        /* PAGE */
        /* ================================================= */

        .order-page {
          min-height: 100vh;
          width: 100%;
          background: #F5F7F8;
        }

        /* ================================================= */
        /* HEADER */
        /* ================================================= */

        .top-header {
          width: 100%;
          min-height: 82px;
          background: #FFFFFF;
          border-bottom: 1px solid #E7EBEE;
          padding: 17px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .back-button {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border: 1px solid #E2E6E9;
          background: #FFFFFF;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4B5563;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .back-button:hover {
          border-color: #00A4A6;
          color: #00A4A6;
          background: #F2FCFC;
        }

        .header-icon {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          background: #EAF9F9;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .top-header h1 {
          margin: 0;
          font-size: 21px;
          font-weight: 750;
          color: #111827;
        }

        .top-header p {
          margin: 4px 0 0;
          color: #7B8491;
          font-size: 13px;
        }

        .delete-expired-button {
          height: 42px;
          padding: 0 15px;
          border: none;
          border-radius: 9px;
          background: #DC2626;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.2s ease;
          white-space: nowrap;
        }

        .delete-expired-button:hover {
          background: #B91C1C;
          transform: translateY(-1px);
        }

        .delete-expired-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        /* ================================================= */
        /* MAIN */
        /* ================================================= */

        .main-content {
          width: 100%;
          max-width: 1550px;
          margin: auto;
          padding: 30px 32px 60px;
        }

        .intro {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 22px;
        }

        .intro h2 {
          margin: 0;
          font-size: 25px;
          font-weight: 750;
          color: #111827;
        }

        .intro p {
          margin: 6px 0 0;
          font-size: 14px;
          color: #7B8491;
        }

        .refresh-button {
          height: 40px;
          padding: 0 14px;
          border: 1px solid #DDE3E6;
          border-radius: 9px;
          background: #FFFFFF;
          color: #4B5563;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .refresh-button:hover {
          border-color: #00A4A6;
          color: #00A4A6;
        }

        /* ================================================= */
        /* STATS */
        /* ================================================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin-bottom: 22px;
        }

        .stat-card {
          background: #FFFFFF;
          border: 1px solid #E7EBEE;
          border-radius: 13px;
          padding: 16px;
          min-height: 91px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 3px 10px rgba(20, 30, 40, 0.025);
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .total-icon {
          background: #EAF9F9;
          color: #00A4A6;
        }

        .stat-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-info span {
          color: #7B8491;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-info strong {
          color: #111827;
          font-size: 23px;
          line-height: 1;
        }

        /* ================================================= */
        /* TOOLBAR */
        /* ================================================= */

        .toolbar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 14px;
        }

        .search-box {
          width: 100%;
          max-width: 650px;
          position: relative;
        }

        .search-box input {
          width: 100%;
          height: 48px;
          border: 1px solid #DDE3E6;
          border-radius: 11px;
          background: #FFFFFF;
          padding: 0 43px;
          outline: none;
          font-size: 14px;
          color: #1F2937;
          transition: 0.2s ease;
        }

        .search-box input::placeholder {
          color: #9CA3AF;
        }

        .search-box input:focus {
          border-color: #00A4A6;
          box-shadow:
            0 0 0 3px rgba(0, 164, 166, 0.08);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          pointer-events: none;
        }

        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 7px;
          background: #F1F3F4;
          color: #6B7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .clear-search:hover {
          color: #00A4A6;
          background: #EAF9F9;
        }

        .result-counter {
          font-size: 13px;
          color: #7B8491;
          white-space: nowrap;
        }

        .result-counter strong {
          color: #111827;
          margin-right: 4px;
        }

        /* ================================================= */
        /* TABLE */
        /* ================================================= */

        .table-card {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #E7EBEE;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 4px 15px rgba(20, 30, 40, 0.035);
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1120px;
          border-collapse: collapse;
        }

        thead {
          background: #F8FAFB;
        }

        th {
          padding: 14px 17px;
          border-bottom: 1px solid #E7EBEE;
          color: #727C88;
          text-align: left;
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.035em;
          white-space: nowrap;
        }

        td {
          padding: 15px 17px;
          border-bottom: 1px solid #EEF1F3;
          vertical-align: middle;
          font-size: 13px;
        }

        tbody tr {
          transition: background 0.15s ease;
        }

        tbody tr:hover {
          background: #FBFDFD;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        /* ================================================= */
        /* COMMAND ID */
        /* ================================================= */

        .commande-id {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .commande-id span {
          color: #1F2937;
          font-family: monospace;
          font-size: 12px;
          font-weight: 700;
        }

        .commande-id small {
          color: #A0A7AF;
          font-size: 10px;
        }

        /* ================================================= */
        /* CLIENT */
        /* ================================================= */

        .client-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 175px;
        }

        .client-avatar {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          background: #EEF7F7;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .client-cell > div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .client-cell strong {
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #1F2937;
          font-size: 13px;
        }

        .client-cell span {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #8A939D;
          font-size: 11px;
        }

        /* ================================================= */
        /* PRODUCT */
        /* ================================================= */

        .product-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 180px;
        }

        .product-icon {
          width: 33px;
          height: 33px;
          border-radius: 8px;
          background: #F4F6F7;
          color: #6B7280;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .product-cell > span {
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #374151;
          font-weight: 550;
        }

        /* ================================================= */
        /* QUANTITY */
        /* ================================================= */

        .quantity {
          min-width: 31px;
          height: 27px;
          padding: 0 8px;
          border-radius: 6px;
          background: #F1F3F4;
          color: #374151;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        /* ================================================= */
        /* PRICE */
        /* ================================================= */

        .price {
          color: #008B8D;
          font-size: 13px;
          white-space: nowrap;
        }

        /* ================================================= */
        /* STATUS */
        /* ================================================= */

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        /* ================================================= */
        /* DATE */
        /* ================================================= */

        .date-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
          white-space: nowrap;
        }

        .date-cell span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #4B5563;
          font-size: 12px;
        }

        .date-cell small {
          color: #9CA3AF;
          font-size: 10px;
        }

        /* ================================================= */
        /* ACTION */
        /* ================================================= */

        .edit-button {
          height: 35px;
          padding: 0 11px;
          border: 1px solid #DCE8E8;
          border-radius: 8px;
          background: #F1FAFA;
          color: #008B8D;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          transition: 0.2s ease;
          white-space: nowrap;
        }

        .edit-button:hover {
          background: #00A4A6;
          color: #FFFFFF;
          border-color: #00A4A6;
        }

        /* ================================================= */
        /* EMPTY */
        /* ================================================= */

        .empty-state {
          width: 100%;
          min-height: 390px;
          background: #FFFFFF;
          border: 1px solid #E7EBEE;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          width: 75px;
          height: 75px;
          border-radius: 20px;
          background: #EAF9F9;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 17px;
        }

        .empty-state h3 {
          margin: 0;
          color: #1F2937;
          font-size: 18px;
        }

        .empty-state p {
          margin: 8px 0 0;
          color: #8A939D;
          font-size: 13px;
        }

        .clear-result-button {
          margin-top: 18px;
          height: 39px;
          border: none;
          border-radius: 8px;
          background: #00A4A6;
          color: #FFFFFF;
          padding: 0 15px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 650;
        }

        /* ================================================= */
        /* MODAL OVERLAY */
        /* ================================================= */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(15, 23, 42, 0.58);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(3px);
        }

        .modal {
          width: 100%;
          max-width: 570px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          background: #FFFFFF;
          border-radius: 17px;
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.18);
          animation: modalIn 0.25s ease;
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ================================================= */
        /* MODAL HEADER */
        /* ================================================= */

        .modal-header {
          padding: 22px 23px;
          border-bottom: 1px solid #EEF1F3;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .modal-kicker {
          color: #00A4A6;
          font-size: 10px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .modal-header h3 {
          margin: 5px 0 0;
          color: #111827;
          font-family: monospace;
          font-size: 19px;
        }

        .close-modal {
          width: 35px;
          height: 35px;
          border: none;
          border-radius: 8px;
          background: #F3F4F6;
          color: #6B7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .close-modal:hover {
          background: #FEECEC;
          color: #DC2626;
        }

        /* ================================================= */
        /* MODAL SUMMARY */
        /* ================================================= */

        .modal-summary {
          padding: 16px 23px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: #FAFBFC;
          border-bottom: 1px solid #EEF1F3;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .summary-item > svg {
          color: #00A4A6;
          flex-shrink: 0;
        }

        .summary-item div {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .summary-item span {
          color: #9CA3AF;
          font-size: 10px;
        }

        .summary-item strong {
          color: #374151;
          font-size: 12px;
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ================================================= */
        /* FORM */
        /* ================================================= */

        .form-section {
          padding: 18px 23px 0;
        }

        .form-section label {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          color: #374151;
          font-size: 12px;
          font-weight: 700;
        }

        .form-section select,
        .form-section textarea {
          width: 100%;
          border: 1px solid #D9E0E3;
          border-radius: 9px;
          outline: none;
          background: #FFFFFF;
          color: #374151;
          transition: 0.2s ease;
        }

        .form-section select {
          height: 43px;
          padding: 0 12px;
          font-size: 13px;
          cursor: pointer;
        }

        .form-section textarea {
          padding: 11px 12px;
          resize: vertical;
          min-height: 90px;
          font-size: 13px;
          line-height: 1.5;
        }

        .form-section select:focus,
        .form-section textarea:focus {
          border-color: #00A4A6;
          box-shadow:
            0 0 0 3px rgba(0, 164, 166, 0.08);
        }

        /* ================================================= */
        /* PROGRESS */
        /* ================================================= */

        .progress-section {
          padding: 20px 23px 4px;
        }

        .progress-label {
          display: block;
          margin-bottom: 11px;
          color: #7B8491;
          font-size: 11px;
          font-weight: 650;
        }

        .progress-line {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .progress-item {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: 0.2s ease;
        }

        .progress-connector {
          height: 3px;
          flex: 1;
          transition: 0.2s ease;
        }

        .progress-status {
          margin-top: 8px;
          color: #00A4A6;
          font-size: 11px;
          font-weight: 700;
        }

        /* ================================================= */
        /* SHIPPING */
        /* ================================================= */

        .shipping-section {
          margin: 18px 23px 0;
          padding: 15px;
          border: 1px solid #E5EAEC;
          border-radius: 11px;
          background: #FAFBFC;
        }

        .section-title {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 14px;
        }

        .section-title > svg {
          color: #00A4A6;
          margin-top: 2px;
        }

        .section-title div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .section-title strong {
          color: #374151;
          font-size: 12px;
        }

        .section-title span {
          color: #9CA3AF;
          font-size: 10px;
        }

        .shipping-input {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }

        .shipping-icon {
          width: 37px;
          height: 37px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .shipping-icon.maritime {
          background: #EEF7FF;
          color: #2563EB;
        }

        .shipping-icon.air {
          background: #FFF4E8;
          color: #EA580C;
        }

        .shipping-field {
          flex: 1;
          min-width: 0;
        }

        .shipping-field label {
          display: block;
          margin-bottom: 5px;
          color: #6B7280;
          font-size: 10px;
          font-weight: 650;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper input {
          width: 100%;
          height: 39px;
          border: 1px solid #D9E0E3;
          border-radius: 8px;
          padding: 0 55px 0 10px;
          outline: none;
          font-size: 12px;
          color: #374151;
          background: #FFFFFF;
        }

        .input-wrapper input:focus {
          border-color: #00A4A6;
        }

        .input-wrapper span {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          font-size: 10px;
          font-weight: 650;
        }

        /* ================================================= */
        /* MODAL ACTIONS */
        /* ================================================= */

        .modal-actions {
          padding: 20px 23px 23px;
          margin-top: 3px;
          display: flex;
          justify-content: flex-end;
          gap: 9px;
        }

        .cancel-button,
        .save-button {
          height: 42px;
          padding: 0 15px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .cancel-button {
          border: 1px solid #DDE2E5;
          background: #FFFFFF;
          color: #6B7280;
        }

        .cancel-button:hover {
          background: #F3F4F6;
        }

        .save-button {
          border: none;
          background: #00A4A6;
          color: #FFFFFF;
        }

        .save-button:hover {
          background: #008F91;
        }

        .cancel-button:disabled,
        .save-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .button-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* ================================================= */
        /* RESPONSIVE */
        /* ================================================= */

        @media (min-width: 1400px) {

          .stats-grid {
            grid-template-columns:
              repeat(8, minmax(0, 1fr));
          }

        }

        @media (max-width: 1200px) {

          .main-content {
            padding: 26px 24px 50px;
          }

          .top-header {
            padding: 16px 24px;
          }

          .stats-grid {
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
          }

        }

        @media (max-width: 900px) {

          .stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .search-box {
            max-width: none;
          }

          .result-counter {
            text-align: right;
          }

        }

        @media (max-width: 700px) {

          .top-header {
            padding: 14px 15px;
          }

          .header-icon {
            width: 40px;
            height: 40px;
          }

          .top-header h1 {
            font-size: 18px;
          }

          .top-header p {
            display: none;
          }

          .delete-expired-button {
            width: 42px;
            height: 42px;
            padding: 0;
          }

          .delete-expired-button span {
            display: none;
          }

          .main-content {
            padding: 20px 14px 45px;
          }

          .intro {
            align-items: flex-start;
          }

          .intro h2 {
            font-size: 21px;
          }

          .intro p {
            font-size: 12px;
            line-height: 1.5;
          }

          .refresh-button {
            width: 40px;
            padding: 0;
            flex-shrink: 0;
          }

          .refresh-button span {
            display: none;
          }

          .modal-overlay {
            padding: 10px;
          }

          .modal {
            max-height: calc(100vh - 20px);
            border-radius: 14px;
          }

          .modal-summary {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 480px) {

          .back-button {
            width: 36px;
            height: 36px;
          }

          .header-icon {
            width: 37px;
            height: 37px;
          }

          .top-header h1 {
            font-size: 17px;
          }

          .stats-grid {
            gap: 9px;
          }

          .stat-card {
            min-height: 82px;
            padding: 12px;
            gap: 9px;
          }

          .stat-icon {
            width: 36px;
            height: 36px;
          }

          .stat-icon svg {
            width: 17px;
            height: 17px;
          }

          .stat-info span {
            font-size: 10px;
          }

          .stat-info strong {
            font-size: 20px;
          }

          .search-box input {
            height: 44px;
            font-size: 12px;
          }

          .modal-header {
            padding: 18px;
          }

          .modal-summary,
          .form-section,
          .progress-section {
            padding-left: 18px;
            padding-right: 18px;
          }

          .shipping-section {
            margin-left: 18px;
            margin-right: 18px;
          }

          .modal-actions {
            padding-left: 18px;
            padding-right: 18px;
          }

          .modal-actions button {
            flex: 1;
          }

        }

      `}</style>
    </>
  );
};

export default OrderTellerPage;