import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DocentesContext = createContext();

export const useDocentes = () => useContext(DocentesContext);

export const DocentesProvider = ({ children }) => {
  const [docentes, setDocentes] = useState([]);
  const API_URL = "http://localhost:4000/docentes"; // URL simulada con json-server

  const obtenerDocentes = async () => {
    try {
      const response = await axios.get(API_URL);
      setDocentes(response.data);
    } catch (error) {
      console.error("Error al obtener docentes:", error);
    }
  };

  const agregarDocente = async (nuevoDocente) => {
    try {
      const response = await axios.post(API_URL, nuevoDocente);
      setDocentes([...docentes, response.data]);
    } catch (error) {
      console.error("Error al agregar docente:", error);
    }
  };

  const editarDocente = async (docenteEditado) => {
    try {
      await axios.put(`${API_URL}/${docenteEditado.id}`, docenteEditado);
      setDocentes(
        docentes.map((docente) =>
          docente.id === docenteEditado.id ? docenteEditado : docente
        )
      );
    } catch (error) {
      console.error("Error al editar docente:", error);
    }
  };

  const eliminarDocente = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setDocentes(docentes.filter((docente) => docente.id !== id));
    } catch (error) {
      console.error("Error al eliminar docente:", error);
    }
  };

  useEffect(() => {
    obtenerDocentes();
  }, []);

  return (
    <DocentesContext.Provider
      value={{ docentes, agregarDocente, editarDocente, eliminarDocente }}
    >
      {children}
    </DocentesContext.Provider>
  );
};
