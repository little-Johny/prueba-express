import React from 'react'
import { useAuth } from "./../hooks/useContext/";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const { token, isLoading } = useAuth();
  if (isLoading) return <span className="loading loading-spinner text-primary"></span>
  if(!token) return <Navigate to='/' replace/>
  return children;
}
