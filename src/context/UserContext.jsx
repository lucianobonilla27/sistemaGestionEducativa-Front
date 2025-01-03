import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuario autenticado
  const [persona, setPersona] = useState(null); // Alumno o docente relacionado
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
  const [loading, setLoading] = useState(false);

  // Cargar todos los usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:4000/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/usuarios");
      const usuario = response.data.find(
        (u) => u.email === email && u.password === password
      );

      if (usuario) {
        setUser(usuario);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos relacionados con el usuario autenticado
  useEffect(() => {
    if (!user || !user.personaId) {
      setPersona(null);
      return;
    }

    const fetchPersona = async () => {
      setLoading(true);
      try {
        const url =
          user.role === "alumno"
            ? `http://localhost:4000/alumnos/${user.personaId}`
            : user.role === "docente"
            ? `http://localhost:4000/docentes/${user.personaId}`
            : null;

        if (url) {
          const response = await axios.get(url);
          setPersona(response.data);
        } else {
          setPersona(null);
        }
      } catch (error) {
        console.error("Error al cargar los datos de la persona:", error);
        setPersona(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPersona();
  }, [user]);

  // Crear usuario
  const crearUsuario = async (usuario) => {
    setLoading(true);
    console.log("Datos enviados a crearUsuario:", usuario);
    try {
      const response = await axios.post("http://localhost:4000/usuarios", usuario);
      setUsuarios([...usuarios, response.data]); // Actualizar la lista local de usuarios
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    setPersona(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        persona,
        usuarios,
        login,
        logout,
        crearUsuario,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
