import api from "./api";

const BASE = "/members";

export const membersService = {
  getAll: () => api.get(BASE).then((r) => r.data),
  getOne: (id) => api.get(`${BASE}/${id}`).then((r) => r.data),
  create: (data) => api.post(BASE, data).then((r) => r.data),
  update: (id, data) => api.put(`${BASE}/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`${BASE}/${id}`),
};
