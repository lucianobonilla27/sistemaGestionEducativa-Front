import { useState, useEffect } from "react";
import { useReportes } from "../../context/ReportesContext";
import { useAlumnos } from "../../context/AlumnosContext";
import { useCursos } from "../../context/CursosContext";
import { useUser } from "../../context/UserContext";
import "./reportes.css";

function Reportes() {
  const { reportes, crearReporte, editarReporte, eliminarReporte } = useReportes();
  const { alumnos } = useAlumnos();
  const { cursos } = useCursos();
  const { user, persona } = useUser(); // Usuario actual
  const [tipoReporte, setTipoReporte] = useState("Todos");
  const [formulario, setFormulario] = useState({
    id: null,
    alumnoId: "",
    cursoId: "",
    nota: "",
    asistencia: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [reporteAEliminar, setReporteAEliminar] = useState(null);
  const [filteredCursos, setFilteredCursos] = useState([]); // Cursos disponibles según el alumno seleccionado

  // Filtrar reportes según el rol del usuario
  const reportesFiltrados = reportes
  .filter((reporte) => {
    if (user.role === "admin") return true; // Admin ve todos los reportes
    // Docente solo ve los reportes de los cursos que dicta
    const cursoPerteneceAlDocente = persona?.cursos.includes(reporte.cursoId);
    return cursoPerteneceAlDocente;
  })
  .filter((reporte) => {
    if (tipoReporte === "Todos") return true;
    if (tipoReporte === "Aprobados") return reporte.nota >= 7;
    if (tipoReporte === "Reprobados") return reporte.nota < 7;
    return true;
  })
  .map((reporte) => ({
    ...reporte,
    alumnoNombre: alumnos.find((a) => a.id === reporte.alumnoId)?.nombre || "Desconocido",
    cursoNombre: cursos.find((c) => c.id === reporte.cursoId)?.nombre || "Desconocido",
  }));

  const manejarCambioReporte = (e) => setTipoReporte(e.target.value);

  const abrirModal = (reporte = null) => {
    if (reporte) {
      setFormulario({ ...reporte });
      filtrarCursosPorAlumno(reporte.alumnoId); // Filtrar cursos automáticamente si ya hay un alumno seleccionado
    } else {
      setFormulario({ id: null, alumnoId: "", cursoId: "", nota: "", asistencia: "" });
      setFilteredCursos([]); // Resetear cursos filtrados
    }
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setFilteredCursos([]);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    if (name === "alumnoId") {
      filtrarCursosPorAlumno(value);
    }
  };

  // Filtrar alumnos para mostrar solo aquellos que pertenecen a los cursos del docente
const alumnosFiltrados = alumnos.filter((alumno) => {
  if (user.role === "admin") {
    return true; // Si es admin, muestra todos los alumnos
  }
  // Si no es admin, filtra los alumnos que están inscritos en los cursos que el docente dicta
  return alumno.cursos.some((cursoId) => persona?.cursos.includes(cursoId));
});


const filtrarCursosPorAlumno = (alumnoId) => {
  if (user.role === "admin") {
    // Admin puede ver todos los cursos
    const alumno = alumnos.find((a) => a.id === alumnoId);
    setFilteredCursos(cursos.filter((curso) => alumno?.cursos.includes(curso.id)));
  } else {
    // Docente ve solo los cursos que dicta y que el alumno cursa
    const alumno = alumnos.find((a) => a.id === alumnoId);
    if (alumno) {
      const cursosDisponibles = alumno.cursos.filter((cursoId) =>
        persona.cursos.includes(cursoId)
      );
      setFilteredCursos(cursos.filter((curso) => cursosDisponibles.includes(curso.id)));
    } else {
      setFilteredCursos([]);
    }
  }
};


  const guardarReporte = () => {
    if (
      user.role !== "admin" &&
      (!persona.cursos.includes(formulario.cursoId) ||
        !alumnos.find((a) => a.id === formulario.alumnoId)?.cursos.includes(formulario.cursoId))
    ) {
      alert("No puedes crear reportes para cursos que no dictas o alumnos que no corresponden.");
      return;
    }

    if (formulario.id) {
      editarReporte(formulario);
    } else {
      crearReporte({ ...formulario, id: crypto.randomUUID() });
    }
    cerrarModal();
  };

  const confirmarEliminar = (id) => setReporteAEliminar(id);

  const cancelarEliminar = () => setReporteAEliminar(null);

  const ejecutarEliminar = () => {
    if (reporteAEliminar) {
      eliminarReporte(reporteAEliminar);
      setReporteAEliminar(null);
    }
  };

  return (
    <div className="reportes-container">
      <h1 className="text-center my-4">Gestión de Reportes</h1>

      <button className="btn btn-primary mb-3" onClick={() => abrirModal()}>
        Crear Reporte
      </button>

      <div className="mb-3">
        <label htmlFor="tipoReporte" className="form-label">Seleccionar tipo de reporte:</label>
        <select
          id="tipoReporte"
          className="form-select"
          value={tipoReporte}
          onChange={manejarCambioReporte}
        >
          <option value="Todos">Todos</option>
          <option value="Aprobados">Aprobados</option>
          <option value="Reprobados">Reprobados</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th hidden>#</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Nota</th>
              <th>Asistencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportesFiltrados.map((reporte) => (
              <tr key={reporte.id}>
                <td hidden>{reporte.id}</td>
                <td>{reporte.alumnoNombre}</td>
                <td>{reporte.cursoNombre}</td>
                <td>{reporte.nota}</td>
                <td>{reporte.asistencia}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(reporte)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => confirmarEliminar(reporte.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación para eliminación */}
      {reporteAEliminar && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelarEliminar}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este reporte?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelarEliminar}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={ejecutarEliminar}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formulario.id ? "Editar Reporte" : "Crear Reporte"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
              </div>
              <div className="modal-body">
                <label>Alumno</label>
                <select
                  className="form-select mb-2"
                  name="alumnoId"
                  value={formulario.alumnoId}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione un alumno</option>
                  {alumnosFiltrados.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>
                      {alumno.nombre}
                    </option>
                  ))}
                </select>
                <label>Curso</label>
                <select
                  className="form-select mb-2"
                  name="cursoId"
                  value={formulario.cursoId}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione un curso</option>
                  {filteredCursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre}
                    </option>
                  ))}
                </select>
                <label>Nota</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  name="nota"
                  value={formulario.nota}
                  onChange={manejarCambio}
                  min="0"
                  max="10"
                />
                <label>Asistencia</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="asistencia"
                  value={formulario.asistencia}
                  onChange={manejarCambio}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarReporte}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reportes;
