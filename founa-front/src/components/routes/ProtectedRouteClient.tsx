import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteClientProps {
  children: React.ReactNode;
}

const ProtectedRouteClient: React.FC<ProtectedRouteClientProps> = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    // Redirige vers la page login si client absent
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRouteClient;