import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Alumnos from "../pages/Alumnos";
import Docentes from "../pages/Docentes";
import Pagos from "../pages/Pagos";
import Reportes from "../pages/Reportes";

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
        </Routes>
      </>
    </Router>
  );
}

export default AppRoutes;
