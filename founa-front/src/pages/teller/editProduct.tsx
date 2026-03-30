import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateProduit, GetSingleProduit } from "../../services/product.service";

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

  const teller = JSON.parse(sessionStorage.getItem("teller") || "{}");
  const teller_id = teller.uid || "";

  // 🔥 NORMALIZE IMAGES
  const normalizeImages = (images: any): string[] => {
    if (Array.isArray(images)) return images;

    if (typeof images === "string") {
      try {
        return JSON.parse(images);
      } catch {
        return [];
      }
    }

    return [];
  };

  // 🔥 FETCH PRODUIT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await GetSingleProduit({ produit_id : id });
        console.log(id)
        console.log(id)

        if (res.data.status === "success") {
          const p = res.data.produit;

          setForm({
          nom: p.nom ?? "",
          description: p.description ?? "",
          prix_fournisseur: String(p.prix_fournisseur ?? ""),
          stock_disponible: String(p.stock_disponible ?? ""),
          moq: Number(p.moq ?? 1),
          lien_1: p.lien_1 ?? "",
          lien_2: p.lien_2 ?? "",
          images: [],
        });

          setExistingImages(normalizeImages(p.images));
        }
      } catch (err) {
        console.error(err);
        alert("Erreur chargement produit");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // 🔥 HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 HANDLE FILES
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, images: Array.from(e.target.files) });
    }
  };

  // 🔥 SUBMIT UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("produit_id", id || "");
      formData.append("nom", form.nom);
      formData.append("description", form.description);
      formData.append("prix_fournisseur", form.prix_fournisseur || "0");
      formData.append("stock_disponible", form.stock_disponible || "0");
      formData.append("moq", form.moq.toString());
      formData.append("lien_1", form.lien_1);
      formData.append("lien_2", form.lien_2);
      formData.append("teller_id", teller_id);

      // 🔥 nouvelles images
      form.images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await UpdateProduit(formData);

      if (res.data.status === "success") {
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          nav(-1);
        }, 2500);
      } else {
        alert(res.data.message || "Erreur update produit");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 STYLE PRO
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: 900,
      margin: "30px auto",
      padding: 10,
      fontFamily: "Arial",
    },
    header: { textAlign: "center", marginBottom: 30 },
    title: { fontSize: 28, color: "#00A4A6" },
    subtitle: { color: "#555" },
    form: {
      background: "#fff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    },
    row: { display: "flex", gap: 20, flexWrap: "wrap" },
    group: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      marginBottom: 15,
    },
    input: {
      padding: 10,
      borderRadius: 6,
      border: "1px solid #ccc",
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
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
    },
    submit: {
      background: "#00A4A6",
      color: "#fff",
      padding: "10px 25px",
      border: "none",
      borderRadius: 6,
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
    imagesPreview: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginTop: 10,
    },
    img: { width: 80, height: 80, objectFit: "cover", borderRadius: 6 },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Modifier produit</h2>
        <p style={styles.subtitle}>Mettre à jour les informations</p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ ...styles.form, filter: loading ? "blur(3px)" : "none" }}
      >
        <div style={styles.group}>
          <label>Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.group}>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} style={styles.input} />
        </div>

          <div style={styles.group}>
            <label>Prix fournisseur</label>
            <input type="number" name="prix_fournisseur" value={form.prix_fournisseur} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label>Stock</label>
            <input type="number" name="stock_disponible" value={form.stock_disponible} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label>MOQ</label>
            <input type="number" name="moq" value={form.moq} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label>Lien 1</label>
            <input name="lien_1" value={form.lien_1} onChange={handleChange} style={styles.input} />
          </div>

          <div style={styles.group}>
            <label>Lien 2</label>
            <input name="lien_2" value={form.lien_2} onChange={handleChange} style={styles.input} />
          </div>

        {/* 🔥 PREVIEW IMAGES EXISTANTES */}
        <div style={styles.group}>
          <label>Images actuelles</label>
          <div style={styles.imagesPreview}>
            {existingImages.map((img, i) => (
              <img key={i} src={img} style={styles.img} />
            ))}
          </div>
        </div>

        <div style={styles.group}>
          <label>Ajouter nouvelles images</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={() => nav(-1)} style={styles.cancel}>
            Annuler
          </button>

          <button type="submit" style={styles.submit}>
            Mettre à jour
          </button>
        </div>
      </form>

      {loading && <div style={styles.loader}>Chargement...</div>}
      {success && <div style={styles.success}>Produit mis à jour ✅</div>}
    </div>
  );
};

export default EditProduct;