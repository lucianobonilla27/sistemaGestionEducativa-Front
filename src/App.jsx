import React from 'react';
import AppRoutes from "./routes/AppRoutes";
import { AlumnosProvider } from './context/AlumnosContext';
import { CursosProvider } from './context/CursosContext';
import { DocentesProvider } from './context/DocentesContext';
import { PagosProvider } from './context/PagosContext';
import { ReportesProvider } from './context/ReportesContext';

function App() {
  return (
    <AlumnosProvider>
      <CursosProvider>
        <DocentesProvider>
          <PagosProvider>
            <ReportesProvider>
              <AppRoutes />
            </ReportesProvider>
          </PagosProvider>
        </DocentesProvider>
      </CursosProvider>
    </AlumnosProvider>
  );
}

export default App;
