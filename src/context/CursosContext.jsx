import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

const CursosContext = createContext();

const CursosProvider = ({ children }) => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    // Obtener cursos
    axios.get('http://localhost:3001/cursos')
      .then(response => {
        setCursos(response.data);
      })
      .catch(error => {
        console.error('Error fetching cursos data:', error);
      });
  }, []);

  return (
    <CursosContext.Provider value={{ cursos }}>
      {children}
    </CursosContext.Provider>
  );
};

export { CursosContext, CursosProvider };
