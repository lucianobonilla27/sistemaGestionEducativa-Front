import React, { createContext, useContext } from 'react';
import axios from 'axios';

const UsuarioContext = createContext();

export const useUsuario = () => useContext(UsuarioContext);

export const UsuarioProvider = ({ children }) => {
 
  return (
    <UsuarioContext.Provider value={{}}>
      {children}
    </UsuarioContext.Provider>
  );
};
