import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  name: string;
  type: string;
  price: number;
  pr_uid: string;
  inventory_level: number;
  image_file: string[];
}

const ReadAllProducts = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Product[]>([]);

  // 🔥 Fake data (remplace par ton API)
  useEffect(() => {
    const fakeData: Product[] = [
      {
        name: "Nike Air",
        type: "Chaussures Homme",
        price: 25000,
        pr_uid: "PR001",
        inventory_level: 3,
        image_file: ["https://via.placeholder.com/300"],
      },
      {
        name: "Sandale Femme",
        type: "Chaussures Femme",
        price: 15000,
        pr_uid: "PR002",
        inventory_level: 10,
        image_file: ["https://via.placeholder.com/300"],
      },
    ];

    setData(fakeData);
  }, []);

  // 👁️ Voir produit
  const viewsingleProducts = (uid: string) => {
    navigate(`/admin/product/${uid}`);
  };

  // 🗑️ Supprimer produit
  const deleteProduct = (uid: string) => {
    setData(prev => prev.filter(p => p.pr_uid !== uid));
  };

  return (
    <>
      <div className="admin-products-page">

        {/* HEADER */}
        <div className="header">
          <div className="left">
            <span className="back-btn" onClick={() => navigate("/admin/ad-home")}>
              ←
            </span>
            <div>
              <h2>Produits</h2>
              <p>Gérez vos produits facilement</p>
            </div>
          </div>
        </div>

        {/* LISTE */}
        {data.length > 0 ? (
          <div className="table-container">

            <table className="product-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((product) => (
                  <tr key={product.pr_uid}>
                    <td>{product.name}</td>
                    <td>{product.type}</td>
                    <td className="price">{product.price} FCFA</td>
                    <td>
                      <span
                        className={`stock ${
                          product.inventory_level < 5 ? "low" : ""
                        }`}
                      >
                        {product.inventory_level}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="btn-view"
                        onClick={() => viewsingleProducts(product.pr_uid)}
                      >
                        👁️
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => deleteProduct(product.pr_uid)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        ) : (
          <div className="empty-state">
            📦
            <p>Aucun produit disponible</p>
          </div>
        )}

      </div>

      {/* STYLE INLINE */}
      <style>{`
        .admin-products-page {
          padding: 5px;
          background: #f4f6f9;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }

        .header {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
        }

        .left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .back-btn {
          font-size: 20px;
          cursor: pointer;
        }

        .table-container {
          background: #fff;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          overflow-x: auto;
        }

        .product-table {
          width: 100%;
          border-collapse: collapse;
        }

        .product-table th {
          text-align: left;
          padding: 12px;
          background: #f4f6f9;
          font-size: 14px;
          color: #555;
        }

        .product-table td {
          padding: 12px;
          border-top: 1px solid #eee;
          font-size: 14px;
        }

        .product-table tr:hover {
          background: #fafafa;
        }

        .price {
          font-weight: bold;
          color: #28a745;
        }

        .stock {
          padding: 5px 10px;
          border-radius: 20px;
          background: #e8f5e9;
          color: #2e7d32;
          font-size: 12px;
        }

        .stock.low {
          background: #ffebee;
          color: #c62828;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .actions button {
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-view {
          background: #2196f3;
          color: #fff;
        }

        .btn-delete {
          background: #f44336;
          color: #fff;
        }

        .empty-state {
          text-align: center;
          padding: 50px;
          color: #777;
        }
      `}</style>
    </>
  );
};

export default ReadAllProducts;