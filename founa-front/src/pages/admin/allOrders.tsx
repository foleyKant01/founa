// src/pages/teller/OrderTellerPage.tsx

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  GetAllCommandes,
  UpdateCommande,
  DeleteExpiredCommandes,
} from "../../services/order.service";
import { useNavigate } from "react-router-dom";

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

const AllOrderPage: React.FC = () => {
  const [data, setData] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Commande | null>(null);
  const [searchText, setSearchText] = useState("");

  const teller = JSON.parse(localStorage.getItem("teller") || "{}");
  const navigate = useNavigate();

  // ============================================================
  // CHARGEMENT DES COMMANDES
  // ============================================================

  const loadCommandes = async () => {
    setLoading(true);

    try {
      const res = await GetAllCommandes();

      if (res.data.status === "success") {
        setData(res.data.commandes || []);
      } else {
        Swal.fire(
          "Erreur",
          res.data.message || "Impossible de charger les commandes",
          "error"
        );
      }
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

  // ============================================================
  // COULEUR STATUT
  // ============================================================

const getStatutConfig = (statut: string) => {
  switch (statut) {
    case "Initier":
      return {
        color: "#9E9E9E",
        background: "#F3F4F6",
        icon: "○",
      };

    case "Prise en charge":
      return {
        color: "#2196F3",
        background: "#EFF6FF",
        icon: "◉",
      };

    case "Valider":
      return {
        color: "#3F51B5",
        background: "#EEF2FF",
        icon: "✓",
      };

    case "Payer":
      return {
        color: "#FFC107",
        background: "#FFFBEB",
        icon: "●",
      };

    case "Expedition":
      return {
        color: "#FF9800",
        background: "#FFF7ED",
        icon: "→",
      };

    case "Livraison":
      return {
        color: "#00BCD4",
        background: "#ECFEFF",
        icon: "↗",
      };

    case "Livrer":
      return {
        color: "#4CAF50",
        background: "#F0FDF4",
        icon: "✓",
      };

    default:
      return {
        color: "#6B7280",
        background: "#F3F4F6",
        icon: "•",
      };
  }
};

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // RECHERCHE
  // ============================================================

  const filteredCommandes = data.filter((commande) => {
    const search = searchText.trim().toLowerCase();

    if (!search) return true;

    return (
      commande.client?.nom?.toLowerCase().includes(search) ||
      commande.client?.phone?.toLowerCase().includes(search) ||
      commande.commande_id?.toLowerCase().includes(search) ||
      commande.produit?.nom?.toLowerCase().includes(search) ||
      commande.statut?.toLowerCase().includes(search)
    );
  });

  // ============================================================
  // STATISTIQUES
  // ============================================================

  const totalCommandes = data.length;

  const commandesInitiees = data.filter(
    (c) => c.statut === "Initier"
  ).length;

  const commandesEnCharge = data.filter(
    (c) => c.statut === "Prise en charge"
  ).length;

  const commandesValider = data.filter(
    (c) => c.statut === "Valider"
  ).length;

  const commandesPayer = data.filter(
    (c) => c.statut === "Payer"
  ).length;

  const commandesExpedition = data.filter(
    (c) => c.statut === "Expedition"
  ).length;

  const commandesLivraison = data.filter(
    (c) => c.statut === "Livraison"
  ).length;

  const commandesLivrees = data.filter(
    (c) => c.statut === "Livrer"
  ).length;

  // ============================================================
  // MODIFICATION
  // ============================================================

  const handleUpdate = async () => {
    if (!editing) return;

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
      Swal.fire(
        "Erreur",
        err?.response?.data?.message || "Erreur serveur",
        "error"
      );
    }
  };

  // ============================================================
  // SUPPRESSION COMMANDES EXPIREES
  // ============================================================

  const handleDeleteExpiredCommandes = async () => {
    const confirmation = await Swal.fire({
      title: "Supprimer les commandes expirées ?",
      text:
        "Cette action supprimera définitivement les commandes non payées ayant dépassé le délai de 7 jours.",
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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="order-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="page-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={() => navigate(-1)}
            title="Retour"
          >
            ←
          </button>

          <div>
            <div className="breadcrumb">
              Administration
              <span>/</span>
              Commandes
            </div>

            <h1>Gestion des commandes</h1>

            <p>
              Suivez et gérez toutes les commandes de vos clients.
            </p>
          </div>

        </div>

        <button
          className="delete-expired-btn"
          onClick={handleDeleteExpiredCommandes}
          disabled={loading}
        >
          <span>🗑</span>
          Supprimer ceux expirées
        </button>

      </header>

      {/* ======================================================
          STATISTIQUES
      ====================================================== */}

      <section className="stats-grid">

        <div className="stat-card">
            <div className="stat-icon total">
            #
            </div>
            <div>
            <span className="stat-label">Total commandes</span>
            <strong className="stat-value">{totalCommandes}</strong>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon initier">
            ○
            </div>
            <div>
            <span className="stat-label">Initiées</span>
            <strong className="stat-value">{commandesInitiees}</strong>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon charge">
            ◉
            </div>
            <div>
            <span className="stat-label">Prise en charge</span>
            <strong className="stat-value">{commandesEnCharge}</strong>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon valider">
            ✓
            </div>
            <div>
            <span className="stat-label">Validées</span>
            <strong className="stat-value">{commandesValider}</strong>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon payer">
            ●
            </div>
            <div>
            <span className="stat-label">Payées</span>
            <strong className="stat-value">{commandesPayer}</strong>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon expedition">
            →
            </div>
            <div>
            <span className="stat-label">Expédiées</span>
            <strong className="stat-value">{commandesExpedition}</strong>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon livraison">
            ↗
            </div>
            <div>
            <span className="stat-label">En livraison</span>
            <strong className="stat-value">{commandesLivraison}</strong>
            </div>
        </div>

        <div className="stat-card">
            <div className="stat-icon livrer">
            ✓
            </div>
            <div>
            <span className="stat-label">Livrées</span>
            <strong className="stat-value">{commandesLivrees}</strong>
            </div>
        </div>

        </section>

      {/* ======================================================
          SEARCH / TOOLBAR
      ====================================================== */}

      <section className="toolbar">

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Rechercher par client, téléphone, produit ou ID..."
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
              ×
            </button>
          )}

        </div>

        <div className="result-count">
          <strong>{filteredCommandes.length}</strong>
          <span>
            {filteredCommandes.length > 1
              ? " commandes"
              : " commande"}
          </span>
        </div>

      </section>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <section className="orders-card">

        {loading ? (

          <div className="loading-container">

            <div className="loader"></div>

            <p>
              Chargement des commandes...
            </p>

          </div>

        ) : data.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📦
            </div>

            <h3>
              Aucune commande
            </h3>

            <p>
              Aucune commande n'est actuellement disponible.
            </p>

          </div>

        ) : filteredCommandes.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🔍
            </div>

            <h3>
              Aucun résultat
            </h3>

            <p>
              Aucune commande ne correspond à
              <strong> "{searchText}"</strong>.
            </p>

            <button
              className="reset-search"
              onClick={() => setSearchText("")}
            >
              Réinitialiser la recherche
            </button>

          </div>

        ) : (

          <div className="table-scroll">

            <table className="commande-table">

              <thead>
                <tr>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Produit</th>
                  <th>Qté</th>
                  <th>Prix total</th>
                  <th>Teller</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th className="action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredCommandes.map((cmd) => {

                  const status =
                    getStatutConfig(cmd.statut);

                  return (

                    <tr key={cmd.commande_id}>

                      {/* ID */}
                      <td>

                        <div className="order-id">
                          #{cmd.commande_id}
                        </div>

                      </td>

                      {/* CLIENT */}
                      <td>

                        <div className="client-info">

                          <div className="client-avatar">
                            {cmd.client?.nom
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>

                          <div>

                            <strong>
                              {cmd.client?.nom || "-"}
                            </strong>

                            <small>
                              {cmd.client?.phone || "-"}
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* PRODUIT */}
                      <td>

                        <div className="product-name">
                          {cmd.produit?.nom || "-"}
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
                          {Number(
                            cmd.prix_total || 0
                          ).toLocaleString("fr-FR")}
                          {" "}FCFA
                        </strong>

                      </td>

                      {/* TELLER */}
                      <td>

                        <span className="teller-id">
                          {cmd.teller_id
                            ? cmd.teller_id.substring(0, 8)
                            : "-"}
                        </span>

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
                          <span>
                            {status.icon}
                          </span>

                          {cmd.statut}
                        </span>

                      </td>

                      {/* DATE */}
                      <td>

                        <span className="date">
                          {formatDate(
                            cmd.created_date
                          )}
                        </span>

                      </td>

                      {/* ACTION */}
                      <td className="action-column">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            setEditing(cmd)
                          }
                        >
                          <span>✎</span>
                          Modifier
                        </button>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* ======================================================
          MODAL MODIFICATION
      ====================================================== */}

      {editing && (

        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setEditing(null);
            }
          }}
        >

          <div className="modal">

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <span className="modal-label">
                  COMMANDE
                </span>

                <h2>
                  #{editing.commande_id}
                </h2>

              </div>

              <button
                className="modal-close"
                onClick={() => setEditing(null)}
              >
                ×
              </button>

            </div>

            {/* CLIENT */}

            <div className="order-summary">

              <div className="summary-avatar">
                {editing.client?.nom
                  ?.charAt(0)
                  ?.toUpperCase() || "?"}
              </div>

              <div>

                <strong>
                  {editing.client?.nom}
                </strong>

                <span>
                  {editing.client?.phone}
                </span>

              </div>

            </div>

            {/* STATUT */}

            <div className="form-group">

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

            {/* COUTS EXPEDITION */}

            {editing.statut === "Valider" && (

              <div className="shipping-section">

                <div className="section-title">
                  Frais d'expédition
                </div>

                <div className="shipping-grid">

                  {/* MARITIME */}

                  <div className="form-group">

                    <label>
                      Maritime
                    </label>

                    <div className="input-with-unit">

                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="5000"
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
                      />

                      <span>
                        FCFA
                      </span>

                    </div>

                  </div>

                  {/* AERIENNE */}

                  <div className="form-group">

                    <label>
                      Aérienne
                    </label>

                    <div className="input-with-unit">

                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="10000"
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
                      />

                      <span>
                        FCFA
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            )}

            {/* DETAILS */}

            <div className="form-group">

              <label>
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
              />

            </div>

            {/* ACTIONS */}

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditing(null)
                }
              >
                Annuler
              </button>

              <button
                className="save-btn"
                onClick={handleUpdate}
              >
                ✓ Enregistrer
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          STYLE
      ====================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .order-page {
          width: 100%;
          min-height: 100vh;
          padding: 28px 32px 50px;
          background: #F5F7F9;
          font-family: Arial, Helvetica, sans-serif;
          color: #1F2937;
        }

        /* ================= HEADER ================= */

        .page-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 28px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-button {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          background: #FFFFFF;
          color: #374151;
          font-size: 24px;
          cursor: pointer;
          transition: all .2s ease;
        }

        .back-button:hover {
          background: #00A4A6;
          border-color: #00A4A6;
          color: #FFFFFF;
          transform: translateX(-2px);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9CA3AF;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .breadcrumb span {
          color: #D1D5DB;
        }

        .page-header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          color: #111827;
        }

        .page-header p {
          margin: 5px 0 0;
          color: #6B7280;
          font-size: 14px;
        }

        /* ================= DELETE ================= */

        .delete-expired-btn {
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 17px;
          border: 1px solid #FECACA;
          border-radius: 9px;
          background: #FEF2F2;
          color: #DC2626;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all .2s ease;
        }

        .delete-expired-btn:hover {
          background: #DC2626;
          border-color: #DC2626;
          color: white;
          transform: translateY(-1px);
        }

        .delete-expired-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }

        /* ================= STATS ================= */

        .stats-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          min-height: 105px;
          padding: 18px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,.025);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
        }

        .stat-icon.total {
          background: #E8F8F8;
          color: #00A4A6;
        }

        .stat-icon.pending {
          background: #F3F4F6;
          color: #6B7280;
        }

        .stat-icon.progress {
          background: #EFF6FF;
          color: #2563EB;
        }

        .stat-icon.delivered {
          background: #F0FDF4;
          color: #16A34A;
        }

        .stat-label {
          display: block;
          color: #6B7280;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .stat-value {
          display: block;
          color: #111827;
          font-size: 23px;
        }

        /* ================= TOOLBAR ================= */

        .toolbar {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 16px;
        }

        .search-box {
          position: relative;
          flex: 1;
        }

        .search-box input {
          width: 100%;
          height: 48px;
          padding: 0 48px;
          border: 1px solid #E1E5E9;
          border-radius: 10px;
          background: #FFFFFF;
          color: #374151;
          font-size: 14px;
          outline: none;
          transition: all .2s ease;
        }

        .search-box input:focus {
          border-color: #00A4A6;
          box-shadow: 0 0 0 3px rgba(0,164,166,.10);
        }

        .search-icon {
          position: absolute;
          left: 17px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          z-index: 1;
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 27px;
          height: 27px;
          border: none;
          border-radius: 50%;
          background: #F3F4F6;
          color: #6B7280;
          cursor: pointer;
          font-size: 17px;
        }

        .result-count {
          height: 48px;
          min-width: 130px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          background: #FFFFFF;
          color: #6B7280;
          font-size: 13px;
        }

        .result-count strong {
          color: #111827;
        }

        /* ================= TABLE ================= */

        .orders-card {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 13px;
          overflow: hidden;
          box-shadow: 0 3px 14px rgba(0,0,0,.035);
        }

        .table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        .commande-table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
        }

        .commande-table th {
          height: 48px;
          padding: 0 15px;
          text-align: left;
          background: #F8FAFC;
          border-bottom: 1px solid #E5E7EB;
          color: #6B7280;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .commande-table td {
          height: 72px;
          padding: 10px 15px;
          border-bottom: 1px solid #F0F1F2;
          color: #374151;
          font-size: 13px;
          vertical-align: middle;
        }

        .commande-table tbody tr {
          transition: background .15s ease;
        }

        .commande-table tbody tr:hover {
          background: #FAFCFC;
        }

        .commande-table tbody tr:last-child td {
          border-bottom: none;
        }

        /* ================= ORDER ID ================= */

        .order-id {
          font-family: monospace;
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
          max-width: 130px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ================= CLIENT ================= */

        .client-info {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 170px;
        }

        .client-avatar {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          background: #E8F8F8;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .client-info strong {
          display: block;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #1F2937;
          font-size: 13px;
        }

        .client-info small {
          display: block;
          margin-top: 3px;
          color: #9CA3AF;
          font-size: 11px;
        }

        /* ================= PRODUCT ================= */

        .product-name {
          max-width: 220px;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ================= QUANTITY ================= */

        .quantity {
          min-width: 30px;
          padding: 5px 9px;
          display: inline-flex;
          justify-content: center;
          background: #F3F4F6;
          border-radius: 6px;
          color: #374151;
          font-weight: 700;
          font-size: 12px;
        }

        /* ================= PRICE ================= */

        .price {
          color: #008B8D;
          white-space: nowrap;
          font-size: 13px;
        }

        /* ================= TELLER ================= */

        .teller-id {
          display: inline-block;
          padding: 5px 8px;
          border-radius: 6px;
          background: #F3F4F6;
          color: #6B7280;
          font-family: monospace;
          font-size: 11px;
        }

        /* ================= STATUS ================= */

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* ================= DATE ================= */

        .date {
          color: #6B7280;
          white-space: nowrap;
          font-size: 12px;
        }

        /* ================= ACTION ================= */

        .action-column {
          text-align: right !important;
        }

        .edit-btn {
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 11px;
          border: 1px solid #BFDBFE;
          border-radius: 7px;
          background: #EFF6FF;
          color: #2563EB;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
        }

        .edit-btn:hover {
          background: #2563EB;
          border-color: #2563EB;
          color: #FFFFFF;
        }

        /* ================= LOADING ================= */

        .loading-container {
          min-height: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6B7280;
        }

        .loader {
          width: 42px;
          height: 42px;
          border: 4px solid #E5E7EB;
          border-top-color: #00A4A6;
          border-radius: 50%;
          animation: spin .8s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= EMPTY ================= */

        .empty-state {
          min-height: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .empty-icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #F3F4F6;
          font-size: 28px;
          margin-bottom: 15px;
        }

        .empty-state h3 {
          margin: 0 0 7px;
          color: #374151;
          font-size: 18px;
        }

        .empty-state p {
          margin: 0;
          color: #9CA3AF;
          font-size: 13px;
        }

        .reset-search {
          margin-top: 18px;
          border: none;
          background: #00A4A6;
          color: #FFFFFF;
          border-radius: 8px;
          padding: 9px 15px;
          cursor: pointer;
          font-weight: 600;
        }

        /* ================= MODAL ================= */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, .58);
          backdrop-filter: blur(3px);
        }

        .modal {
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 25px;
          border-radius: 15px;
          background: #FFFFFF;
          box-shadow: 0 25px 70px rgba(0,0,0,.20);
          animation: modalIn .25s ease;
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 18px;
          border-bottom: 1px solid #E5E7EB;
        }

        .modal-label {
          display: block;
          margin-bottom: 4px;
          color: #9CA3AF;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .5px;
        }

        .modal-header h2 {
          margin: 0;
          color: #111827;
          font-family: monospace;
          font-size: 20px;
        }

        .modal-close {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 8px;
          background: #F3F4F6;
          color: #6B7280;
          font-size: 23px;
          cursor: pointer;
        }

        .modal-close:hover {
          background: #FEE2E2;
          color: #DC2626;
        }

        /* ================= SUMMARY ================= */

        .order-summary {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          padding: 13px;
          border-radius: 10px;
          background: #F8FAFC;
          border: 1px solid #E5E7EB;
        }

        .summary-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #E8F8F8;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .order-summary strong {
          display: block;
          color: #1F2937;
          font-size: 14px;
        }

        .order-summary span {
          display: block;
          margin-top: 3px;
          color: #6B7280;
          font-size: 12px;
        }

        /* ================= FORM ================= */

        .form-group {
          margin-top: 17px;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
          color: #374151;
          font-size: 12px;
          font-weight: 700;
        }

        .form-group select,
        .form-group textarea,
        .form-group input {
          width: 100%;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          background: #FFFFFF;
          color: #374151;
          outline: none;
          font-family: inherit;
          transition: all .2s ease;
        }

        .form-group select,
        .form-group input {
          height: 43px;
          padding: 0 12px;
          font-size: 13px;
        }

        .form-group textarea {
          padding: 11px 12px;
          resize: vertical;
          min-height: 100px;
          font-size: 13px;
        }

        .form-group select:focus,
        .form-group textarea:focus,
        .form-group input:focus {
          border-color: #00A4A6;
          box-shadow: 0 0 0 3px rgba(0,164,166,.09);
        }

        /* ================= SHIPPING ================= */

        .shipping-section {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          background: #FAFCFC;
        }

        .section-title {
          margin-bottom: 3px;
          color: #374151;
          font-size: 12px;
          font-weight: 700;
        }

        .shipping-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .input-with-unit {
          position: relative;
        }

        .input-with-unit input {
          padding-right: 55px;
        }

        .input-with-unit span {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          font-size: 10px;
          font-weight: 700;
        }

        /* ================= MODAL ACTION ================= */

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 25px;
          padding-top: 18px;
          border-top: 1px solid #E5E7EB;
        }

        .cancel-btn,
        .save-btn {
          height: 42px;
          padding: 0 17px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
        }

        .cancel-btn {
          background: #F3F4F6;
          color: #4B5563;
        }

        .cancel-btn:hover {
          background: #E5E7EB;
        }

        .save-btn {
          background: #00A4A6;
          color: #FFFFFF;
        }

        .save-btn:hover {
          background: #008B8D;
          transform: translateY(-1px);
        }

        /* ================= TABLET ================= */

        @media (max-width: 1000px) {

          .order-page {
            padding: 22px 20px 40px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        /* ================= MOBILE ================= */

        @media (max-width: 650px) {

          .order-page {
            padding: 15px 12px 35px;
          }

          .page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .header-left {
            width: 100%;
          }

          .page-header h1 {
            font-size: 21px;
          }

          .page-header p {
            font-size: 12px;
          }

          .delete-expired-btn {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .stat-card {
            min-height: 90px;
            padding: 12px;
            gap: 10px;
          }

          .stat-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            font-size: 16px;
          }

          .stat-value {
            font-size: 19px;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .result-count {
            width: 100%;
          }

          .modal {
            padding: 20px;
            max-height: 94vh;
          }

          .shipping-grid {
            grid-template-columns: 1fr;
          }

        }

        /* ================= SMALL MOBILE ================= */

        @media (max-width: 400px) {

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .header-left {
            gap: 10px;
          }

          .back-button {
            width: 40px;
            height: 40px;
            min-width: 40px;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .cancel-btn,
          .save-btn {
            width: 100%;
          }

        }

      `}</style>
    </div>
  );
};

export default AllOrderPage;