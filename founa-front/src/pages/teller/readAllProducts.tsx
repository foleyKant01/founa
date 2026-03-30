import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteProduitByTeller, GetAllProduitByTeller } from "../../services/product.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

interface Product {
  nom: string;
  description: string;
  prix_vente: number;
  uid: string;
  stock_disponible: number;
  images: string[];
  type?: string;
}

const ReadAllProducts = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const teller = JSON.parse(sessionStorage.getItem("teller") || "{}");
      const teller_id = teller.uid;

      const response = await GetAllProduitByTeller({ teller_id });

      if (response.data.status === "success") {
        setData(response.data.produits || []);
        toast.success("Produits chargés ✅");
      } else {
        toast.error(response.data.message || "Erreur chargement");
      }
    } catch (error) {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const viewSingleProduct = (uid: string) => {
    navigate(`/admin/product/${uid}`);
  };

  const deleteProduct = async (uid: string) => {
  const result = await Swal.fire({
      title: "Supprimer le produit ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

  if (!result.isConfirmed) return;
    try {
      const teller = JSON.parse(sessionStorage.getItem("teller") || "{}");

      const res = await DeleteProduitByTeller({
        produit_id: uid,
        teller_id: teller.uid,
      });

      if (res.data.status === "success") {
        setData((prev) => prev.filter((p) => p.uid !== uid));

        Swal.fire({
          icon: "success",
          title: "Supprimé !",
          text: res.data.message || "Produit supprimé avec succès",
          timer: 1500,
          showConfirmButton: false,
        });

      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: res.data.message || "Une erreur est survenue",
        });
      }
    } 
    catch (error: any) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text:
          error?.response?.data?.message ||
          "Erreur serveur",
      });
    }

  };

  return (
    <>
      <div className="container">
        {/* HEADER */}
          <span className="back" onClick={() => navigate(-1)}>
            ←
          </span>
        <div className="header">
          <div>
            <h2>Produits</h2>
            <p>Gestion des produits</p>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="loader"></div>
        ) : data.length === 0 ? (
          <div className="empty">
            📦
            <p>Aucun produit disponible</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((p) => (
                  <tr key={p.uid}>
                    <td className="truncate">{p.nom}</td>
                    <td className="price">{p.prix_vente} FCFA</td>
                    <td>
                      <span
                        className={`stock ${
                          p.stock_disponible < 5 ? "low" : ""
                        }`}
                      >
                        {p.stock_disponible}
                      </span>
                    </td>
                    <td className="actions">
                      <button onClick={() => navigate(`/teller/readsingle/${p.uid}`)}>👁️</button>
                      <button
                        className="delete"
                        onClick={() => deleteProduct(p.uid)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer autoClose={2500} />

      {/* STYLE */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .container {
          max-width: 1200px;
          margin: auto;
          padding: 15px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .back {
          font-size: 22px;
          cursor: pointer;
        }

        /* LOADER */
        .loader {
          border: 4px solid #eee;
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 60px auto;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .empty {
          text-align: center;
          color: #777;
          margin-top: 50px;
        }

        /* TABLE */
        .table-wrapper {
          width: 100%;
          overflow-x: auto; /* 🔥 empêche débordement */
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        table {
          width: 100%;
          min-width: 600px; /* 🔥 évite casse layout */
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          text-align: left;
        }

        th {
          background: #f7f7f7;
        }

        tr {
          border-bottom: 1px solid #eee;
        }

        tr:hover {
          background: #fafafa;
        }

        .truncate {
          max-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .price {
          color: green;
          font-weight: bold;
        }

        .stock {
          padding: 4px 8px;
          border-radius: 6px;
          background: #e6f9ed;
          color: green;
        }

        .stock.low {
          background: #ffe5e5;
          color: red;
        }

        .actions button {
          margin-right: 5px;
          padding: 6px 8px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: #eee;
        }

        .actions button:hover {
          background: #ddd;
        }

        .delete {
          background: #ff0000 !important;
          color: white;
        }

        .delete:hover {
          background: #cc0000 !important;
        }
      `}</style>
    </>
  );
};

export default ReadAllProducts;