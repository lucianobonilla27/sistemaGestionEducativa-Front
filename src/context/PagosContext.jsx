import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PagosContext = createContext();

export const usePagos = () => useContext(PagosContext);

export const PagosProvider = ({ children }) => {
  const [pagos, setPagos] = useState([]);
  const API_URL = "http://localhost:4000/pagos"; // URL de la fake API

  // Obtener todos los pagos
  const obtenerPagos = async () => {
    try {
      const response = await axios.get(API_URL);
      setPagos(response.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

  // Actualizar el estado de un pago
  const actualizarPago = async (id, estado) => {
    try {
      const pagoActualizado = pagos.find((pago) => pago.id === id);
      const response = await axios.put(`${API_URL}/${id}`, {
        ...pagoActualizado,
        estado,
      });
      setPagos(
        pagos.map((pago) => (pago.id === id ? response.data : pago))
      );
    } catch (error) {
      console.error("Error al actualizar pago:", error);
    }
  };

  const crearPago = async (nuevoPago) => {
    try {
      const response = await axios.post(API_URL, nuevoPago);
      setPagos([...pagos, response.data]);
    } catch (error) {
      console.error("Error al crear un pago:", error);
    }
  };
  
  const editarPago = async (pagoEditado) => {
    try {
      const response = await axios.put(`${API_URL}/${pagoEditado.id}`, pagoEditado);
      setPagos(
        pagos.map((pago) => (pago.id === pagoEditado.id ? response.data : pago))
      );
    } catch (error) {
      console.error("Error al editar un pago:", error);
    }
  };

  useEffect(() => {
    obtenerPagos();
  }, []);

  return (
    <PagosContext.Provider value={{ pagos, setPagos, actualizarPago, crearPago, editarPago }}>
      {children}
    </PagosContext.Provider>
  );
};
