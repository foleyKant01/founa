import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage";
import RegisterPage from "../pages/auth/registerPage";
import ForgotPasswordPage from "../pages/auth/forgotPasswordPage";
import HomePage from "../pages/home/homePage";
import CartPage from "../pages/cart/cartPage";
import OrdersPage from "../pages/orders/orderTrackingPage";
import ProfilePage from "../pages/profile/profilePage";
import BottomBar from "../components/layout/bottomBar";
import ProductPage from "../pages/product/productsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* Container principal avec padding pour BottomBar */}
      <div style={{ paddingBottom: 60, minHeight: "100vh" }}>
        <Routes>

          {/* 🚀 Redirection automatique vers Login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* 🔐 AUTH */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/product/products" element={<ProductPage />} />

          {/* 🏠 PAGES PRINCIPALES */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Routes>
      </div>

      {/* BottomBar FIXE visible sur toutes les pages */}
      <BottomBar />
    </BrowserRouter>
  );
};

export default AppRoutes;
