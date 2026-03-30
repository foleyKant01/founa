import api from './api';

export const CreateClient = (data: {
  fullname: string;
  email: string;
  phone: string;
  adresse_livraison: string;
  password: string;
  confirmpassword: string;
}) => {
  return api.post('/clients/create_client', data);
};

export const LoginClient = (data: {
  email: string;
  password: string;
}) => {
  return api.post('/auth/login_client', data); 
};

export const UpdateClient = (data: {
  uid: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  adresse_livraison: string;
}) => {
  return api.post('/clients/update_client', data); 
};

export const UpdatePassword = (data: {
  uid: string;
  old_password: string;
  password: string;
}) => {
  return api.post('/clients/update_password', data); 
};

export const ForgotPassword = (data: { 
  email: string;
}) => {
  return api.post('/auth/forgot_password', data);
};

export const SaveNewPassword = (data: {
  email: string;
  newpassword: string;
  confirmpassword: string;
}) => {
  return api.post('/auth/save_new_password', data);
};

export const ReadSingleClient = (data: {
  uid: string;
}) => {
  return api.post('/clients/read_single_client', data); 
};