import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

const AlumnosContext = createContext();

const AlumnosProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    // Obtener usuarios
    axios.get('http://localhost:3001/usuarios')
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios data:', error);
      });

    // Obtener alumnos
    axios.get('http://localhost:3001/alumnos')
      .then(response => {
        setAlumnos(response.data);
      })
      .catch(error => {
        console.error('Error fetching alumnos data:', error);
      });
  }, []);

  return (
    <AlumnosContext.Provider value={{ usuarios, alumnos }}>
      {children}
    </AlumnosContext.Provider>
  );
};

export { AlumnosContext, AlumnosProvider };