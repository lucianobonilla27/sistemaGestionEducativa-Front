import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Usuario autenticado
  const [persona, setPersona] = useState(null); // Alumno o docente relacionado
  const [loading, setLoading] = useState(false);

const login = async (email, password) => {
  setLoading(true);
  try {
    const response = await axios.get("http://localhost:4000/usuarios");
    const usuario = response.data.find(
      (u) => u.email === email && u.password === password
    );

    if (usuario) {
      setUser(usuario); // Inicia sesión asignando el usuario
      return true; // Devuelve true si las credenciales son correctas
    } else {
      setUser(null); // Asegúrate de que no haya datos residuales
      return false; // Devuelve false si las credenciales son incorrectas
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

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    setPersona(null);
  };

  return (
    <UserContext.Provider value={{ user, persona, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
