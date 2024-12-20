import { useState } from "react";
import { useReportes } from "../../context/ReportesContext";
import { useAlumnos } from "../../context/AlumnosContext";
import { useCursos } from "../../context/CursosContext";
import "./reportes.css";

function Reportes() {
  const { reportes, crearReporte, editarReporte, eliminarReporte } = useReportes();
  const { alumnos } = useAlumnos();
  const { cursos } = useCursos();
  const [tipoReporte, setTipoReporte] = useState("Todos");
  const [formulario, setFormulario] = useState({
    id: null,
    alumnoId: "",
    cursoId: "",
    nota: "",
    asistencia: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [reporteAEliminar, setReporteAEliminar] = useState(null); // Estado para el reporte a eliminar

  const manejarCambioReporte = (e) => setTipoReporte(e.target.value);

  const abrirModal = (reporte = null) => {
    if (reporte) {
      setFormulario({ ...reporte });
    } else {
      setFormulario({ id: null, alumnoId: "", cursoId: "", nota: "", asistencia: "" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => setShowModal(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const guardarReporte = () => {
    if (formulario.id) {
      editarReporte(formulario);
    } else {
      crearReporte({ ...formulario, id: crypto.randomUUID() });
    }
    cerrarModal();
  };

  const confirmarEliminar = (id) => {
    setReporteAEliminar(id); // Guardar el reporte a eliminar
  };

  const cancelarEliminar = () => {
    setReporteAEliminar(null); // Cancelar la eliminación
  };

  const ejecutarEliminar = () => {
    if (reporteAEliminar) {
      eliminarReporte(reporteAEliminar);
      setReporteAEliminar(null); // Limpiar el estado después de eliminar
    }
  };

  const resultadosFiltrados = reportes
    .map((reporte) => ({
      ...reporte,
      alumnoNombre: alumnos.find((a) => a.id === reporte.alumnoId)?.nombre || "Desconocido",
      cursoNombre: cursos.find((c) => c.id === reporte.cursoId)?.nombre || "Desconocido",
    }))
    .filter((reporte) => {
      if (tipoReporte === "Todos") return true;
      if (tipoReporte === "Aprobados") return reporte.nota >= 7;
      if (tipoReporte === "Reprobados") return reporte.nota < 7;
      return true;
    });

  const exportarReporte = () => {
    alert("Función de exportar no implementada aún");
  };

  return (
    <div className="reportes-container">
      <h1 className="text-center my-4">Generación de Reportes</h1>

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
            {resultadosFiltrados.map((reporte) => (
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

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={exportarReporte}>
          Exportar Reporte
        </button>
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
                  {alumnos.map((alumno) => (
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
                  {cursos.map((curso) => (
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
