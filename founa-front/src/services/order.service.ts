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

export const GetAllCommandeByClient = (data: {
  client_id: string;
}) => {
  return api.post('/commandes/get_all_commande_by_client', data);
};

export const GetSingleCommande = (data: {
  commande_id: string;
}) => {
  return api.post('/commandes/get_single_commande', data);
};


export const GetAllCommandeByTeller = (data: {
  teller_id: string;
}) => {
  return api.post('/commandes/get_all_commande_by_teller', data);
};


export const UpdateCommande = (data: {
  commande_id: string;
  details: string;
  teller_id: string;
}) => {
  return api.post('/commandes/update_commande', data);
};

export const StatistiquesTeller = (data: {
  teller_id: string;
}) => {
  return api.post('/teller/statistiques_teller', data);
};