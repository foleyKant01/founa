import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {DeleteProduitByTeller,GetAllProduits,ImporterProduit} from "../../services/product.service";
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

const ReadAllProductsAdmin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await GetAllProduits();
      if (response.data.status === "success") {
        setData(response.data.produits || []);

        toast.success("Produits chargés ✅");
      } else {
        toast.error(
          response.data.message || "Erreur chargement"
        );
      }

    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur");

    } finally {
      setLoading(false);
    }
  };

  const importerProduits = async () => {
    const result = await Swal.fire({
      title: "Importer les produits ?",
      text: "Les produits présents dans produits.json seront importés.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00A4A6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, importer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);
      const response = await ImporterProduit();
      if (response.data.status === "success") {
        const {
          produits_crees = [],
          produits_ignores = [],
          erreurs = [],
        } = response.data;
        await Swal.fire({
          icon: "success",
          title: "Importation terminée",
          html: `
            <div style="text-align:left">
              <p>
                <strong>${produits_crees.length}</strong>
                produit(s) créé(s)
              </p>
              <p>
                <strong>${produits_ignores.length}</strong>
                produit(s) ignoré(s)
              </p>
              <p>
                <strong>${erreurs.length}</strong>
                erreur(s)
              </p>
            </div>
          `,
          confirmButtonColor: "#00A4A6",
        });
        await fetchProducts();

      } else {
        await Swal.fire({
          icon: "error",
          title: "Erreur d'importation",
          text:
            response.data.message ||
            "Une erreur est survenue pendant l'importation.",
        });
      }
    } catch (error: any) {
      console.error(
        "Erreur importation :",
        error
      );
      await Swal.fire({
        icon: "error",
        title: "Erreur serveur",
        text:
          error?.response?.data?.message ||
          "Impossible d'importer les produits.",
      });
    } finally {
      setLoading(false);
    }
  };
  const filteredProducts = data.filter((product) => {
    const search = searchText
      .trim()
      .toLowerCase();
    if (!search) {
      return true;
    }
    return (
      product.nom
        .toLowerCase()
        .includes(search) ||
      product.uid
        .toLowerCase()
        .includes(search)
    );
  });
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
    if (!result.isConfirmed) {
      return;
    }
    try {
      const teller = JSON.parse(
        localStorage.getItem("teller") || "{}"
      );
      const res = await DeleteProduitByTeller({
        produit_id: uid,
        teller_id: teller.uid,
      });

      if (res.data.status === "success") {

        setData((prev) =>
          prev.filter(
            (p) => p.uid !== uid
          )
        );

        Swal.fire({
          icon: "success",
          title: "Supprimé !",
          text:
            res.data.message ||
            "Produit supprimé avec succès",
          timer: 1500,
          showConfirmButton: false,
        });

      } else {

        Swal.fire({
          icon: "error",
          title: "Erreur",
          text:
            res.data.message ||
            "Une erreur est survenue",
        });
      }

    } catch (error: any) {

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

  // =========================================================
  // RENDER
  // =========================================================


  return (
    <>
      <div className="container">
        {/* HEADER */}
        <div className="header">
          <span className="back" onClick={() => navigate(-1)}>
            ←
          </span>

          <div className="header-content">
            <div>
              <h2>Produits</h2>
              <p>Gestion des produits</p>
            </div>

            <div className="header-actions">
            <button
              className="create-order-button"
              onClick={() => navigate("/admin/createproduct")}
            >
              ➕ Créer produit
            </button>

            <button
              className="import-button"
              onClick={importerProduits}
            >
              📥 Importer produit
            </button>
          </div>
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
                      {p.prix_vente} FCF
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
                          navigate(`/admin/readsingleproduct/${p.uid}`)
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
    background: #f5f7f9;
  }

  /* =========================
     CONTAINER PRINCIPAL
  ========================= */

  .container {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 20px 30px 40px;
  }


  /* =========================
     HEADER
  ========================= */

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
  }

  .header-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
  }

  .header-content h2 {
    margin: 0;
    font-size: 25px;
    font-weight: 700;
    color: #1f2937;
  }

  .header-content p {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 14px;
  }


  /* =========================
     BOUTON RETOUR
  ========================= */

  .back {
    width: 42px;
    height: 42px;
    min-width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;

    font-size: 22px;
    color: #374151;

    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back:hover {
    background: #00A4A6;
    color: white;
    border-color: #00A4A6;
    transform: translateX(-2px);
  }


  /* =========================
     ACTIONS HEADER
  ========================= */

  .header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
    margin-left: auto;
    flex-shrink: 0;
  }

  .create-order-button,
  .import-button {
    height: 42px;
    border: none;
    border-radius: 9px;

    padding: 0 17px;

    font-size: 14px;
    font-weight: 600;

    cursor: pointer;
    white-space: nowrap;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    transition: all 0.2s ease;
  }


  /* CREER PRODUIT */

  .create-order-button {
    background: #1f2937;
    color: white;
  }

  .create-order-button:hover {
    background: #111827;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.12);
  }


  /* IMPORTER */

  .import-button {
    background: #00A4A6;
    color: white;
  }

  .import-button:hover {
    background: #008b8d;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0,164,166,0.2);
  }

  .create-order-button:active,
  .import-button:active {
    transform: translateY(0);
  }


  /* =========================
     RECHERCHE
  ========================= */

  .search-container {
    position: relative;
    width: 100%;
    margin: 0 0 20px;
  }

  .search-input {
    width: 100%;
    height: 48px;

    padding: 0 48px 0 17px;

    border: 1px solid #e1e5e9;
    border-radius: 10px;

    outline: none;

    font-size: 14px;
    color: #374151;

    background: white;

    transition: all 0.2s ease;
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  .search-input:focus {
    border-color: #00A4A6;
    box-shadow: 0 0 0 3px rgba(0,164,166,0.10);
  }

  .clear-search {
    position: absolute;

    right: 13px;
    top: 50%;

    transform: translateY(-50%);

    width: 30px;
    height: 30px;

    border: none;
    border-radius: 50%;

    background: #f3f4f6;
    color: #6b7280;

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: 0.2s;
  }

  .clear-search:hover {
    background: #e5e7eb;
    color: #00A4A6;
  }


  /* =========================
     TABLEAU
  ========================= */

  .table-wrapper {
    width: 100%;
    overflow-x: auto;

    background: white;

    border: 1px solid #e5e7eb;
    border-radius: 12px;

    box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  }

  table {
    width: 100%;
    min-width: 700px;

    border-collapse: collapse;
  }

  thead {
    background: #f8fafc;
  }

  th {
    padding: 15px 16px;

    text-align: left;

    color: #6b7280;

    font-size: 12px;
    font-weight: 700;

    text-transform: uppercase;

    border-bottom: 1px solid #e5e7eb;

    white-space: nowrap;
  }

  td {
    padding: 15px 16px;

    color: #374151;

    font-size: 14px;

    border-bottom: 1px solid #f0f1f2;

    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }


  /* =========================
     UID
  ========================= */

  .uid {
    max-width: 220px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    color: #9ca3af;

    font-family: monospace;
    font-size: 12px;
  }


  /* =========================
     NOM PRODUIT
  ========================= */

  .truncate {
    max-width: 350px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-weight: 600;
    color: #1f2937;
  }


  /* =========================
     PRIX
  ========================= */

  .price {
    color: #008b8d;
    font-weight: 700;
    white-space: nowrap;
  }


  /* =========================
     STOCK
  ========================= */

  .stock {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 40px;

    padding: 5px 10px;

    border-radius: 20px;

    background: #e6f9ed;
    color: #15803d;

    font-size: 12px;
    font-weight: 700;
  }

  .stock.low {
    background: #fee2e2;
    color: #dc2626;
  }


  /* =========================
     ACTIONS
  ========================= */

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .actions button {
    width: 36px;
    height: 36px;

    margin: 0;

    border: 1px solid #e5e7eb;
    border-radius: 8px;

    cursor: pointer;

    background: #f8fafc;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 15px;

    transition: all 0.2s ease;
  }

  .actions button:first-child:hover {
    background: #e8f8f8;
    border-color: #00A4A6;
    transform: translateY(-1px);
  }

  .actions .delete {
    background: #fff1f2 !important;
    border-color: #fecdd3;
    color: #dc2626;
  }

  .actions .delete:hover {
    background: #dc2626 !important;
    border-color: #dc2626;
    color: white;
    transform: translateY(-1px);
  }


  /* =========================
     LOADER
  ========================= */

  .loader {
    width: 45px;
    height: 45px;

    border: 4px solid #e5e7eb;
    border-top-color: #00A4A6;

    border-radius: 50%;

    animation: spin 0.8s linear infinite;

    margin: 100px auto;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }


  /* =========================
     EMPTY
  ========================= */

  .empty {
    width: 100%;

    min-height: 300px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    text-align: center;

    color: #9ca3af;

    background: white;

    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }

  .empty p {
    margin: 10px 0 4px;

    color: #4b5563;

    font-size: 16px;
    font-weight: 600;
  }

  .empty small {
    color: #9ca3af;
  }


  /* =========================
     TABLET
  ========================= */

  @media (max-width: 800px) {

    .container {
      padding: 15px;
    }

    .header-content {
      gap: 15px;
    }

    .header-content h2 {
      font-size: 21px;
    }

    .header-actions {
      gap: 8px;
    }

    .create-order-button,
    .import-button {
      padding: 0 12px;
      font-size: 13px;
    }

  }


  /* =========================
     MOBILE
  ========================= */

  @media (max-width: 600px) {

    .container {
      padding: 12px;
    }

    .header {
      align-items: flex-start;
      gap: 10px;
    }

    .header-content {
      align-items: flex-start;
      flex-direction: column;
      gap: 12px;
    }

    .header-content h2 {
      font-size: 20px;
    }

    .header-actions {
      width: 100%;
      margin-left: 0;

      display: grid;
      grid-template-columns: 1fr 1fr;

      gap: 8px;
    }

    .create-order-button,
    .import-button {
      width: 100%;
      height: 40px;
      padding: 0 8px;
      font-size: 12px;
    }

    .search-container {
      margin-top: 5px;
    }

    .search-input {
      height: 44px;
    }

    .table-wrapper {
      border-radius: 10px;
    }

    table {
      min-width: 650px;
    }

    th,
    td {
      padding: 12px;
    }

    .uid {
      max-width: 150px;
    }

    .truncate {
      max-width: 220px;
    }

  }


  /* =========================
     PETIT MOBILE
  ========================= */

  @media (max-width: 400px) {

    .header-actions {
      grid-template-columns: 1fr 1fr;
    }

    .create-order-button,
    .import-button {
      font-size: 0;
    }

    .create-order-button::before {
      content: "➕";
      font-size: 18px;
    }

    .import-button::before {
      content: "📥";
      font-size: 18px;
    }

  }
`}</style>
    </>
  );
};

export default ReadAllProductsAdmin;