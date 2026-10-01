// src/services/commande.service.ts
import api from "./api"; // ton axios instance


export const PaymentRequest = (data: {
  commande_id: string;
  paymentMethod: string;
  totalAPayer: number;
}) => {
  return api.post('/jeko/payment_request', data);
};