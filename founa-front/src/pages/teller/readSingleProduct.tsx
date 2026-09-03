import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Package,
  Pencil,
  Trash2,
  Boxes,
  ShoppingCart,
  CalendarDays,
  RefreshCw,
  Tag,
} from "lucide-react";
import { DeleteProduitByTeller, GetSingleProduit } from "../../services/product.service";
import Swal from "sweetalert2";

interface Product {
  uid: string;
  nom: string;
  description: string;
  lien_1: string;
  lien_2: string;
  prix_fournisseur: number;
  prix_vente: string;
  images: string[];
  stock_disponible: string;
  moq?: string;
  status?: string;
  teller_id?: string;
  fournisseur_id?: string;
  creation_date: string;
  update_date: string;
}

const ReadSingleProduct = () => {
  const navigate = useNavigate();
  const { uid } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (uid) {
      fetchProduct(uid);
    }
  }, [uid]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);

      const res = await GetSingleProduit({
        produit_id: id,
      });

      console.log("API RESPONSE 👉", res.data);

      if (res.data.status === "success" && res.data.produit) {
        const prod = res.data.produit;

        let imagesArray: string[] = [];

        if (Array.isArray(prod.images)) {
          imagesArray = prod.images;
        } else if (typeof prod.images === "string") {
          try {
            const parsed = JSON.parse(prod.images);

            if (Array.isArray(parsed)) {
              imagesArray = parsed;
            }
          } catch {
            imagesArray = [];
          }
        }

        const productData: Product = {
          ...prod,
          images: imagesArray,
        };

        setProduct(productData);
        setMainImage(imagesArray[0] || "");
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error("Erreur serveur", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productUid: string) => {
    const result = await Swal.fire({
      title: "Supprimer le produit ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      setDeleting(true);

      const teller = JSON.parse(
        localStorage.getItem("teller") || "{}"
      );

      const res = await DeleteProduitByTeller({
        produit_id: productUid,
        teller_id: teller.uid,
      });

      if (res.data.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Produit supprimé",
          text:
            res.data.message ||
            "Le produit a été supprimé avec succès.",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/teller/readall");
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
    } finally {
      setDeleting(false);
    }
  };

  const editProduct = () => {
    if (!product?.uid) return;

    navigate(`/teller/edit/${product.uid}`);
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number | string) => {
    const value = Number(price) || 0;

    return value.toLocaleString("fr-FR");
  };

  const getStockClass = () => {
    const stock = Number(product?.stock_disponible || 0);

    if (stock === 0) return "stock-danger";
    if (stock < 5) return "stock-warning";

    return "stock-success";
  };

  const getStockLabel = () => {
    const stock = Number(product?.stock_disponible || 0);

    if (stock === 0) return "Rupture de stock";
    if (stock < 5) return "Stock faible";

    return "Disponible";
  };

  /* =========================================================
     LOADER PLEIN ÉCRAN
  ========================================================= */

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <div className="fullscreen-empty">
          <div className="empty-icon">
            <Package size={42} />
          </div>

          <h2>Produit introuvable</h2>

          <p>
            Le produit demandé n'existe pas ou n'est plus disponible.
          </p>

          <button
            className="back-list-button"
            onClick={() => navigate("/teller/readall")}
          >
            <ArrowLeft size={18} />
            Retour aux produits
          </button>
        </div>

        <style>{`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
          }

          .fullscreen-empty {
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #F5F7F8;
            padding: 30px;
            text-align: center;
            font-family: Arial, sans-serif;
          }

          .empty-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #E8F7F7;
            color: #00A4A6;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .fullscreen-empty h2 {
            margin: 0 0 8px;
            color: #111827;
          }

          .fullscreen-empty p {
            color: #6B7280;
            margin-bottom: 24px;
          }

          .back-list-button {
            display: flex;
            align-items: center;
            gap: 8px;
            border: none;
            background: #00A4A6;
            color: white;
            padding: 12px 18px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
          }
        `}</style>
      </>
    );
  }

  const stock = Number(product.stock_disponible || 0);

  return (
    <div className="product-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="page-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={() => navigate(-1)}
            title="Retour"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="breadcrumb">
              Teller
              <span>/</span>
              Produits
              <span>/</span>
              Détails
            </div>

            <h1>Détails du produit</h1>
          </div>

        </div>

        <div className="header-actions">

          <button
            className="refresh-button"
            onClick={() => uid && fetchProduct(uid)}
            disabled={loading}
          >
            <RefreshCw size={17} />
            <span>Actualiser</span>
          </button>

          <button
            className="edit-button"
            onClick={editProduct}
          >
            <Pencil size={17} />
            Modifier
          </button>

          <button
            className="delete-button"
            onClick={() => deleteProduct(product.uid)}
            disabled={deleting}
          >
            <Trash2 size={17} />
            {deleting ? "Suppression..." : "Supprimer"}
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main-content">

        {/* ===================================================
            PRODUCT TITLE
        =================================================== */}

        <section className="product-heading">

          <div>

            <div className="product-status-row">

              <span className={`stock-badge ${getStockClass()}`}>
                <span className="status-dot"></span>
                {getStockLabel()}
              </span>

              {product.status && (
                <span className="type-badge">
                  {product.status}
                </span>
              )}

            </div>

            <h2>{product.nom}</h2>

            <p className="product-uid">
              UID : <strong>{product.uid}</strong>
            </p>

          </div>

          <div className="heading-price">

            <span>Prix de vente</span>

            <strong>
              {formatPrice(product.prix_vente)} FCFA
            </strong>

          </div>

        </section>

        {/* ===================================================
            QUICK STATS
        =================================================== */}

        <section className="quick-stats">

          <div className="stat-card">

            <div className="stat-icon stock-icon">
              <Boxes size={21} />
            </div>

            <div>
              <span>Stock disponible</span>
              <strong>{stock}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon price-icon">
              <Tag size={21} />
            </div>

            <div>
              <span>Prix fournisseur</span>
              <strong>
                {formatPrice(product.prix_fournisseur)} FCFA
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon moq-icon">
              <ShoppingCart size={21} />
            </div>

            <div>
              <span>MOQ</span>
              <strong>
                {product.moq || "0"}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon update-icon">
              <RefreshCw size={21} />
            </div>

            <div>
              <span>Dernière modification</span>
              <strong className="date-value">
                {formatDate(product.update_date)}
              </strong>
            </div>

          </div>

        </section>

        {/* ===================================================
            CONTENT GRID
        =================================================== */}

        <section className="content-grid">

          {/* =================================================
              LEFT : GALLERY
          ================================================= */}

          <div className="gallery-card">

            <div className="card-header">

              <div>
                <h3>Galerie du produit</h3>
                <p>
                  {product.images?.length || 0} image(s)
                </p>
              </div>

            </div>

            <div className="main-image-wrapper">

              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.nom}
                  className="main-image"
                />
              ) : (
                <div className="no-image">
                  <Package size={50} />
                  <span>Aucune image disponible</span>
                </div>
              )}

            </div>

            {product.images?.length > 0 && (
              <div className="thumbnail-list">

                {product.images.map((img, index) => (

                  <button
                    key={`${img}-${index}`}
                    className={`thumbnail ${
                      mainImage === img ? "active" : ""
                    }`}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`${product.nom} ${index + 1}`}
                    />
                  </button>

                ))}

              </div>
            )}

          </div>

          {/* =================================================
              RIGHT : INFORMATIONS
          ================================================= */}

          <div className="details-column">

            {/* DESCRIPTION */}

            <div className="info-card">

              <div className="card-header">

                <div>
                  <h3>Description</h3>
                  <p>Informations sur le produit</p>
                </div>

              </div>

              <div className="description">

                {product.description ? (
                  product.description
                ) : (
                  <span className="muted">
                    Aucune description disponible.
                  </span>
                )}

              </div>

            </div>

            {/* PRICING */}

            <div className="info-card">

              <div className="card-header">

                <div>
                  <h3>Informations commerciales</h3>
                  <p>Prix et conditions de vente</p>
                </div>

              </div>

              <div className="info-grid">

                <div className="info-item">
                  <span>Prix fournisseur</span>
                  <strong>
                    {formatPrice(product.prix_fournisseur)} FCFA
                  </strong>
                </div>

                <div className="info-item highlight">
                  <span>Prix de vente</span>
                  <strong>
                    {formatPrice(product.prix_vente)} FCFA
                  </strong>
                </div>

                <div className="info-item">
                  <span>Quantité minimale (MOQ)</span>
                  <strong>
                    {product.moq || "-"}
                  </strong>
                </div>

                <div className="info-item">
                  <span>Stock disponible</span>
                  <strong className={getStockClass()}>
                    {stock}
                  </strong>
                </div>

              </div>

            </div>

            {/* LINKS */}

            <div className="info-card">

              <div className="card-header">

                <div>
                  <h3>Sources du produit</h3>
                  <p>Liens fournisseurs</p>
                </div>

              </div>

              <div className="links-list">

                {product.lien_1 && (
                  <a
                    href={product.lien_1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    <div className="source-icon">
                      <ExternalLink size={18} />
                    </div>

                    <div className="source-content">
                      <strong>Source produit 1</strong>
                      <span>
                        Ouvrir le lien fournisseur
                      </span>
                    </div>

                    <ExternalLink size={17} />
                  </a>
                )}

                {product.lien_2 && (
                  <a
                    href={product.lien_2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    <div className="source-icon">
                      <ExternalLink size={18} />
                    </div>

                    <div className="source-content">
                      <strong>Source produit 2</strong>
                      <span>
                        Ouvrir le lien fournisseur
                      </span>
                    </div>

                    <ExternalLink size={17} />
                  </a>
                )}

                {!product.lien_1 && !product.lien_2 && (
                  <div className="no-link">
                    Aucun lien fournisseur disponible.
                  </div>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            HISTORIQUE
        =================================================== */}

        <section className="info-card history-card">

          <div className="card-header">

            <div>
              <h3>Historique du produit</h3>
              <p>
                Informations de création et de modification
              </p>
            </div>

          </div>

          <div className="timeline">

            <div className="timeline-item">

              <div className="timeline-icon">
                <CalendarDays size={18} />
              </div>

              <div className="timeline-content">

                <strong>Produit créé</strong>

                <span>
                  {formatDate(product.creation_date)}
                </span>

              </div>

            </div>

            <div className="timeline-line"></div>

            <div className="timeline-item">

              <div className="timeline-icon">
                <RefreshCw size={18} />
              </div>

              <div className="timeline-content">

                <strong>Dernière modification</strong>

                <span>
                  {formatDate(product.update_date)}
                </span>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          STYLE
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #F5F7F8;
        }

        button,
        input,
        textarea,
        select {
          font-family: inherit;
        }

        /* =========================================
           PAGE
        ========================================= */

        .product-page {
          min-height: 100vh;
          width: 100%;
          background: #F5F7F8;
          color: #111827;
        }

        /* =========================================
           HEADER
        ========================================= */

        .page-header {
          width: 100%;
          min-height: 82px;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E7EB;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .back-button {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .2s ease;
          flex-shrink: 0;
        }

        .back-button:hover {
          background: #F3F4F6;
          border-color: #D1D5DB;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #9CA3AF;
          margin-bottom: 5px;
        }

        .breadcrumb span {
          color: #D1D5DB;
        }

        .page-header h1 {
          margin: 0;
          font-size: 22px;
          color: #111827;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-actions button {
          height: 40px;
          padding: 0 14px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
        }

        .refresh-button {
          background: #FFFFFF;
          border: 1px solid #D1D5DB;
          color: #374151;
        }

        .refresh-button:hover {
          background: #F9FAFB;
        }

        .edit-button {
          background: #00A4A6;
          color: white;
          border: 1px solid #00A4A6;
        }

        .edit-button:hover {
          background: #008F91;
        }

        .delete-button {
          background: #FFFFFF;
          color: #DC2626;
          border: 1px solid #FECACA;
        }

        .delete-button:hover {
          background: #FEF2F2;
        }

        .delete-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* =========================================
           MAIN
        ========================================= */

        .main-content {
          width: 100%;
          max-width: 1550px;
          margin: 0 auto;
          padding: 28px 32px 60px;
        }

        /* =========================================
           PRODUCT HEADING
        ========================================= */

        .product-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 22px;
        }

        .product-heading h2 {
          margin: 10px 0 6px;
          font-size: 30px;
          line-height: 1.2;
          color: #111827;
        }

        .product-uid {
          margin: 0;
          color: #9CA3AF;
          font-size: 13px;
        }

        .product-uid strong {
          color: #6B7280;
          font-weight: 500;
        }

        .product-status-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stock-badge,
        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .stock-success {
          background: #ECFDF5;
          color: #15803D;
        }

        .stock-warning {
          background: #FFFBEB;
          color: #B45309;
        }

        .stock-danger {
          background: #FEF2F2;
          color: #DC2626;
        }

        .type-badge {
          background: #F0FDFA;
          color: #008B8D;
        }

        .heading-price {
          text-align: right;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 14px 20px;
          min-width: 190px;
          box-shadow: 0 2px 8px rgba(0,0,0,.03);
        }

        .heading-price span {
          display: block;
          color: #9CA3AF;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .heading-price strong {
          color: #00A4A6;
          font-size: 23px;
        }

        /* =========================================
           QUICK STATS
        ========================================= */

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 17px;
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,.025);
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stock-icon {
          background: #ECFDF5;
          color: #16A34A;
        }

        .price-icon {
          background: #F0FDFA;
          color: #00A4A6;
        }

        .moq-icon {
          background: #EFF6FF;
          color: #2563EB;
        }

        .update-icon {
          background: #FFF7ED;
          color: #EA580C;
        }

        .stat-card span {
          display: block;
          color: #9CA3AF;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .stat-card strong {
          display: block;
          color: #1F2937;
          font-size: 16px;
        }

        .stat-card .date-value {
          font-size: 13px;
          line-height: 1.35;
        }

        /* =========================================
           CONTENT
        ========================================= */

        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr);
          gap: 20px;
          align-items: start;
        }

        .gallery-card,
        .info-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,.025);
        }

        .gallery-card {
          padding: 20px;
        }

        .details-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card {
          padding: 20px;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 17px;
        }

        .card-header h3 {
          margin: 0 0 4px;
          color: #1F2937;
          font-size: 16px;
        }

        .card-header p {
          margin: 0;
          color: #9CA3AF;
          font-size: 12px;
        }

        /* =========================================
           GALLERY
        ========================================= */

        .main-image-wrapper {
          width: 100%;
          height: 500px;
          background: #F8FAFC;
          border: 1px solid #E5E7EB;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .no-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #9CA3AF;
        }

        .thumbnail-list {
          display: flex;
          gap: 10px;
          margin-top: 13px;
          overflow-x: auto;
          padding-bottom: 3px;
        }

        .thumbnail {
          width: 72px;
          height: 72px;
          border-radius: 9px;
          padding: 0;
          border: 2px solid transparent;
          background: #F9FAFB;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          transition: all .2s ease;
        }

        .thumbnail:hover {
          border-color: #99DADB;
        }

        .thumbnail.active {
          border-color: #00A4A6;
          box-shadow: 0 0 0 2px rgba(0,164,166,.1);
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* =========================================
           DESCRIPTION
        ========================================= */

        .description {
          color: #4B5563;
          line-height: 1.7;
          font-size: 14px;
          white-space: pre-wrap;
          min-height: 55px;
        }

        .muted {
          color: #9CA3AF;
        }

        /* =========================================
           INFO GRID
        ========================================= */

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .info-item {
          background: #F8FAFC;
          border: 1px solid #EEF2F7;
          border-radius: 10px;
          padding: 13px;
        }

        .info-item span {
          display: block;
          color: #9CA3AF;
          font-size: 11px;
          margin-bottom: 7px;
        }

        .info-item strong {
          display: block;
          color: #374151;
          font-size: 14px;
        }

        .info-item.highlight {
          background: #F0FDFA;
          border-color: #CCFBF1;
        }

        .info-item.highlight strong {
          color: #00A4A6;
        }

        /* =========================================
           LINKS
        ========================================= */

        .links-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .source-link {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: #374151;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 11px;
          transition: all .2s ease;
        }

        .source-link:hover {
          border-color: #8DD6D7;
          background: #F7FFFF;
        }

        .source-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #F0FDFA;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .source-content {
          flex: 1;
          min-width: 0;
        }

        .source-content strong {
          display: block;
          font-size: 13px;
          color: #374151;
          margin-bottom: 3px;
        }

        .source-content span {
          display: block;
          color: #9CA3AF;
          font-size: 11px;
        }

        .no-link {
          color: #9CA3AF;
          font-size: 13px;
          padding: 10px 0;
        }

        /* =========================================
           HISTORY
        ========================================= */

        .history-card {
          margin-top: 20px;
        }

        .timeline {
          display: flex;
          align-items: center;
          gap: 15px;
          max-width: 800px;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 230px;
        }

        .timeline-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #F0FDFA;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .timeline-content strong {
          display: block;
          color: #374151;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .timeline-content span {
          display: block;
          color: #9CA3AF;
          font-size: 11px;
        }

        .timeline-line {
          height: 1px;
          flex: 1;
          min-width: 40px;
          background: #D1D5DB;
        }

        /* =========================================
           FULL SCREEN LOADER
        ========================================= */

        .fullscreen-loader {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #E5E7EB;
          border-top-color: #00A4A6;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1100px) {

          .main-content {
            padding: 24px;
          }

          .page-header {
            padding: 15px 24px;
          }

          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .main-image-wrapper {
            height: 460px;
          }

        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 700px) {

          .page-header {
            padding: 14px 16px;
            min-height: auto;
            align-items: flex-start;
          }

          .header-left {
            gap: 10px;
          }

          .page-header h1 {
            font-size: 18px;
          }

          .breadcrumb {
            display: none;
          }

          .header-actions {
            gap: 6px;
          }

          .header-actions button {
            width: 40px;
            padding: 0;
          }

          .header-actions button span,
          .header-actions button:not(.edit-button):not(.delete-button) span {
            display: none;
          }

          .edit-button,
          .delete-button,
          .refresh-button {
            font-size: 0;
          }

          .main-content {
            padding: 18px 14px 40px;
          }

          .product-heading {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .product-heading h2 {
            font-size: 23px;
          }

          .heading-price {
            text-align: left;
            width: 100%;
          }

          .quick-stats {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .gallery-card,
          .info-card {
            padding: 15px;
            border-radius: 12px;
          }

          .main-image-wrapper {
            height: 330px;
          }

          .thumbnail {
            width: 62px;
            height: 62px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .timeline {
            flex-direction: column;
            align-items: flex-start;
          }

          .timeline-line {
            width: 1px;
            height: 25px;
            margin-left: 20px;
          }

          .timeline-item {
            min-width: 0;
          }

        }

        @media (max-width: 430px) {

          .page-header {
            padding: 12px;
          }

          .back-button {
            width: 38px;
            height: 38px;
          }

          .page-header h1 {
            font-size: 16px;
          }

          .header-actions button {
            width: 36px;
            height: 36px;
          }

          .main-content {
            padding: 14px 10px 35px;
          }

          .product-heading h2 {
            font-size: 21px;
          }

          .main-image-wrapper {
            height: 280px;
          }

          .stat-card {
            padding: 13px;
          }

          .stat-icon {
            width: 39px;
            height: 39px;
          }

        }

      `}</style>
    </div>
  );
};

export default ReadSingleProduct;