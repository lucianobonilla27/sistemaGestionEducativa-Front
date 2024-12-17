import { useState } from "react";
import "./docentes.css";

function Docentes() {
  // Datos simulados
  const [docentes, setDocentes] = useState([
    { id: 1, nombre: "María López", cursos: [1, 2] },
    { id: 2, nombre: "José Martínez", cursos: [3] },
  ]);

  const [cursos] = useState([
    { id: 1, nombre: "Matemáticas" },
    { id: 2, nombre: "Historia" },
    { id: 3, nombre: "Física" },
  ]);

  // Estado para manejar el modal
  const [formulario, setFormulario] = useState({
    id: null,
    nombre: "",
    cursos: [],
  });
  const [showModal, setShowModal] = useState(false);

  // Función para abrir el modal
  const abrirModal = (docente = null) => {
    if (docente) {
      setFormulario(docente);
    } else {
      setFormulario({ id: null, nombre: "", cursos: [] });
    }
    setShowModal(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => setShowModal(false);

  // Función para manejar cambios en el formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // Función para manejar la selección de cursos
  const manejarCursos = (cursoId) => {
    const cursoSeleccionado = parseInt(cursoId, 10);
    if (formulario.cursos.includes(cursoSeleccionado)) {
      setFormulario({
        ...formulario,
        cursos: formulario.cursos.filter((id) => id !== cursoSeleccionado),
      });
    } else {
      setFormulario({ ...formulario, cursos: [...formulario.cursos, cursoSeleccionado] });
    }
  };

  // Función para guardar un docente
  const guardarDocente = () => {
    if (formulario.id) {
      // Editar docente existente
      setDocentes(
        docentes.map((docente) =>
          docente.id === formulario.id ? formulario : docente
        )
      );
    } else {
      // Agregar nuevo docente
      setDocentes([
        ...docentes,
        { ...formulario, id: Date.now() },
      ]);
    }
    cerrarModal();
  };

  const eliminarDocente = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este docente?");
    if (confirmacion) {
      setDocentes(docentes.filter((docente) => docente.id !== id));
    }
  };

  // Función para obtener los nombres de los cursos
  const obtenerNombreCursos = (cursosIds) => {
    return cursos
      .filter((curso) => cursosIds.includes(curso.id))
      .map((curso) => curso.nombre)
      .join(", ");
  };

  return (
    <div className="docentes-container">
      <h1 className="text-center my-4">Gestión de Docentes</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => abrirModal(null)}
      >
        Agregar Docente
      </button>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Cursos Asignados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((docente) => (
              <tr key={docente.id}>
                <td>{docente.id}</td>
                <td>{docente.nombre}</td>
                <td>{obtenerNombreCursos(docente.cursos)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(docente)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarDocente(docente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cursos</label>
                  {cursos.map((curso) => (
                    <div key={curso.id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`curso-${curso.id}`}
                        checked={formulario.cursos.includes(curso.id)}
                        onChange={() => manejarCursos(curso.id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`curso-${curso.id}`}
                      >
                        {curso.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={guardarDocente}
                >
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
