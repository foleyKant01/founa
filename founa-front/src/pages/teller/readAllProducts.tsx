import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DeleteProduitByTeller,
  GetAllProduits,
  ImporterProduit,
} from "../../services/product.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import {
  ArrowLeft,
  Eye,
  Package,
  PackagePlus,
  Search,
  Trash2,
  RefreshCw,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

interface Product {
  nom: string;
  description: string;
  prix_vente: number;
  uid: string;
  stock_disponible: number;
  images: string[] | string;
  type?: string;
}

const ReadAllProducts = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // =========================================================
  // RECUPERATION DES PRODUITS
  // =========================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await GetAllProduits();

      if (response.data.status === "success") {
        setData(response.data.produits || []);
      } else {
        toast.error(
          response.data.message || "Erreur lors du chargement des produits"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // IMAGE
  // =========================================================

  const getFirstImage = (images: string[] | string) => {
    if (!images) {
      return "";
    }

    try {
      if (Array.isArray(images)) {
        return images[0] || "";
      }

      if (typeof images === "string") {
        const parsed = JSON.parse(images);

        if (Array.isArray(parsed)) {
          return parsed[0] || "";
        }

        return images;
      }

      return "";
    } catch {
      return typeof images === "string" ? images : "";
    }
  };

  // =========================================================
  // IMPORTATION
  // =========================================================

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
            <div style="text-align:left;line-height:1.8">
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
      console.error("Erreur importation :", error);

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

  // =========================================================
  // SUPPRESSION
  // =========================================================

  const deleteProduct = async (uid: string) => {
    const result = await Swal.fire({
      title: "Supprimer le produit ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
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
          prev.filter((product) => product.uid !== uid)
        );

        Swal.fire({
          icon: "success",
          title: "Produit supprimé",
          text:
            res.data.message ||
            "Produit supprimé avec succès.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text:
            res.data.message ||
            "Une erreur est survenue.",
        });
      }
    } catch (error: any) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text:
          error?.response?.data?.message ||
          "Erreur serveur.",
      });
    }
  };

  // =========================================================
  // RECHERCHE
  // =========================================================

  const filteredProducts = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return data;
    }

    return data.filter((product) => {
      return (
        product.nom?.toLowerCase().includes(search) ||
        product.uid?.toLowerCase().includes(search)
      );
    });
  }, [data, searchText]);

  // =========================================================
  // STATISTIQUES
  // =========================================================

  const totalProduits = data.length;

  const produitsEnStock = data.filter(
    (product) => product.stock_disponible > 0
  ).length;

  const produitsRupture = data.filter(
    (product) => product.stock_disponible === 0
  ).length;

  const produitsStockFaible = data.filter(
    (product) =>
      product.stock_disponible > 0 &&
      product.stock_disponible < 5
  ).length;

  // =========================================================
  // LOADER PLEIN ECRAN
  // =========================================================

  if (loading) {
    return (
      <>
        <div className="full-screen-loader">
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

          .full-screen-loader {
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
            width: 50px;
            height: 50px;
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
      <div className="page">

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
              <Package size={24} />
            </div>

            <div>
              <h1>Produits</h1>

              <p>
                Gestion et suivi de votre catalogue
              </p>
            </div>

          </div>

          <button
            className="import-button"
            onClick={importerProduits}
          >
            <PackagePlus size={18} />
            <span>Importer un produit</span>
          </button>

        </header>

        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <main className="main-content">

          {/* ================================================= */}
          {/* TITLE */}
          {/* ================================================= */}

          <section className="intro-section">

            <div>
              <h2>Catalogue produits</h2>

              <p>
                Consultez, recherchez et gérez les produits
                disponibles dans votre boutique.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={fetchProducts}
              title="Actualiser"
            >
              <RefreshCw size={18} />
              <span>Actualiser</span>
            </button>

          </section>

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <section className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon total">
                <Boxes size={22} />
              </div>

              <div className="stat-content">
                <span>Total produits</span>
                <strong>{totalProduits}</strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon available">
                <CheckCircle2 size={22} />
              </div>

              <div className="stat-content">
                <span>En stock</span>
                <strong>{produitsEnStock}</strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon warning">
                <AlertTriangle size={22} />
              </div>

              <div className="stat-content">
                <span>Stock faible</span>
                <strong>{produitsStockFaible}</strong>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon danger">
                <Package size={22} />
              </div>

              <div className="stat-content">
                <span>Rupture</span>
                <strong>{produitsRupture}</strong>
              </div>

            </div>

          </section>

          {/* ================================================= */}
          {/* SEARCH */}
          {/* ================================================= */}

          <section className="toolbar">

            <div className="search-box">

              <Search
                size={20}
                className="search-icon"
              />

              <input
                type="text"
                placeholder="Rechercher un produit ou un UID..."
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />

              {searchText && (
                <button
                  className="clear-button"
                  onClick={() => setSearchText("")}
                  title="Effacer"
                >
                  <X size={17} />
                </button>
              )}

            </div>

            <div className="result-count">

              <span>
                {filteredProducts.length}
              </span>

              produit
              {filteredProducts.length > 1 ? "s" : ""}

            </div>

          </section>

          {/* ================================================= */}
          {/* CONTENT */}
          {/* ================================================= */}

          {data.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                <Package size={40} />
              </div>

              <h3>Aucun produit disponible</h3>

              <p>
                Votre catalogue ne contient actuellement
                aucun produit.
              </p>

              <button
                className="empty-action"
                onClick={importerProduits}
              >
                <PackagePlus size={18} />
                Importer des produits
              </button>

            </div>

          ) : filteredProducts.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                <Search size={40} />
              </div>

              <h3>Aucun résultat</h3>

              <p>
                Aucun produit ne correspond à votre recherche.
              </p>

              <button
                className="empty-action secondary"
                onClick={() => setSearchText("")}
              >
                Effacer la recherche
              </button>

            </div>

          ) : (

            <section className="products-card">

              <div className="table-container">

                <table>

                  <thead>

                    <tr>
                      <th>Produit</th>
                      <th>UID</th>
                      <th>Prix de vente</th>
                      <th>Stock</th>
                      <th>Statut</th>
                      <th className="action-header">
                        Actions
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredProducts.map((product) => {

                      const image =
                        getFirstImage(product.images);

                      const stock =
                        product.stock_disponible;

                      const isOutOfStock =
                        stock === 0;

                      const isLowStock =
                        stock > 0 && stock < 5;

                      return (

                        <tr key={product.uid}>

                          {/* PRODUIT */}

                          <td>

                            <div className="product-cell">

                              <div className="product-image">

                                {image ? (

                                  <img
                                    src={image}
                                    alt={product.nom}
                                  />

                                ) : (

                                  <Package size={22} />

                                )}

                              </div>

                              <div className="product-info">

                                <strong>
                                  {product.nom}
                                </strong>

                                {product.type && (
                                  <span>
                                    {product.type}
                                  </span>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* UID */}

                          <td>

                            <span className="uid">
                              {product.uid}
                            </span>

                          </td>

                          {/* PRIX */}

                          <td>

                            <span className="price">
                              {Number(
                                product.prix_vente || 0
                              ).toLocaleString("fr-FR")}{" "}
                              FCFA
                            </span>

                          </td>

                          {/* STOCK */}

                          <td>

                            <span
                              className={`stock ${
                                isOutOfStock
                                  ? "out"
                                  : isLowStock
                                  ? "low"
                                  : "good"
                              }`}
                            >
                              {stock}
                            </span>

                          </td>

                          {/* STATUT */}

                          <td>

                            {isOutOfStock ? (

                              <span className="status danger-status">
                                <span className="status-dot"></span>
                                Rupture

                              </span>

                            ) : isLowStock ? (

                              <span className="status warning-status">
                                <span className="status-dot"></span>
                                Stock faible
                              </span>

                            ) : (

                              <span className="status success-status">
                                <span className="status-dot"></span>
                                Disponible
                              </span>

                            )}

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="actions">

                              <button
                                className="view-button"
                                onClick={() =>
                                  navigate(
                                    `/teller/readsingle/${product.uid}`
                                  )
                                }
                                title="Voir le produit"
                              >
                                <Eye size={17} />
                              </button>

                              <button
                                className="delete-button"
                                onClick={() =>
                                  deleteProduct(product.uid)
                                }
                                title="Supprimer"
                              >
                                <Trash2 size={17} />
                              </button>

                            </div>

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

      <ToastContainer
        position="top-right"
        autoClose={2500}
      />

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
          background: #f5f7f8;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          color: #172033;
        }

        button,
        input {
          font-family: inherit;
        }

        /* ================================================= */
        /* PAGE */
        /* ================================================= */

        .page {
          width: 100%;
          min-height: 100vh;
          background: #f5f7f8;
        }

        /* ================================================= */
        /* HEADER */
        /* ================================================= */

        .top-header {
          width: 100%;
          min-height: 82px;
          padding: 18px 32px;
          background: #ffffff;
          border-bottom: 1px solid #e8ecef;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .back-button {
          width: 40px;
          height: 40px;
          border: 1px solid #e2e6e8;
          background: #ffffff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #374151;
          transition: 0.2s ease;
          flex-shrink: 0;
        }

        .back-button:hover {
          border-color: #00A4A6;
          color: #00A4A6;
          background: #f0ffff;
        }

        .header-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(0, 164, 166, 0.1);
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .top-header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 750;
          color: #111827;
        }

        .top-header p {
          margin: 4px 0 0;
          font-size: 13px;
          color: #7b8491;
        }

        .import-button {
          height: 44px;
          border: none;
          border-radius: 10px;
          padding: 0 18px;
          background: #00A4A6;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 164, 166, 0.18);
        }

        .import-button:hover {
          background: #008f91;
          transform: translateY(-1px);
        }

        /* ================================================= */
        /* MAIN */
        /* ================================================= */

        .main-content {
          width: 100%;
          max-width: 1550px;
          margin: 0 auto;
          padding: 30px 32px 60px;
        }

        .intro-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .intro-section h2 {
          margin: 0;
          font-size: 25px;
          font-weight: 750;
          color: #111827;
        }

        .intro-section p {
          margin: 6px 0 0;
          color: #7b8491;
          font-size: 14px;
        }

        .refresh-button {
          height: 40px;
          border: 1px solid #dfe5e8;
          background: #ffffff;
          border-radius: 9px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #4b5563;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
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
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e8ecef;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          min-height: 105px;
          box-shadow: 0 3px 10px rgba(20, 30, 40, 0.025);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.total {
          background: #eefafa;
          color: #00A4A6;
        }

        .stat-icon.available {
          background: #edf9f1;
          color: #16a34a;
        }

        .stat-icon.warning {
          background: #fff8e8;
          color: #d97706;
        }

        .stat-icon.danger {
          background: #fff0f0;
          color: #dc2626;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .stat-content span {
          color: #7b8491;
          font-size: 13px;
        }

        .stat-content strong {
          color: #111827;
          font-size: 25px;
          line-height: 1;
        }

        /* ================================================= */
        /* TOOLBAR */
        /* ================================================= */

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 16px;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 600px;
        }

        .search-box input {
          width: 100%;
          height: 48px;
          border: 1px solid #dfe5e8;
          border-radius: 11px;
          background: #ffffff;
          outline: none;
          padding: 0 45px;
          font-size: 14px;
          color: #1f2937;
          transition: 0.2s ease;
        }

        .search-box input::placeholder {
          color: #9ca3af;
        }

        .search-box input:focus {
          border-color: #00A4A6;
          box-shadow: 0 0 0 3px rgba(0, 164, 166, 0.08);
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .clear-button {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 7px;
          background: #f0f2f3;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .clear-button:hover {
          color: #00A4A6;
          background: #e8fafa;
        }

        .result-count {
          color: #7b8491;
          font-size: 13px;
          white-space: nowrap;
        }

        .result-count span {
          color: #111827;
          font-weight: 700;
        }

        /* ================================================= */
        /* PRODUCTS CARD */
        /* ================================================= */

        .products-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e8ecef;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(20, 30, 40, 0.035);
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 950px;
          border-collapse: collapse;
        }

        thead {
          background: #f8fafb;
        }

        th {
          padding: 15px 18px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #737d89;
          border-bottom: 1px solid #e8ecef;
          white-space: nowrap;
        }

        td {
          padding: 15px 18px;
          border-bottom: 1px solid #eef1f3;
          vertical-align: middle;
          font-size: 14px;
        }

        tbody tr {
          transition: background 0.15s ease;
        }

        tbody tr:hover {
          background: #fbfdfd;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        /* ================================================= */
        /* PRODUCT */
        /* ================================================= */

        .product-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 260px;
        }

        .product-image {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          background: #f3f5f6;
          border: 1px solid #e6eaec;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a0a8b1;
          flex-shrink: 0;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .product-info strong {
          color: #1f2937;
          font-size: 14px;
          font-weight: 650;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-info span {
          font-size: 12px;
          color: #929aa4;
        }

        /* ================================================= */
        /* UID */
        /* ================================================= */

        .uid {
          display: inline-block;
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6b7280;
          font-family: monospace;
          font-size: 12px;
          background: #f5f6f7;
          padding: 5px 8px;
          border-radius: 6px;
        }

        /* ================================================= */
        /* PRICE */
        /* ================================================= */

        .price {
          color: #008b8d;
          font-weight: 700;
          white-space: nowrap;
        }

        /* ================================================= */
        /* STOCK */
        /* ================================================= */

        .stock {
          min-width: 42px;
          padding: 6px 9px;
          border-radius: 7px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
        }

        .stock.good {
          background: #ecfdf3;
          color: #15803d;
        }

        .stock.low {
          background: #fff7e6;
          color: #c26100;
        }

        .stock.out {
          background: #fff0f0;
          color: #dc2626;
        }

        /* ================================================= */
        /* STATUS */
        /* ================================================= */

        .status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 650;
          white-space: nowrap;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .success-status {
          color: #15803d;
        }

        .success-status .status-dot {
          background: #22c55e;
        }

        .warning-status {
          color: #c26100;
        }

        .warning-status .status-dot {
          background: #f59e0b;
        }

        .danger-status {
          color: #dc2626;
        }

        .danger-status .status-dot {
          background: #ef4444;
        }

        /* ================================================= */
        /* ACTIONS */
        /* ================================================= */

        .action-header {
          text-align: right;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 7px;
        }

        .actions button {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .view-button {
          border: 1px solid #dce8e8;
          background: #f2fbfb;
          color: #008b8d;
        }

        .view-button:hover {
          background: #00A4A6;
          color: #ffffff;
          border-color: #00A4A6;
        }

        .delete-button {
          border: 1px solid #f5d4d4;
          background: #fff6f6;
          color: #dc2626;
        }

        .delete-button:hover {
          background: #dc2626;
          color: #ffffff;
          border-color: #dc2626;
        }

        /* ================================================= */
        /* EMPTY */
        /* ================================================= */

        .empty-state {
          width: 100%;
          min-height: 390px;
          background: #ffffff;
          border: 1px solid #e8ecef;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          width: 76px;
          height: 76px;
          border-radius: 20px;
          background: #eefafa;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .empty-state h3 {
          margin: 0;
          color: #1f2937;
          font-size: 18px;
        }

        .empty-state p {
          margin: 8px 0 20px;
          color: #8a939d;
          font-size: 14px;
        }

        .empty-action {
          height: 42px;
          border: none;
          border-radius: 9px;
          padding: 0 16px;
          background: #00A4A6;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
        }

        .empty-action.secondary {
          background: #f0f2f3;
          color: #4b5563;
        }

        /* ================================================= */
        /* RESPONSIVE */
        /* ================================================= */

        @media (max-width: 1200px) {

          .main-content {
            padding: 26px 24px 50px;
          }

          .top-header {
            padding: 16px 24px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }

        @media (max-width: 768px) {

          .top-header {
            min-height: auto;
            padding: 15px;
          }

          .header-icon {
            width: 40px;
            height: 40px;
          }

          .top-header h1 {
            font-size: 19px;
          }

          .top-header p {
            display: none;
          }

          .import-button {
            width: 42px;
            height: 42px;
            padding: 0;
            border-radius: 10px;
          }

          .import-button span {
            display: none;
          }

          .main-content {
            padding: 20px 15px 45px;
          }

          .intro-section {
            align-items: flex-start;
          }

          .intro-section h2 {
            font-size: 21px;
          }

          .intro-section p {
            font-size: 13px;
            line-height: 1.5;
          }

          .refresh-button span {
            display: none;
          }

          .refresh-button {
            width: 40px;
            padding: 0;
            justify-content: center;
            flex-shrink: 0;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .stat-card {
            padding: 14px;
            min-height: 90px;
            gap: 10px;
          }

          .stat-icon {
            width: 40px;
            height: 40px;
          }

          .stat-content strong {
            font-size: 21px;
          }

          .stat-content span {
            font-size: 11px;
          }

          .toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .search-box {
            max-width: none;
          }

          .result-count {
            text-align: right;
          }

        }

        @media (max-width: 480px) {

          .header-left {
            gap: 9px;
          }

          .back-button {
            width: 36px;
            height: 36px;
          }

          .header-icon {
            width: 38px;
            height: 38px;
          }

          .top-header h1 {
            font-size: 17px;
          }

          .main-content {
            padding: 18px 12px 40px;
          }

          .intro-section {
            gap: 10px;
          }

          .intro-section h2 {
            font-size: 19px;
          }

          .intro-section p {
            max-width: 240px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stat-card {
            min-height: 82px;
            padding: 12px;
          }

          .stat-icon {
            width: 34px;
            height: 34px;
          }

          .stat-icon svg {
            width: 17px;
            height: 17px;
          }

          .stat-content strong {
            font-size: 19px;
          }

          .stat-content span {
            font-size: 10px;
          }

          .search-box input {
            height: 44px;
            font-size: 13px;
          }

          .empty-state {
            min-height: 330px;
          }

        }

      `}</style>
    </>
  );
};

export default ReadAllProducts;