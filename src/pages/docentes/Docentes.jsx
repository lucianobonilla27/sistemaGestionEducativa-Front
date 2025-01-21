import React, { useContext, useEffect, useState } from "react";
import { DocentesContext } from '../../context/DocentesContext';
import CrearDocente from "../../components/forms/CrearDocente";
import EditarDocente from "../../components/forms/EditarDocente";
import { FaEdit, FaTrash } from "react-icons/fa";

function Docentes() {
  const { usuarios, docentes, deleteDocente, updateDocente } = useContext(DocentesContext);
  const [docenteEditado, setDocenteEditado] = useState(null);

  const handleEliminar = async (id_docente) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este docente?")) {
      await deleteDocente(id_docente);
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="text-center my-4">Lista de Docentes</h1>
        <button
          className="btn btn-primary mb-3"
          data-bs-toggle="modal"
          data-bs-target="#agregarDocenteModal"
        >
          Agregar docente
        </button>
        <ul className="list-group">
          {docentes.map((docente) => {
            const usuario = usuarios.find(
              (usuario) => usuario.id_usuario === docente.id_docente
            );

            return (
              <li
                key={docente.id_docente}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{usuario ? usuario.nombre : "Usuario no encontrado"}</span>
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editarDocenteModal"
                    onClick={() =>
                      setDocenteEditado({
                        id_docente: docente.id_docente,
                        id_usuario: docente.id_docente,
                        nombre: usuario ? usuario.nombre : "",
                        email: usuario ? usuario.email : "",
                      })
                    }
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(docente.id_docente)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal para agregar docente */}
      <div
        className="modal fade"
        id="agregarDocenteModal"
        tabIndex="-1"
        aria-labelledby="agregarDocenteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="agregarDocenteModalLabel">
                Agregar Docente
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <CrearDocente />
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar docente */}
      <div
        className="modal fade"
        id="editarDocenteModal"
        tabIndex="-1"
        aria-labelledby="editarDocenteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editarDocenteModalLabel">
                Editar Docente
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {docenteEditado && (
                <EditarDocente
                  docente={docenteEditado}
                  onClose={() => setDocenteEditado(null)}
                  updateDocente={updateDocente}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Docentes;
