import React, { useState, useContext } from "react";
import { CursosContext } from "../../context/CursosContext";

function Cursos() {
  const { cursos, crearCurso, eliminarCurso, actualizarCurso } = useContext(CursosContext);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: 0,
  });
  const [cursoEditar, setCursoEditar] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitCrear = async (e) => {
    e.preventDefault();

    const result = await crearCurso(formData);

    if (result.success) {
      alert(result.message);
      setFormData({ nombre: "", precio: 0 }); // Limpiar formulario
      window.location.reload(); // Recargar la página para ver los cambios
    } else {
      alert('Error: ' + result.message);
    }
  };

  const handleSubmitEditar = async (e) => {
    e.preventDefault();

    const result = await actualizarCurso({ ...cursoEditar, ...formData });

    if (result.success) {
      alert(result.message);
      setFormData({ nombre: "", precio: 0 }); // Limpiar formulario
      setCursoEditar(null);
      window.location.reload(); // Recargar la página para ver los cambios
    } else {
      alert('Error: ' + result.message);
    }
  };

  const handleEliminar = async (id_curso) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      await eliminarCurso(id_curso);
      window.location.reload(); // Recargar la página para ver los cambios
    }
  };

  const handleEditar = (curso) => {
    setCursoEditar(curso);
    setFormData({ nombre: curso.nombre, precio: curso.precio });
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Lista de Cursos</h1>
      <button
        className="btn btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#agregarCursoModal"
      >
        Agregar curso
      </button>
      <ul className="list-group">
        {cursos.map((curso) => (
          <li
            key={curso.id_curso}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{curso.nombre}</span>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                data-bs-toggle="modal"
                data-bs-target="#editarCursoModal"
                onClick={() => handleEditar(curso)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleEliminar(curso.id_curso)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div
        className="modal fade"
        id="agregarCursoModal"
        tabIndex="-1"
        aria-labelledby="agregarCursoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="agregarCursoModalLabel">
                Agregar Curso
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitCrear}>
                <label htmlFor="nombre" className="form-label">
                  Nombre del curso:
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label htmlFor="precio" className="form-label">
                  Precio del curso:
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <button type="submit" className="btn btn-primary">
                  Agregar Curso
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="editarCursoModal"
        tabIndex="-1"
        aria-labelledby="editarCursoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editarCursoModalLabel">
                Editar Curso
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {cursoEditar && (
                <form onSubmit={handleSubmitEditar}>
                  <label htmlFor="nombre" className="form-label">
                    Nombre del curso:
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label htmlFor="precio" className="form-label">
                    Precio del curso:
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <button type="submit" className="btn btn-primary">
                    Actualizar Curso
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cursos;