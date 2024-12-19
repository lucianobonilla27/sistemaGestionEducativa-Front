import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AlumnosProvider } from "./context/AlumnosContext";
import { CursosProvider } from "./context/CursosContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlumnosProvider>
      <CursosProvider>
        <App />
      </CursosProvider>
    </AlumnosProvider>
  </React.StrictMode>
);
