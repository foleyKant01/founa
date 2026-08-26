// src/pages/OrderTellerPage.tsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { GetAllCommandeByTeller, UpdateCommande, DeleteExpiredCommandes } from "../../services/order.service";
import { useNavigate } from "react-router-dom";


interface Commande {
  commande_id: string;
  produit: { nom: string };
  client: { nom: string, phone: string };
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
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Commande | null>(null);
  const [searchText, setSearchText] = useState("");

  const teller = JSON.parse(sessionStorage.getItem("teller") || "{}");
  const navigate = useNavigate();
  

  const loadCommandes = async () => {
    setLoading(true);
    try {
      const res = await GetAllCommandeByTeller({ teller_id: teller.uid });
      setData(res.data.commandes || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", "Impossible de charger les commandes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommandes();
  }, []);

  const handleUpdate = async () => {
    if (!editing) return;

    const payload = {
      commande_id: editing.commande_id,
      statut: editing.statut,
      details: editing.details || "",
      teller_id: teller.uid,
      cout_envoie_maritime: Number(editing.cout_envoie_maritime) || 0,
      cout_envoie_aérienne: Number(editing.cout_envoie_aérienne) || 0,
    };

    try {
      const res = await UpdateCommande(payload);
      if (res.data.status === "success") {
        Swal.fire({ icon: "success", title: "Succès", text: "Commande mise à jour", timer: 1500, showConfirmButton: false });
        setEditing(null);
        loadCommandes();
      } else {
        Swal.fire("Erreur", res.data.message, "error");
      }
    } catch (err: any) {
      Swal.fire("Erreur", err?.response?.data?.message || "Erreur serveur", "error");
    }
  };

  // Nouvelle fonction pour couleur des statuts
  const getStatutColor = (statut: string) => {
  switch (statut) { // ne plus mettre toLowerCase()
    case "Initier": return "#9E9E9E";
    case "Prise en charge": return "#2196F3";
    case "Valider": return "#3F51B5";
    case "Payer": return "#FFC107";
    case "Expedition": return "#FF9800";
    case "Livraison": return "#00BCD4";
    case "Livrer": return "#4CAF50";
    default: return "#000";
  }
};

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const filteredCommandes = data.filter((commande) => {
    const search = searchText.trim().toLowerCase();

    if (!search) return true;

    return (
      commande.client?.nom?.toLowerCase().includes(search) ||
      commande.client?.phone?.toLowerCase().includes(search) ||
      commande.commande_id?.toLowerCase().includes(search) 

    );
  });

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

      if (res.data.success || res.data.status === "success") {
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
          res.data.message || "Impossible de supprimer les commandes.",
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

  return (
    <div className="order-page">
      <div className="page-header">
        <div className="page-header-left">
          <span className="back" onClick={() => navigate(-1)}>
            ←
          </span>

          <h2 className="page-title">
            Gestion des commandes
          </h2>
        </div>

        <button
          className="delete-expired-btn"
          onClick={handleDeleteExpiredCommandes}
          disabled={loading}
        >
          🗑️ Delete Expired Commande
        </button>
      </div>
      <div className="search-container">
      <input
        type="text"
        placeholder="Rechercher par client ou ID commande..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />

      {searchText && (
        <button
          className="clear-search"
          onClick={() => setSearchText("")}
        >
          ✕
        </button>
      )}
    </div>

      {loading ? (
        <div className="loading">Chargement des commandes...</div>
      ) : data.length === 0 ? (
          <div className="no-data">
            Aucune commande trouvée.
          </div>
        ) : filteredCommandes.length === 0 ? (
          <div className="no-data">
            🔍 Aucune commande ne correspond à "{searchText}"
          </div>
        ) : (
        <div className="table-wrapper">
          <table className="commande-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Tel</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommandes.map((cmd) => (
                <tr key={cmd.commande_id}>
                  <td>{cmd.commande_id}</td>
                  <td>{cmd.client?.nom}</td>
                  <td>{cmd.client?.phone}</td>
                  <td>{cmd.produit?.nom}</td>
                  <td>{cmd.quantite}</td>
                  <td>{cmd.prix_total.toLocaleString()} FCFA</td>
                  <td>
                    <span
                      className="statut"
                      style={{
                        backgroundColor: getStatutColor(cmd.statut),
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        display: "inline-block",
                        fontWeight: 'bold',
                        fontSize: "12px",
                        
                      }}
                    >
                      {cmd.statut}
                    </span>
                  </td>
                  <td>{formatDate(cmd.created_date)}</td>
                  <td>
                    <button className="edit-btn" onClick={() => setEditing(cmd)}>Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal animate-fadeIn">

            <h3 className="modal-title">
              Modifier commande
            </h3>

            {/* STATUT */}
            <label>Statut</label>

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
                <option value="Initier">Initier</option>
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

            {/* EXPÉDITION MARITIME */}
            <label>
              Coût d'expédition maritime
            </label>

            <input
              type="number"
              min="0"
              step="1"
              placeholder="Ex : 5000"
              value={editing.cout_envoie_maritime ?? ""}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  cout_envoie_maritime: Number(e.target.value),
                })
              }
            />

            {/* EXPÉDITION AÉRIENNE */}
            <label>
              Coût d'expédition aérienne
            </label>

            <input
              type="number"
              min="0"
              step="1"
              placeholder="Ex : 10000"
              value={editing.cout_envoie_aérienne ?? ""}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  cout_envoie_aérienne: Number(e.target.value),
                })
              }
            />

            {/* DÉTAILS */}
            <label>Détails</label>

            <textarea
              value={editing.details || ""}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  details: e.target.value,
                })
              }
              rows={4}
              style={{
                fontSize: "16px",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setEditing(null)}
              >
                Annuler
              </button>

              <button
                className="save-btn"
                onClick={handleUpdate}
              >
                Enregistrer
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .order-page { padding:24px; background:#F9FAFB; min-height:80vh; font-family:Arial,sans-serif; }
        .page-title { font-size:28px; font-weight:bold; margin-bottom:24px; color:#374151; }
        .loading, .no-data { text-align:center; color:#6B7280; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }
        .table-wrapper { overflow-x:auto; background:#fff; border-radius:12px; border:1px solid #E5E7EB; box-shadow:0 4px 15px rgba(0,0,0,0.05); }
        .commande-table { width:100%; border-collapse:collapse; }
        th, td { padding:12px; border-bottom:1px solid #E5E7EB; text-align:left; }
        th { background:#F3F4F6; font-weight:600; }
        tr:hover { background:#F9FAFB; transition:background 0.2s; }
        .edit-btn { background:#3B82F6; color:#fff; padding:6px 12px; border:none; border-radius:6px; cursor:pointer; transition:all 0.2s; }
        .edit-btn:hover { background:#2563EB; }

        /* MODAL */
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:50; }
        .modal { background:#fff; padding:24px; border-radius:12px; width:380px; box-shadow:0 8px 25px rgba(0,0,0,0.15); border:1px solid #E5E7EB; }
        .modal-title { font-size:20px; font-weight:bold; margin-bottom:16px; color:#374151; }
        label { display:block; font-weight:600; margin-top:12px; margin-bottom:4px; color:#374151; }
        select, textarea { width:100%; padding:8px 12px; border:1px solid #D1D5DB; border-radius:8px; outline:none; transition:all 0.2s; }
        select:focus, textarea:focus { border-color:#3B82F6; box-shadow:0 0 0 2px rgba(59,130,246,0.2); }
        textarea { resize:none; }

        .modal-actions { display:flex; justify-content:flex-end; gap:12px; margin-top:16px; }
        .cancel-btn { background:#9CA3AF; color:#fff; padding:8px 16px; border:none; border-radius:8px; cursor:pointer; transition:all 0.2s; }
        .cancel-btn:hover { background:#6B7280; }
        .save-btn { background:#16A34A; color:#fff; padding:8px 16px; border:none; border-radius:8px; cursor:pointer; transition:all 0.2s; }
        .save-btn:hover { background:#15803D; }

        @keyframes fadeIn { from {opacity:0; transform:translateY(-10px);} to {opacity:1; transform:translateY(0);} }
        .animate-fadeIn { animation:fadeIn 0.3s ease-out; }
        .search-container {
  position: relative;
  width: 100%;
  margin: 20px 0;
}

.search-input {
  width: 100%;
  height: 45px;
  padding: 0 45px 0 16px;
  box-sizing: border-box;

  border: 1px solid #ddd;
  border-radius: 12px;

  background-color: #fff;

  font-size: 14px;
  outline: none;

  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #00A4A6;
  box-shadow: 0 0 0 3px rgba(0, 164, 166, 0.1);
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  border: none;
  background: transparent;

  color: #777;
  font-size: 16px;

  cursor: pointer;
}

.clear-search:hover {
  color: #00A4A6;
}

.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #777;
}
  .page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.page-header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-header-left .page-title {
  margin: 0;
}

.delete-expired-btn {
  background: #DC2626;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.delete-expired-btn:hover {
  background: #B91C1C;
  transform: translateY(-1px);
}

.delete-expired-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header-left {
    justify-content: flex-start;
  }

  .delete-expired-btn {
    width: 100%;
  }
}
      `}</style>
    </div>
  );
};

export default OrderTellerPage;