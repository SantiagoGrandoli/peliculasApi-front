import axiosClient from './axiosClient';

export const moviesApi = {
  getAll: (params) => axiosClient.get('/movies', { params }).then((r) => r.data),
  getGenres: () => axiosClient.get('/genre').then((r) => r.data),
  getById: (id) => axiosClient.get(`/movies/${id}`).then((r) => r.data),
  create: (data) => axiosClient.post('/movies', data).then((r) => r.data),
  update: (id, data) => axiosClient.put(`/movies/${id}`, data).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/movies/${id}`).then((r) => r.data),
  getStats: () => axiosClient.get('/stats').then((r) => r.data),
};
