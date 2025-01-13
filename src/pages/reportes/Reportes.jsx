import React, { useContext } from "react";
import { ReportesContext } from '../../context/ReportesContext';

function Reportes() {
  const { reportes, usuarios, cursos, docentes } = useContext(ReportesContext);

  return (
    <div className="container">
      <h1 className="text-center my-4">Lista de Reportes</h1>
      <ul className="list-group">
        {reportes.map(reporte => {
          const alumno = usuarios.find(usuario => usuario.id_usuario === reporte.id_alumno);
          const curso = cursos.find(curso => curso.id_curso === reporte.id_curso);
          const docente = usuarios.find(usuario => usuario.id_usuario === reporte.id_docente);

          return (
            <li key={reporte.id_reporte} className="list-group-item">
              <p><strong>Alumno:</strong> {alumno ? alumno.nombre : 'Alumno no encontrado'}</p>
              <p><strong>Curso:</strong> {curso ? curso.nombre : 'Curso no encontrado'}</p>
              <p><strong>Docente:</strong> {docente ? docente.nombre : 'Docente no encontrado'}</p>
              <p><strong>Asistencia:</strong> {reporte.asistencia}</p>
              <p><strong>Observación:</strong> {reporte.observacion}</p>
              <p><strong>Fecha:</strong> {new Date(reporte.fecha).toLocaleDateString()}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Reportes;
