import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AlumnosContext = createContext();

const URL = "http://localhost:3001";

const AlumnosProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    // Obtener alumnos
    axios.get(URL + "/alumnos")
      .then((response) => {
        setAlumnos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching alumnos data:", error);
      });

    // Obtener usuarios
    axios.get(URL + "/usuarios")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Error fetching usuarios data:", error);
      })
    })

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

  const deleteAlumno = async (id_alumno) => {
    try {
      await axios.delete(URL + `/alumnos/${id_alumno}`);
      await axios.delete(URL + `/usuarios/${id_alumno}`);

      setAlumnos((prev) => prev.filter((alumno) => alumno.id_alumno !== id_alumno));
      setUsuarios((prev) => prev.filter((usuario) => usuario.id_usuario !== id_alumno));
      
      alert("Alumno eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el alumno:", error);
      alert("No se pudo eliminar el alumno");
    }
  };

  const updateAlumno = async (id_alumno, data) => {
    try {
      await axios.put(URL + `/usuarios/${id_alumno}`, {
        nombre: data.nombre,
        email: data.email,
      });

  

      alert("Alumno actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el alumno:", error);
      alert("No se pudo actualizar el alumno");
    }
  };

  

  return (
    <AlumnosContext.Provider value={{ usuarios, alumnos, crearAlumno, deleteAlumno, updateAlumno }}>
      {children}
    </AlumnosContext.Provider>
  );
};

export { AlumnosContext, AlumnosProvider };
