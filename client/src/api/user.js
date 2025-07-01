import { api } from "./api";

export const all = () => api.get("users/");
export const getById = (id) => api.get(`users/${id}`);
export const getByUser = (filters) => api.get("users/tasks", { params: filters });
export const update = (data, id) => api.patch(`/users/${id}`, data);
export const remove = (id) => api.delete(`users/${id}`);