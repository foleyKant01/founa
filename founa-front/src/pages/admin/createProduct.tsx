// src/pages/products/CreateProduct.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Link as LinkIcon,
  Package,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { CreateProduit } from "../../services/product.service";

const CreateProduct: React.FC = () => {
  const nav = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const teller = JSON.parse(localStorage.getItem("teller") || "{}");
  const teller_id = teller.uid || "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // Permet de sélectionner à nouveau les mêmes fichiers
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.images.length === 0) {
      alert("Veuillez sélectionner au moins une image.");
      return;
    }

    if (!teller_id) {
      alert("Session Teller introuvable. Veuillez vous reconnecter.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("nom", form.nom);
      formData.append("description", form.description);
      formData.append(
        "prix_fournisseur",
        form.prix_fournisseur || "0"
      );
      formData.append(
        "stock_disponible",
        form.stock_disponible || "0"
      );
      formData.append("moq", form.moq.toString());
      formData.append("lien_1", form.lien_1);
      formData.append("lien_2", form.lien_2);
      formData.append("teller_id", teller_id);

      form.images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await CreateProduit(formData);

      if (response.data.status === "success") {
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          nav("/teller/home");
        }, 2000);
      } else {
        alert(
          response.data.message ||
            "Erreur lors de la création du produit"
        );
      }
    } catch (error) {
      console.error("Erreur création produit :", error);
      alert("Erreur serveur, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-page">
      {/* ================= HEADER ================= */}
      <header className="create-header">
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
              <strong>Créer</strong>
            </div>

            <h1>Créer un produit</h1>

            <p>
              Ajoutez un nouveau produit à votre catalogue
            </p>
          </div>
        </div>

        <div className="header-badge">
          <Package size={18} />
          Nouveau produit
        </div>
      </header>

      {/* ================= CONTENU ================= */}
      <form
        className="create-product-layout"
        onSubmit={handleSubmit}
      >
        {/* ================= FORMULAIRE PRINCIPAL ================= */}
        <main className="form-main">

          {/* INFORMATIONS GENERALES */}
          <section className="form-card">
            <div className="section-header">
              <div className="section-icon">
                <Package size={19} />
              </div>

              <div>
                <h2>Informations générales</h2>
                <p>
                  Renseignez les informations principales du produit
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
                  placeholder="Ex : Organisateur de cuisine"
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
                  placeholder="Décrivez votre produit..."
                  rows={7}
                  required
                />

                <small>
                  Présentez les caractéristiques et avantages du
                  produit.
                </small>
              </div>
            </div>
          </section>

          {/* INFORMATIONS COMMERCIALES */}
          <section className="form-card">
            <div className="section-header">
              <div className="section-icon">
                <Save size={19} />
              </div>

              <div>
                <h2>Informations commerciales</h2>
                <p>
                  Définissez le prix, le stock et les conditions de
                  vente
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
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />

                  <span>FCFA</span>
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
                    placeholder="0"
                    min="0"
                    required
                  />

                  <span>unités</span>
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

                  <span>unités</span>
                </div>

                <small>
                  Quantité minimale de commande
                </small>
              </div>

            </div>
          </section>

          {/* IMAGES */}
          <section className="form-card">
            <div className="section-header">
              <div className="section-icon">
                <ImagePlus size={19} />
              </div>

              <div>
                <h2>Images du produit</h2>
                <p>
                  Ajoutez plusieurs images pour présenter votre
                  produit
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
                <div className="images-preview">
                  <div className="preview-header">
                    <span>
                      Images sélectionnées
                    </span>

                    <strong>
                      {form.images.length} image
                      {form.images.length > 1 ? "s" : ""}
                    </strong>
                  </div>

                  <div className="preview-grid">
                    {form.images.map((file, index) => (
                      <div
                        className="preview-item"
                        key={`${file.name}-${index}`}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                        />

                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => removeImage(index)}
                        >
                          <X size={15} />
                        </button>

                        <div className="file-name">
                          <FileImage size={13} />
                          <span>{file.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* LIENS */}
          <section className="form-card">
            <div className="section-header">
              <div className="section-icon">
                <LinkIcon size={19} />
              </div>

              <div>
                <h2>Liens du produit</h2>
                <p>
                  Ajoutez les liens permettant de retrouver le
                  produit
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

        {/* ================= SIDEBAR ================= */}
        <aside className="form-sidebar">

          <div className="summary-card">

            <div className="summary-header">
              <h2>Résumé</h2>
              <Package size={19} />
            </div>

            <div className="summary-product">
              {form.images.length > 0 ? (
                <img
                  src={URL.createObjectURL(form.images[0])}
                  alt="Aperçu"
                />
              ) : (
                <div className="summary-placeholder">
                  <ImagePlus size={30} />
                </div>
              )}

              <div>
                <strong>
                  {form.nom || "Nouveau produit"}
                </strong>

                <span>
                  {form.images.length} image
                  {form.images.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Prix fournisseur</span>
              <strong>
                {form.prix_fournisseur
                  ? `${Number(
                      form.prix_fournisseur
                    ).toLocaleString("fr-FR")} FCFA`
                  : "—"}
              </strong>
            </div>

            <div className="summary-row">
              <span>Stock</span>
              <strong>
                {form.stock_disponible || "0"} unité
                {Number(form.stock_disponible) > 1 ? "s" : ""}
              </strong>
            </div>

            <div className="summary-row">
              <span>MOQ</span>
              <strong>{form.moq} unité(s)</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-info">
              <CheckCircle2 size={17} />
              <span>
                Vérifiez les informations avant de créer le produit.
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
                ? "Création en cours..."
                : "Créer le produit"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => nav("/teller/home")}
              disabled={loading}
            >
              <ArrowLeft size={17} />
              Annuler
            </button>

          </div>

        </aside>
      </form>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="overlay">
          <div className="loading-card">
            <div className="spinner" />

            <h3>Création du produit</h3>

            <p>
              Veuillez patienter pendant l'enregistrement...
            </p>
          </div>
        </div>
      )}

      {/* ================= SUCCESS ================= */}
      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon">
              <CheckCircle2 size={42} />
            </div>

            <h3>Produit créé avec succès</h3>

            <p>
              Le produit a été ajouté à votre catalogue.
            </p>
          </div>
        </div>
      )}

      {/* ================= CSS ================= */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .create-product-page {
          width: 100%;
          min-height: 100vh;
          background: #f5f7f9;
          padding: 24px 30px 40px;
          color: #1f2937;
        }

        /* HEADER */

        .create-header {
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

        .create-header h1 {
          margin: 0;
          font-size: 27px;
          line-height: 1.2;
          font-weight: 750;
          color: #111827;
        }

        .create-header p {
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

        /* LAYOUT */

        .create-product-layout {
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

        /* CARDS */

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
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .full-width {
          width: 100%;
        }

        /* FIELDS */

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
          box-shadow: 0 0 0 3px rgba(0, 164, 166, .09);
        }

        .field small {
          font-size: 11px;
          color: #9ca3af;
        }

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
          box-shadow: 0 0 0 3px rgba(0, 164, 166, .09);
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

        /* UPLOAD */

        .upload-zone {
          width: 100%;
          min-height: 175px;
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

        /* PREVIEW */

        .images-preview {
          margin-top: 4px;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 12px;
          color: #6b7280;
        }

        .preview-header strong {
          color: #00A4A6;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .preview-item {
          position: relative;
          min-width: 0;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          overflow: hidden;
          background: #f8fafb;
        }

        .preview-item img {
          width: 100%;
          height: 115px;
          display: block;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 26px;
          height: 26px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, .95);
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

        /* SIDEBAR */

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

        /* ACTIONS */

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

        /* OVERLAY */

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
          box-shadow: 0 20px 60px rgba(0,0,0,.18);
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

        /* RESPONSIVE */

        @media (max-width: 1200px) {
          .create-product-layout {
            grid-template-columns: minmax(0, 1fr) 290px;
          }

          .preview-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 1000px) {
          .create-product-layout {
            grid-template-columns: 1fr;
          }

          .form-sidebar {
            position: static;
            display: grid;
            grid-template-columns: 1fr 280px;
            align-items: start;
          }
        }

        @media (max-width: 750px) {
          .create-product-page {
            padding: 18px 15px 30px;
          }

          .create-header {
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

          .preview-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 500px) {
          .create-header h1 {
            font-size: 22px;
          }

          .create-header p {
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

          .preview-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .preview-item img {
            height: 130px;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateProduct;