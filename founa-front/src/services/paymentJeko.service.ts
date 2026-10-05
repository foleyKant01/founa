// src/services/commande.service.ts
import api from "./api"; // ton axios instance


export const PaymentRequest = (data: {
  commande_id: string;
  user_id: string;
  paymentMethod: string; 
}) => {
  return api.post('/jeko/payment_request', data);
};