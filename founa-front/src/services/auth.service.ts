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
