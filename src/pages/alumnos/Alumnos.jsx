import { useState } from "react";
import "./Alumnos.css";

function Alumnos() {
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: "Juan Pérez", cursoId: 1, estado: "Activo" },
    { id: 2, nombre: "Ana García", cursoId: 2, estado: "Inactivo" },
  ]);

  const [cursos] = useState([
    { id: 1, nombre: "Matemáticas" },
    { id: 2, nombre: "Historia" },
  ]);

  const [formulario, setFormulario] = useState({
    id: null,
    nombre: "",
    cursoId: "",
    estado: "Activo",
  });

  const [showModal, setShowModal] = useState(false);

  const abrirModal = (alumno = null) => {
    if (alumno) {
      setFormulario(alumno);
    } else {
      setFormulario({ id: null, nombre: "", cursoId: "", estado: "Activo" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => setShowModal(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const guardarAlumno = () => {
    if (formulario.id) {
      setAlumnos(
        alumnos.map((alumno) =>
          alumno.id === formulario.id ? formulario : alumno
        )
      );
    } else {
      setAlumnos([
        ...alumnos,
        { ...formulario, id: Date.now(), cursoId: parseInt(formulario.cursoId) },
      ]);
    }
    cerrarModal();
  };

  return (
    <div className="alumnos-container">
      <h1 className="text-center my-4">Gestión de Alumnos</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => abrirModal(null)}
      >
        Agregar Alumno
      </button>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td>{alumno.id}</td>
                <td>{alumno.nombre}</td>
                <td>
                  {cursos.find((curso) => curso.id === alumno.cursoId)?.nombre ||
                    "Sin Curso"}
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
                    onClick={() =>
                      setAlumnos(alumnos.filter((a) => a.id !== alumno.id))
                    }
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
                  {formulario.id ? "Editar Alumno" : "Agregar Alumno"}
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
                  <label className="form-label">Curso</label>
                  <select
                    className="form-select"
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
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
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
                  onClick={guardarAlumno}
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

export default Alumnos;
