import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AlumnosContext = createContext();

export const useAlumnos = () => useContext(AlumnosContext);

export const AlumnosProvider = ({ children }) => {
  const [alumnos, setAlumnos] = useState([]);
  const API_URL = "http://localhost:4000/alumnos";

  // Obtener todos los alumnos
  const obtenerAlumnos = async () => {
    try {
      const response = await axios.get(API_URL);
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
    }
  };

  // Agregar un alumno
  const agregarAlumno = async (nuevoAlumno) => {
    try {
      const response = await axios.post(API_URL, nuevoAlumno);
      setAlumnos([...alumnos, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error al agregar alumno:", error);
    }
  };

  const editarAlumno = async (alumnoEditado) => {
    try {
      await axios.put(`${API_URL}/${alumnoEditado.id}`, alumnoEditado);
      setAlumnos(
        alumnos.map((alumno) =>
          alumno.id === alumnoEditado.id ? alumnoEditado : alumno
        )
      );
    } catch (error) {
      console.error("Error al editar alumno:", error);
    }
  };

  // Eliminar un alumno
  const eliminarAlumno = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAlumnos(alumnos.filter((alumno) => alumno.id !== id));
    } catch (error) {
      console.error("Error al eliminar alumno:", error);
    }
  };

  // Cargar alumnos al montar el componente
  useEffect(() => {
    obtenerAlumnos();
  }, []);

  return (
    <AlumnosContext.Provider value={{ alumnos, agregarAlumno, editarAlumno, eliminarAlumno }}>
      {children}
    </AlumnosContext.Provider>
  );
};
