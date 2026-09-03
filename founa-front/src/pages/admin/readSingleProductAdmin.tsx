import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DeleteProduitByTeller,
  GetSingleProduit,
} from "../../services/product.service";
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

const ReadSingleProductAdmin = () => {
  const navigate = useNavigate();
  const { uid } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

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
            imagesArray = JSON.parse(prod.images);
          } catch {
            imagesArray = [];
          }
        }

        setProduct({
          ...prod,
          images: imagesArray,
        });

        setMainImage(imagesArray[0] || "");
      }
    } catch (err) {
      console.error("Erreur serveur :", err);

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger le produit.",
      });
    } finally {
      setLoading(false);
    }
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
      const teller = JSON.parse(
        localStorage.getItem("teller") || "{}"
      );

      const res = await DeleteProduitByTeller({
        produit_id: uid,
        teller_id: teller.uid,
      });

      if (res.data.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Supprimé !",
          text:
            res.data.message ||
            "Produit supprimé avec succès",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/admin/readall");
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

  const editProduct = () => {
    if (!product?.uid) return;

    navigate(`/admin/editproduct/${product.uid}`);
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty">
        <div className="empty-icon">📦</div>
        <h3>Produit introuvable</h3>
        <button
          className="back-button"
          onClick={() => navigate("/admin/readall")}
        >
          ← Retour aux produits
        </button>
      </div>
    );
  }

  return (
    <div className="product-page">

      {/* ================= HEADER ================= */}
      <header className="page-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <div>
            <div className="breadcrumb">
              Administration
              <span>/</span>
              Produits
              <span>/</span>
              Détails
            </div>

            <h1>{product.nom}</h1>

            <p className="product-id">
              UID : {product.uid}
            </p>
          </div>

        </div>

        <div className="header-actions">

          <button
            className="btn btn-edit"
            onClick={editProduct}
          >
            ✏️
            <span>Modifier</span>
          </button>

          <button
            className="btn btn-delete"
            onClick={() =>
              deleteProduct(product.uid)
            }
          >
            🗑️
            <span>Supprimer</span>
          </button>

        </div>

      </header>


      {/* ================= CONTENU ================= */}
      <main className="product-content">

        {/* ================= GALERIE ================= */}
        <section className="gallery-card">

          <div className="main-image-container">

            {mainImage ? (
              <img
                src={mainImage}
                alt={product.nom}
                className="main-image"
              />
            ) : (
              <div className="no-image">
                <span>📷</span>
                <p>Aucune image</p>
              </div>
            )}

          </div>

          {product.images &&
            product.images.length > 0 && (
              <div className="thumbnails">

                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${
                      mainImage === img
                        ? "thumbnail-active"
                        : ""
                    }`}
                    onClick={() =>
                      setMainImage(img)
                    }
                  >
                    <img
                      src={img}
                      alt={`${product.nom} ${index + 1}`}
                    />
                  </button>
                ))}

              </div>
            )}

        </section>


        {/* ================= INFORMATIONS ================= */}
        <section className="details">

          {/* Prix */}
          <div className="price-card">

            <div>
              <span className="label">
                Prix de vente
              </span>

              <div className="selling-price">
                {product.prix_vente} FCFA
              </div>
            </div>

            <div className="price-icon">
              💰
            </div>

          </div>


          {/* Description */}
          <div className="info-card">

            <div className="section-title">
              <span>📋</span>
              <h2>Description</h2>
            </div>

            <p className="description">
              {product.description ||
                "Aucune description disponible."}
            </p>

          </div>


          {/* Informations commerciales */}
          <div className="info-card">

            <div className="section-title">
              <span>📊</span>
              <h2>Informations commerciales</h2>
            </div>

            <div className="info-grid">

              <div className="info-item">
                <span className="info-label">
                  Prix fournisseur
                </span>

                <strong>
                  {product.prix_fournisseur} FCFA
                </strong>
              </div>


              <div className="info-item">
                <span className="info-label">
                  Stock disponible
                </span>

                <strong
                  className={
                    Number(product.stock_disponible) < 5
                      ? "stock-danger"
                      : "stock-success"
                  }
                >
                  {product.stock_disponible}
                </strong>
              </div>


              <div className="info-item">
                <span className="info-label">
                  MOQ
                </span>

                <strong>
                  {product.moq || "-"}
                </strong>
              </div>


              <div className="info-item">
                <span className="info-label">
                  Statut
                </span>

                <span className="status-badge">
                  {product.status || "Actif"}
                </span>
              </div>

            </div>

          </div>


          {/* Liens */}
          <div className="info-card">

            <div className="section-title">
              <span>🔗</span>
              <h2>Liens du produit</h2>
            </div>

            <div className="links">

              {product.lien_1 && (
                <a
                  href={product.lien_1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link"
                >
                  <span>🔗</span>
                  <div>
                    <strong>Lien fournisseur 1</strong>
                    <small>
                      Ouvrir le lien
                    </small>
                  </div>

                  <span className="arrow">
                    ↗
                  </span>
                </a>
              )}


              {product.lien_2 && (
                <a
                  href={product.lien_2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link"
                >
                  <span>🔗</span>
                  <div>
                    <strong>Lien fournisseur 2</strong>
                    <small>
                      Ouvrir le lien
                    </small>
                  </div>

                  <span className="arrow">
                    ↗
                  </span>
                </a>
              )}

            </div>

          </div>


          {/* Dates */}
          <div className="info-card">

            <div className="section-title">
              <span>🕐</span>
              <h2>Historique</h2>
            </div>

            <div className="dates">

              <div className="date-item">
                <span>Créé le</span>

                <strong>
                  {new Date(
                    product.creation_date
                  ).toLocaleString("fr-FR")}
                </strong>
              </div>

              <div className="date-item">
                <span>Dernière modification</span>

                <strong>
                  {new Date(
                    product.update_date
                  ).toLocaleString("fr-FR")}
                </strong>
              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ================= STYLE ================= */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f5f7f9;
        }

        .product-page {
          width: 100%;
          min-height: 100vh;
          padding: 20px 25px 40px;
          font-family: Arial, Helvetica, sans-serif;
        }


        /* ================= HEADER ================= */

        .page-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
        }

        .back-button {
          width: 42px;
          height: 42px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          font-size: 22px;
          cursor: pointer;
          color: #374151;
          transition: 0.2s;
          flex-shrink: 0;
        }

        .back-button:hover {
          background: #00A4A6;
          color: white;
          border-color: #00A4A6;
        }

        .breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .breadcrumb span {
          color: #d1d5db;
        }

        .page-header h1 {
          margin: 0;
          font-size: 24px;
          color: #111827;
          font-weight: 700;
        }

        .product-id {
          margin: 5px 0 0;
          color: #9ca3af;
          font-size: 12px;
        }


        /* ================= ACTIONS ================= */

        .header-actions {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .btn {
          border: none;
          padding: 11px 18px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.2s;
        }

        .btn-edit {
          background: #00A4A6;
          color: white;
        }

        .btn-edit:hover {
          background: #008b8d;
          transform: translateY(-1px);
        }

        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-delete:hover {
          background: #dc2626;
          color: white;
        }


        /* ================= CONTENU ================= */

        .product-content {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.85fr);
          gap: 25px;
          align-items: start;
        }


        /* ================= GALERIE ================= */

        .gallery-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          position: sticky;
          top: 20px;
        }

        .main-image-container {
          width: 100%;
          height: calc(100vh - 250px);
          min-height: 400px;
          max-height: 650px;
          background: #f8fafc;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .no-image {
          text-align: center;
          color: #9ca3af;
        }

        .no-image span {
          font-size: 55px;
        }

        .no-image p {
          margin-top: 10px;
        }


        /* ================= THUMBNAILS ================= */

        .thumbnails {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          overflow-x: auto;
          padding-bottom: 3px;
        }

        .thumbnail {
          width: 75px;
          height: 75px;
          padding: 0;
          border: 2px solid transparent;
          border-radius: 9px;
          overflow: hidden;
          cursor: pointer;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-active {
          border-color: #00A4A6;
        }


        /* ================= DETAILS ================= */

        .details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .price-card {
          background: #00A4A6;
          color: white;
          border-radius: 16px;
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 6px 20px rgba(0,164,166,0.2);
        }

        .label {
          display: block;
          font-size: 13px;
          opacity: 0.85;
          margin-bottom: 6px;
        }

        .selling-price {
          font-size: 30px;
          font-weight: 700;
        }

        .price-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }


        /* ================= CARDS ================= */

        .info-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .section-title span {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: #e8f8f8;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .section-title h2 {
          margin: 0;
          font-size: 16px;
          color: #111827;
        }


        /* ================= DESCRIPTION ================= */

        .description {
          margin: 0;
          line-height: 1.7;
          color: #4b5563;
          font-size: 14px;
          white-space: pre-line;
        }


        /* ================= GRID INFOS ================= */

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .info-item {
          padding: 14px;
          border-radius: 10px;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }

        .info-label {
          color: #9ca3af;
          font-size: 12px;
        }

        .info-item strong {
          color: #111827;
          font-size: 14px;
          word-break: break-word;
        }

        .stock-success {
          color: #16a34a !important;
        }

        .stock-danger {
          color: #dc2626 !important;
        }

        .status-badge {
          width: fit-content;
          background: #dcfce7;
          color: #15803d;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }


        /* ================= LIENS ================= */

        .links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .product-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px;
          background: #f8fafc;
          border-radius: 10px;
          text-decoration: none;
          color: #111827;
          transition: 0.2s;
        }

        .product-link:hover {
          background: #e8f8f8;
        }

        .product-link > div {
          flex: 1;
          min-width: 0;
        }

        .product-link strong {
          display: block;
          font-size: 13px;
        }

        .product-link small {
          display: block;
          margin-top: 3px;
          color: #9ca3af;
          font-size: 11px;
        }

        .arrow {
          font-size: 18px;
          color: #00A4A6;
        }


        /* ================= DATES ================= */

        .dates {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .date-item {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .date-item span {
          color: #9ca3af;
          font-size: 12px;
        }

        .date-item strong {
          color: #374151;
          font-size: 13px;
        }


        /* ================= LOADER ================= */

        .page-loader {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #777;
        }

        .loader {
          width: 45px;
          height: 45px;
          border: 4px solid #e5e7eb;
          border-top-color: #00A4A6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }


        /* ================= EMPTY ================= */

        .empty {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #777;
        }

        .empty-icon {
          font-size: 60px;
          margin-bottom: 10px;
        }

        .empty h3 {
          color: #374151;
        }


        /* ================= TABLET ================= */

        @media (max-width: 1000px) {

          .product-content {
            grid-template-columns: 1fr;
          }

          .gallery-card {
            position: relative;
            top: 0;
          }

          .main-image-container {
            height: 500px;
          }

        }


        /* ================= MOBILE ================= */

        @media (max-width: 600px) {

          .product-page {
            padding: 12px;
          }

          .page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .header-left {
            width: 100%;
          }

          .page-header h1 {
            font-size: 19px;
          }

          .breadcrumb {
            display: none;
          }

          .header-actions {
            width: 100%;
          }

          .btn {
            flex: 1;
            justify-content: center;
            padding: 10px;
          }

          .product-content {
            gap: 15px;
          }

          .gallery-card {
            padding: 12px;
          }

          .main-image-container {
            height: 350px;
            min-height: 350px;
          }

          .thumbnail {
            width: 60px;
            height: 60px;
          }

          .info-card {
            padding: 15px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .dates {
            grid-template-columns: 1fr;
          }

          .selling-price {
            font-size: 24px;
          }

        }

      `}</style>
    </div>
  );
};

export default ReadSingleProductAdmin;