import { useState } from "react";
import { usePagos } from "../../context/PagosContext";
import { useAlumnos } from "../../context/AlumnosContext";
import "./pagos.css";

function Pagos() {
  const { pagos, actualizarPago, crearPago, editarPago } = usePagos();
  const { alumnos } = useAlumnos();
  const [filtro, setFiltro] = useState("Todos");
  const [formulario, setFormulario] = useState({
    id: null,
    alumnoId: "",
    concepto: "",
    monto: "",
    estado: "Pendiente",
  });
  const [showModal, setShowModal] = useState(false);

  const manejarFiltro = (e) => setFiltro(e.target.value);

  const abrirModal = (pago = null) => {
    if (pago) {
      setFormulario({ ...pago });
    } else {
      setFormulario({ id: null, alumnoId: "", concepto: "", monto: "", estado: "Pendiente" });
    }
    setShowModal(true);
  };

  const cerrarModal = () => setShowModal(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const guardarPago = () => {
    if (formulario.id) {
      editarPago(formulario);
    } else {
      crearPago( { ...formulario, id: crypto.randomUUID() });
    }
    cerrarModal();
  };

  const completarPago = (id) => {
    actualizarPago(id, "Completado");
    alert("Pago marcado como completado.");
  };

  const desmarcarPago = (id) => {
    actualizarPago(id, "Pendiente");
    alert("Pago marcado como pendiente.");
  };

  const pagosFiltrados = pagos.filter((pago) => {
    if (filtro === "Pendiente") return pago.estado === "Pendiente";
    if (filtro === "Completado") return pago.estado === "Completado";
    return true;
  });

  return (
    <div className="pagos-container">
      <h1 className="text-center my-4">Gestión de Pagos</h1>

      <button className="btn btn-primary mb-3" onClick={() => abrirModal()}>
        Crear Pago
      </button>

      <div className="mb-3">
        <label htmlFor="filtro" className="form-label">
          Filtrar por estado:
        </label>
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
              <th hidden>#</th>
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
                <td hidden>{pago.id}</td>
                <td>{alumnos.find((a) => a.id === pago.alumnoId)?.nombre || "Desconocido"}</td>
                <td>{pago.concepto}</td>
                <td>${pago.monto}</td>
                <td className={`text-${pago.estado === "Pendiente" ? "warning" : "success"}`}>
                  {pago.estado}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(pago)}
                  >
                    Editar
                  </button>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formulario.id ? "Editar Pago" : "Crear Pago"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
              </div>
              <div className="modal-body">
                <label>Alumno</label>
                <select
                  className="form-select mb-2"
                  name="alumnoId"
                  value={formulario.alumnoId}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione un alumno</option>
                  {alumnos.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>
                      {alumno.nombre}
                    </option>
                  ))}
                </select>
                <label>Concepto</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="concepto"
                  value={formulario.concepto}
                  onChange={manejarCambio}
                />
                <label>Monto</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  name="monto"
                  value={formulario.monto}
                  onChange={manejarCambio}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarPago}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pagos;
