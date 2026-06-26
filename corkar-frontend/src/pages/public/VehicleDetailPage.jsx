// ============================================================
// VehicleDetailPage.jsx — Detalle completo de un vehículo
// ------------------------------------------------------------
// Muestra toda la información del vehículo seleccionado y
// permite al cliente solicitar una reserva.
// ============================================================

import { useState, useEffect }     from 'react';
import { useParams, Link }         from 'react-router-dom';
import { Users, Fuel, Settings, ArrowLeft, Calendar } from 'lucide-react';
import { getVehicleById }          from '../../services/vehicles.service';
import { formatPrice }             from '../../utils/formatters';
import LoadingSpinner              from '../../components/ui/LoadingSpinner';
import { useAuth }                 from '../../context/AuthContext';

const VehicleDetailPage = () => {
  const { id }                          = useParams();
  const { isAuthenticated }             = useAuth();
  const [vehicle,      setVehicle]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [selectedImg,  setSelectedImg]  = useState(null);
  const [fechaInicio,  setFechaInicio]  = useState('');
  const [fechaFin,     setFechaFin]     = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVehicleById(id);
        setVehicle(data);
        if (data.images?.[0]) setSelectedImg(data.images[0].url);
      } catch (error) {
        console.error('Error cargando vehículo:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Calcula el costo estimado según las fechas seleccionadas
  const calcularDias = () => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin    = new Date(fechaFin);
    const dias   = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  };

  const dias         = calcularDias();
  const costoTotal   = dias * (vehicle?.precioDia || 0);
  const hoy          = new Date().toISOString().split('T')[0];

  if (loading) return (
    <div className="pt-20">
      <LoadingSpinner text="Cargando vehículo..." />
    </div>
  );

  if (!vehicle) return (
    <div className="pt-24 text-center">
      <p className="text-gray-500">Vehículo no encontrado.</p>
      <Link to="/catalogo" className="text-[#8B0000] hover:underline mt-2 inline-block">
        ← Volver al catálogo
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B0000] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna izquierda: imágenes y specs ─────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Imagen principal */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {selectedImg ? (
                <img
                  src={selectedImg}
                  alt={`${vehicle.marca} ${vehicle.modelo}`}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-3">
                  <svg viewBox="0 0 100 60" className="w-40 opacity-20" fill="#8B0000">
                    <path d="M10,40 L15,20 Q20,10 35,10 L65,10 Q80,10 85,20 L90,40 L95,42 L95,50 L5,50 L5,42 Z"/>
                    <circle cx="25" cy="50" r="8" fill="#555"/>
                    <circle cx="75" cy="50" r="8" fill="#555"/>
                  </svg>
                  <span className="text-gray-400 text-sm">Sin imagen disponible</span>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {vehicle.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vehicle.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img.url)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImg === img.url
                        ? 'border-[#8B0000]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Info principal */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-sm text-[#8B0000] font-medium bg-red-50 px-3 py-1 rounded-full">
                    {vehicle.category?.nombre}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mt-3">
                    {vehicle.marca} {vehicle.modelo}
                  </h1>
                  <p className="text-gray-500 mt-1">Año {vehicle.anio} • Placa {vehicle.placa}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  vehicle.estado === 'DISPONIBLE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {vehicle.estado === 'DISPONIBLE' ? '✓ Disponible' : '✗ No disponible'}
                </span>
              </div>

              {/* Especificaciones */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Users className="text-[#8B0000]" size={24} />
                  <span className="text-xs text-gray-500">Pasajeros</span>
                  <span className="font-semibold text-gray-900">{vehicle.capacidad}</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Settings className="text-[#8B0000]" size={24} />
                  <span className="text-xs text-gray-500">Transmisión</span>
                  <span className="font-semibold text-gray-900">
                    {vehicle.transmision === 'AUTOMATICA' ? 'Automática' : 'Manual'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Fuel className="text-[#8B0000]" size={24} />
                  <span className="text-xs text-gray-500">Combustible</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {vehicle.combustible.charAt(0) + vehicle.combustible.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Calendar className="text-[#8B0000]" size={24} />
                  <span className="text-xs text-gray-500">Año</span>
                  <span className="font-semibold text-gray-900">{vehicle.anio}</span>
                </div>
              </div>

              {/* Descripción */}
              {vehicle.descripcion && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{vehicle.descripcion}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Columna derecha: panel de reserva ───────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">

              {/* Precio */}
              <div className="text-center pb-5 border-b border-gray-100">
                <span className="text-4xl font-bold text-[#8B0000]">
                  ${vehicle.precioDia}
                </span>
                <span className="text-gray-400 text-sm ml-1">/ día</span>
              </div>

              {/* Fechas */}
              <div className="flex flex-col gap-4 mt-5">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Fecha de inicio</label>
                  <input
                    type="date"
                    min={hoy}
                    value={fechaInicio}
                    onChange={e => {
                      setFechaInicio(e.target.value);
                      if (fechaFin && e.target.value >= fechaFin) setFechaFin('');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Fecha de devolución</label>
                  <input
                    type="date"
                    min={fechaInicio || hoy}
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  />
                </div>
              </div>

              {/* Resumen de costo */}
              {dias > 0 && (
                <div className="mt-5 p-4 bg-gray-50 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">${vehicle.precioDia} × {dias} días</span>
                    <span className="font-medium">${costoTotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total estimado</span>
                    <span className="font-bold text-[#8B0000] text-lg">${costoTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Botón de reserva */}
              <div className="mt-5">
                {vehicle.estado !== 'DISPONIBLE' ? (
                  <button disabled className="w-full py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
                    No disponible
                  </button>
                ) : !isAuthenticated ? (
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white rounded-xl font-semibold transition-colors"
                  >
                    Inicia sesión para reservar
                  </Link>
                ) : !fechaInicio || !fechaFin ? (
                  <button disabled className="w-full py-3 bg-gray-200 text-gray-400 rounded-xl font-semibold cursor-not-allowed">
                    Selecciona las fechas
                  </button>
                ) : (
                  <Link
                    to={`/reserva/${vehicle.id}?inicio=${fechaInicio}&fin=${fechaFin}`}
                    className="flex items-center justify-center w-full py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white rounded-xl font-semibold transition-colors"
                  >
                    Solicitar Reserva
                  </Link>
                )}
              </div>

              {/* Nota */}
              <p className="text-xs text-gray-400 text-center mt-4">
                La reserva está sujeta a confirmación por parte de nuestro equipo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;