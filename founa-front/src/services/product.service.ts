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