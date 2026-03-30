// src/pages/products/CreateProduct.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const teller = JSON.parse(sessionStorage.getItem("teller") || "{}");
  const teller_id = teller.uid || "";

  // Gestion du changement de champ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  // Gestion du changement de fichiers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, images: Array.from(e.target.files) });
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("description", form.description);
      formData.append("prix_fournisseur", form.prix_fournisseur || "0");
      formData.append("stock_disponible", form.stock_disponible || "0");
      formData.append("moq", form.moq.toString());
      formData.append("lien_1", form.lien_1);
      formData.append("lien_2", form.lien_2);
      formData.append("teller_id", teller_id);

      form.images.forEach((file) => formData.append("images", file));

      const response = await CreateProduit(formData);

      if (response.data.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          nav("/teller/home");
        }, 2500);
      } else {
        alert(response.data.message || "Erreur lors de la création du produit");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur, veuillez réessayer");
    } finally {
      setLoading(false);
    }
  };

  // Styles inline
  const styles: { [key: string]: React.CSSProperties } = {
    container: { maxWidth: 900, margin: "30px auto", padding: 10, fontFamily: "Arial" },
    header: { textAlign: "center", marginBottom: 30 },
    logo: { width: 80, marginBottom: 10 },
    title: { fontSize: 28, color: "#00A4A6" },
    subtitle: { color: "#555" },
    form: { background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" },
    row: { display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 15 },
    group: { flex: 1, display: "flex", flexDirection: "column", marginBottom: 15 },
    input: { padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 14 },
    actions: { display: "flex", justifyContent: "space-between", marginTop: 20 },
    cancel: { background: "#ccc", color: "#fff", padding: "10px 25px", borderRadius: 6, border: "none", cursor: "pointer" },
    submit: { background: "#00A4A6", color: "#fff", padding: "10px 25px", borderRadius: 6, border: "none", fontWeight: "bold", cursor: "pointer" },
    loader: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#000", color: "#fff", padding: 20, borderRadius: 10 },
    success: { position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", background: "#28a745", color: "#fff", padding: "12px 25px", borderRadius: 6 },
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <img src="/logo-founa.png" alt="logo" style={styles.logo} />
        <h2 style={styles.title}>Créer un produit</h2>
        <p style={styles.subtitle}>Ajoutez un produit à votre catalogue rapidement et facilement</p>
      </div>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} style={{ ...styles.form, filter: loading || success ? "blur(3px)" : "none" }}>
        <div style={styles.group}>
          <label>Nom:</label>
          <input name="nom" value={form.nom} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.group}>
          <label>Description:</label>
          <textarea name="description" value={form.description} onChange={handleChange} style={styles.input} required />
        </div>

          <div style={styles.group}>
            <label>Prix fournisseur:</label>
            <input type="number" name="prix_fournisseur" value={form.prix_fournisseur} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.group}>
            <label>Stock disponible:</label>
            <input type="number" name="stock_disponible" value={form.stock_disponible} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.group}>
            <label>MOQ:</label>
            <input type="number" name="moq" value={form.moq} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.group}>
            <label>Lien 1:</label>
            <input name="lien_1" value={form.lien_1} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label>Lien 2:</label>
            <input name="lien_2" value={form.lien_2} onChange={handleChange} style={styles.input} />
          </div>

        <div style={styles.group}>
          <label>Images (plusieurs fichiers):</label>
          <input type="file" multiple onChange={handleFileChange} style={styles.input} required />
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={() => nav("/teller/home")} style={styles.cancel}>Annuler</button>
          <button type="submit" style={styles.submit}>Créer</button>
        </div>
      </form>

      {loading && <div style={styles.loader}>Chargement...</div>}
      {success && <div style={styles.success}>Produit créé avec succès !</div>}
    </div>
  );
};

export default CreateProduct;