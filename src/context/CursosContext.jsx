import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CursosContext = createContext();

export const useCursos = () => useContext(CursosContext);

export const CursosProvider = ({ children }) => {
  const [cursos, setCursos] = useState([]);
  const API_URL = "http://localhost:4000/cursos";

  // Obtener cursos
  const obtenerCursos = async () => {
    try {
      const response = await axios.get(API_URL);
      setCursos(response.data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    }
  };

  // Crear curso
  const crearCurso = async (nuevoCurso) => {
    try {
      const response = await axios.post(API_URL, nuevoCurso);
      setCursos([...cursos, response.data]);
    } catch (error) {
      console.error("Error al crear curso:", error);
    }
  };

  // Editar curso
  const editarCurso = async (cursoEditado) => {
    try {
      const response = await axios.put(`${API_URL}/${cursoEditado.id}`, cursoEditado);
      setCursos(
        cursos.map((curso) => (curso.id === cursoEditado.id ? response.data : curso))
      );
    } catch (error) {
      console.error("Error al editar curso:", error);
    }
  };

  // Eliminar curso
  const eliminarCurso = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCursos(cursos.filter((curso) => curso.id !== id));
    } catch (error) {
      console.error("Error al eliminar curso:", error);
    }
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  return (
    <CursosContext.Provider
      value={{ cursos, crearCurso, editarCurso, eliminarCurso }}
    >
      {children}
    </CursosContext.Provider>
  );
};
