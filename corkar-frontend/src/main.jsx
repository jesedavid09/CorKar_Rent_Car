// ============================================================
// main.jsx — Punto de entrada de React
// ------------------------------------------------------------
// Monta la aplicación en el DOM y envuelve todo con los
// providers necesarios:
// - BrowserRouter: habilita el sistema de rutas
// - AuthProvider: provee el estado global de autenticación
// - Toaster: habilita las notificaciones toast en toda la app
// ============================================================

import { StrictMode }    from 'react'
import { createRoot }    from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster }       from 'react-hot-toast'
import { AuthProvider }  from './context/AuthContext'
import App               from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* Toaster renderiza las notificaciones en una capa por encima de todo */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: '14px' },
            success: { iconTheme: { primary: '#8B0000', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)