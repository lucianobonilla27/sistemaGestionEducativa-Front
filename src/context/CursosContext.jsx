import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

const CursosContext = createContext();

const URL = "http://localhost:3001";

const CursosProvider = ({ children }) => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    // Obtener cursos
    axios.get(`${URL}/cursos`)
      .then(response => {
        setCursos(response.data);
      })
      .catch(error => {
        console.error('Error fetching cursos data:', error);
      });
  }, []);

  const obtenerNuevoId = async (tabla, campoId) => {
    try {
      // Obtener todos los registros de la tabla
      const response = await axios.get(`${URL}/${tabla}`);
      const registros = response.data;

      // Si hay registros, tomar el mayor ID y sumarle 1; si no, iniciar desde 1
      const nuevoId =
        registros.length > 0
          ? Math.max(...registros.map((registro) => registro[campoId])) + 1
          : 1;

      return nuevoId;
    } catch (error) {
      console.error(`Error al obtener el nuevo ID para la tabla ${tabla}:`, error);
      throw new Error('Error al calcular el ID');
    }
  };

  const crearCurso = async (formData) => {
    try {
      // Obtener el próximo ID para el curso
      const nuevoIdCurso = await obtenerNuevoId('cursos', 'id_curso');

      // Crear el curso en la tabla `cursos`
      const cursoResponse = await axios.post(`${URL}/cursos`, {
        id_curso: nuevoIdCurso,
        ...formData,
      });

      return { success: true, message: 'Curso creado exitosamente' };
    } catch (error) {
      console.error('Error al crear el curso:', error);

      const errorMessage =
        error.response?.data?.message || 'Ocurrió un error al crear el curso';
      return { success: false, message: errorMessage };
    }
  };

  const eliminarCurso = async (id_curso) => {
    try {
      console.log(`Intentando eliminar curso con id_curso: ${id_curso}`);

      // 1. Buscar el curso en la tabla "cursos" usando id_curso
      const cursoResponse = await axios.get(`${URL}/cursos?id_curso=${id_curso}`);
      const curso = cursoResponse.data[0]; // Obtener el primer resultado

      if (!curso) {
        throw new Error(`No se encontró un curso con id_curso: ${id_curso}`);
      }

      // 2. Obtener el "id" que JSON Server asigna a la instancia
      const jsonServerId = curso.id;

      // 3. Eliminar el curso usando el "id" de JSON Server
      await axios.delete(`${URL}/cursos/${jsonServerId}`);
      console.log("Curso eliminado correctamente");

      // 4. Actualizar el estado local (eliminar el curso de la lista)
      setCursos((prevCursos) =>
        prevCursos.filter((curso) => curso.id_curso !== id_curso)
      );

      // 5. Mostrar un mensaje de éxito
      alert("Curso eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el curso:", error);

      // Mostrar un mensaje de error detallado
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error("Respuesta del servidor:", error.response.data);
        alert(`Error: ${error.response.data.message || "Error en el servidor"}`);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("No se recibió respuesta del servidor:", error.request);
        alert("No se pudo conectar al servidor. Verifica tu conexión a internet.");
      } else {
        // Algo más causó el error
        console.error("Error inesperado:", error.message);
        alert("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    }
  };

  const actualizarCurso = async (curso) => {
    try {
      const cursoResponse = await axios.get(`${URL}/cursos?id_curso=${curso.id_curso}`);
      const cursoEncontrado = cursoResponse.data[0]; // Obtener el primer resultado

      if (!cursoEncontrado) {
        throw new Error(`No se encontró un curso con id_curso: ${curso.id_curso}`);
      }

      const jsonServerId = cursoEncontrado.id;

      await axios.put(`${URL}/cursos/${jsonServerId}`, curso);

      alert("Curso actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el curso:", error);
      alert("No se pudo actualizar el curso");
    }
  };

  return (
    <CursosContext.Provider value={{ cursos, crearCurso, eliminarCurso, actualizarCurso }}>
      {children}
    </CursosContext.Provider>
  );
};

export { CursosContext, CursosProvider };