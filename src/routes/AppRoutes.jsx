import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/home/Home";
import Alumnos from "../pages/alumnos/Alumnos";
import Docentes from "../pages/docentes/Docentes";
import Pagos from "../pages/pagos/Pagos";
import Reportes from "../pages/reportes/Reportes";
import Cursos from "../pages/cursos/Cursos";
import Login from "../pages/login/Login";
import Unauthorized from "../pages/unathorized/Unauthorized";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Home />} />

          {/* Rutas protegidas */}
          {/* Cursos: accesible para administradores y docentes */}
          <Route
            path="/cursos"
            element={
              <ProtectedRoute requiredRole={["admin", "docente"]}>
                <Cursos />
              </ProtectedRoute>
            }
          />

          {/* Alumnos: accesible solo para administradores */}
          <Route
            path="/alumnos"
            element={
              <ProtectedRoute requiredRole="admin">
                <Alumnos />
              </ProtectedRoute>
            }
          />

          {/* Docentes: accesible solo para administradores */}
          <Route
            path="/docentes"
            element={
              <ProtectedRoute requiredRole="admin">
                <Docentes />
              </ProtectedRoute>
            }
          />

          {/* Pagos: accesible para administradores y rol financiero */}
          <Route
            path="/pagos"
            element={
              <ProtectedRoute requiredRole={["admin", "finanzas"]}>
                <Pagos />
              </ProtectedRoute>
            }
          />

          {/* Reportes: accesible para administradores y docentes */}
          <Route
            path="/reportes"
            element={
              <ProtectedRoute requiredRole={["admin", "docente", "alumno"]}>
                <Reportes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </>
    </Router>
  );
}

export default AppRoutes;
