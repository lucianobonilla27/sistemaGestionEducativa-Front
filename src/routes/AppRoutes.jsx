import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/home/Home";
import Alumnos from "../pages/alumnos/Alumnos";
import Docentes from "../pages/docentes/Docentes";
import Pagos from "../pages/pagos/Pagos";
import Reportes from "../pages/reportes/Reportes";
import Cursos from "../pages/cursos/Cursos";

function AppRoutes() {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/docentes" element={<Docentes />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/cursos" element={<Cursos />} />
        </Routes>
      </>
    </Router>
  );
}

export default AppRoutes;
