import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage";
import RegisterPage from "../pages/auth/registerPage";
import ForgotPasswordPage from "../pages/auth/forgotPasswordPage";
import HomePage from "../pages/home/homePage";
import CartPage from "../pages/cart/cartPage";
import OrdersPage from "../pages/orders/orderTrackingPage";
import ProfilePage from "../pages/profile/profilePage";
import ProductPage from "../pages/product/productsPage";
import BottomBar from "../components/layout/bottomBar";

const AppRoutes = () => {
  const location = useLocation();

  // Pages où le BottomBar ne doit pas apparaître
  const authPages = ["/auth/login", "/auth/register", "/auth/forgotpassword"];
  const showBottomBar = !authPages.includes(location.pathname);

  return (
    <>
      {/* Container principal avec padding pour BottomBar */}
      <div style={{ paddingBottom: showBottomBar ? 60 : 0, minHeight: "100vh" }}>
        <Routes>
          {/* 🚀 Redirection automatique vers Login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* 🔐 AUTH */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgotpassword" element={<ForgotPasswordPage />} />

          {/* 🏠 PAGES PRINCIPALES */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product/products" element={<ProductPage />} />
        </Routes>
      </div>

      {/* BottomBar FIXE uniquement si on n'est pas sur une page d'auth */}
      {showBottomBar && <BottomBar />}
    </>
  );
};

// Comme useLocation() ne fonctionne que dans un Router, 
// on enveloppe AppRoutes avec BrowserRouter dans un wrapper
const AppRoutesWrapper = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default AppRoutesWrapper;
