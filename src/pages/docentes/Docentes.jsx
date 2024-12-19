import { useState } from "react";
import { useDocentes } from "../../context/DocentesContext";
import { useCursos } from "../../context/CursosContext";
import "./docentes.css";

function Docentes() {
  const { docentes, agregarDocente, editarDocente, eliminarDocente } = useDocentes();
  const { cursos } = useCursos();

  const [formulario, setFormulario] = useState({
    id: null,
    nombre: "",
    cursos: [], // Array para los IDs de cursos asignados como cadenas
    estado: "Activo",
  });

  const [showModal, setShowModal] = useState(false);
  const [docenteAEliminar, setDocenteAEliminar] = useState(null);

  const abrirModal = (docente = null) => {
    if (docente) {
      setFormulario({ ...docente });
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
        ? prev.cursos.filter((curso) => curso !== cursoId) // Remover si ya está seleccionado
        : [...prev.cursos, cursoId], // Agregar si no está seleccionado
    }));
  };

  const guardarDocente = () => {
    if (formulario.id) {
      editarDocente(formulario);
    } else {
      agregarDocente({ ...formulario, id: crypto.randomUUID()})
    }
    cerrarModal();
  };

  const confirmarEliminarDocente = (id) => setDocenteAEliminar(id);
  const cancelarEliminar = () => setDocenteAEliminar(null);
  const confirmarEliminar = () => {
    eliminarDocente(docenteAEliminar);
    setDocenteAEliminar(null);
  };

  return (
    <div className="docentes-container">
      <h1 className="text-center my-4">Gestión de Docentes</h1>
      <button className="btn btn-primary mb-3" onClick={() => abrirModal(null)}>
        Agregar Docente
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
            {docentes.map((docente) => (
              <tr key={docente.id}>
                <td>{docente.nombre}</td>
                <td>
                  {cursos
                    .filter((curso) => docente.cursos.includes(curso.id)) // Comparación con IDs como cadenas
                    .map((curso) => curso.nombre)
                    .join(", ") || "Sin Cursos"}
                </td>
                <td>{docente.estado}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(docente)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => confirmarEliminarDocente(docente.id)}
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
      {docenteAEliminar && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar este docente?</p>
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
                  {formulario.id ? "Editar Docente" : "Agregar Docente"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
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
                  <div key={curso.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`curso-${curso.id}`}
                      checked={formulario.cursos.includes(curso.id)} // Comparación con IDs como cadenas
                      onChange={() => manejarCursos(curso.id)} // Usar ID como cadena
                    />
                    <label htmlFor={`curso-${curso.id}`}>{curso.nombre}</label>
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
                <button className="btn btn-primary" onClick={guardarDocente}>
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

export default Docentes;
