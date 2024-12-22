import { useState } from "react";
import { useCursos } from "../../context/CursosContext";
import "./cursos.css";

function Cursos() {
  const { cursos, crearCurso, editarCurso, eliminarCurso } = useCursos();
  const [formulario, setFormulario] = useState({ id: null, nombre: "" });
  const [showModal, setShowModal] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState(null);

  const abrirModal = (curso = null) => {
    if (curso) {
      setFormulario({ ...curso });
    } else {
      setFormulario({ id: null, nombre: "" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => setShowModal(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const guardarCurso = () => {
    if (formulario.id) {
      editarCurso(formulario);
    } else {
      crearCurso({ ...formulario, id: crypto.randomUUID() });
    }
    cerrarModal();
  };

  const confirmarEliminar = (id) => setCursoAEliminar(id);

  const cancelarEliminar = () => setCursoAEliminar(null);

  const ejecutarEliminar = () => {
    if (cursoAEliminar) {
      eliminarCurso(cursoAEliminar);
      setCursoAEliminar(null);
    }
  };

  return (
    <div className="cursos-container">
      <h1 className="text-center my-4">Gestión de Cursos</h1>

      <button className="btn btn-primary mb-3" onClick={() => abrirModal()}>
        Crear Curso
      </button>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th hidden>#</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td hidden>{curso.id}</td>
                <td>{curso.nombre}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(curso)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => confirmarEliminar(curso.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formulario.id ? "Editar Curso" : "Crear Curso"}
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
                  className="form-control"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarCurso}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cursoAEliminar && (
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
                <p>¿Estás seguro de que deseas eliminar este curso?</p>
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
    </div>
  );
}

export default Cursos;
