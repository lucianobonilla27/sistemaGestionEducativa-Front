import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

const ReportesContext = createContext();

const ReportesProvider = ({ children }) => {
  const [reportes, setReportes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);

  useEffect(() => {
    // Obtener reportes
    axios.get('http://localhost:3001/reportes')
      .then(response => {
        setReportes(response.data);
      })
      .catch(error => {
        console.error('Error fetching reportes data:', error);
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

    // Obtener docentes
    axios.get('http://localhost:3001/docentes')
      .then(response => {
        setDocentes(response.data);
      })
      .catch(error => {
        console.error('Error fetching docentes data:', error);
      });
  }, []);

  return (
    <ReportesContext.Provider value={{ reportes, usuarios, cursos, docentes }}>
      {children}
    </ReportesContext.Provider>
  );
};

export { ReportesContext, ReportesProvider };
