import React, { useContext } from "react";
import { AlumnosContext } from '../../context/AlumnosContext';
import "./Alumnos.css";

function Alumnos() {
  const { usuarios, alumnos } = useContext(AlumnosContext);

  return (
    <div className="container">
      <h1 className="text-center my-4">Lista de Alumnos</h1>
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
  );
}

export default Alumnos;
