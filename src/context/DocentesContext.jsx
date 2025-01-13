import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

const DocentesContext = createContext();

const DocentesProvider = ({ children }) => {
  const [docentes, setDocentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Obtener docentes
    axios.get('http://localhost:3001/docentes')
      .then(response => {
        setDocentes(response.data);
      })
      .catch(error => {
        console.error('Error fetching docentes data:', error);
      });

    // Obtener usuarios
    axios.get('http://localhost:3001/usuarios')
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios data:', error);
      });
  }, []);

  return (
    <DocentesContext.Provider value={{ docentes, usuarios }}>
      {children}
    </DocentesContext.Provider>
  );
};

export { DocentesContext, DocentesProvider };
