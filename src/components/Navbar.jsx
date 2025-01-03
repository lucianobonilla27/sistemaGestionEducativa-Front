import { Link } from "react-router-dom";
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaMoneyBill, FaFileAlt, FaBook, FaSignInAlt, FaSignOutAlt, FaUser  } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import "./navbar.css"; // Archivo CSS personalizado

function Navbar() {
  const { user, logout, persona } = useUser();

  const routesByRole = {
    admin: [
      { path: "/usuarios", label: "Usuarios", icon: <FaUser  /> },
      { path: "/cursos", label: "Cursos", icon: <FaBook /> },
      { path: "/alumnos", label: "Alumnos", icon: <FaUserGraduate /> },
      { path: "/docentes", label: "Docentes", icon: <FaChalkboardTeacher /> },
      { path: "/pagos", label: "Pagos", icon: <FaMoneyBill /> },
      { path: "/reportes", label: "Reportes", icon: <FaFileAlt /> },
    ],
    docente: [
      { path: "/cursos", label: "Cursos", icon: <FaBook /> },
      { path: "/reportes", label: "Reportes", icon: <FaFileAlt /> },
    ],
    finanzas: [
      { path: "/pagos", label: "Pagos", icon: <FaMoneyBill /> },
    ],
    alumno: [
      { path: "/pagos", label: "Pagos", icon: <FaMoneyBill /> },
      { path: "/reportes", label: "Reportes", icon: <FaFileAlt /> },
    ],
  };

  const userRoutes = user?.role ? routesByRole[user.role] || [] : [];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
          <ul className="navbar-nav me-auto">
            {userRoutes.map((route) => (
              <li key={route.path} className="nav-item">
                <Link className="nav-link" to={route.path}>
                  {route.icon} {route.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light fw-bold">
                    {persona ? `Bienvenido, ${persona.nombre}` : "Cargando..."}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-icon"
                    onClick={logout}
                    title="Cerrar Sesión"
                  >
                    <FaSignOutAlt size={20} />
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-icon" to="/login" title="Iniciar Sesión">
                  <FaSignInAlt size={20} />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
