
import { useEffect } from "react";
import AppRoutes from "./router/appRouter";
import { ActivityProvider } from "./context/activityContext";
import { initializeNotifications } from "./services/notification.service";

function App() {

  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <ActivityProvider>
      <AppRoutes />
    </ActivityProvider>
  );
}

export default App;


