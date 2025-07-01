import { api } from "./api";

export const all = () => api.get("tasks/");
export const getById = (id) => api.get(`tasks/${id}`);
export const create = (data) => api.post("tasks/", data);
export const update = (data, id) => api.patch(`/tasks/update/${id}`, data);
export const remove = (id) => api.delete(`tasks/${id}`);