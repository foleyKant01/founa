import api from './api';
import type { RegisterPayload, LoginPayload, ForgotPayload } from './types';

export const register = (payload: RegisterPayload) => api.post('/auth/register', payload);
export const login = (payload: LoginPayload) => api.post('/auth/login', payload);
export const forgot = (payload: ForgotPayload) => api.post('/auth/forgot', payload);
