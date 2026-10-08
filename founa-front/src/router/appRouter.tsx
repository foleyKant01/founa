import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import ReadAllProducts from "../pages/teller/readAllProducts";
import ReadSingleProduct from "../pages/teller/readSingleProduct";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage";
import UpdateClient from "../pages/profile/updateClient";
import UpdatePassword from "../pages/profile/updatePasswordClient";
import OrderTellerPage from "../pages/teller/orderStatusEdit";
import StatistiquesTellerPage from "../pages/teller/stateTeller"; 
import ProtectedRouteTeller from "../components/routes/ProtectedRouteTeller"; // chemin correct
import ProtectedAdminRoute from "../components/routes/ProtectedRouteAdmin";
import { AppProvider } from "../context/appContext";
import SendOtpPage from "../pages/auth/SendOtpPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import AllOrderPage from "../pages/admin/allOrders";
import ReadAllProductsAdmin from "../pages/admin/readAllProductsAdmin";
import CreateProduct from "../pages/admin/createProduct";
import EditProduct from "../pages/admin/editProduct";
import ReadSingleProductAdmin from "../pages/admin/readSingleProductAdmin";
import CreateTeller from "../pages/admin/createTellers";
import ReadAllTellersPage from "../pages/admin/readAllTellers";
import ReadAllUnavaibleProductsPage from "../pages/admin/unavaibleProduct";

import CookiePolicyPage from "../pages/security/cookiePolicyPage";
import PrivacyPolicyPage from "../pages/security/privacyPolicyPage";
import TermsPage from "../pages/security/termsPage";
import PaymentSuccessPage from "../pages/payment/paymentSuccessPage";
import PaymentErrorPage from "../pages/payment/paymentErrorPage";
import CreatePartnerPub from "../pages/admin/createPartnerPub";
import ReadAllPartnerPubPage from "../pages/admin/readAllPartnerPub";
import ProtectedRoutePartnerPub from "../components/routes/ProtectedRoutePartnerPub";
import HomePartnerPub from "../pages/partnerpub/homePartnerPub";
import { trackPageView } from "../utils/analytics";


const AppRoutes = () => {
  const location = useLocation();

  // 📊 Suivi des changements de pages avec Google Tag Manager
  useEffect(() => {
    const path = location.pathname + location.search;

    trackPageView(path);
  }, [location]);

  // Pages où le BottomBar ne doit pas apparaître
  const authPages = [
    "/auth/login",
    "/auth/register",
    "/auth/forgotpassword",
    "/auth/sendotp",
    "/auth/verifyotp",
  ];

  // Toutes les routes admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Toutes les routes teller
  const isTellerRoute = location.pathname.startsWith("/teller");

  // Toutes les routes partnerpub
  const isPartnerPubRoute = location.pathname.startsWith("/partnerpub");

  const showBottomBar =
    !authPages.includes(location.pathname) &&
    !isTellerRoute &&
    !isAdminRoute &&
    !isPartnerPubRoute;

  return (
    <>
      <div
        style={{
          paddingBottom: showBottomBar ? 60 : 0,
          minHeight: "100vh",
        }}
      >
        <Routes>

          {/* 🚀 ACCUEIL */}
          <Route path="/" element={<HomePage />} />

          {/* 🔐 AUTH */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/auth/sendotp" element={<SendOtpPage />} />
          <Route path="/auth/verifyotp" element={<VerifyOtpPage />} />

          {/* 🏠 PAGES PRINCIPALES */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update" element={<UpdateClient />} />
          <Route path="/updatepassword" element={<UpdatePassword />} />
          <Route path="/activity/favorites" element={<FavoritesPage />} />
          <Route path="/activity/history" element={<HistoryPage />} />
          <Route path="/singleproduct/:uid" element={<ProductPage />} />
          <Route path="/order/:commande_id" element={<OrderDetailsPage />} />

          {/* 🔒 SÉCURITÉ */}
          <Route path="/cookiepolicy" element={<CookiePolicyPage />} />
          <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* 💳 PAIEMENT */}
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/error" element={<PaymentErrorPage />} />

          {/* 🔥 TELLER */}
          <Route
            path="/teller/home"
            element={
              <ProtectedRouteTeller>
                <HomeTeller />
              </ProtectedRouteTeller>
            }
          />

          <Route
            path="/teller/readall"
            element={
              <ProtectedRouteTeller>
                <ReadAllProducts />
              </ProtectedRouteTeller>
            }
          />

          <Route
            path="/teller/readsingle/:uid"
            element={
              <ProtectedRouteTeller>
                <ReadSingleProduct />
              </ProtectedRouteTeller>
            }
          />

          <Route
            path="/teller/allorderteller"
            element={
              <ProtectedRouteTeller>
                <OrderTellerPage />
              </ProtectedRouteTeller>
            }
          />

          <Route
            path="/teller/stateteller"
            element={
              <ProtectedRouteTeller>
                <StatistiquesTellerPage />
              </ProtectedRouteTeller>
            }
          />

          {/* 🔥 PARTNERPUB */}
          <Route
            path="/partnerpub/home"
            element={
              <ProtectedRoutePartnerPub>
                <HomePartnerPub />
              </ProtectedRoutePartnerPub>
            }
          />

          <Route
            path="/partnerpub/statepartnerpub"
            element={
              <ProtectedRoutePartnerPub>
                <StatistiquesTellerPage />
              </ProtectedRoutePartnerPub>
            }
          />

          {/* 🔥 ADMIN */}
          <Route
            path="/admin/home"
            element={
              <ProtectedAdminRoute>
                <HomeAdmin />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/createproduct"
            element={
              <ProtectedAdminRoute>
                <CreateProduct />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/readall"
            element={
              <ProtectedAdminRoute>
                <ReadAllProductsAdmin />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/createteller"
            element={
              <ProtectedAdminRoute>
                <CreateTeller />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/readallteller"
            element={
              <ProtectedAdminRoute>
                <ReadAllTellersPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/createpartnerpub"
            element={
              <ProtectedAdminRoute>
                <CreatePartnerPub />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/readallpartnerpub"
            element={
              <ProtectedAdminRoute>
                <ReadAllPartnerPubPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/getallunavaibleproduct"
            element={
              <ProtectedAdminRoute>
                <ReadAllUnavaibleProductsPage />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/editproduct/:uid"
            element={
              <ProtectedAdminRoute>
                <EditProduct />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/readsingleproduct/:uid"
            element={
              <ProtectedAdminRoute>
                <ReadSingleProductAdmin />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/allorders"
            element={
              <ProtectedAdminRoute>
                <AllOrderPage />
              </ProtectedAdminRoute>
            }
          />

        </Routes>
      </div>

      {showBottomBar && <BottomBar />}
    </>
  );
};


// Comme useLocation() ne fonctionne que dans un Router, 
// on enveloppe AppRoutes avec BrowserRouter dans un wrapper
const AppRoutesWrapper = () => (
  <BrowserRouter>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </BrowserRouter>
);

export default AppRoutesWrapper;
