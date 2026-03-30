import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  useEffect(() => {
    if (uid) fetchProduct(uid);
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

      // 🔥 CORRECTION ICI
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
    console.error("Erreur serveur", err);
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
        const teller = JSON.parse(sessionStorage.getItem("teller") || "{}");
  
        const res = await DeleteProduitByTeller({
          produit_id: uid,
          teller_id: teller.uid,
        });
  
        if (res.data.status === "success") {
          setData((prev) => prev.filter((p) => p.uid !== uid));
  
          Swal.fire({
            icon: "success",
            title: "Supprimé !",
            text: res.data.message || "Produit supprimé avec succès",
            timer: 1500,
            showConfirmButton: false,
          });
  
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: res.data.message || "Une erreur est survenue",
          });
        }
      } 
      catch (error: any) {
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
    navigate(`/teller/edit/${product?.uid}`);
  };

  if (loading) return <div className="loader"></div>;
  if (!product) return <p className="empty">Produit introuvable</p>;

  return (
    <>
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <div>
            <span className="back" onClick={() => navigate(-1)}>← Retour</span>
            <h2>{product.nom}</h2>
          </div>

          <div className="actions">
            <button className="btn edit" onClick={editProduct}>
              Modifier
            </button>
            <button className="btn delete" onClick={() => deleteProduct(product.uid)}>
              Supprimer
            </button>
          </div>
        </div>

        {/* CARD */}
        <div className="card">

          {/* IMAGES */}
          <div className="images">

            <img
              src={mainImage || "https://via.placeholder.com/400"}
              className="main-img"
            />

            <div className="thumbs">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={mainImage === img ? "active" : ""}
                />
              ))}
            </div>
          </div>

          {/* INFOS */}
          <div className="infos">

            <p className="price">{product.prix_vente} FCFA</p>

            <p className="desc">{product.description}</p>

            <div className="grid">

              {/* <div><strong>UID</strong><span>{product.uid}</span></div> */}
              <div><strong>Stock</strong><span>{product.stock_disponible}</span></div>
              <div><strong>MOQ</strong><span>{product.moq || "-"}</span></div>

              <div><strong>Prix fournisseur</strong><span>{product.prix_fournisseur}</span></div>
              {/* <div><strong>Status</strong><span className="status">{product.status}</span></div> */}

              <div><strong>Lien 1</strong><a href={product.lien_1} target="_blank">Voir</a></div>
              <div><strong>Lien 2</strong><a href={product.lien_2} target="_blank">Voir</a></div>

              <div><strong>Créé</strong><span>{new Date(product.creation_date).toLocaleString()}</span></div>
              <div><strong>Mis à jour</strong><span>{new Date(product.update_date).toLocaleString()}</span></div>

            </div>

          </div>
        </div>
      </div>

      {/* STYLE PRO */}
      <style>{`
        * { box-sizing: border-box; }

        .container {
          max-width: 1100px;
          margin: auto;
          padding: 20px;
          font-family: Arial;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back {
          cursor: pointer;
          color: #777;
          font-size: 14px;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: white;
        }

        .edit { background: orange; }
        .delete { background: red; }

        .card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .main-img {
          width: 100%;
          height: 320px;
          object-fit: cover;
          border-radius: 10px;
        }

        .thumbs {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .thumbs img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          cursor: pointer;
          border-radius: 6px;
          border: 2px solid transparent;
        }

        .thumbs img.active {
          border-color: #4CAF50;
        }

        .price {
          font-size: 22px;
          color: green;
          font-weight: bold;
        }

        .desc {
          margin: 10px 0;
          color: #555;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .grid div {
          background: #f7f7f7;
          padding: 10px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          font-size: 14px;
        }

        .grid strong {
          color: #333;
        }

        .grid span, .grid a {
          margin-top: 5px;
          color: #555;
          text-decoration: none;
        }

        .status {
          color: green;
          font-weight: bold;
        }

        .loader {
          margin: 100px auto;
          width: 40px;
          height: 40px;
          border: 4px solid #eee;
          border-top: 4px solid green;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .empty {
          text-align: center;
          margin-top: 50px;
        }

        @media(max-width: 768px){
          .card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default ReadSingleProduct;