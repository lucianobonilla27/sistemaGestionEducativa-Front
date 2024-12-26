import { useState } from "react";
import { useCursos } from "../../context/CursosContext";
import { useDocentes } from "../../context/DocentesContext";
import { useUser } from "../../context/UserContext";
import "./cursos.css";

function Cursos() {
  const { cursos, crearCurso, editarCurso, eliminarCurso } = useCursos();
  const { docentes, editarDocente } = useDocentes();
  const { user } = useUser(); // Usuario actual
  const [formulario, setFormulario] = useState({ id: null, nombre: "" });
  const [showModal, setShowModal] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState(null);

  // Filtrar cursos según el rol del usuario
  const cursosFiltrados =
    user.role === "docente"
      ? cursos.filter((curso) =>
          docentes.find((docente) => docente.id === user.personaId)?.cursos.includes(curso.id)
        )
      : cursos;

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

  const guardarCurso = async () => {
    if (formulario.id) {
      editarCurso({ ...formulario });
    } else {
      const nuevoCurso = {
        ...formulario,
        id: crypto.randomUUID(),
      };

      await crearCurso(nuevoCurso);

      if (user.role === "docente") {
        // Actualizar la lista de cursos del docente actual
        const docenteActual = docentes.find((docente) => docente.id === user.personaId);
        await editarDocente( {...docenteActual,
          cursos: [...(docenteActual.cursos || []), nuevoCurso.id],
        });
      }
    }
    cerrarModal();
  };

  const confirmarEliminar = (id) => setCursoAEliminar(id);

  const cancelarEliminar = () => setCursoAEliminar(null);

  const ejecutarEliminar = async () => {
    if (cursoAEliminar) {
      await eliminarCurso(cursoAEliminar);

      if (user.role === "docente") {
        const docenteActual = docentes.find((docente) => docente.id === user.personaId);
        const cursosActualizados = docenteActual.cursos.filter(
          (cursoId) => cursoId !== cursoAEliminar
        );
        await actualizarDocente(user.personaId, { cursos: cursosActualizados });
      }

      setCursoAEliminar(null);
    }
  };

  return (
    <div className="cursos-container">
      <h1 className="text-center my-4">Gestión de Cursos</h1>

      {/* Mostrar botón de crear para admin y docentes */}
      {(user.role === "admin" || user.role === "docente") && (
        <button className="btn btn-primary mb-3" onClick={() => abrirModal()}>
          Crear Curso
        </button>
      )}

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
            {cursosFiltrados.map((curso) => (
              <tr key={curso.id}>
                <td hidden>{curso.id}</td>
                <td>{curso.nombre}</td>
                {(user.role === "admin" || docentes.find((docente) => docente.id === user.personaId)?.cursos.includes(curso.id)) && (
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => abrirModal(curso)}
                    >
                      Editar
                    </button>
                    {user.role === "admin" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => confirmarEliminar(curso.id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear/Editar Cursos */}
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

      {/* Modal de Confirmación para Eliminar */}
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
