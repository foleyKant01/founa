// src/pages/OrderTellerPage.tsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { GetAllCommandeByTeller, UpdateCommande } from "../../services/order.service";
import { useNavigate } from "react-router-dom";


interface Commande {
  commande_id: string;
  produit: { nom: string };
  client: { nom: string };
  quantite: number;
  prix_total: number;
  statut: string;
  details: string;
  created_date: string;
}

const OrderTellerPage: React.FC = () => {
  const [data, setData] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Commande | null>(null);

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

    try {
      const res = await UpdateCommande(editing);
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

  return (
    <div className="order-page">
      <span className="back" onClick={() => navigate(-1)}>
            ←
        </span>
      <h2 className="page-title">Gestion des commandes</h2>

      {loading ? (
        <div className="loading">Chargement des commandes...</div>
      ) : data.length === 0 ? (
        <div className="no-data">Aucune commande trouvée.</div>
      ) : (
        <div className="table-wrapper">
          <table className="commande-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cmd) => (
                <tr key={cmd.commande_id}>
                  <td>{cmd.commande_id}</td>
                  <td>{cmd.client?.nom}</td>
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
            <h3 className="modal-title">Modifier commande</h3>

            <label>Statut</label>
            <select
              value={editing.statut}
              onChange={(e) => setEditing({ ...editing, statut: e.target.value })}
            >
              <option>Prise en charge</option>
              <option>Valider</option>
              {/* <option>Payer</option> */}
              <option>Expedition</option>
              <option>Livraison</option>
              <option>Livrer</option>
            </select>

            <label>Détails</label>
            <textarea
              value={editing.details || ""}
              onChange={(e) => setEditing({ ...editing, details: e.target.value })}
              rows={4}
              style={{
                fontSize: "16px", // IMPORTANT pour éviter le zoom iPhone
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setEditing(null)}>Annuler</button>
              <button className="save-btn" onClick={handleUpdate}>Enregistrer</button>
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
      `}</style>
    </div>
  );
};

export default OrderTellerPage;