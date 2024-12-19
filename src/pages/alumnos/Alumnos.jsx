import { useState } from "react";
import "./alumnos.css";
import { useAlumnos } from "../../context/AlumnosContext";
import { useCursos } from "../../context/CursosContext";

function Alumnos() {
  const { alumnos, agregarAlumno, editarAlumno, eliminarAlumno } = useAlumnos();
  const { cursos } = useCursos();

  const [formulario, setFormulario] = useState({
    id: null,
    nombre: "",
    cursos: [],
    estado: "Activo",
  });

  const [showModal, setShowModal] = useState(false);
  const [alumnoAEliminar, setAlumnoAEliminar] = useState(null);

  const abrirModal = (alumno = null) => {
    if (alumno) {
      setFormulario({ ...alumno });
    } else {
      setFormulario({ id: null, nombre: "", cursos: [], estado: "Activo" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => setShowModal(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarCursos = (cursoId) => {
    setFormulario((prev) => ({
      ...prev,
      cursos: prev.cursos.includes(cursoId)
        ? prev.cursos.filter((curso) => curso !== cursoId)
        : [...prev.cursos, cursoId],
    }));
  };

  const guardarAlumno = () => {
    if (formulario.id) {
      editarAlumno(formulario);
    } else {
      agregarAlumno({ ...formulario, id: crypto.randomUUID()});
    }
    cerrarModal();
  };

  const confirmarEliminarAlumno = (id) => {
    setAlumnoAEliminar(id);
  };

  const cancelarEliminar = () => setAlumnoAEliminar(null);

  const confirmarEliminar = () => {
    eliminarAlumno(alumnoAEliminar);
    setAlumnoAEliminar(null);
  };

  return (
    <div className="alumnos-container">
      <h1 className="text-center my-4">Gestión de Alumnos</h1>
      <button className="btn btn-primary mb-3" onClick={() => abrirModal(null)}>
        Agregar Alumno
      </button>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Nombre</th>
              <th>Cursos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td>{alumno.nombre}</td>
                <td>
                  {cursos
                    .filter((curso) => alumno.cursos.includes(curso.id))
                    .map((curso) => curso.nombre)
                    .join(", ") || "Sin Cursos"}
                </td>
                <td>{alumno.estado}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(alumno)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => confirmarEliminarAlumno(alumno.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación para eliminar */}
      {alumnoAEliminar && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este alumno?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelarEliminar}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={confirmarEliminar}>
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
                  {formulario.id ? "Editar Alumno" : "Agregar Alumno"}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                />
                <label>Cursos</label>
                {cursos.map((curso) => (
                  <div key={curso.id} className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={formulario.cursos.includes(curso.id)}
                      onChange={() => manejarCursos(curso.id)}
                    />
                    <label>{curso.nombre}</label>
                  </div>
                ))}
                <label>Estado</label>
                <select
                  className="form-select"
                  name="estado"
                  value={formulario.estado}
                  onChange={manejarCambio}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarAlumno}>
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

export default Alumnos;
