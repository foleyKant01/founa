import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  name: string;
  type: string;
  description: string;
  price: number;
  inventory_level: number;
  color: string;
  pr_uid: string;
  image_file: string[];
  pointure?: string;
  style?: string;
  material?: string;
}

const EditProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    price: "",
    inventory_level: "",
    color: "",
    pointure: "",
    style: "",
    material: "",
    image: null,
  });

  // 🔥 Fake data (remplace par ton API)
  useEffect(() => {
    const fakeProduct: Product = {
      name: "Chaussure Nike",
      type: "Chaussures Homme",
      description: "Chaussure stylée et confortable",
      price: 25000,
      inventory_level: 10,
      color: "Noir",
      pr_uid: "PR12345",
      image_file: ["https://via.placeholder.com/300"],
      pointure: "40-45",
      style: "Sport",
      material: "Cuir",
    };

    setProduct(fakeProduct);
    setFormData(fakeProduct);
  }, []);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const updateProducts = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <>
      <div className="product-update-page">

        {/* HEADER */}
        <div className="header">
          <span className="back" onClick={() => navigate("/admin/view-all-products")}>
            ←
          </span>
          <div>
            <h2>Modifier le produit</h2>
            <p>Gérez et mettez à jour les informations</p>
          </div>
        </div>

        {/* FORMULAIRE CENTRÉ */}
        <div className="form-container">
          <form
            onSubmit={updateProducts}
            className={`form-card ${loading ? "blur" : ""}`}
          >
            <h3>Modifier le produit</h3>

            <div className="form-group">
              <label>Nom</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="form-group">
            <label>Prix</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>

            <div className="form-group">
            <label>Stock</label>
            <input name="inventory_level" type="number" value={formData.inventory_level} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Couleur</label>
              <input name="color" value={formData.color} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Pointure</label>
              <input name="pointure" value={formData.pointure} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Style</label>
              <input name="style" value={formData.style} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Matière</label>
              <input name="material" value={formData.material} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Image</label>
              <input name="image" type="file" onChange={handleChange} />
            </div>

            <button type="submit" className="btn">
              Mettre à jour
            </button>
          </form>
        </div>

        {/* LOADING */}
        {loading && <div className="overlay">Chargement...</div>}

        {/* SUCCESS */}
        {success && (
          <div className="success-msg">
            Produit mis à jour avec succès ✅
          </div>
        )}
      </div>

      {/* STYLE INLINE */}
      <style>{`
        .product-update-page {
          background: #f4f6f9;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          padding: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
          width: 100%;
          max-width: 800px;
        }

        .back {
          font-size: 20px;
          cursor: pointer;
        }

        .form-container {
          width: 100%;
          max-width: 600px;
        }

        .form-card {
          background: #fff;
          border-radius: 15px;
          padding: 10px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }

        .form-group input,
        .form-group textarea {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
        }

        .form-row {
          display: flex;
        //   gap: 10px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          background: #111;
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }

        .btn:hover {
          background: #ff9800;
        }

        .blur {
          filter: blur(3px);
        }

        .overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 20px 30px;
          border-radius: 10px;
          font-size: 18px;
        }

        .success-msg {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #28a745;
          color: #fff;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 14px;
        }

        textarea {
          resize: vertical;
        }
      `}</style>
    </>
  );
};

export default EditProduct;