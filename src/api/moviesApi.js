import axiosClient from './axiosClient';

export const updateMovie = async (id, dto) => {
  const response = await axiosClient.put(`/movies/${id}`, dto);
  return response.data;
};

export const moviesApi = {
getAll: ({ search, genreId, page = 1, spoiler, pageSize = 12 } = {}) =>
  axiosClient
    .get(
      '/movies', 
      { params: { search: search, genreId: genreId, spoiler, page, pageSize } })
    .then((r) => r.data),

getById: (id) => axiosClient.get(`/movies/${id}`).then((r) => r.data),

create: (dto) => axiosClient.post('/movies', dto).then((r) => r.data),

update: (id, dto) => updateMovie(id, dto),

remove: (id) => axiosClient.delete(`/movies/${id}`).then((r) => r.data),

getGenres: () => axiosClient.get('/genre').then((r) => r.data),

createGenre: (dto) => axiosClient.post('/genre', dto).then((r) => r.data),

updateGenre: (id, dto) => axiosClient.put(`/genre/${id}`, dto).then((r) => r.data),

removeGenre: (id) => axiosClient.delete(`/genre/${id}`).then((r) => r.data),

getStats: () => axiosClient.get('/admin/stats').then((r) => r.data),

upsertRating: (movieId, score) =>
    axiosClient.put(`/movies/${movieId}/ratings`, { score }).then((r) => r.data),
    
deleteRating: (movieId) => axiosClient.delete(`/movies/${movieId}/ratings`).then((r) => r.data),
    
getMyRating: (movieId) =>
  axiosClient
    .get(`/movies/${movieId}/ratings/me`)
    .then((r) => r.data)
    .catch((err) => (err.status === 404 ? null : Promise.reject(err))),

getReviews: (movieId) => axiosClient.get(`/movies/${movieId}/reviews`).then((r) => r.data),

createReview: (movieId, dto) => axiosClient.post(`/movies/${movieId}/reviews`, dto).then((r) => r.data),

updateReview: (movieId, reviewId, dto) =>
  axiosClient.put(`/movies/${movieId}/reviews/${reviewId}`, dto).then((r) => r.data),

deleteReview: (movieId, reviewId) =>
  axiosClient.delete(`/movies/${movieId}/reviews/${reviewId}`).then((r) => r.data),

};