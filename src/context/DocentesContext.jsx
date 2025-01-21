import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

const DocentesContext = createContext();
const URL = "http://localhost:3001";

const DocentesProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [docentes, setDocentes] = useState([]);

  useEffect(() => {
    // Obtener docentes
    axios.get(URL + "/docentes")
      .then(response => {
        setDocentes(response.data);
      })
      .catch(error => {
        console.error('Error fetching docentes data:', error);
      });

    // Obtener usuarios
    axios.get(URL + "/usuarios")
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios data:', error);
      });
  }, []);

  const obtenerNuevoId = async (tabla, campoId) => {
    try {
      const response = await axios.get(`${URL}/${tabla}`);
      const registros = response.data;
      const nuevoId = registros.length > 0 ? Math.max(...registros.map((registro) => registro[campoId])) + 1 : 1;
      return nuevoId;
    } catch (error) {
      console.error(`Error al obtener el nuevo ID para la tabla ${tabla}:`, error);
      throw new Error('Error al calcular el ID');
    }
  };

  const crearDocente = async (formData) => {
    try {
      const nuevoIdUsuario = await obtenerNuevoId('usuarios', 'id_usuario');
      const usuarioResponse = await axios.post(`${URL}/usuarios`, {
        id_usuario: nuevoIdUsuario,
        ...formData,
      });

      const docenteResponse = await axios.post(`${URL}/docentes`, {
        id_docente: nuevoIdUsuario,
      });

      return { success: true, message: 'Docente creado exitosamente' };
    } catch (error) {
      console.error('Error al crear el docente:', error);
      const errorMessage = error.response?.data?.message || 'Ocurrió un error al crear el docente';
      return { success: false, message: errorMessage };
    }
  };

  const deleteDocente = async (id_usuario) => {
    try {
      const usuarioResponse = await axios.get(`${URL}/usuarios?id_usuario=${id_usuario}`);
      const usuario = usuarioResponse.data[0];

      if (!usuario) {
        throw new Error(`No se encontró un usuario con id_usuario: ${id_usuario}`);
      }

      const jsonServerId = usuario.id;
      await axios.delete(`${URL}/usuarios/${jsonServerId}`);

      const docenteResponse = await axios.get(`${URL}/docentes?id_docente=${id_usuario}`);
      const docente = docenteResponse.data[0];

      if (docente) {
        const jsonServerDocenteId = docente.id;
        await axios.delete(`${URL}/docentes/${jsonServerDocenteId}`);
      }

      setDocentes((prev) => prev.filter((docente) => docente.id_docente !== id_usuario));
      setUsuarios((prev) => prev.filter((usuario) => usuario.id_usuario !== id_usuario));

      alert("Docente y usuario asociado eliminados exitosamente");
    } catch (error) {
      console.error("Error al eliminar el docente:", error);
      alert("No se pudo eliminar el docente");
    }
  };

  const updateDocente = async (id_usuario, data) => {
    try {
      const usuarioResponse = await axios.get(`${URL}/usuarios?id_usuario=${id_usuario}`);
      const usuario = usuarioResponse.data[0];

      if (!usuario) {
        throw new Error(`No se encontró un usuario con id_usuario: ${id_usuario}`);
      }

      const jsonServerId = usuario.id;
      await axios.put(`${URL}/usuarios/${jsonServerId}`, {
        id_usuario: id_usuario,
        nombre: data.nombre,
        email: data.email,
      });

      alert("Docente actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar el docente:", error);
      alert("No se pudo actualizar el docente");
    }
  };

  return (
    <DocentesContext.Provider value={{ usuarios, docentes, crearDocente, deleteDocente, updateDocente }}>
      {children}
    </DocentesContext.Provider>
  );
};

export { DocentesContext, DocentesProvider };
