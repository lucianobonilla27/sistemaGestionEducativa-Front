import React, { useContext } from "react";
import { CursosContext } from '../../context/CursosContext';
import "./Cursos.css";

function Cursos() {
  const { cursos } = useContext(CursosContext);

  return (
    <div className="container">
      <h1 className="text-center my-4">Lista de Cursos</h1>
      <ul className="list-group">
        {cursos.map(curso => (
          <li key={curso.id_curso} className="list-group-item">
            {curso.nombre} - ${curso.precio.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cursos;
