import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "../pages/auth/loginPage";
import RegisterPage from "../pages/auth/registerPage";
import ForgotPasswordPage from "../pages/auth/forgotPasswordPage";
import HomePage from "../pages/home/homePage";
import OrdersPage from "../pages/orders/orderTrackingPage";
import ProfilePage from "../pages/profile/profilePage";
import ProductPage from "../pages/product/productsPage";
import BottomBar from "../components/layout/bottomBar";
import ActivityPage from "../pages/activity/activityPage";
import FavoritesPage from "../pages/activity/favorites";
import HistoryPage from "../pages/activity/history";
import HomeTeller from "../pages/teller/homeTeller";
import HomeAdmin from "../pages/admin/homeAdmin";
import CreateProduct from "../pages/teller/createProduct";
import ReadAllProducts from "../pages/teller/readAllProducts";
import ReadSingleProduct from "../pages/teller/readSingleProduct";
import EditProduct from "../pages/teller/editProduct";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage";

const AppRoutes = () => {
  const location = useLocation();

  // Pages où le BottomBar ne doit pas apparaître
  const authPages = ["/auth/login", "/auth/register", "/auth/forgotpassword"];
  // toutes les routes teller
  const isTellerRoute = location.pathname.startsWith("/teller");
  const showBottomBar = !authPages.includes(location.pathname) && !isTellerRoute;

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
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/activity/favorites" element={<FavoritesPage />} />
          <Route path="/activity/history" element={<HistoryPage />} />
          <Route path="/singleproduct/:uid" element={<ProductPage />} />
          <Route path="/order/:commande_id" element={<OrderDetailsPage />} />

           {/* 🔥 TELLER */}
          <Route path="/teller/home" element={<HomeTeller />} />
          <Route path="/teller/create" element={<CreateProduct />} />
          <Route path="/teller/readall" element={<ReadAllProducts />} />
          <Route path="/teller/readsingle" element={<ReadSingleProduct />} />
          <Route path="/teller/edit" element={<EditProduct />} />

          {/* 🔥 ADMIN */}
          <Route path="/admin/home" element={<HomeAdmin />} />
          {/* <Route path="/admin/create" element={<CreateProduct />} />
          <Route path="/admin/readall" element={<ReadAllProducts />} />
          <Route path="/admin/readsingle" element={<ReadSingleProduct />} />
          <Route path="/admin/edit" element={<EditProduct />} /> */}
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
