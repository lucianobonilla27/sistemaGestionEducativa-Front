import React, { createContext, useContext } from 'react';
import axios from 'axios';

const UsuarioContext = createContext();

export const useUsuario = () => useContext(UsuarioContext);

export const UsuarioProvider = ({ children }) => {
  const obtenerNuevoId = async (tabla, campoId) => {
    try {
      // Obtener todos los registros de la tabla
      const response = await axios.get(`http://localhost:3001/${tabla}`);
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

  const crearAlumno = async (formData) => {
    try {
      // Obtener el próximo ID para el usuario
      const nuevoIdUsuario = await obtenerNuevoId('usuarios', 'id_usuario');

      // Crear el usuario en la tabla `usuarios`
      const usuarioResponse = await axios.post('http://localhost:3001/usuarios', {
        id_usuario: nuevoIdUsuario,
        ...formData,
      });

      // Crear el alumno en la tabla `alumnos` con el mismo ID
      const alumnoResponse = await axios.post('http://localhost:3001/alumnos', {
        id_alumno: nuevoIdUsuario,
      });

      return { success: true, message: 'Alumno creado exitosamente' };
    } catch (error) {
      console.error('Error al crear el alumno:', error);

      const errorMessage =
        error.response?.data?.message || 'Ocurrió un error al crear el alumno';
      return { success: false, message: errorMessage };
    }
  };

  return (
    <UsuarioContext.Provider value={{ crearAlumno }}>
      {children}
    </UsuarioContext.Provider>
  );
};
