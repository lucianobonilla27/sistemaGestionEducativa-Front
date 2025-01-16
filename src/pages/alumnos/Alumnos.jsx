import React, { useContext, useEffect, useState } from "react";
import { AlumnosContext } from "../../context/AlumnosContext";
import CrearAlumno from "../../components/forms/CrearAlumno";
import EditarAlumno from "../../components/forms/EditarAlumno";
import { FaEdit, FaTrash } from "react-icons/fa";

function Alumnos() {
  const { usuarios, alumnos, deleteAlumno, updateAlumno } = useContext(AlumnosContext);
  const [alumnoEditado, setAlumnoEditado] = useState(null);




  const handleEliminar = async (id_alumno) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este alumno?")) {
      await deleteAlumno(id_alumno);
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center my-4">Lista de Alumnos</h1>
        <button
          className="btn btn-primary mb-3"
          data-bs-toggle="modal"
          data-bs-target="#agregarAlumnoModal"
        >
          Agregar alumno
        </button>
        <ul className="list-group">
          {alumnos.map((alumno) => {
            const usuario = usuarios.find(
              (usuario) => usuario.id_usuario === alumno.id_alumno
            );

            return (
              <li
                key={alumno.id_alumno}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{usuario ? usuario.nombre : "Usuario no encontrado"}</span>
                <div>
                  {/* Botón de edición */}
                  <button
                    className="btn btn-warning btn-sm me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editarAlumnoModal"
                    onClick={() =>
                      setAlumnoEditado({
                        id_alumno: alumno.id_alumno,
                        id_usuario: alumno.id_alumno, // Sincronizamos IDs
                        nombre: usuario ? usuario.nombre : "",
                        email: usuario ? usuario.email : "",
                      })
                    }
                  >
                    <FaEdit />
                  </button>
                  {/* Botón de eliminación */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(alumno.id_alumno)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal para agregar alumno */}
      <div
        className="modal fade"
        id="agregarAlumnoModal"
        tabIndex="-1"
        aria-labelledby="agregarAlumnoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="agregarAlumnoModalLabel">
                Agregar Alumno
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <CrearAlumno />
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar alumno */}
      <div
        className="modal fade"
        id="editarAlumnoModal"
        tabIndex="-1"
        aria-labelledby="editarAlumnoModalLabel"
        aria-hidden="true"
      
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editarAlumnoModalLabel">
                Editar Alumno
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {alumnoEditado && (
                <EditarAlumno
                  alumno={alumnoEditado}
                  onClose={() => setAlumnoEditado(null)}
                  updateAlumno={updateAlumno}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Alumnos;
