// ============================================================
// ReservationsAdminPage.jsx — Gestión de reservas
// ------------------------------------------------------------
// El admin puede ver todas las reservas, filtrarlas por estado
// y cambiar el estado de cada una.
// ============================================================

import { useState, useEffect }  from 'react';
import { toast }                from 'react-hot-toast';
import { Search, Filter }       from 'lucide-react';
import { getAllReservations, updateReservationEstado } from '../../services/reservations.service';
import { formatDate, formatEstadoReserva }             from '../../utils/formatters';
import LoadingSpinner            from '../../components/ui/LoadingSpinner';
import AdminLayout               from './AdminLayout';

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

// Estados a los que puede transicionar cada estado actual
const transiciones = {
  PENDIENTE:  ['APROBADA', 'RECHAZADA'],
  APROBADA:   ['ACTIVA', 'CANCELADA'],
  ACTIVA:     ['COMPLETADA', 'CANCELADA'],
  COMPLETADA: [],
  RECHAZADA:  [],
  CANCELADA:  [],
};

const ReservationsAdminPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [updating,     setUpdating]     = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda,     setBusqueda]     = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getAllReservations();
      setReservations(data);
    } catch {
      toast.error('Error cargando reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (id, nuevoEstado) => {
    setUpdating(id);
    try {
      await updateReservationEstado(id, nuevoEstado);
      toast.success(`Reserva ${formatEstadoReserva(nuevoEstado).toLowerCase()} exitosamente`);
      loadReservations();
    } catch {
      toast.error('Error actualizando estado');
    } finally {
      setUpdating(null);
    }
  };

  // Filtro local por estado y búsqueda
  const filtered = reservations.filter(r => {
    const matchEstado   = !filtroEstado || r.estado === filtroEstado;
    const matchBusqueda = !busqueda || (
      `${r.user?.nombre} ${r.user?.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      `${r.vehicle?.marca} ${r.vehicle?.modelo}`.toLowerCase().includes(busqueda.toLowerCase())
    );
    return matchEstado && matchBusqueda;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">

        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
          <p className="text-gray-500 text-sm mt-1">{reservations.length} reservas en total</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por cliente o vehículo..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          >
            <option value="">Todos los estados</option>
            {['PENDIENTE','APROBADA','ACTIVA','COMPLETADA','RECHAZADA','CANCELADA'].map(e => (
              <option key={e} value={e}>{formatEstadoReserva(e)}</option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        {loading ? (
          <LoadingSpinner text="Cargando reservas..." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left border-b border-gray-200">
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Vehículo</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Fechas</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {r.user?.nombre} {r.user?.apellido}
                        </p>
                        <p className="text-xs text-gray-400">{r.user?.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-700">
                        <p>{r.vehicle?.marca} {r.vehicle?.modelo}</p>
                        <p className="text-xs text-gray-400">{r.vehicle?.placa}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs">
                        <p>{formatDate(r.fechaInicio)}</p>
                        <p className="text-gray-400">→ {formatDate(r.fechaFin)}</p>
                        <p className="text-gray-400 mt-0.5">{r.diasTotal} días</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">
                        ${Number(r.costoTotal).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estadoBadge(r.estado)}`}>
                          {formatEstadoReserva(r.estado)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {transiciones[r.estado]?.map(nuevoEstado => (
                            <button
                              key={nuevoEstado}
                              onClick={() => handleUpdateEstado(r.id, nuevoEstado)}
                              disabled={updating === r.id}
                              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                                nuevoEstado === 'APROBADA' || nuevoEstado === 'ACTIVA' || nuevoEstado === 'COMPLETADA'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {updating === r.id ? '...' : formatEstadoReserva(nuevoEstado)}
                            </button>
                          ))}
                          {transiciones[r.estado]?.length === 0 && (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No se encontraron reservas
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReservationsAdminPage;