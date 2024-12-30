import { useState } from "react";
import { usePagos } from "../../context/PagosContext";
import { useAlumnos } from "../../context/AlumnosContext";
import { useUser } from "../../context/UserContext"; 
import "./pagos.css";

function Pagos() {
  const { pagos, actualizarPago, crearPago, editarPago } = usePagos();
  const { alumnos } = useAlumnos();
  const { user } = useUser(); 
  const [filtro, setFiltro] = useState("Todos");
  const [formulario, setFormulario] = useState({
    id: null,
    alumnoId: "",
    concepto: "",
    monto: "",
    estado: "Pendiente",
    descuento: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Cálculo del descuento
  const calcularDescuento = (alumnoId) => {
    const familiares = alumnos.filter((a) => a.familiaId === alumnoId);
    return familiares.length > 0 ? 10 : 0; // Ejemplo: 10% de descuento
  };

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
    let descuento = formulario.descuento;

    if (name === "alumnoId") {
      descuento = calcularDescuento(value);
    }

    setFormulario({ ...formulario, [name]: value, descuento });
  };

  const guardarPago = () => {
    if (formulario.id) {
      editarPago(formulario);
    } else {
      crearPago({ ...formulario, id: crypto.randomUUID() });
    }
    setShowConfirmModal(false);
    cerrarModal();
  };

  const mostrarConfirmacion = () => {
    if (!formulario.alumnoId || !formulario.concepto || !formulario.monto) {
      alert("Por favor complete todos los campos.");
      return;
    }
    setShowConfirmModal(true);
  };

  const completarPago = (id) => {
    actualizarPago(id, "Completado");
    alert("Pago marcado como completado.");
  };

  const desmarcarPago = (id) => {
    actualizarPago(id, "Pendiente");
    alert("Pago marcado como pendiente.");
  };

  // Filtrar pagos según el role del user
  const pagosFiltrados = pagos.filter((pago) => {
    if (user.role === "alumno") {
      return pago.alumnoId === user.alumnoId; // Solo pagos del alumno actual
    }
    if (filtro === "Pendiente") return pago.estado === "Pendiente";
    if (filtro === "Completado") return pago.estado === "Completado";
    return true;
  });

  const conceptos = ["Matrícula", "Mensualidad", "Materiales", "Otro"];

  return (
    <div className="pagos-container">

      {user.role != "alumno" && (
        <>
         <h1 className="text-center my-4">Gestión de Pagos</h1>

         <div className="resumen-pagos d-flex justify-content-between my-3">
           <div className="card p-3">
             <h5>Pagos Pendientes</h5>
             <p>{pagos.filter((p) => p.estado === "Pendiente").length}</p>
           </div>
           <div className="card p-3">
             <h5>Pagos Completados</h5>
             <p>{pagos.filter((p) => p.estado === "Completado").length}</p>
           </div>
           <div className="card p-3">
             <h5>Total Monto Pagado</h5>
             <p>
               ${pagos
                 .filter((p) => p.estado === "Completado")
                 .reduce((sum, p) => sum + parseFloat(p.monto), 0)}
             </p>
           </div>
         </div>
         </>
      )}
     

      {(user.role === "admin" || user.role === "finanzas") && (
        <button className="btn btn-primary mb-3" onClick={() => abrirModal()}>
          Crear Pago
        </button>
      )}

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
                  {(user.role === "admin" || user.role === "finanzas") && (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => abrirModal(pago)}
                    >
                      Editar
                    </button>
                  )}
                  {pago.estado === "Pendiente" && (user.role === "admin" || user.role === "finanzas") ? (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => completarPago(pago.id)}
                    >
                      Marcar como Pagado
                    </button>
                  ) : (
                    user.role === "admin" && (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => desmarcarPago(pago.id)}
                      >
                        Desmarcar Pago
                      </button>
                    )
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
                <select
                  className="form-select mb-2"
                  name="concepto"
                  value={formulario.concepto}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione un concepto</option>
                  {conceptos.map((concepto, index) => (
                    <option key={index} value={concepto}>
                      {concepto}
                    </option>
                  ))}
                </select>
                <label>Monto</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  name="monto"
                  value={formulario.monto}
                  onChange={manejarCambio}
                />
                <label>Descuento</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={`${formulario.descuento}%`}
                  disabled
                />
                <label>Monto Total</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={(formulario.monto * (1 - formulario.descuento / 100)).toFixed(2)}
                  disabled
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={mostrarConfirmacion}
                  disabled={!formulario.alumnoId || !formulario.concepto || !formulario.monto}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Pago</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Alumno: {alumnos.find((a) => a.id === formulario.alumnoId)?.nombre}</p>
                <p>Concepto: {formulario.concepto}</p>
                <p>Monto Total: ${(formulario.monto * (1 - formulario.descuento / 100)).toFixed(2)}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarPago}>
                  Confirmar
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
