import React, { useEffect, useState } from "react";
import {
  GetAllProduits,
  SearchProduct,
} from "../../services/product.service";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/appContext";
import { Search, PackageOpen, ChevronRight } from "lucide-react";

interface Produit {
  id: number;
  uid: string;
  nom: string;
  description: string;
  status: string;
  prix_vente: number;
  stock_disponible: number;
  images: string | string[];
}

const HomePage: React.FC = () => {
  const nav = useNavigate();

  const [Allproduits, setProduits] = useState<Produit[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Produit[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const { refreshCommandeCount } = useApp();

  /* =========================
     RECUPERATION PRODUITS
  ========================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);

        const res = await GetAllProduits();

        setProduits(res.data.produits || []);
      } catch (err) {
        console.error(
          "Erreur récupération produits:",
          err
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  /* =========================
     REFRESH COMMANDES
  ========================= */

  useEffect(() => {
    refreshCommandeCount();
  }, [refreshCommandeCount]);

  /* =========================
     RECHERCHE
  ========================= */

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (!text || text.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);

      const res = await SearchProduct({
        textSearch: text,
      });

      setSearchResults(
        res.data.status === "success"
          ? res.data.products || []
          : []
      );
    } catch (err) {
      console.error("Erreur recherche produits :", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /* =========================
     IMAGE PRODUIT
  ========================= */

  const getFirstImage = (
    images: string | string[]
  ): string => {
    if (!images) return "/default-image.png";

    let imgArray: string[] = [];

    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);

        if (Array.isArray(parsed)) {
          imgArray = parsed;
        }
      } catch {
        imgArray = [];
      }
    } else {
      imgArray = images;
    }

    return imgArray.length > 0
      ? imgArray[0]
      : "/default-image.png";
  };

  /* =========================
     PRODUITS
  ========================= */

  const topProducts = Allproduits.filter(
    (p) => p.status === "Top"
  );

  const displayedProducts = searchText.trim()
    ? searchResults
    : Allproduits;

  /* =========================
     FORMAT PRIX
  ========================= */

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  /* =========================
     CARTE PRODUIT
  ========================= */

  const ProductCard = ({
    produit,
    horizontal = false,
  }: {
    produit: Produit;
    horizontal?: boolean;
  }) => {
    return (
      <div
        className={
          horizontal
            ? "product-card top-product-card"
            : "product-card"
        }
        onClick={() =>
          nav(`/singleproduct/${produit.uid}`)
        }
      >
        <div className="product-image-container">
          <img
            src={getFirstImage(produit.images)}
            alt={produit.nom}
            className="product-image"
          />

          {produit.status === "Top" && (
            <span className="top-badge">
              TOP
            </span>
          )}
        </div>

        <div className="product-content">
          <h3 className="product-name">
            {produit.nom}
          </h3>

          <p className="product-price">
            {formatPrice(produit.prix_vente)} FCFA
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="home-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="home-header">
        <div className="header-inner">

          <div className="logo-container">
            <img
              src="/logo-founa2.png"
              alt="FOUNA"
              className="logo"
            />
          </div>

          <div className="search-container">

            <Search
              size={20}
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchText}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
            />

            {searchLoading && (
              <div className="search-loader" />
            )}
          </div>

        </div>
      </header>

      {/* =========================
          CONTENU PRINCIPAL
      ========================= */}

      <main className="home-content">
        {loadingProducts ? (
          <div className="products-loading">
            <div className="loading-spinner-large" />
          </div>
        ) : (
          <>
            {/* TOUT TON CONTENU ACTUEL DES PRODUITS */}
          </>
        )}

        {/* =========================
            RECHERCHE
        ========================= */}

        {searchText.trim() ? (

          <section className="products-section">

            <div className="section-header">

              <div>
                <span className="section-kicker">
                  RECHERCHE
                </span>

                <h2>
                  Résultats de recherche
                </h2>

                <p>
                  Résultats pour « {searchText} »
                </p>
              </div>

              {searchResults.length > 0 && (
                <span className="result-count">
                  {searchResults.length} produit
                  {searchResults.length > 1 ? "s" : ""}
                </span>
              )}

            </div>

            {searchLoading ? (

              <div className="empty-state">
                <div className="loading-spinner" />
                <p>Recherche en cours...</p>
              </div>

            ) : displayedProducts.length === 0 ? (

              <div className="empty-state">

                <PackageOpen size={52} />

                <h3>
                  Aucun produit trouvé
                </h3>

                <p>
                  Aucun produit ne correspond à
                  votre recherche.
                </p>

              </div>

            ) : (

              <div className="product-grid">

                {displayedProducts.map((produit) => (
                  <ProductCard
                    key={produit.uid}
                    produit={produit}
                  />
                ))}

              </div>

            )}

          </section>

        ) : (

          <>

            {/* =========================
                TOP PRODUITS
            ========================= */}

            {topProducts.length > 0 && (
              <section className="products-section">

                <div className="section-header">

                  <div>
                    <span className="section-kicker">
                      SÉLECTION FOUNA
                    </span>

                    <h2>
                      Produits au top
                    </h2>

                    <p>
                      Découvrez les produits
                      actuellement mis en avant.
                    </p>
                  </div>

                  <button
                    className="see-all-button"
                    onClick={() =>
                      document
                        .getElementById(
                          "popular-products"
                        )
                        ?.scrollIntoView({
                          behavior: "smooth",
                        })
                    }
                  >
                    Voir tous
                    <ChevronRight size={18} />
                  </button>

                </div>

                <div className="top-products-slider">

                  {topProducts.map((produit) => (
                    <ProductCard
                      key={produit.uid}
                      produit={produit}
                      horizontal
                    />
                  ))}

                </div>

              </section>
            )}

            {/* =========================
                PRODUITS POPULAIRES
            ========================= */}

            <section
              className="products-section"
              id="popular-products"
            >

              <div className="section-header">

                <div>
                  <span className="section-kicker">
                    CATALOGUE
                  </span>

                  <h2>
                    Produits populaires
                  </h2>

                  <p>
                    Parcourez notre catalogue et
                    trouvez les produits qui vous
                    intéressent.
                  </p>
                </div>

                <span className="product-total">
                  {Allproduits.length} produit
                  {Allproduits.length > 1 ? "s" : ""}
                </span>

              </div>

              {Allproduits.length === 0 ? (

                <div className="empty-state">

                  <PackageOpen size={52} />

                  <h3>
                    Aucun produit disponible
                  </h3>

                  <p>
                    Les produits apparaîtront ici
                    lorsqu'ils seront disponibles.
                  </p>

                </div>

              ) : (

                <div className="product-grid">

                  {Allproduits.map((produit) => (
                    <ProductCard
                      key={produit.uid}
                      produit={produit}
                    />
                  ))}

                </div>

              )}

            </section>

          </>
        )}

      </main>

      {/* =========================
          CSS
      ========================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .home-page {
          min-height: 100vh;
          width: 100%;
          background: #f5f7f8;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #1f2937;
          padding-bottom: 60px;
        }

        /* =========================
           HEADER
        ========================= */

        .home-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: #00a4a6;
          box-shadow:
            0 2px 15px rgba(0, 0, 0, 0.08);
        }

        .header-inner {
          width: 100%;
          min-height: 72px;
          padding: 10px 30px;
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .products-loading {
          width: 100%;
          min-height: calc(100vh - 72px);

          display: flex;
          align-items: center;
          justify-content: center;

          background: transparent;
        }

        .loading-spinner-large {
          width: 45px;
          height: 45px;

          border: 4px solid #dfe7e7;
          border-top-color: #00a4a6;

          border-radius: 50%;

          animation: searchSpin 0.8s linear infinite;
        }

        @keyframes searchSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .logo-container {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo {
          width: 90px;
          height: 52px;
          object-fit: contain;
        }

        .search-container {
          flex: 1;
          max-width: 900px;
          height: 48px;
          margin: 0 auto;

          display: flex;
          align-items: center;

          background: #ffffff;
          border-radius: 14px;

          padding: 0 16px;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.08);

          position: relative;
        }

        .search-icon {
          color: #6b7280;
          flex-shrink: 0;
          margin-right: 10px;
        }

        .search-container input {
          width: 100%;
          height: 100%;

          border: none;
          outline: none;

          background: transparent;

          font-size: 15px;
          color: #1f2937;
        }

        .search-container input::placeholder {
          color: #9ca3af;
        }

        .search-loader {
          width: 18px;
          height: 18px;

          border: 2px solid #d1d5db;
          border-top-color: #00a4a6;

          border-radius: 50%;

          animation:
            searchSpin 0.7s linear infinite;

          flex-shrink: 0;
        }

        @keyframes searchSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =========================
           CONTENU
        ========================= */

        .home-content {
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
          padding: 30px;
        }

        .products-section {
          width: 100%;
          margin-bottom: 45px;
        }

        /* =========================
           SECTION HEADER
        ========================= */

        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;

          margin-bottom: 20px;
        }

        .section-kicker {
          display: block;

          color: #00a4a6;

          font-size: 11px;
          font-weight: 700;

          letter-spacing: 1.2px;

          margin-bottom: 5px;
        }

        .section-header h2 {
          margin: 0;

          color: #111827;

          font-size: 25px;
          font-weight: 700;
        }

        .section-header p {
          margin: 6px 0 0;

          color: #6b7280;

          font-size: 14px;
        }

        .result-count,
        .product-total {
          white-space: nowrap;

          color: #6b7280;

          background: #ffffff;

          padding: 8px 13px;

          border-radius: 20px;

          font-size: 13px;

          border: 1px solid #e5e7eb;
        }

        .see-all-button {
          display: flex;
          align-items: center;
          gap: 4px;

          border: none;
          background: transparent;

          color: #00a4a6;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          padding: 8px 0;
        }

        .see-all-button:hover {
          opacity: 0.75;
        }

        /* =========================
           TOP PRODUCTS
        ========================= */

        .top-products-slider {
          display: flex;

          gap: 16px;

          overflow-x: auto;

          padding:
            5px
            4px
            15px
            4px;

          scrollbar-width: none;

          scroll-behavior: smooth;
        }

        .top-products-slider::-webkit-scrollbar {
          display: none;
        }

        .top-product-card {
          flex: 0 0 210px;
        }

        /* =========================
           GRILLE PRODUITS
        ========================= */

        .product-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fill,
              minmax(180px, 1fr)
            );

          gap: 18px;

          width: 100%;
        }

        /* =========================
           CARTE PRODUIT
        ========================= */

        .product-card {
          width: 100%;

          min-width: 0;

          background: #ffffff;

          border-radius: 14px;

          overflow: hidden;

          cursor: pointer;

          border:
            1px solid
            rgba(0, 0, 0, 0.04);

          box-shadow:
            0 4px 15px
            rgba(0, 0, 0, 0.045);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .product-card:hover {
          transform:
            translateY(-4px);

          box-shadow:
            0 10px 25px
            rgba(0, 0, 0, 0.10);
        }

        .product-image-container {
          position: relative;

          width: 100%;

          aspect-ratio: 1 / 1;

          background: #f4f5f6;

          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          transition:
            transform 0.3s ease;
        }

        .product-card:hover
        .product-image {
          transform: scale(1.04);
        }

        .top-badge {
          position: absolute;

          top: 10px;
          left: 10px;

          background: #00a4a6;

          color: white;

          font-size: 10px;
          font-weight: 700;

          padding: 5px 8px;

          border-radius: 6px;

          letter-spacing: 0.5px;
        }

        .product-content {
          padding: 12px 13px 15px;
        }

        .product-name {
          margin: 0 0 9px;

          color: #1f2937;

          font-size: 14px;
          font-weight: 500;

          line-height: 1.4;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          overflow: hidden;

          min-height: 39px;
        }

        .product-price {
          margin: 0;

          color: #00a4a6;

          font-size: 16px;

          font-weight: 700;
        }

        /* =========================
           EMPTY STATE
        ========================= */

        .empty-state {
          width: 100%;

          min-height: 280px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;

          background: #ffffff;

          border-radius: 16px;

          border:
            1px dashed
            #d1d5db;

          color: #9ca3af;

          padding: 30px;
        }

        .empty-state h3 {
          color: #374151;

          margin:
            15px
            0
            5px;

          font-size: 17px;
        }

        .empty-state p {
          margin: 0;

          font-size: 14px;
        }

        .loading-spinner {
          width: 38px;
          height: 38px;

          border:
            3px solid
            #e5e7eb;

          border-top-color:
            #00a4a6;

          border-radius: 50%;

          animation:
            searchSpin 0.8s linear infinite;
        }

        /* =========================
           TABLETTE
        ========================= */

        @media (max-width: 900px) {

          .header-inner {
            padding:
              10px
              18px;

            gap: 15px;
          }

          .home-content {
            padding:
              25px
              18px;
          }

          .product-grid {
            grid-template-columns:
              repeat(
                3,
                minmax(0, 1fr)
              );

            gap: 14px;
          }

          .top-product-card {
            flex-basis: 190px;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {

          .home-header {
            position: sticky;
          }

          .header-inner {
            min-height: 65px;

            padding:
              8px
              10px;

            gap: 8px;
          }

          .logo {
            width: 65px;
            height: 44px;
          }

          .search-container {
            height: 44px;

            border-radius: 12px;

            padding:
              0
              12px;
          }

          .search-container input {
            font-size: 14px;
          }

          .home-content {
            padding:
              20px
              10px;
          }

          .section-header {
            align-items: flex-start;

            flex-direction: column;

            gap: 10px;
          }

          .section-header h2 {
            font-size: 20px;
          }

          .section-header p {
            font-size: 13px;
          }

          .see-all-button {
            align-self: flex-end;
          }

          .product-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 10px;
          }

          .top-products-slider {
            gap: 10px;
          }

          .top-product-card {
            flex-basis: 165px;
          }

          .product-content {
            padding:
              10px
              10px
              12px;
          }

          .product-name {
            font-size: 13px;

            min-height: 36px;
          }

          .product-price {
            font-size: 14px;
          }

          .top-badge {
            top: 7px;
            left: 7px;

            font-size: 9px;

            padding:
              4px
              6px;
          }
        }

        /* =========================
           PETITS TELEPHONES
        ========================= */

        @media (max-width: 380px) {

          .home-content {
            padding:
              16px
              8px;
          }

          .product-grid {
            gap: 7px;
          }

          .product-content {
            padding:
              8px;
              8px
              10px;
          }

          .product-name {
            font-size: 12px;
          }

          .product-price {
            font-size: 13px;
          }

          .top-product-card {
            flex-basis: 150px;
          }
        }

      `}</style>
    </div>
  );
};

export default HomePage;