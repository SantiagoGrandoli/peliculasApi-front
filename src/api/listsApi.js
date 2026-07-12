import axiosClient from './axiosClient';

export const listsApi = {
  getAll: () => axiosClient.get('/lists').then((r) => r.data),
  getById: (id) => axiosClient.get(`/lists/${id}`).then((r) => r.data),
  create: (name) => axiosClient.post('/lists', { name }).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/lists/${id}`).then((r) => r.data),
  addMovie: (listId, movieId) =>
    axiosClient.post(`/lists/${listId}/movies`, { movieId }).then((r) => r.data),
  removeMovie: (listId, movieId) =>
    axiosClient.delete(`/lists/${listId}/movies/${movieId}`).then((r) => r.data),
};