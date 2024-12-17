import { useState } from "react";
import "./reportes.css";

function Reportes() {
  // Datos simulados
  const [alumnos] = useState([
    { id: 1, nombre: "Juan Pérez", curso: "Matemáticas", nota: 8, asistencia: "85%" },
    { id: 2, nombre: "Ana García", curso: "Historia", nota: 6, asistencia: "90%" },
    { id: 3, nombre: "Carlos López", curso: "Física", nota: 9, asistencia: "95%" },
  ]);

  // Estado para el tipo de reporte
  const [tipoReporte, setTipoReporte] = useState("Todos");

  // Función para manejar el cambio del filtro
  const manejarCambioReporte = (e) => setTipoReporte(e.target.value);

  // Filtrar resultados según el tipo de reporte seleccionado
  const resultadosFiltrados = alumnos.filter((alumno) => {
    if (tipoReporte === "Todos") return true;
    if (tipoReporte === "Aprobados") return alumno.nota >= 7;
    if (tipoReporte === "Reprobados") return alumno.nota < 7;
    return true;
  });

  return (
    <div className="reportes-container">
      <h1 className="text-center my-4">Generación de Reportes</h1>

      {/* Selector para tipo de reporte */}
      <div className="mb-3">
        <label htmlFor="tipoReporte" className="form-label">Seleccionar tipo de reporte:</label>
        <select
          id="tipoReporte"
          className="form-select"
          value={tipoReporte}
          onChange={manejarCambioReporte}
        >
          <option value="Todos">Todos</option>
          <option value="Aprobados">Aprobados</option>
          <option value="Reprobados">Reprobados</option>
        </select>
      </div>

      {/* Tabla con resultados */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Nota</th>
              <th>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {resultadosFiltrados.map((alumno) => (
              <tr key={alumno.id}>
                <td>{alumno.id}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.curso}</td>
                <td>{alumno.nota}</td>
                <td>{alumno.asistencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para exportar */}
      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => alert("Función de exportar no implementada aún")}
        >
          Exportar Reporte
        </button>
      </div>
    </div>
  );
}

export default Reportes;
