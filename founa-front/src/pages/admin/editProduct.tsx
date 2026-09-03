// src/pages/products/EditProduct.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Link as LinkIcon,
  Package,
  Save,
  X,
} from "lucide-react";
import {
  UpdateProduit,
  GetSingleProduit,
} from "../../services/product.service";

const EditProduct: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nom: "",
    description: "",
    prix_fournisseur: "",
    stock_disponible: "",
    moq: 1,
    lien_1: "",
    lien_2: "",
    images: [] as File[],
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const teller = JSON.parse(localStorage.getItem("teller") || "{}");
  const teller_id = teller.uid || "";

  // =========================================================
  // NORMALISATION DES IMAGES
  // =========================================================

  const normalizeImages = (images: any): string[] => {
    if (Array.isArray(images)) {
      return images.filter(
        (image) => typeof image === "string" && image.trim() !== ""
      );
    }

    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);

        if (Array.isArray(parsed)) {
          return parsed.filter(
            (image) =>
              typeof image === "string" && image.trim() !== ""
          );
        }
      } catch {
        return [];
      }
    }

    return [];
  };

  // =========================================================
  // CHARGEMENT DU PRODUIT
  // =========================================================

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await GetSingleProduit({
          produit_id: id,
        });

        console.log("ID produit :", id);

        if (res.data.status === "success") {
          const p = res.data.produit;

          setForm({
            nom: p.nom ?? "",
            description: p.description ?? "",
            prix_fournisseur: String(
              p.prix_fournisseur ?? ""
            ),
            stock_disponible: String(
              p.stock_disponible ?? ""
            ),
            moq: Number(p.moq ?? 1),
            lien_1: p.lien_1 ?? "",
            lien_2: p.lien_2 ?? "",
            images: [],
          });

          setExistingImages(
            normalizeImages(p.images)
          );
        } else {
          alert(
            res.data.message ||
              "Produit introuvable"
          );
        }
      } catch (err) {
        console.error(
          "Erreur chargement produit :",
          err
        );

        alert(
          "Erreur lors du chargement du produit"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================================================
  // INPUT
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // NOUVELLES IMAGES
  // =========================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // Permet de sélectionner à nouveau le même fichier
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!id) {
      alert("Identifiant du produit introuvable.");
      return;
    }

    if (!teller_id) {
      alert(
        "Session Teller introuvable. Veuillez vous reconnecter."
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "produit_id",
        id
      );

      formData.append(
        "nom",
        form.nom
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "prix_fournisseur",
        form.prix_fournisseur || "0"
      );

      formData.append(
        "stock_disponible",
        form.stock_disponible || "0"
      );

      formData.append(
        "moq",
        form.moq.toString()
      );

      formData.append(
        "lien_1",
        form.lien_1
      );

      formData.append(
        "lien_2",
        form.lien_2
      );

      formData.append(
        "teller_id",
        teller_id
      );

      // Nouvelles images
      form.images.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      const res = await UpdateProduit(
        formData
      );

      if (
        res.data.status ===
        "success"
      ) {
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          nav(-1);
        }, 2000);
      } else {
        alert(
          res.data.message ||
            "Erreur lors de la mise à jour du produit"
        );
      }
    } catch (err) {
      console.error(
        "Erreur update produit :",
        err
      );

      alert(
        "Erreur serveur, veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="edit-product-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="edit-header">

        <div className="header-left">

          <button
            type="button"
            className="back-button"
            onClick={() => nav(-1)}
          >
            <ArrowLeft size={19} />
          </button>

          <div>

            <div className="breadcrumb">
              <span>Accueil</span>
              <span>/</span>
              <span>Produits</span>
              <span>/</span>
              <strong>Modifier</strong>
            </div>

            <h1>
              Modifier le produit
            </h1>

            <p>
              Mettez à jour les informations de votre produit
            </p>

          </div>

        </div>

        <div className="header-badge">
          <Package size={18} />
          Modification
        </div>

      </header>

      {/* =====================================================
          LAYOUT
      ===================================================== */}

      <form
        className="edit-product-layout"
        onSubmit={handleSubmit}
      >

        {/* ===================================================
            MAIN
        =================================================== */}

        <main className="form-main">

          {/* =================================================
              INFORMATIONS GENERALES
          ================================================= */}

          <section className="form-card">

            <div className="section-header">

              <div className="section-icon">
                <Package size={19} />
              </div>

              <div>
                <h2>
                  Informations générales
                </h2>

                <p>
                  Informations principales du produit
                </p>
              </div>

            </div>

            <div className="form-content">

              <div className="field full-width">

                <label htmlFor="nom">
                  Nom du produit
                  <span>*</span>
                </label>

                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Nom du produit"
                  required
                />

              </div>

              <div className="field full-width">

                <label htmlFor="description">
                  Description
                  <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description du produit..."
                  rows={7}
                  required
                />

                <small>
                  Décrivez les caractéristiques et avantages
                  du produit.
                </small>

              </div>

            </div>

          </section>

          {/* =================================================
              INFORMATIONS COMMERCIALES
          ================================================= */}

          <section className="form-card">

            <div className="section-header">

              <div className="section-icon">
                <Save size={19} />
              </div>

              <div>
                <h2>
                  Informations commerciales
                </h2>

                <p>
                  Prix, stock et conditions de vente
                </p>
              </div>

            </div>

            <div className="form-content grid-3">

              <div className="field">

                <label htmlFor="prix_fournisseur">
                  Prix fournisseur
                  <span>*</span>
                </label>

                <div className="input-with-suffix">

                  <input
                    id="prix_fournisseur"
                    type="number"
                    name="prix_fournisseur"
                    value={form.prix_fournisseur}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0"
                    required
                  />

                  <span>
                    FCFA
                  </span>

                </div>

              </div>

              <div className="field">

                <label htmlFor="stock_disponible">
                  Stock disponible
                  <span>*</span>
                </label>

                <div className="input-with-suffix">

                  <input
                    id="stock_disponible"
                    type="number"
                    name="stock_disponible"
                    value={form.stock_disponible}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    required
                  />

                  <span>
                    unités
                  </span>

                </div>

              </div>

              <div className="field">

                <label htmlFor="moq">
                  MOQ
                  <span>*</span>
                </label>

                <div className="input-with-suffix">

                  <input
                    id="moq"
                    type="number"
                    name="moq"
                    value={form.moq}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                  <span>
                    unités
                  </span>

                </div>

                <small>
                  Quantité minimale de commande
                </small>

              </div>

            </div>

          </section>

          {/* =================================================
              IMAGES EXISTANTES
          ================================================= */}

          <section className="form-card">

            <div className="section-header">

              <div className="section-icon">
                <ImagePlus size={19} />
              </div>

              <div>
                <h2>
                  Images du produit
                </h2>

                <p>
                  Images actuellement enregistrées
                </p>
              </div>

            </div>

            <div className="form-content">

              {existingImages.length > 0 ? (

                <div className="existing-images">

                  <div className="images-title">
                    <span>
                      Images actuelles
                    </span>

                    <strong>
                      {existingImages.length} image
                      {existingImages.length > 1
                        ? "s"
                        : ""}
                    </strong>
                  </div>

                  <div className="existing-grid">

                    {existingImages.map(
                      (img, index) => (

                        <div
                          className="existing-item"
                          key={`${img}-${index}`}
                        >

                          <img
                            src={img}
                            alt={`Produit ${index + 1}`}
                          />

                          <div className="image-number">
                            {index + 1}
                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              ) : (

                <div className="empty-images">
                  <ImagePlus size={30} />

                  <strong>
                    Aucune image enregistrée
                  </strong>

                  <span>
                    Ajoutez des images ci-dessous
                  </span>
                </div>

              )}

            </div>

          </section>

          {/* =================================================
              AJOUT IMAGES
          ================================================= */}

          <section className="form-card">

            <div className="section-header">

              <div className="section-icon">
                <ImagePlus size={19} />
              </div>

              <div>
                <h2>
                  Ajouter de nouvelles images
                </h2>

                <p>
                  Les nouvelles images seront envoyées avec
                  la modification
                </p>
              </div>

            </div>

            <div className="form-content">

              <label className="upload-zone">

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />

                <div className="upload-icon">
                  <ImagePlus size={28} />
                </div>

                <strong>
                  Cliquez pour ajouter des images
                </strong>

                <span>
                  PNG, JPG, JPEG ou WEBP
                </span>

                <small>
                  Vous pouvez sélectionner plusieurs images
                </small>

              </label>

              {form.images.length > 0 && (

                <div className="new-images">

                  <div className="images-title">

                    <span>
                      Nouvelles images
                    </span>

                    <strong>
                      {form.images.length} image
                      {form.images.length > 1
                        ? "s"
                        : ""}
                    </strong>

                  </div>

                  <div className="new-images-grid">

                    {form.images.map(
                      (file, index) => (

                        <div
                          className="new-image-item"
                          key={`${file.name}-${index}`}
                        >

                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                          />

                          <button
                            type="button"
                            className="remove-image"
                            onClick={() =>
                              removeNewImage(index)
                            }
                          >
                            <X size={15} />
                          </button>

                          <div className="file-name">

                            <FileImage size={13} />

                            <span>
                              {file.name}
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>

          </section>

          {/* =================================================
              LIENS
          ================================================= */}

          <section className="form-card">

            <div className="section-header">

              <div className="section-icon">
                <LinkIcon size={19} />
              </div>

              <div>
                <h2>
                  Liens du produit
                </h2>

                <p>
                  Liens externes associés au produit
                </p>
              </div>

            </div>

            <div className="form-content grid-2">

              <div className="field">

                <label htmlFor="lien_1">
                  Lien principal
                </label>

                <div className="input-with-icon">

                  <LinkIcon size={17} />

                  <input
                    id="lien_1"
                    name="lien_1"
                    type="url"
                    value={form.lien_1}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                </div>

              </div>

              <div className="field">

                <label htmlFor="lien_2">
                  Lien secondaire
                </label>

                <div className="input-with-icon">

                  <LinkIcon size={17} />

                  <input
                    id="lien_2"
                    name="lien_2"
                    type="url"
                    value={form.lien_2}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                </div>

              </div>

            </div>

          </section>

        </main>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="form-sidebar">

          {/* RESUME */}

          <div className="summary-card">

            <div className="summary-header">

              <h2>
                Résumé du produit
              </h2>

              <Package size={19} />

            </div>

            <div className="summary-product">

              {form.images.length > 0 ? (

                <img
                  src={URL.createObjectURL(
                    form.images[0]
                  )}
                  alt="Nouvelle image"
                />

              ) : existingImages.length > 0 ? (

                <img
                  src={existingImages[0]}
                  alt="Produit"
                />

              ) : (

                <div className="summary-placeholder">
                  <ImagePlus size={28} />
                </div>

              )}

              <div>

                <strong>
                  {form.nom ||
                    "Produit sans nom"}
                </strong>

                <span>
                  {existingImages.length} image
                  {existingImages.length > 1
                    ? "s"
                    : ""}{" "}
                  actuelle
                  {existingImages.length > 1
                    ? "s"
                    : ""}
                </span>

              </div>

            </div>

            <div className="summary-divider" />

            <div className="summary-row">

              <span>
                Prix fournisseur
              </span>

              <strong>
                {form.prix_fournisseur
                  ? `${Number(
                      form.prix_fournisseur
                    ).toLocaleString(
                      "fr-FR"
                    )} FCFA`
                  : "—"}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Stock
              </span>

              <strong>
                {form.stock_disponible ||
                  "0"}{" "}
                unité
                {Number(
                  form.stock_disponible
                ) > 1
                  ? "s"
                  : ""}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                MOQ
              </span>

              <strong>
                {form.moq} unité(s)
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Nouvelles images
              </span>

              <strong>
                {form.images.length}
              </strong>

            </div>

            <div className="summary-divider" />

            <div className="summary-info">

              <CheckCircle2 size={17} />

              <span>
                Les modifications seront enregistrées
                après validation.
              </span>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="actions-card">

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >

              <Save size={18} />

              {loading
                ? "Enregistrement..."
                : "Enregistrer les modifications"}

            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => nav(-1)}
              disabled={loading}
            >

              <ArrowLeft size={17} />

              Annuler

            </button>

          </div>

        </aside>

      </form>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <div className="overlay">

          <div className="loading-card">

            <div className="spinner" />

            <h3>
              Enregistrement
            </h3>

            <p>
              Mise à jour du produit en cours...
            </p>

          </div>

        </div>

      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (

        <div className="success-overlay">

          <div className="success-card">

            <div className="success-icon">
              <CheckCircle2 size={42} />
            </div>

            <h3>
              Produit mis à jour
            </h3>

            <p>
              Les modifications ont été enregistrées
              avec succès.
            </p>

          </div>

        </div>

      )}

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .edit-product-page {
          width: 100%;
          min-height: 100vh;
          background: #f5f7f9;
          padding: 24px 30px 40px;
          color: #1f2937;
        }

        /* ================= HEADER ================= */

        .edit-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 25px;
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
          min-width: 42px;
          border: 1px solid #e1e5e9;
          background: #fff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #374151;
          transition: all .2s ease;
        }

        .back-button:hover {
          border-color: #00A4A6;
          color: #00A4A6;
          transform: translateX(-2px);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .breadcrumb strong {
          color: #00A4A6;
          font-weight: 600;
        }

        .edit-header h1 {
          margin: 0;
          font-size: 27px;
          line-height: 1.2;
          font-weight: 750;
          color: #111827;
        }

        .edit-header p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .header-badge {
          height: 40px;
          padding: 0 14px;
          border-radius: 9px;
          background: #e6f7f7;
          color: #008789;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ================= LAYOUT ================= */

        .edit-product-layout {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 22px;
          align-items: start;
        }

        .form-main {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ================= CARDS ================= */

        .form-card,
        .summary-card,
        .actions-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, .035);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 19px 21px;
          border-bottom: 1px solid #eef0f2;
        }

        .section-icon {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 9px;
          background: #e6f7f7;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-header h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #1f2937;
        }

        .section-header p {
          margin: 3px 0 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .form-content {
          padding: 21px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .grid-2 {
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
        }

        .grid-3 {
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
        }

        .full-width {
          width: 100%;
        }

        /* ================= FIELDS ================= */

        .field {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .field label span {
          color: #ef4444;
          margin-left: 3px;
        }

        .field input,
        .field textarea {
          width: 100%;
          border: 1px solid #dfe3e8;
          border-radius: 9px;
          background: #fff;
          color: #1f2937;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: all .2s ease;
        }

        .field input {
          height: 45px;
          padding: 0 13px;
        }

        .field textarea {
          padding: 12px 13px;
          resize: vertical;
          min-height: 130px;
          line-height: 1.55;
        }

        .field input:hover,
        .field textarea:hover {
          border-color: #b8c1c8;
        }

        .field input:focus,
        .field textarea:focus {
          border-color: #00A4A6;
          box-shadow:
            0 0 0 3px
            rgba(0, 164, 166, .09);
        }

        .field small {
          font-size: 11px;
          color: #9ca3af;
        }

        /* ================= SUFFIX ================= */

        .input-with-suffix {
          display: flex;
          align-items: center;
          height: 45px;
          border: 1px solid #dfe3e8;
          border-radius: 9px;
          overflow: hidden;
          transition: all .2s ease;
        }

        .input-with-suffix:focus-within {
          border-color: #00A4A6;
          box-shadow:
            0 0 0 3px
            rgba(0, 164, 166, .09);
        }

        .input-with-suffix input {
          border: none;
          box-shadow: none !important;
          height: 100%;
          border-radius: 0;
          min-width: 0;
        }

        .input-with-suffix span {
          padding: 0 11px;
          height: 100%;
          display: flex;
          align-items: center;
          background: #f8fafb;
          border-left: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 11px;
          white-space: nowrap;
        }

        /* ================= ICON INPUT ================= */

        .input-with-icon {
          position: relative;
        }

        .input-with-icon svg {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .input-with-icon input {
          padding-left: 40px;
        }

        /* ================= EXISTING IMAGES ================= */

        .images-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 12px;
          color: #6b7280;
        }

        .images-title strong {
          color: #00A4A6;
        }

        .existing-grid {
          display: grid;
          grid-template-columns: repeat(
            5,
            minmax(0, 1fr)
          );
          gap: 11px;
        }

        .existing-item {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          background: #f8fafb;
        }

        .existing-item img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .image-number {
          position: absolute;
          top: 7px;
          left: 7px;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: rgba(255,255,255,.95);
          color: #00A4A6;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,.1);
        }

        .empty-images {
          min-height: 140px;
          border: 1px dashed #d7dfe2;
          border-radius: 11px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #a0a9af;
          gap: 6px;
        }

        .empty-images strong {
          color: #6b7280;
          font-size: 13px;
        }

        .empty-images span {
          font-size: 11px;
        }

        /* ================= UPLOAD ================= */

        .upload-zone {
          width: 100%;
          min-height: 165px;
          border: 1.5px dashed #b9dcdc;
          border-radius: 12px;
          background: #faffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .2s ease;
          padding: 25px;
          text-align: center;
        }

        .upload-zone:hover {
          border-color: #00A4A6;
          background: #f4ffff;
        }

        .upload-zone input {
          display: none;
        }

        .upload-icon {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          background: #e6f7f7;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 11px;
        }

        .upload-zone strong {
          font-size: 14px;
          color: #374151;
        }

        .upload-zone span {
          margin-top: 5px;
          font-size: 12px;
          color: #6b7280;
        }

        .upload-zone small {
          margin-top: 4px;
          font-size: 11px;
          color: #9ca3af;
        }

        /* ================= NEW IMAGES ================= */

        .new-images {
          margin-top: 2px;
        }

        .new-images-grid {
          display: grid;
          grid-template-columns: repeat(
            5,
            minmax(0, 1fr)
          );
          gap: 10px;
        }

        .new-image-item {
          position: relative;
          min-width: 0;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          overflow: hidden;
          background: #f8fafb;
        }

        .new-image-item img {
          width: 100%;
          height: 115px;
          display: block;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 27px;
          height: 27px;
          border: none;
          border-radius: 50%;
          background: rgba(255,255,255,.95);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,.12);
        }

        .file-name {
          height: 31px;
          padding: 0 7px;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6b7280;
          font-size: 10px;
        }

        .file-name span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ================= SIDEBAR ================= */

        .form-sidebar {
          position: sticky;
          top: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .summary-card {
          padding: 18px;
        }

        .summary-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 17px;
        }

        .summary-header h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
        }

        .summary-header svg {
          color: #00A4A6;
        }

        .summary-product {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .summary-product img,
        .summary-placeholder {
          width: 58px;
          height: 58px;
          min-width: 58px;
          border-radius: 9px;
          object-fit: cover;
          background: #f3f5f6;
        }

        .summary-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b4bec4;
        }

        .summary-product strong {
          display: block;
          font-size: 13px;
          color: #1f2937;
          line-height: 1.35;
        }

        .summary-product span {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          color: #9ca3af;
        }

        .summary-divider {
          height: 1px;
          background: #eef0f2;
          margin: 17px 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 13px;
        }

        .summary-row:last-of-type {
          margin-bottom: 0;
        }

        .summary-row span {
          color: #6b7280;
          font-size: 12px;
        }

        .summary-row strong {
          color: #1f2937;
          font-size: 12px;
          text-align: right;
        }

        .summary-info {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          padding: 10px;
          border-radius: 8px;
          background: #f0fafa;
          color: #008789;
          font-size: 11px;
          line-height: 1.45;
        }

        .summary-info svg {
          min-width: 17px;
          margin-top: 1px;
        }

        /* ================= ACTIONS ================= */

        .actions-card {
          padding: 14px;
        }

        .submit-button,
        .cancel-button {
          width: 100%;
          height: 45px;
          border-radius: 9px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: all .2s ease;
        }

        .submit-button {
          background: #00A4A6;
          color: #fff;
        }

        .submit-button:hover:not(:disabled) {
          background: #008f91;
          transform: translateY(-1px);
        }

        .cancel-button {
          margin-top: 9px;
          background: #f3f4f6;
          color: #4b5563;
        }

        .cancel-button:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .submit-button:disabled,
        .cancel-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* ================= OVERLAY ================= */

        .overlay,
        .success-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, .42);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .loading-card,
        .success-card {
          width: 100%;
          max-width: 360px;
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          box-shadow:
            0 20px 60px
            rgba(0,0,0,.18);
        }

        .spinner {
          width: 42px;
          height: 42px;
          margin: 0 auto 17px;
          border: 4px solid #e6f7f7;
          border-top-color: #00A4A6;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-card h3,
        .success-card h3 {
          margin: 0;
          font-size: 17px;
          color: #1f2937;
        }

        .loading-card p,
        .success-card p {
          margin: 7px 0 0;
          color: #6b7280;
          font-size: 12px;
        }

        .success-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: #eaf8ef;
          color: #22a447;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1250px) {

          .edit-product-layout {
            grid-template-columns:
              minmax(0, 1fr)
              290px;
          }

          .existing-grid,
          .new-images-grid {
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
          }

        }

        @media (max-width: 1000px) {

          .edit-product-layout {
            grid-template-columns: 1fr;
          }

          .form-sidebar {
            position: static;

            display: grid;

            grid-template-columns:
              minmax(0, 1fr)
              280px;

            align-items: start;
          }

        }

        @media (max-width: 750px) {

          .edit-product-page {
            padding: 18px 15px 30px;
          }

          .edit-header {
            align-items: flex-start;
          }

          .header-badge {
            display: none;
          }

          .grid-2,
          .grid-3 {
            grid-template-columns: 1fr;
          }

          .form-sidebar {
            grid-template-columns: 1fr;
          }

          .existing-grid,
          .new-images-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

        }

        @media (max-width: 500px) {

          .edit-header h1 {
            font-size: 22px;
          }

          .edit-header p {
            font-size: 12px;
          }

          .breadcrumb {
            font-size: 10px;
          }

          .back-button {
            width: 38px;
            height: 38px;
            min-width: 38px;
          }

          .section-header {
            padding: 15px;
          }

          .form-content {
            padding: 15px;
          }

          .section-header p {
            display: none;
          }

          .existing-grid,
          .new-images-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .new-image-item img {
            height: 130px;
          }

        }

      `}</style>

    </div>
  );
};

export default EditProduct;