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
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = data.filter((product) => {
    const search = searchText.trim().toLowerCase();

    if (!search) return true;

    return (
      product.nom.toLowerCase().includes(search) ||
      product.uid.toLowerCase().includes(search)
    );
  });

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const teller = JSON.parse(localStorage.getItem("teller") || "{}");
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

  // const viewSingleProduct = (uid: string) => {
  //   navigate(`/admin/product/${uid}`);
  // };

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
      const teller = JSON.parse(localStorage.getItem("teller") || "{}");

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

        {/* SEARCH */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom ou UID..."
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

        {/* CONTENT */}
        {loading ? (
          <div className="loader"></div>
        ) : data.length === 0 ? (
          <div className="empty">
            📦
            <p>Aucun produit disponible</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty">
            🔍
            <p>Aucun produit trouvé</p>
            <small>
              Aucun produit ne correspond à "{searchText}"
            </small>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.uid}>
                    <td className="uid">{p.uid}</td>

                    <td className="truncate">
                      {p.nom}
                    </td>

                    <td className="price">
                      {p.prix_vente} FCFA
                    </td>

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
                      <button
                        onClick={() =>
                          navigate(`/teller/readsingle/${p.uid}`)
                        }
                      >
                        👁️
                      </button>

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

        .uid {
          max-width: 200px;
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
        .search-container {
          position: relative;
          width: 100%;
          margin: 20px 0;
        }

        .search-input {
          width: 100%;
          height: 45px;
          padding: 0 45px 0 16px;
          border: 1px solid #ddd;
          border-radius: 12px;
          outline: none;
          font-size: 14px;
          background: #fff;
          box-sizing: border-box;
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
          cursor: pointer;
          font-size: 16px;
        }

        .clear-search:hover {
          color: #00A4A6;
        }
      `}</style>
    </>
  );
};

export default ReadAllProducts;