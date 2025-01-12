import React from 'react';
import AppRoutes from "./routes/AppRoutes";
import { AlumnosProvider } from './context/AlumnosContext';

function App() {
  return (
    <AlumnosProvider>
      <AppRoutes />
    </AlumnosProvider>
  );
}

export default App;
