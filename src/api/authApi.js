import axiosClient from './axiosClient';
import { mockAuthApi } from './mockAuthApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH !== 'false';

const realAuthApi = {

  login: ({ email, password }) =>
    axiosClient.post('/auth/login', { email, password }).then((r) => r.data),
  register: async ({ username, email, password, confirmPassword }) => {
    await axiosClient.post('/auth/register', {
      userName: username,
      email,
      password,
      confirmPassword,
    });
    return realAuthApi.login({ email, password });
  },
};

export const authApi = USE_MOCK ? mockAuthApi : realAuthApi;
