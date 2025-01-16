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
      console.log(nuevoIdUsuario);

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

  // const deleteAlumno = async (id_alumno) => {
  //   try {
  //     console.log("Intentando eliminar alumno con ID:", id_alumno);
  //     await axios.delete(URL + `/alumnos/${id_alumno}`);
  //     console.log("Alumno eliminado correctamente");
  //     await axios.delete(URL + `/usuarios/${id_alumno}`);
  //     console.log("Usuario eliminado correctamente");

  //     setAlumnos((prev) => prev.filter((alumno) => alumno.id_alumno !== id_alumno));
  //     setUsuarios((prev) => prev.filter((usuario) => usuario.id_usuario !== id_alumno));
      
  //     alert("Alumno eliminado exitosamente");
  //   } catch (error) {
  //     console.error("Error al eliminar el alumno:", error);
  //     alert("No se pudo eliminar el alumno");
  //   }
  // };

  // Función para eliminar un alumno
  const deleteAlumno = async (id_usuario) => {
    try {
      console.log(`Intentando eliminar alumno con id_usuario: ${id_usuario}`);

      // 1. Buscar el usuario en la tabla "usuarios" usando id_usuario
      const usuarioResponse = await axios.get(`${URL}/usuarios?id_usuario=${id_usuario}`);
      const usuario = usuarioResponse.data[0]; // Obtener el primer resultado

      if (!usuario) {
        throw new Error(`No se encontró un usuario con id_usuario: ${id_usuario}`);
      }

      // 2. Obtener el "id" que JSON Server asigna a la instancia
      const jsonServerId = usuario.id;

      // 3. Eliminar el usuario usando el "id" de JSON Server
      await axios.delete(`${URL}/usuarios/${jsonServerId}`);
      console.log("Usuario eliminado correctamente");

      // 4. Eliminar el alumno de la tabla "alumnos" (si existe)
      const alumnoResponse = await axios.get(`${URL}/alumnos?id_alumno=${id_usuario}`);
      const alumno = alumnoResponse.data[0]; // Obtener el primer resultado

      if (alumno) {
        const jsonServerAlumnoId = alumno.id;
        await axios.delete(`${URL}/alumnos/${jsonServerAlumnoId}`);
        console.log("Alumno eliminado correctamente");
      }

      // 5. Actualizar el estado local (eliminar el alumno y usuario de las listas)
      setAlumnos((prevAlumnos) =>
        prevAlumnos.filter((alumno) => alumno.id_alumno !== id_usuario)
      );
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((usuario) => usuario.id_usuario !== id_usuario)
      );

      // 6. Mostrar un mensaje de éxito
      alert("Alumno y usuario asociado eliminados exitosamente");
    } catch (error) {
      console.error("Error al eliminar el alumno:", error);

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
