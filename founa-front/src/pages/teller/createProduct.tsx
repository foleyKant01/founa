import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct: React.FC = () => {
  const nav = useNavigate();

  const [form, setForm] = useState<any>({
    type: "Jouet Enfant",
    name: "",
    model: "",
    style: "",
    description: "",
    price: "",
    inventory_level: "",
    price_received: "",
    material: "",
    color: "",
    talon_cm: "",
    pointure: "",
    image_file: [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const colors = ["Noir", "Blanc", "Rouge", "Bleu", "Vert"];

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setForm({ ...form, image_file: e.target.files });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const isShoes =
    form.type === "Chaussures Homme" ||
    form.type === "Chaussures Femme";

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <img src="/logo-founa.png" alt="logo" style={styles.logo} />
        <h2 style={styles.title}>Créer un produit</h2>
        <p style={styles.subtitle}>
          Ajoutez un produit à votre catalogue rapidement et facilement
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          ...styles.form,
          filter: loading || success ? "blur(5px)" : "none",
        }}
      >

        {/* TYPE & NAME */}
        <div style={styles.row}>
          <div style={styles.group}>
            <label>Type:</label>
            <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
              <option>Jouet Enfant</option>
              <option>Chaussures Homme</option>
              <option>Chaussures Femme</option>
            </select>
          </div>

          <div style={styles.group}>
            <label>Nom:</label>
            <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
          </div>
        </div>

        {/* MODEL & STYLE */}
        <div style={styles.row}>
          <div style={styles.group}>
            <label>Modèle:</label>
            <input name="model" value={form.model} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label>Style:</label>
            <input name="style" value={form.style} onChange={handleChange} style={styles.input} />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={styles.group}>
          <label>Description:</label>
          <textarea name="description" value={form.description} onChange={handleChange} style={styles.input} />
        </div>

        {/* PRIX */}
        <div style={styles.row}>
          <div style={styles.group}>
            <label>Prix:</label>
            <input type="number" name="price" onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label>Stock:</label>
            <input type="number" name="inventory_level" onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label>Prix d'achat:</label>
            <input type="number" name="price_received" onChange={handleChange} style={styles.input} />
          </div>
        </div>

        {/* MATIERE & COULEUR */}
        <div style={styles.row}>
          <div style={styles.group}>
            <label>Matière:</label>
            <input name="material" onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label>Couleur:</label>
            <select name="color" onChange={handleChange} style={styles.input}>
              {colors.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CHAUSSURES */}
        {isShoes && (
          <div style={styles.row}>
            <div style={styles.group}>
              <label>Talon cm:</label>
              <input name="talon_cm" onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.group}>
              <label>Pointure:</label>
              <input name="pointure" onChange={handleChange} style={styles.input} />
            </div>
          </div>
        )}

        {/* IMAGE */}
        <div style={styles.group}>
          <label>Image:</label>
          <input type="file" multiple onChange={handleFileChange} style={styles.input} />
        </div>

        {/* ACTIONS */}
        <div style={styles.actions}>
          <button type="button" onClick={() => nav("/teller/home")} style={styles.cancel}>
            Annuler
          </button>

          <button type="submit" style={styles.submit}>
            Créer
          </button>
        </div>

      </form>

      {/* LOADING */}
      {loading && <div style={styles.loader}>Chargement...</div>}

      {/* SUCCESS */}
      {success && <div style={styles.success}>Produit créé avec succès !</div>}

    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {

  container: {
    maxWidth: 900,
    margin: "30px auto",
    padding: 20,
    fontFamily: "Arial",
  },

  header: {
    textAlign: "center",
    marginBottom: 30,
  },

  logo: {
    width: 80,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    color: "#00A4A6",
  },

  subtitle: {
    color: "#555",
  },

  form: {
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  row: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 15,
  },

  group: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
  },

  cancel: {
    background: "#ccc",
    color: "#fff",
    padding: "10px 25px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },

  submit: {
    background: "#00A4A6",
    color: "#fff",
    padding: "10px 25px",
    borderRadius: 6,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },

  loader: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#000",
    color: "#fff",
    padding: 20,
    borderRadius: 10,
  },

  success: {
    position: "fixed",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#28a745",
    color: "#fff",
    padding: "12px 25px",
    borderRadius: 6,
  },
};

export default CreateProduct;