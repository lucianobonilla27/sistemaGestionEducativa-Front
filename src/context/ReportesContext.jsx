import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ReportesContext = createContext();

export const useReportes = () => useContext(ReportesContext);

export const ReportesProvider = ({ children }) => {
  const [reportes, setReportes] = useState([]);
  const API_URL = "http://localhost:4000/reportes"; // URL de la fake API

  // Obtener los reportes desde la API
  const obtenerReportes = async () => {
    try {
      const response = await axios.get(API_URL);
      setReportes(response.data);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    }
  };

  const crearReporte = async (nuevoReporte) => {
    try {
      const response = await axios.post(API_URL, nuevoReporte);
      setReportes([...reportes, response.data]);
    } catch (error) {
      console.error("Error al crear un reporte:", error);
    }
  };
  
  const editarReporte = async (reporteEditado) => {
    try {
      const response = await axios.put(`${API_URL}/${reporteEditado.id}`, reporteEditado);
      setReportes(
        reportes.map((reporte) =>
          reporte.id === reporteEditado.id ? response.data : reporte
        )
      );
    } catch (error) {
      console.error("Error al editar un reporte:", error);
    }
  };
  
  const eliminarReporte = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setReportes(reportes.filter((reporte) => reporte.id !== id));
    } catch (error) {
      console.error("Error al eliminar un reporte:", error);
    }
  };

  useEffect(() => {
    obtenerReportes();
  }, []);

  return (
    <ReportesContext.Provider value={{  reportes, setReportes, crearReporte, editarReporte, eliminarReporte }}>
      {children}
    </ReportesContext.Provider>
  );
};
