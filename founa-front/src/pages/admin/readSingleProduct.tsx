import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  name: string;
  type: string;
  description: string;
  price: number;
  price_received: number;
  inventory_level: number;
  color: string;
  pr_uid: string;
  image_file: string[];
  pointure?: string;
  model?: string;
  style?: string;
  material?: string;
  creation_date: string;
  update_date: string;
}

const ReadSingleProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");

  // 🔥 Fake data (remplace par ton API)
  useEffect(() => {
    const fakeProduct: Product = {
      name: "Nike Air Max",
      type: "Chaussures Homme",
      description: "Chaussure confortable et stylée",
      price: 30000,
      price_received: 20000,
      inventory_level: 12,
      color: "Noir",
      pr_uid: "PR999",
      image_file: [
        "https://via.placeholder.com/400",
        "https://via.placeholder.com/401",
        "https://via.placeholder.com/402"
      ],
      pointure: "40-45",
      model: "Air Max 2024",
      style: "Sport",
      material: "Cuir",
      creation_date: new Date().toISOString(),
      update_date: new Date().toISOString(),
    };

    setProduct(fakeProduct);
    setMainImage(fakeProduct.image_file[0]);
  }, []);

  // 🗑️ supprimer
  const deleteProduct = (uid: string) => {
    console.log("delete", uid);
    navigate("/admin/view-all-products");
  };

  // ✏️ modifier
  const editProduct = (uid: string) => {
    navigate(`/admin/update-product/${uid}`);
  };

  return (
    <>
      {product && (
        <div className="container product-admin">

          {/* HEADER */}
          <div className="header">
            <div>
              <span
                className="back-btn"
                onClick={() => navigate("/admin/view-all-products")}
              >
                ← Retour
              </span>
              <h2 className="mt-2">Détails du produit</h2>
            </div>

            <div className="actions-top">
              <button
                className="btn warning"
                onClick={() => editProduct(product.pr_uid)}
              >
                Modifier
              </button>

              <button
                className="btn danger"
                onClick={() => deleteProduct(product.pr_uid)}
              >
                Supprimer
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="product-card">

            {/* IMAGE */}
            <div className="image-section">

              {mainImage && (
                <img src={mainImage} className="main-img" />
              )}

              <div className="thumbs">
                {product.image_file.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="thumb"
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>

            </div>

            {/* INFOS */}
            <div className="product-info">

              <h3>{product.name}</h3>
              <p className="text-muted">{product.type}</p>

              <h4 className="price">{product.price} FCFA</h4>

              <p>
                <strong>Description :</strong> {product.description}
              </p>

              <div className="info-grid">

                <p><strong>Référence :</strong> {product.pr_uid}</p>
                <p><strong>Stock :</strong> {product.inventory_level}</p>
                <p><strong>Prix reçu :</strong> {product.price_received}</p>

                <p><strong>Couleur :</strong> {product.color}</p>
                <p><strong>Pointure :</strong> {product.pointure || "—"}</p>

                <p><strong>Modèle :</strong> {product.model || "—"}</p>
                <p><strong>Style :</strong> {product.style || "—"}</p>
                <p><strong>Matière :</strong> {product.material || "—"}</p>

                <p>
                  <strong>Créé le :</strong>{" "}
                  {new Date(product.creation_date).toLocaleString()}
                </p>

                <p>
                  <strong>Mis à jour :</strong>{" "}
                  {new Date(product.update_date).toLocaleString()}
                </p>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* 🎨 STYLE */}
      <style>{`
        .product-admin {
          padding: 20px;
          font-family: 'Poppins', sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .back-btn {
          cursor: pointer;
          color: #555;
          font-size: 14px;
        }

        .actions-top {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: #fff;
        }

        .warning {
          background: #ff9800;
        }

        .danger {
          background: #f44336;
        }

        .product-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          background: #fff;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 25px rgba(0,0,0,0.05);
        }

        .main-img {
          width: 100%;
          max-height: 350px;
          object-fit: cover;
          border-radius: 10px;
        }

        .thumbs {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .thumb {
          width: 60px;
          height: 60px;
          object-fit: cover;
          margin: 5px;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: 0.3s;
        }

        .thumb:hover {
          border-color: #007bff;
          transform: scale(1.05);
        }

        .price {
          color: #28a745;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .info-grid p {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 6px;
          margin: 0;
        }

        @media(max-width: 768px){
          .product-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default ReadSingleProduct;