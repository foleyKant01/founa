import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const admin = sessionStorage.getItem("admin");

  if (!admin) {
    // Redirige vers la page de connexion si admin absent
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;