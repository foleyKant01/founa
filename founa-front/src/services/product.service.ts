// src/services/produitService.ts
import api from './api'; // ton instance Axios

// 🔹 Récupérer tous les produits
export const GetAllProduits = () => {
  return api.get('/produits/get_all_produits'); // adapte le path selon ta route Flask
};

export const GetSingleProduit = (data: {
  produit_id: string;
}) => {
  return api.post('/produits/get_single_produit', data);
};

export const AllSimilarProducts = (data: {
  uid: string;
  nom: string;
  description: string;
}) => {
  return api.post('/produits/all_similar_products', data);
};

/* ➕ Ajouter un favori */
export const SaveFavoris = (produit_id: string, client_id: string) => {
  return api.post("/favoris/save_favoris", {
    produit_id,
    client_id,
  });
};

export const ReadAllFavorisByUser = (client_id: string) => {
  return api.post("/favoris/read_all_favoris_by_user", {
    client_id,
  });
};

/* ❌ Supprimer un favori */
export const DeleteFavoris = (produit_id: string, client_id: string) => {
  return api.post("/favoris/delete_favoris", {
    produit_id,
    client_id,
  });
};