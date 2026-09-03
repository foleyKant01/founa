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

export const GetAllCommandes = () => {
  return api.get('/commandes/get_all_commandes'); // adapte le path selon ta route Flask
};


export const DeleteExpiredCommandes = () => {
  return api.post('/commandes/delete_expired_commandes');
};


export const UpdateCommande = (data: {
  commande_id: string;
  details: string;
  teller_id: string;
}) => {
  return api.post('/commandes/update_commande', data);
};

export const OptionEnvoie = (data: {
  commande_id: string;
  option_envoie: string;
}) => {
  return api.post('/commandes/option_envoie', data);
};

export const StatistiquesTeller = (data: {
  teller_id: string;
}) => {
  return api.post('/teller/statistiques_teller', data);
};