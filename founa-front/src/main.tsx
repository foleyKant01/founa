import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ActivityProvider } from "./context/activityContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ActivityProvider>
      <App />
    </ActivityProvider>
  </React.StrictMode>
);
