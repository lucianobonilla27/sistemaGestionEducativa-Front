import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AlumnosProvider } from "./context/AlumnosContext";
import { CursosProvider } from "./context/CursosContext";
import { DocentesProvider } from "./context/DocentesContext";
import { PagosProvider } from "./context/PagosContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlumnosProvider>
      <DocentesProvider>
        <CursosProvider>
          <PagosProvider>
            <App />
          </PagosProvider>
        </CursosProvider>
      </DocentesProvider>
    </AlumnosProvider>
  </React.StrictMode>
);
