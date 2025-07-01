import { useEffect, useState } from "react";

import { api } from "../api/api";
import { AuthContext } from "./authContext";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) setToken(getToken);
    setIsLoading(false);
  }, []);

  // Inicio sesion y guardar token
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Eliminar token
  const logout = () => {
    setToken(null);
    // localStorage.removeItem('token');
    localStorage.clear();
  };

  // Interceptor de token
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [token]);

  return (
    <AuthContext.Provider value={{ login, logout, token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
