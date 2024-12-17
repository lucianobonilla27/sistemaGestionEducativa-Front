import { useState } from "react";
import "./pagos.css";

function Pagos() {
  // Datos simulados
  const [pagos, setPagos] = useState([
    { id: 1, alumno: "Juan Pérez", concepto: "Matrícula", monto: 5000, estado: "Pendiente" },
    { id: 2, alumno: "Ana García", concepto: "Cuota Mensual", monto: 2500, estado: "Completado" },
    { id: 3, alumno: "Carlos López", concepto: "Cuota Mensual", monto: 2500, estado: "Pendiente" },
  ]);

  // Estado para el filtro
  const [filtro, setFiltro] = useState("Todos");

  // Función para manejar el cambio de filtro
  const manejarFiltro = (e) => setFiltro(e.target.value);

  // Función para marcar un pago como completado
  const completarPago = (id) => {
    setPagos(
      pagos.map((pago) =>
        pago.id === id ? { ...pago, estado: "Completado" } : pago
      )
    );
    alert("Pago marcado como completado.");
  };

  // Función para desmarcar un pago como completado (volver a pendiente)
  const desmarcarPago = (id) => {
    setPagos(
      pagos.map((pago) =>
        pago.id === id ? { ...pago, estado: "Pendiente" } : pago
      )
    );
    alert("Pago marcado como pendiente.");
  };

  // Función para generar un comprobante (simulado)
  const generarComprobante = (id) => {
    const pago = pagos.find((p) => p.id === id);
    alert(`Comprobante generado para ${pago.alumno} - ${pago.concepto}`);
  };

  // Filtrar los pagos según el filtro seleccionado
  const pagosFiltrados = pagos.filter((pago) => {
    if (filtro === "Pendiente") return pago.estado === "Pendiente";
    if (filtro === "Completado") return pago.estado === "Completado";
    return true; // "Todos"
  });

  return (
    <div className="pagos-container">
      <h1 className="text-center my-4">Gestión de Pagos</h1>

      {/* Selector de filtro */}
      <div className="mb-3">
        <label htmlFor="filtro" className="form-label">Filtrar por estado:</label>
        <select
          id="filtro"
          className="form-select"
          value={filtro}
          onChange={manejarFiltro}
        >
          <option value="Todos">Todos</option>
          <option value="Pendiente">Pendientes</option>
          <option value="Completado">Completados</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Alumno</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.id}</td>
                <td>{pago.alumno}</td>
                <td>{pago.concepto}</td>
                <td>${pago.monto}</td>
                <td
                  className={`text-${
                    pago.estado === "Pendiente" ? "warning" : "success"
                  }`}
                >
                  {pago.estado}
                </td>
                <td>
                  {pago.estado === "Pendiente" ? (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => completarPago(pago.id)}
                    >
                      Marcar como Pagado
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => desmarcarPago(pago.id)}
                    >
                      Desmarcar Pago
                    </button>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => generarComprobante(pago.id)}
                  >
                    Generar Comprobante
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pagos;
