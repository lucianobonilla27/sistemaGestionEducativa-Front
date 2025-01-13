import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

const PagosContext = createContext();

const PagosProvider = ({ children }) => {
  const [pagos, setPagos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    // Obtener pagos
    axios.get('http://localhost:3001/pagos')
      .then(response => {
        setPagos(response.data);
      })
      .catch(error => {
        console.error('Error fetching pagos data:', error);
      });

    // Obtener usuarios
    axios.get('http://localhost:3001/usuarios')
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios data:', error);
      });

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
    <PagosContext.Provider value={{ pagos, usuarios, cursos }}>
      {children}
    </PagosContext.Provider>
  );
};

export { PagosContext, PagosProvider };
