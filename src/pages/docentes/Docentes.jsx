import React, { useContext } from "react";
import { DocentesContext } from '../../context/DocentesContext';


function Docentes() {
  const { docentes, usuarios } = useContext(DocentesContext);

  return (
    <div className="container">
      <h1 className="text-center my-4">Lista de Docentes</h1>
      <ul className="list-group">
        {docentes.map(docente => {
          const usuario = usuarios.find(usuario => usuario.id_usuario === docente.id_docente);
          return (
            <li key={docente.id_docente} className="list-group-item">
              {usuario ? usuario.nombre : 'Usuario no encontrado'}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Docentes;
