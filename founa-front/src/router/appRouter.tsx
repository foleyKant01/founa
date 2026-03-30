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
import UpdateClient from "../pages/profile/updateClient";
import UpdatePassword from "../pages/profile/updatePasswordClient";
import OrderTellerPage from "../pages/teller/orderStatusEdit";
import StatistiquesTellerPage from "../pages/teller/stateTeller";
import ProtectedRouteTeller from "../components/routes/ProtectedRouteTeller"; // chemin correct
import ProtectedRouteClient from "../components/routes/ProtectedRouteClient";


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
          <Route path="/home" element={<ProtectedRouteClient><HomePage /></ProtectedRouteClient>} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update" element={<UpdateClient />} />
          <Route path="/updatepassword" element={<UpdatePassword />} />
          <Route path="/activity/favorites" element={<FavoritesPage />} />
          <Route path="/activity/history" element={<HistoryPage />} />
          <Route path="/singleproduct/:uid" element={<ProductPage />} />
          <Route path="/order/:commande_id" element={<OrderDetailsPage />} />

           {/* 🔥 TELLER */}
          <Route path="/teller/home" element={<ProtectedRouteTeller><HomeTeller /></ProtectedRouteTeller>} />
          <Route path="/teller/create" element={<ProtectedRouteTeller><CreateProduct /></ProtectedRouteTeller>} />
          <Route path="/teller/readall" element={<ProtectedRouteTeller><ReadAllProducts /></ProtectedRouteTeller>} />
          <Route path="/teller/readsingle/:uid" element={<ProtectedRouteTeller><ReadSingleProduct /></ProtectedRouteTeller>} />
          <Route path="/teller/allorderteller" element={<ProtectedRouteTeller><OrderTellerPage /></ProtectedRouteTeller>} />
          <Route path="/teller/stateteller" element={<ProtectedRouteTeller><StatistiquesTellerPage /></ProtectedRouteTeller>} />
          <Route path="/teller/edit/:id" element={<ProtectedRouteTeller><EditProduct /></ProtectedRouteTeller>} />

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
