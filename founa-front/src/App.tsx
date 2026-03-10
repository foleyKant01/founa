// src/App.tsx
import React from "react";
import AppRoutes from "./router/appRouter";
import { ActivityProvider } from "./context/activityContext";

function App() {
  return (
    <ActivityProvider>
      <AppRoutes />
    </ActivityProvider>
  );
}

export default App;
