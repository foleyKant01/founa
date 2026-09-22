import React, { useEffect, useRef, useState } from "react";
import {
  GetAllProduits,
  SearchProduct,
  TopProducts,
  GetProduitsByCategorie,
} from "../../services/product.service";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/appContext";
import {
  Search,
  PackageOpen,
  ChevronRight,
  ChevronLeft,
  Factory,
  Zap,
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  HeartPulse,
  Baby,
  Car,
  Package,
  Building2,
  Wheat,
  PawPrint,
  FlaskConical,
  Scissors,
  Gift,
  Luggage,
  Dumbbell,
  BriefcaseBusiness,
  BatteryCharging,
  Leaf,
  ShieldCheck,
  Utensils,
  Radio,
  Armchair,
  Wrench,
  Palette,
  Pickaxe,
  CircleDot,
  Briefcase,
} from "lucide-react";
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

interface HeroSlide {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  button: string;
  image: string;
  badge: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: "VOTRE UNIVERS FOUNA",
    title: "Trouvez.",
    highlight: "Commandez.",
    description:
      "Découvrez des produits sélectionnés auprès de fournisseurs internationaux et commandez-les simplement depuis FOUNA.",
    button: "Découvrir les produits",
    image: "/hero-founa-1.png",
    badge: "FOUNA",
  },
  {
    eyebrow: "DES PRODUITS DU MONDE",
    title: "Un monde de produits",
    highlight: "à portée de main.",
    description:
      "FOUNA vous permet d'accéder facilement à une sélection de produits provenant de fournisseurs internationaux.",
    button: "Explorer FOUNA",
    image: "/hero-founa-2.png",
    badge: "INTERNATIONAL",
  },
  {
    eyebrow: "VOUS CHERCHEZ UN PRODUIT ?",
    title: "FOUNA",
    highlight: "le trouve.",
    description:
      "Recherchez simplement le produit dont vous avez besoin et découvrez les disponibilités proposées sur FOUNA.",
    button: "Rechercher un produit",
    image: "/hero-founa-3.png",
    badge: "RECHERCHE",
  },
];

interface CategoryItem {
  name: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: "Machines & Industrie",
    icon: Factory,
  },
  {
    name: "Équipements & Fournitures électriques",
    icon: Zap,
  },
  {
    name: "Électronique grand public",
    icon: Smartphone,
  },
  {
    name: "Vêtements & Accessoires",
    icon: Shirt,
  },
  {
    name: "Maison & Jardin",
    icon: Home,
  },
  {
    name: "Beauté & Soins personnels",
    icon: Sparkles,
  },
  {
    name: "Santé & Médical",
    icon: HeartPulse,
  },
  {
    name: "Bébé, Enfants & Jouets",
    icon: Baby,
  },
  {
    name: "Véhicules & Transport",
    icon: Car,
  },
  {
    name: "Emballage & Impression",
    icon: Package,
  },
  {
    name: "Construction & Immobilier",
    icon: Building2,
  },
  {
    name: "Agriculture & Alimentation",
    icon: Wheat,
  },
  {
    name: "Élevage & Produits pour animaux",
    icon: PawPrint,
  },
  {
    name: "Produits chimiques",
    icon: FlaskConical,
  },
  {
    name: "Textiles & Cuir",
    icon: Scissors,
  },
  {
    name: "Cadeaux, Artisanat & Souvenirs",
    icon: Gift,
  },
  {
    name: "Bagages, Sacs & Étuis",
    icon: Luggage,
  },
  {
    name: "Sports & Divertissement",
    icon: Dumbbell,
  },
  {
    name: "Fournitures de bureau & scolaires",
    icon: BriefcaseBusiness,
  },
  {
    name: "Énergie",
    icon: BatteryCharging,
  },
  {
    name: "Environnement",
    icon: Leaf,
  },
  {
    name: "Sécurité & Protection",
    icon: ShieldCheck,
  },
  {
    name: "Équipements de services",
    icon: Utensils,
  },
  {
    name: "Télécommunications",
    icon: Radio,
  },
  {
    name: "Mobilier",
    icon: Armchair,
  },
  {
    name: "Outils & Quincaillerie",
    icon: Wrench,
  },
  {
    name: "Arts & Artisanat",
    icon: Palette,
  },
  {
    name: "Minéraux & Métallurgie",
    icon: Pickaxe,
  },
  {
    name: "Caoutchouc & Plastiques",
    icon: CircleDot,
  },
  {
    name: "Services aux entreprises",
    icon: Briefcase,
  },
];

const HomePage: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { refreshCommandeCount } = useApp();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [allProducts, setAllProducts] = useState<Produit[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Produit[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [topProducts, setTopProducts] = useState<Produit[]>([]);
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [categoryProducts, setCategoryProducts] = useState<Produit[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);


  const refreshHomePage = async () => {
    try {
      setLoadingProducts(true);

      // Réinitialiser les recherches
      setSearchText("");
      setSearchResults([]);

      // Réinitialiser la catégorie sélectionnée
      setSelectedCategory("");
      setCategoryProducts([]);

      // Recharger tous les produits
      const productsResponse = await GetAllProduits();

      if (productsResponse?.data?.status === "success") {
        setAllProducts(productsResponse.data.produits || []);
      } else {
        setAllProducts([]);
      }

      // Recharger les produits populaires / top produits
      const topResponse = await TopProducts();

      if (topResponse?.data?.status === "success") {
        setTopProducts(topResponse.data.produits || []);
      } else {
        setTopProducts([]);
      }
    } catch (error) {
      console.error(
        "Erreur lors du rafraîchissement de la page d'accueil :",
        error
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  /*
   * =========================
   * HERO SLIDER
   * =========================
   */

  const nextSlide = () => {
    setCurrentSlide((previous) =>
      previous === HERO_SLIDES.length - 1 ? 0 : previous + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((previous) =>
      previous === 0 ? HERO_SLIDES.length - 1 : previous - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isHeroPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentSlide((previous) =>
        previous === HERO_SLIDES.length - 1 ? 0 : previous + 1
      );
    }, 5500);

    return () => {
      window.clearInterval(interval);
    };
  }, [isHeroPaused]);

  // const handleHeroAction = () => {
  //   if (currentSlide === 2) {
  //     searchInputRef.current?.focus();
  //     return;
  //   }

  //   document.getElementById("popular-products")?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  /*
   * =========================
   * TOP PRODUITS
   * =========================
   */

  useEffect(() => {
    const loadTopProducts = async () => {
      try {
        setLoadingTopProducts(true);

        const response = await TopProducts();

        if (response.data.status === "success") {
          setTopProducts(response.data.produits || []);
        } else {
          setTopProducts([]);

          console.error(
            response.data.message || "Erreur récupération top produits"
          );
        }
      } catch (error) {
        console.error("Erreur récupération top produits :", error);
        setTopProducts([]);
      } finally {
        setLoadingTopProducts(false);
      }
    };

    loadTopProducts();
  }, []);

  /*
   * =========================
   * RECUPERATION PRODUITS
   * =========================
   */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await GetAllProduits();

        if (response.data.status === "success") {
          setAllProducts(response.data.produits || []);
        } else {
          setAllProducts([]);
          console.error(
            response.data.message || "Erreur récupération produits"
          );
        }
      } catch (error) {
        console.error("Erreur récupération produits :", error);
        setAllProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  /*
   * =========================
   * REFRESH COMMANDES
   * =========================
   */

  useEffect(() => {
    refreshCommandeCount();
  }, [refreshCommandeCount]);


  useEffect(() => {
  if (location.pathname !== "/home") {
    return;
  }

  if (location.state?.refreshHome) {
    refreshHomePage();
  }
}, [location.state?.refreshHome]);

  /*
   * =========================
   * RECHERCHE
   * =========================
   */

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (!text || text.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(true);

      const response = await SearchProduct({
        textSearch: text,
      });

      if (response.data.status === "success") {
        setSearchResults(response.data.products || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erreur recherche produits :", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /*
   * =========================
   * IMAGE PRODUIT
   * =========================
   */

  const getFirstImage = (images: string | string[]): string => {
    if (!images) {
      return "/default-image.png";
    }

    let imageArray: string[] = [];

    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);

        if (Array.isArray(parsed)) {
          imageArray = parsed;
        } else if (typeof parsed === "string") {
          imageArray = [parsed];
        }
      } catch {
        if (images.trim() !== "") {
          imageArray = [images];
        }
      }
    } else {
      imageArray = images;
    }

    return imageArray.length > 0
      ? imageArray[0]
      : "/default-image.png";
  };

  /*
   * =========================
   * FORMAT PRIX
   * =========================
   */

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  /*
   * =========================
   * CARTE PRODUIT
   * =========================
   */

  const ProductCard = ({
    produit,
    horizontal = false,
  }: {
    produit: Produit;
    horizontal?: boolean;
  }) => {
    const image = getFirstImage(produit.images);

    return (
      <div
        className={
          horizontal
            ? "product-card top-product-card"
            : "product-card"
        }
        onClick={() => nav(`/singleproduct/${produit.uid}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            nav(`/singleproduct/${produit.uid}`);
          }
        }}
      >
        <div className="product-image-container">
          <img
            src={image}
            alt={produit.nom}
            className="product-image"
            onError={(event) => {
              event.currentTarget.src = "/default-image.png";
            }}
          />

          {produit.status === "Top" && (
            <span className="top-badge">TOP</span>
          )}
        </div>

        <div className="product-content">
          <h3 className="product-name">{produit.nom}</h3>

          <p className="product-price">
            {formatPrice(produit.prix_vente)} FCFA
          </p>
        </div>
      </div>
    );
  };

const handleCategoryClick = async (categorie: string) => {
  try {
    setSelectedCategory(categorie);
    setCategoryLoading(true);
    setCategoryProducts([]);

    const response = await GetProduitsByCategorie({
      categorie: categorie,
    });

    if (response.data.status === "success") {
      setCategoryProducts(response.data.produits || []);
    } else {
      setCategoryProducts([]);

      console.error(
        response.data.message ||
          "Erreur récupération produits par catégorie"
      );
    }

  } catch (error) {
    console.error(
      "Erreur lors de la recherche des produits par catégorie :",
      error
    );

    setCategoryProducts([]);
  } finally {
    setCategoryLoading(false);
  }
};

  return (
    <div className="home-page">

      <header className="home-header">
        <div className="header-inner">
          <div className="logo-container">
            <img src="/logo-founa2.png" alt="FOUNA" className="logo" /></div>
          <div className="search-container">
            <Search
              size={20}
              className="search-icon"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher un produit..."
              value={searchText}
              onChange={(event) => handleSearch(event.target.value)}
              aria-label="Rechercher un produit"
            />
            {searchLoading && (
              <div className="search-loader" />
            )}
          </div>
        </div>
      </header>

      {!searchText.trim() && (
        <section
          className="hero-section"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        >
          <div className="hero-slider">
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === currentSlide;

              return (
                <div
                  key={slide.eyebrow}
                  className={`hero-slide ${isActive ? "active" : ""
                    }`}
                  style={{
                    backgroundImage: `url("${slide.image}")`,
                  }}
                  aria-hidden={!isActive}
                >
                  <div className="hero-overlay" />

                  <div className="hero-content">
                    <div className="hero-text">
                      {/* <div className="hero-eyebrow">
                        <Sparkles size={15} />
                        {slide.eyebrow}
                      </div> */}

                      {/* <h1>
                        {slide.title}{" "}
                        <span>{slide.highlight}</span>
                      </h1> */}

                      {/* <p>{slide.description}</p> */}

                      {/* <button
                        type="button"
                        className="hero-button"
                        onClick={handleHeroAction}
                      >
                        {slide.button}
                        <ArrowRight size={18} />
                      </button> */}
                    </div>

                    {/* <div className="hero-side">
                      <div className="hero-badge">
                        <Globe2 size={18} />
                        <span>{slide.badge}</span>
                      </div>

                      <div className="hero-floating-card">
                        <ShoppingBag size={22} />

                        <div>
                          <strong>FOUNA</strong>
                          <span>
                            Votre passerelle vers les produits du monde.
                          </span>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              );
            })}

            {/* Bouton précédent */}
            <button
              type="button"
              className="hero-arrow hero-arrow-left"
              onClick={previousSlide}
              aria-label="Slide précédent"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Bouton suivant */}
            <button
              type="button"
              className="hero-arrow hero-arrow-right"
              onClick={nextSlide}
              aria-label="Slide suivant"
            >
              <ChevronRight size={22} />
            </button>

            {/* Indicateurs */}
            <div className="hero-dots">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={`dot-${slide.eyebrow}`}
                  type="button"
                  className={`hero-dot ${index === currentSlide ? "active" : ""
                    }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Aller au slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {!searchText.trim() && (
        <section className="categories-section">
          <div className="categories-container">

            <div className="categories-header">
              <div>
                <span className="categories-kicker">
                  EXPLOREZ FOUNA
                </span>

                <h2>Nos catégories</h2>
              </div>

              <span className="categories-scroll-hint">
                Faites défiler →
              </span>
            </div>

            <div className="categories-rows">

              {/* PREMIÈRE LIGNE */}
              <div className="categories-row">
                {CATEGORIES.slice(0, Math.ceil(CATEGORIES.length / 2)).map(
                  (category) => {
                    const Icon = category.icon;

                    return (
                      <button
                        type="button"
                        className={`category-item ${
                          selectedCategory === category.name ? "active" : ""
                        }`}
                        key={category.name}
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <span className="category-circle">
                          <Icon size={25} strokeWidth={1.8} />
                        </span>

                        <span className="category-name">
                          {category.name}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {/* DEUXIÈME LIGNE */}
              <div className="categories-row">
                {CATEGORIES.slice(
                  Math.ceil(CATEGORIES.length / 2)
                ).map((category) => {
                  const Icon = category.icon;

                  return (
                    <button
                      type="button"
                      className={`category-item ${
                        selectedCategory === category.name ? "active" : ""
                      }`}
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <span className="category-circle">
                        <Icon size={25} strokeWidth={1.8} />
                      </span>

                      <span className="category-name">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </section>
      )}

      <main className="home-content">
        {loadingProducts ? (
          <div className="products-loading">
            <div className="loading-spinner-large" />
            <p>Chargement des produits...</p>
          </div>
        ) : (
          <>
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

                    <h2>Résultats de recherche</h2>

                    <p>
                      Résultats pour « {searchText} »
                    </p>
                  </div>

                  {!searchLoading &&
                    searchResults.length > 0 && (
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
                ) : searchResults.length === 0 ? (
                  <div className="empty-state">
                    <PackageOpen size={52} />

                    <h3>
                      Aucun produit trouvé pour l'instant
                    </h3>

                    <p>
                      Le produit en rapport à votre recherche
                      sera disponible dans 48h.
                    </p>
                  </div>
                ) : (
                  <div className="product-grid">
                    {searchResults.map((produit) => (
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

                {!loadingTopProducts &&
                  topProducts.length > 0 && (
                    <section className="products-section top-section">
                      <div className="section-header">
                        <div>
                          <span className="section-kicker">
                            SÉLECTION FOUNA
                          </span>

                          <h2>Produits au top</h2>

                          <p>
                            Les produits les plus commandés
                            par nos clients.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="see-all-button"
                          onClick={() =>
                            document
                              .getElementById("popular-products")
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
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
                      {selectedCategory ? (
                        <>
                          <span className="section-kicker">
                            CATÉGORIE FOUNA
                          </span>

                          <h2>
                            {selectedCategory}
                          </h2>

                          <p>
                            Découvrez les produits disponibles dans la
                            catégorie.
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="section-kicker">
                            CATALOGUE FOUNA
                          </span>

                          <h2>
                            Produits populaires
                          </h2>

                          <p>
                            Découvrez tous nos produits.
                          </p>
                        </>
                      )}
                    </div>

                    {selectedCategory && !categoryLoading && (
                      <span className="result-count">
                        {categoryProducts.length} produit
                        {categoryProducts.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {selectedCategory ? (
                    categoryLoading ? (
                      <div className="empty-state">
                        <div className="loading-spinner" />

                        <p>
                          Chargement des produits de la catégorie...
                        </p>
                      </div>
                    ) : categoryProducts.length === 0 ? (
                      <div className="empty-state">
                        <PackageOpen size={52} />

                        <h3>
                          Aucun produit dans cette catégorie
                        </h3>

                        <p>
                          Aucun produit n'est actuellement disponible
                          dans la catégorie « {selectedCategory} ».
                        </p>
                      </div>
                    ) : (
                      <div className="product-grid">
                        {categoryProducts.map((produit) => (
                          <ProductCard
                            key={produit.uid}
                            produit={produit}
                          />
                        ))}
                      </div>
                    )
                  ) : allProducts.length === 0 ? (
                    <div className="empty-state">
                      <PackageOpen size={52} />

                      <h3>
                        Aucun produit disponible
                      </h3>

                      <p>
                        Aucun produit n'est actuellement disponible.
                      </p>
                    </div>
                  ) : (
                    <div className="product-grid">
                      {allProducts.map((produit) => (
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
          </>
        )}
      </main>

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

        .logo-container {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo {
          width: 90px;
          height: 52px;
          object-fit: contain;
          display: block;
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
            0 3px 12px rgba(0, 0, 0, 0.08);

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

          font-size: 16px;
          color: #1f2937;
        }

        .search-container input::placeholder {
          color: #9ca3af;
          font-size: 14px;
          font-weight: 400;
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

        /* =========================
           HERO
        ========================= */

        .hero-section {
          width: 100%;
          margin-top: 12px;
          background: #111827;
        }

        .hero-slider {
          position: relative;
          width: 100%;
          height: 420px;
          // overflow: hidden;
        }

        .hero-slide {
          position: absolute;
          inset: 0;

          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;

          // opacity: 0;
          visibility: hidden;

          transition:
            opacity 0.7s ease,
            visibility 0.7s ease;

          display: flex;
          align-items: center;
        }

        .hero-slide.active {
          opacity: 1;
          visibility: visible;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;

         
        }

        .hero-content {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1800px;
          margin: 0 auto;

          padding: 30px 80px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 40px;
        }

        .hero-text {
          max-width: 700px;
          color: #ffffff;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          color: #72f0ed;

          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;

          margin-bottom: 14px;
        }

        .hero-text h1 {
          margin: 0;

          font-size: clamp(36px, 5vw, 64px);
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -1.8px;
        }

        .hero-text h1 span {
          display: block;
          color: #55dedb;
        }

        .hero-text p {
          max-width: 600px;

          margin: 20px 0 25px;

          color: rgba(255, 255, 255, 0.88);

          font-size: 16px;
          line-height: 1.7;
        }

        .hero-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          border: none;
          border-radius: 10px;

          background: #00a4a6;
          color: #ffffff;

          padding: 13px 20px;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 8px 22px rgba(0, 164, 166, 0.3);

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .hero-button:hover {
          background: #008f91;
          transform: translateY(-2px);
        }

        .hero-side {
          min-width: 280px;

          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 9px 14px;

          border-radius: 30px;

          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);

          color: #ffffff;

          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;

          backdrop-filter: blur(10px);
        }

        .hero-floating-card {
          width: 270px;

          display: flex;
          align-items: flex-start;
          gap: 12px;

          padding: 16px;

          border-radius: 15px;

          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.18);

          backdrop-filter: blur(12px);

          color: #ffffff;

          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .hero-floating-card svg {
          color: #62e3df;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .hero-floating-card div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hero-floating-card strong {
          font-size: 14px;
          letter-spacing: 0.5px;
        }

        .hero-floating-card span {
          color: rgba(255, 255, 255, 0.75);
          font-size: 11px;
          line-height: 1.5;
        }

        .hero-arrow {
          position: absolute;
          top: 50%;
          z-index: 5;

          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 50%;

          background: rgba(0, 0, 0, 0.28);
          color: #ffffff;

          cursor: pointer;

          transform: translateY(-50%);

          backdrop-filter: blur(6px);

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .hero-arrow:hover {
          background: rgba(0, 164, 166, 0.8);
          transform:
            translateY(-50%)
            scale(1.05);
        }

        .hero-arrow-left {
          left: 22px;
        }

        .hero-arrow-right {
          right: 22px;
        }

        .hero-dots {
          position: absolute;
          z-index: 5;

          bottom: 20px;
          left: 50%;

          transform: translateX(-50%);

          display: flex;
          align-items: center;
          gap: 7px;
        }

        .hero-dot {
          width: 8px;
          height: 8px;

          padding: 0;

          border: none;
          border-radius: 20px;

          background: rgba(255, 255, 255, 0.45);

          cursor: pointer;

          transition:
            width 0.25s ease,
            background 0.25s ease;
        }

        .hero-dot.active {
          width: 25px;
          background: #00a4a6;
        }

        /* =========================
   CATEGORIES
========================= */

.categories-section {
  width: 100%;
  background: #ffffff;
  border-top: 1px solid #eef2f2;
  border-bottom: 1px solid #eef2f2;
  padding: 24px 0 26px;
}

.categories-container {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 30px;
}

.categories-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.categories-kicker {
  display: block;
  color: #00a4a6;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}

.categories-header h2 {
  margin: 0;
  color: #111827;
  font-size: 20px;
  font-weight: 700;
}

.categories-scroll-hint {
  color: #9ca3af;
  font-size: 12px;
  white-space: nowrap;
}

.categories-rows {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.categories-row {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 28px;

  overflow-x: auto;
  overflow-y: hidden;

  padding: 4px 4px 8px;

  scroll-behavior: smooth;

  scrollbar-width: none;

  -webkit-overflow-scrolling: touch;
}

.categories-row::-webkit-scrollbar {
  display: none;
}

.category-item {
  flex: 0 0 88px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  padding: 0;

  border: none;
  background: transparent;

  cursor: pointer;

  font-family: inherit;

  transition:
    transform 0.2s ease;
}

.category-circle {
  width: 64px;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #f0fafa;
  color: #00a4a6;

  border: 1px solid rgba(0, 164, 166, 0.12);

  box-shadow:
    0 4px 12px rgba(0, 164, 166, 0.08);

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.category-name {
  width: 88px;

  color: #374151;

  font-size: 12px;
  font-weight: 600;

  line-height: 1.3;

  text-align: center;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

.category-item:hover {
  transform: translateY(-3px);
}

.category-item:hover .category-circle {
  transform: scale(1.06);
}

.category-item.active {
  transform: translateY(-3px);
}

.category-item.active .category-circle {
  background: #00a4a6;
  color: #ffffff;
  border-color: #00a4a6;
  box-shadow: 0 8px 20px rgba(0, 164, 166, 0.22);
  transform: scale(1.06);
}

.category-item.active .category-name {
  color: #00a4a6;
  font-weight: 700;
}

.category-item:focus-visible {
  outline: none;
}

.category-item:focus-visible .category-circle {
  outline: 3px solid rgba(0, 164, 166, 0.25);
  outline-offset: 3px;
}



        /* =========================
           CONTENU
        ========================= */

        .home-content {
          width: 100%;
          max-width: 1800px;

          margin: 0 auto;

          padding: 35px 10px;
        }

        .products-section {
          width: 100%;
          margin-bottom: 50px;
          scroll-margin-top: 90px;
        }

        .top-section {
          margin-top: 5px;
        }

        /* =========================
           LOADING
        ========================= */

        .products-loading {
          width: 100%;
          min-height: 400px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 15px;
        }

        .products-loading p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .loading-spinner-large {
          width: 45px;
          height: 45px;

          border: 4px solid #dfe7e7;
          border-top-color: #00a4a6;

          border-radius: 50%;

          animation:
            searchSpin 0.8s linear infinite;
        }

        .loading-spinner {
          width: 38px;
          height: 38px;

          border: 3px solid #e5e7eb;
          border-top-color: #00a4a6;

          border-radius: 50%;

          animation:
            searchSpin 0.8s linear infinite;
        }

        @keyframes searchSpin {
          to {
            transform: rotate(360deg);
          }
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

        .result-count {
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
           GRILLE
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
          transform: translateY(-4px);

          box-shadow:
            0 10px 25px
            rgba(0, 0, 0, 0.1);
        }

        .product-card:focus-visible {
          outline: 3px solid rgba(0, 164, 166, 0.35);
          outline-offset: 2px;
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

        .product-card:hover .product-image {
          transform: scale(1.04);
        }

        .top-badge {
          position: absolute;

          top: 10px;
          left: 10px;

          background: #00a4a6;
          color: #ffffff;

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
          max-width: 500px;

          margin: 0;

          font-size: 14px;

          line-height: 1.6;
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

          .hero-slider {
            height: 370px;
          }

          .hero-content {
            padding:
              25px
              65px;
          }

          .hero-side {
            min-width: 220px;
          }

          .hero-floating-card {
            width: 230px;
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

          .categories-container {
            padding: 0 18px;
          }

          .categories-row {
            gap: 22px;
          }

          .category-item {
            flex-basis: 82px;
          }

          .category-circle {
            width: 60px;
            height: 60px;
          }

          .category-name {
            width: 82px;
            font-size: 11px;
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
            font-size: 16px;
            font-weight: 500;

          }

          /* HERO MOBILE */

          .hero-slider {
            height: 400px;
          }

          .hero-content {
            padding:
              25px
              45px
              35px
              45px;

            display: block;
          }

          .hero-text {
            max-width: 100%;
          }

          .hero-eyebrow {
            font-size: 9px;
            margin-bottom: 10px;
          }

          .hero-text h1 {
            font-size: 36px;
            letter-spacing: -1px;
          }

          .hero-text p {
            margin:
              14px
              0
              18px;

            font-size: 13px;

            line-height: 1.55;

            max-width: 100%;
          }

          .hero-button {
            padding:
              11px
              15px;

            font-size: 12px;
          }

          .hero-side {
            display: none;
          }

          .hero-arrow {
            width: 34px;
            height: 34px;
          }

          .hero-arrow-left {
            left: 9px;
          }

          .hero-arrow-right {
            right: 9px;
          }

          .hero-dots {
            bottom: 13px;
          }

          .home-content {
            padding:
              20px
              0;
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

          .categories-section {
  padding: 18px 0 20px;
}

.categories-container {
  padding: 0 10px;
}

.categories-header {
  margin-bottom: 14px;
  padding: 0 4px;
}

.categories-header h2 {
  font-size: 18px;
}

.categories-kicker {
  font-size: 9px;
}

.categories-scroll-hint {
  font-size: 10px;
}

.categories-rows {
  gap: 14px;
}

.categories-row {
  gap: 18px;
  padding-left: 2px;
  padding-right: 10px;
}

.category-item {
  flex: 0 0 72px;
  gap: 7px;
}

.category-circle {
  width: 54px;
  height: 54px;
}

.category-circle svg {
  width: 21px;
  height: 21px;
}

.category-name {
  width: 72px;
  font-size: 10px;
}
        }

        /* =========================
           PETITS TELEPHONES
        ========================= */

        @media (max-width: 380px) {
          .hero-slider {
            height: 350px;
          }

          .hero-content {
            padding:
              22px
              40px
              30px;
          }

          .hero-text h1 {
            font-size: 32px;
          }

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
              8px
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