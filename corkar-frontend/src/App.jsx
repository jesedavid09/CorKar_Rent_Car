// ============================================================
// App.jsx — Enrutador principal de la aplicación
// ------------------------------------------------------------
// Define todas las rutas de la app usando React Router v6.
// Las rutas protegidas se envuelven en ProtectedRoute para
// verificar autenticación y roles antes de renderizar.
// ============================================================

import { Routes, Route, useLocation } from 'react-router-dom';

// Layout
import Navbar         from './components/common/Navbar';
import Footer         from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Páginas públicas
import HomePage          from './pages/public/HomePage';
import CatalogPage       from './pages/public/CatalogPage';
import VehicleDetailPage from './pages/public/VehicleDetailPage';
import LoginPage         from './pages/public/LoginPage';
import RegisterPage      from './pages/public/RegisterPage';

// Páginas del cliente
import MyReservationsPage from './pages/client/MyReservationsPage';
import ReservationPage    from './pages/client/ReservationPage';
import IncidentPage       from './pages/client/IncidentPage';

// Páginas del admin
import DashboardPage         from './pages/admin/DashboardPage';
import VehiclesAdminPage     from './pages/admin/VehiclesAdminPage';
import ReservationsAdminPage from './pages/admin/ReservationsAdminPage';
import ClientsAdminPage      from './pages/admin/ClientsAdminPage';
import IncidentsAdminPage    from './pages/admin/IncidentsAdminPage';

const App = () => {
  const location = useLocation();

  // Detecta si estamos en una página del panel admin
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Navbar solo en páginas públicas y de cliente */}
      {!isAdminPage && <Navbar />}

      <main className={`flex-1 ${!isAdminPage ? 'pt-16' : ''}`}>
        <Routes>

          {/* ── Rutas públicas ──────────────────────────── */}
          <Route path="/"             element={<HomePage />} />
          <Route path="/catalogo"     element={<CatalogPage />} />
          <Route path="/vehiculo/:id" element={<VehicleDetailPage />} />
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/registro"     element={<RegisterPage />} />

          {/* ── Rutas del cliente (requieren login) ─────── */}
          <Route path="/mis-reservas" element={
            <ProtectedRoute><MyReservationsPage /></ProtectedRoute>
          } />
          <Route path="/reserva/:vehicleId" element={
            <ProtectedRoute><ReservationPage /></ProtectedRoute>
          } />
          <Route path="/incidente" element={
            <ProtectedRoute><IncidentPage /></ProtectedRoute>
          } />

          {/* ── Rutas del admin (requieren rol ADMIN) ───── */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/admin/vehiculos" element={
            <ProtectedRoute requireAdmin><VehiclesAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/reservas" element={
            <ProtectedRoute requireAdmin><ReservationsAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/clientes" element={
            <ProtectedRoute requireAdmin><ClientsAdminPage /></ProtectedRoute>
          } />
          <Route path="/admin/incidentes" element={
            <ProtectedRoute requireAdmin><IncidentsAdminPage /></ProtectedRoute>
          } />

        </Routes>
      </main>

      {/* Footer solo en páginas no admin */}
      {!isAdminPage && <Footer />}

    </div>
  );
};

export default App;