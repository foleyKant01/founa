
import { useEffect } from "react";
import AppRoutes from "./router/appRouter";
import { ActivityProvider } from "./context/activityContext";
import { initializeNotifications } from "./services/notification.service";
import CookieConsent from "./components/security/cookieConsent";


function App() {

  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <ActivityProvider>
      <AppRoutes />
      <CookieConsent />
    </ActivityProvider>
  );
}

export default App;


