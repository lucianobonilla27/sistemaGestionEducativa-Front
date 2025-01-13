import React, { useContext } from "react";
import { AlumnosContext } from '../../context/AlumnosContext';
import CrearAlumno from '../../components/forms/CrearAlumno';
import "./Alumnos.css";

function Alumnos() {
  const { usuarios, alumnos } = useContext(AlumnosContext);

  return (
    <>
    <div className="container">
      <h1 className="text-center my-4">Lista de Alumnos</h1>
      <button className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#agregarAlumnoModal">Agregar alumno</button>
      <ul className="list-group">
        {alumnos.map(alumno => {
          const usuario = usuarios.find(usuario => usuario.id_usuario === alumno.id_alumno);
          return (
            <li key={alumno.id_alumno} className="list-group-item">
              {usuario ? usuario.nombre : 'Usuario no encontrado'}
            </li>
          );
        })}
      </ul>
    </div>

    {/* Modal para agregar alumno */}
    <div className="modal fade" id="agregarAlumnoModal" tabIndex="-1" aria-labelledby="agregarAlumnoModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="agregarAlumnoModalLabel">Agregar Alumno</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <CrearAlumno />
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

export default Alumnos;
