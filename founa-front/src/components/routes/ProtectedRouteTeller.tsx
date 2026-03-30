import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const teller = sessionStorage.getItem("teller");

  if (!teller) {
    // Redirige vers la page login si teller absent
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;