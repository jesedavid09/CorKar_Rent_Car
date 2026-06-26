// ============================================================
// DashboardPage.jsx — Panel principal del administrador
// ------------------------------------------------------------
// Muestra métricas clave del negocio: reservas, ingresos,
// vehículos e incidentes. Incluye tabla de reservas recientes.
// ============================================================

import { useState, useEffect }  from 'react';
import { Link }                 from 'react-router-dom';
import { Car, Calendar, Users, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { getAllReservations }    from '../../services/reservations.service';
import { getVehicles }          from '../../services/vehicles.service';
import { getAllIncidents }       from '../../services/incidents.service';
import { formatDate, formatEstadoReserva } from '../../utils/formatters';
import LoadingSpinner            from '../../components/ui/LoadingSpinner';
import AdminLayout               from './AdminLayout';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const estadoBadge = (estado) => {
  const map = {
    PENDIENTE:  'bg-yellow-100 text-yellow-700',
    APROBADA:   'bg-blue-100 text-blue-700',
    ACTIVA:     'bg-green-100 text-green-700',
    COMPLETADA: 'bg-gray-100 text-gray-600',
    RECHAZADA:  'bg-red-100 text-red-700',
    CANCELADA:  'bg-red-50 text-red-400',
  };
  return map[estado] || 'bg-gray-100 text-gray-600';
};

const DashboardPage = () => {
  const [reservations, setReservations] = useState([]);
  const [vehicles,     setVehicles]     = useState([]);
  const [incidents,    setIncidents]    = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, v, i] = await Promise.all([
          getAllReservations(),
          getVehicles(),
          getAllIncidents(),
        ]);
        setReservations(r);
        setVehicles(v);
        setIncidents(i);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Métricas calculadas
  const totalIngresos    = reservations
    .filter(r => ['COMPLETADA', 'ACTIVA'].includes(r.estado))
    .reduce((acc, r) => acc + Number(r.costoTotal), 0);

  const reservasPendientes = reservations.filter(r => r.estado === 'PENDIENTE').length;
  const vehiculosDisponibles = vehicles.filter(v => v.estado === 'DISPONIBLE').length;
  const incidentesAbiertos = incidents.filter(i => i.estado === 'ABIERTO').length;

  if (loading) return (
    <AdminLayout>
      <LoadingSpinner text="Cargando dashboard..." />
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">

        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen general de CorKar Rent Car</p>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Calendar className="text-blue-600" size={22} />}
            label="Total reservas"
            value={reservations.length}
            sub={`${reservasPendientes} pendientes`}
            color="bg-blue-50"
          />
          <StatCard
            icon={<TrendingUp className="text-green-600" size={22} />}
            label="Ingresos generados"
            value={`$${totalIngresos.toFixed(2)}`}
            sub="Reservas activas y completadas"
            color="bg-green-50"
          />
          <StatCard
            icon={<Car className="text-[#8B0000]" size={22} />}
            label="Vehículos disponibles"
            value={vehiculosDisponibles}
            sub={`de ${vehicles.length} en flota`}
            color="bg-red-50"
          />
          <StatCard
            icon={<AlertTriangle className="text-yellow-600" size={22} />}
            label="Incidentes abiertos"
            value={incidentesAbiertos}
            sub="Requieren atención"
            color="bg-yellow-50"
          />
        </div>

        {/* Reservas recientes */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Reservas recientes</h2>
            <Link
              to="/admin/reservas"
              className="text-sm text-[#8B0000] hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehículo</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fechas</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.slice(0, 8).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {r.user?.nombre} {r.user?.apellido}
                      </p>
                      <p className="text-xs text-gray-400">{r.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {r.vehicle?.marca} {r.vehicle?.modelo}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {formatDate(r.fechaInicio)} → {formatDate(r.fechaFin)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${Number(r.costoTotal).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estadoBadge(r.estado)}`}>
                        {formatEstadoReserva(r.estado)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">
                No hay reservas aún
              </div>
            )}
          </div>
        </div>

        {/* Incidentes abiertos */}
        {incidentesAbiertos > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-600" size={20} />
              <p className="text-sm text-yellow-800 font-medium">
                Tienes {incidentesAbiertos} incidente{incidentesAbiertos > 1 ? 's' : ''} abierto{incidentesAbiertos > 1 ? 's' : ''} que requiere{incidentesAbiertos > 1 ? 'n' : ''} atención.
              </p>
            </div>
            <Link
              to="/admin/incidentes"
              className="text-sm font-semibold text-yellow-700 hover:underline"
            >
              Ver incidentes
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;