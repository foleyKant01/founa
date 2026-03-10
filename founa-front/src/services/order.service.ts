// src/services/commande.service.ts
import api from "./api"; // ton axios instance

export const CreateCommande = (data: {
  client_id: string;
  produit_id: string;
  quantite: number;
  details?: string;
}) => {
  return api.post("/commandes/create_commande", data);
};
