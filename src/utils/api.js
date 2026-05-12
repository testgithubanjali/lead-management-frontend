import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ─── Lead API Calls ───────────────────────

export const leadsApi = {
  getAll: (params = {}) => api.get("/leads", { params }),
  getStats: () => api.get("/leads/stats"),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post("/leads", data),
  updateStatus: (id, data) => api.patch(`/leads/${id}/status`, data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
};

export default api;
