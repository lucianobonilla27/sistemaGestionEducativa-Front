import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CursosContext = createContext();

export const useCursos = () => useContext(CursosContext);

export const CursosProvider = ({ children }) => {
  const [cursos, setCursos] = useState([]);
  const API_URL = "http://localhost:4000/cursos"; // Ajusta la URL si es necesario

  const obtenerCursos = async () => {
    try {
      const response = await axios.get(API_URL);
      setCursos(response.data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    }
  };

  useEffect(() => {
    obtenerCursos();
  }, []);

  return (
    <CursosContext.Provider value={{ cursos }}>
      {children}
    </CursosContext.Provider>
  );
};
