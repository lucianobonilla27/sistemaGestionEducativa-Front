import { Link } from "react-router-dom";
import "./home.css"; 

function Home() {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="mb-3">¡Bienvenido a SmartEdu!</h1>
        <p className="lead">
          SmartEdu es un sistema avanzado para gestionar alumnos, docentes,
          pagos y reportes académicos de manera eficiente.
        </p>
      </div>

      <div className="row mt-5">
        <div className="col-md-6 col-lg-3 mb-4">
          <Link to="/alumnos" className="text-decoration-none">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Gestión de Alumnos</h5>
                <p className="card-text">Administra la información de los estudiantes.</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <Link to="/docentes" className="text-decoration-none">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Gestión de Docentes</h5>
                <p className="card-text">Controla los perfiles y asignaciones de los docentes.</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <Link to="/pagos" className="text-decoration-none">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Pagos</h5>
                <p className="card-text">Gestiona las cuotas e inscripciones.</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <Link to="/reportes" className="text-decoration-none">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Reportes</h5>
                <p className="card-text">Genera reportes académicos detallados.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
