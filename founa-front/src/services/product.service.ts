// src/services/produitService.ts

import api from "./api";

// ======================================================
// RÉCUPÉRER TOUS LES PRODUITS
// ======================================================

export const GetAllProduits = (
  page: number = 1,
  limit: number = 20
) => {
  return api.get("/produits/get_all_produits", {
    params: {
      page,
      limit,
    },
  });
};


// ======================================================
// PRODUITS NON DISPONIBLES
// ======================================================

export const GetAllUnavaibleProduct = () => {
  return api.get("/produits/get_all_unavaible_product");
};


// ======================================================
// IMPORTER LES PRODUITS
// ======================================================

export const ImporterProduit = () => {
  return api.get("/produits/importer_produit");
};


// ======================================================
// TOP PRODUITS
// ======================================================

export const TopProducts = () => {
  return api.get("/produits/top_products");
};


// ======================================================
// METTRE À JOUR LES PRIX
// ======================================================

export const MettreAJourPrixVente = () => {
  return api.get("/produits/mettre_a_jour_prix_vente");
};


// ======================================================
// PRODUIT UNIQUE
// ======================================================

export const GetSingleProduit = (data: {
  produit_id: string;
}) => {
  return api.post("/produits/get_single_produit", data);
};


// ======================================================
// PRODUITS PAR CATÉGORIE
// ======================================================

export const GetProduitsByCategorie = (data: {
  categorie: string;
  page?: number;
  limit?: number;
}) => {
  return api.post("/produits/get_produits_by_categorie", data);
};


// ======================================================
// CRÉER UN PRODUIT
// ======================================================

export const CreateProduit = (data: FormData) => {
  return api.post("/produits/create_produit", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ======================================================
// MODIFIER UN PRODUIT
// ======================================================

export const UpdateProduit = (data: FormData) => {
  return api.post("/produits/update_produit", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ======================================================
// PRODUITS SIMILAIRES
// ======================================================

export const AllSimilarProducts = (data: {
  uid: string;
  nom: string;
  description: string;
  categorie: string;
}) => {
  return api.post("/produits/all_similar_products", data);
};


// ======================================================
// SUPPRIMER PRODUIT PAR TELLER
// ======================================================

export const DeleteProduitByTeller = (data: {
  teller_id: string;
  produit_id: string;
}) => {
  return api.post(
    "/produits/delete_produit_by_teller",
    data
  );
};


// ======================================================
// RECHERCHE PRODUIT
// ======================================================

export const SearchProduct = (data: {
  textSearch: string;
  page?: number;
  limit?: number;
  client_id?: string;
}) => {
  return api.post(
    "/produits/search_product",
    data
  );
};


// ======================================================
// FAVORIS
// ======================================================

export const SaveFavoris = (
  produit_id: string,
  client_id: string
) => {
  return api.post("/favoris/save_favoris", {
    produit_id,
    client_id,
  });
};


export const ReadAllFavorisByUser = (
  client_id: string
) => {
  return api.post(
    "/favoris/read_all_favoris_by_user",
    {
      client_id,
    }
  );
};


export const DeleteFavoris = (
  produit_id: string,
  client_id: string
) => {
  return api.post(
    "/favoris/delete_favoris",
    {
      produit_id,
      client_id,
    }
  );
};