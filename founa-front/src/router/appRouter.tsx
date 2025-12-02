import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage";
import RegisterPage from "../pages/auth/registerPage";
import HomePage from "../pages/home/homePage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🚀 Redirection automatique vers Login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* 🔐 AUTH */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* 🏠 Exemple page home */}
        <Route path="/home" element={<HomePage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
