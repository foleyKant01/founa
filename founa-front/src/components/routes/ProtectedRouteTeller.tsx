import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const teller = localStorage.getItem("teller");

  if (!teller) {
    // Redirige vers la page login si teller absent
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;