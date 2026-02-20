import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
// import { CourseProvider } from "./context/CourseContext.jsx";
// import { CompanyProvider } from "./context/CompanyContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* <CourseProvider> */}
        {/* <CompanyProvider> */}
          <App />
        {/* </CompanyProvider> */}
      {/* </CourseProvider> */}
    </AuthProvider>
  </StrictMode>
);