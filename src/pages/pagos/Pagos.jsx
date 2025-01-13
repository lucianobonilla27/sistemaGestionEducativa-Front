import React, { useContext } from "react";
import { PagosContext } from '../../context/PagosContext';


function Pagos() {
  const { pagos, usuarios, cursos } = useContext(PagosContext);

  return (
    <div className="container">
      <h1 className="text-center my-4">Lista de Pagos</h1>
      <ul className="list-group">
        {pagos.map(pago => {
          const alumno = usuarios.find(usuario => usuario.id_usuario === pago.id_alumno);
          const curso = cursos.find(curso => curso.id_curso === pago.id_curso);

          return (
            <li key={pago.id_pago} className="list-group-item">
              <p><strong>Alumno:</strong> {alumno ? alumno.nombre : 'Alumno no encontrado'}</p>
              <p><strong>Curso:</strong> {curso ? curso.nombre : 'Curso no encontrado'}</p>
              <p><strong>Concepto:</strong> {pago.concepto}</p>
              <p><strong>Monto:</strong> ${pago.monto.toFixed(2)}</p>
              {pago.descuento > 0 && (
                <p><strong>Descuento:</strong> {pago.descuento}%</p>
              )}
              <p><strong>Fecha:</strong> {new Date(pago.fecha).toLocaleDateString()}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Pagos;
