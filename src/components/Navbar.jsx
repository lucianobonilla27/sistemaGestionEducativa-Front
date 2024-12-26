import { Link } from "react-router-dom";
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaMoneyBill, FaFileAlt, FaBook } from "react-icons/fa";
import { useUser } from "../context/UserContext";

function Navbar() {
  const { user, logout } = useUser();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <FaHome className="me-2" /> SmartEdu
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/cursos">
                <FaBook className="me-2" /> Cursos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/alumnos">
                <FaUserGraduate className="me-2" /> Alumnos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/docentes">
                <FaChalkboardTeacher className="me-2" /> Docentes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pagos">
                <FaMoneyBill className="me-2" /> Pagos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reportes">
                <FaFileAlt className="me-2" /> Reportes
              </Link>
            </li>
            {user && (
              <button className="btn btn-outline-danger" onClick={logout}>
                Cerrar Sesión
              </button>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
