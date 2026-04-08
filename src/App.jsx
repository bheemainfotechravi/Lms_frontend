import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from 'react-redux';
import { store } from './App/store';
export default function App() {
  return (
    <Provider store={store} >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "Plus Jakarta Sans, sans-serif",
            borderRadius: "24px",
            padding: "16px 24px",
            fontWeight: "700",
          },
        }}
      />

      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}