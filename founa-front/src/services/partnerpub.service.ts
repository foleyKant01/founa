import api from './api';

export const CreateOnePartnerPub = (data: {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  code_promo: string;
  confirmpassword: string;
}) => {
  return api.post("/partner_pub/create_partnerpub", data);
};

export const ReadSinglePartnerPub = (data: {
  partnerpub_id: string;
}) => {
  return api.post("/partner_pub/read_single_partnerpub", data);
};

export const UpdatePartnerPub = (data: {
  partnerpub_id: string;
}) => {
  return api.post("/partner_pub/update_partnerpub", data);
};

export const StatistiquesPartnerPub = (data: {
  partnerpub_id: string;
}) => {
  return api.post("/partner_pub/statistiques_partnerpub", data);
};

export const ReadAllPartnerPub = () => {
  return api.get("/partner_pub/read_all_partnerpub");
};