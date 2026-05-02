import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5000/api' })

export const moviesApi = {
  getAll: () => api.get('/movies').then(r => r.data),
  getRevenue: () => api.get('/movies/revenue').then(r => r.data),
  getOrphans: () => api.get('/movies/orphans').then(r => r.data),
}

export const theatresApi = {
  getOccupancy: () => api.get('/theatres/occupancy').then(r => r.data),
  getRevenueByType: () => api.get('/theatres/revenue-by-type').then(r => r.data),
  getAvailableSeats: (screeningId) => api.get(`/theatres/${screeningId}/available-seats`).then(r => r.data),
}

export const customersApi = {
  getTopSpenders: () => api.get('/customers/top-spenders').then(r => r.data),
  getCorporate: () => api.get('/customers/corporate').then(r => r.data),
  getHistory: (id) => api.get(`/customers/${id}/history`).then(r => r.data),
}

export const bookingsApi = {
  create: (customerId, screeningId, seatId) =>
    api.post('/bookings', { customerId, screeningId, seatId }).then(r => r.data),
  cancel: (id) => api.delete(`/bookings/${id}`).then(r => r.data),
}