import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRoutePartnerPubProps {
  children: React.ReactNode;
}

const ProtectedRoutePartnerPub: React.FC<ProtectedRoutePartnerPubProps> = ({
  children,
}) => {
  const partnerpub = localStorage.getItem("partnerpub");

  if (!partnerpub) {
    // Redirige vers la page de connexion si PartnerPub absent
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutePartnerPub;