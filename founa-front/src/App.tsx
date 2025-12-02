// src/App.tsx
import React from "react";
import AppRoutes from "./router/appRouter";
import { CartProvider } from "./context/cartContext";

function App() {
  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  );
}

export default App;
