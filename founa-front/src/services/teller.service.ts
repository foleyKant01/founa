import api from './api';

export const CreateOneTeller = (data: {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmpassword: string;
}) => {
  return api.post("/teller/create_one_teller", data);
};

export const ReadAllTellers = () => {
  return api.get("/teller/read_all_teller");
};