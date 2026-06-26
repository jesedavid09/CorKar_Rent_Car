// ============================================================
// ReservationPage.jsx — Formulario de solicitud de reserva
// ------------------------------------------------------------
// Recibe el vehicleId por params y las fechas por query string.
// Calcula el costo, muestra el resumen y confirma la reserva.
// ============================================================

import { useState, useEffect }     from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast }                   from 'react-hot-toast';
import { ArrowLeft, Car, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { getVehicleById }          from '../../services/vehicles.service';
import { createReservation }       from '../../services/reservations.service';
import { formatDate }              from '../../utils/formatters';
import LoadingSpinner              from '../../components/ui/LoadingSpinner';
import Button                      from '../../components/ui/Button';

const ReservationPage = () => {
  const { vehicleId }                   = useParams();
  const [searchParams]                  = useSearchParams();
  const navigate                        = useNavigate();

  const [vehicle,   setVehicle]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed,  setConfirmed] = useState(false);
  const [notas,      setNotas]    = useState('');

  // Fechas que vienen desde VehicleDetailPage por query string
  const fechaInicio = searchParams.get('inicio');
  const fechaFin    = searchParams.get('fin');

  // Cálculo de días y costo
  const dias = fechaInicio && fechaFin
    ? Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24))
    : 0;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVehicleById(vehicleId);
        setVehicle(data);
      } catch {
        toast.error('Error cargando el vehículo');
        navigate('/catalogo');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vehicleId]);

  // Si no vienen fechas, redirige al detalle del vehículo
  useEffect(() => {
    if (!fechaInicio || !fechaFin || dias <= 0) {
      navigate(`/vehiculo/${vehicleId}`);
    }
  }, [fechaInicio, fechaFin]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await createReservation({
        vehicleId,
        fechaInicio,
        fechaFin,
        notas,
      });
      setConfirmed(true);
      toast.success('¡Reserva solicitada exitosamente!');
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al crear la reserva';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="pt-24">
      <LoadingSpinner text="Cargando información..." />
    </div>
  );

  // ── Pantalla de confirmación exitosa ──────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Reserva Solicitada!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tu solicitud fue enviada exitosamente. Nuestro equipo la revisará y
            te notificará cuando sea aprobada. Puedes ver el estado en "Mis Reservas".
          </p>
          <div className="bg-gray-50 rounded-xl p-4 w-full text-left flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehículo</span>
              <span className="font-medium">{vehicle.marca} {vehicle.modelo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fecha inicio</span>
              <span className="font-medium">{formatDate(fechaInicio)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fecha fin</span>
              <span className="font-medium">{formatDate(fechaFin)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-1">
              <span className="font-semibold text-gray-900">Total estimado</span>
              <span className="font-bold text-[#8B0000]">
                ${(dias * Number(vehicle.precioDia)).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/mis-reservas"
              className="w-full py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white rounded-xl font-semibold text-center transition-colors"
            >
              Ver mis reservas
            </Link>
            <Link
              to="/catalogo"
              className="w-full py-3 border border-gray-300 text-gray-700 hover:border-gray-400 rounded-xl font-semibold text-center transition-colors text-sm"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const costoTotal = dias * Number(vehicle?.precioDia || 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <Link
          to={`/vehiculo/${vehicleId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B0000] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Volver al vehículo
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirmar Reserva</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Panel izquierdo: resumen ─────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Vehículo */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car size={18} className="text-[#8B0000]" />
                Vehículo seleccionado
              </h3>
              {vehicle.images?.[0] && (
                <img
                  src={vehicle.images[0].url}
                  alt=""
                  className="w-full h-36 object-cover rounded-xl mb-4"
                />
              )}
              <p className="font-bold text-lg text-gray-900">
                {vehicle.marca} {vehicle.modelo}
              </p>
              <p className="text-sm text-gray-500">
                {vehicle.anio} • {vehicle.category?.nombre} • {vehicle.transmision === 'AUTOMATICA' ? 'Automático' : 'Manual'}
              </p>
            </div>

            {/* Fechas */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-[#8B0000]" />
                Período de renta
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Fecha inicio</p>
                  <p className="font-semibold text-gray-900 text-sm">{formatDate(fechaInicio)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Fecha fin</p>
                  <p className="font-semibold text-gray-900 text-sm">{formatDate(fechaFin)}</p>
                </div>
              </div>
              <div className="mt-3 text-center bg-[#8B0000]/5 rounded-xl p-3">
                <p className="text-sm text-[#8B0000] font-semibold">{dias} día{dias !== 1 ? 's' : ''} de renta</p>
              </div>
            </div>
          </div>

          {/* ── Panel derecho: costo y confirmación ─────── */}
          <div className="flex flex-col gap-4">

            {/* Resumen de costo */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-[#8B0000]" />
                Resumen de costo
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio por día</span>
                  <span className="font-medium">${vehicle.precioDia}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Días de renta</span>
                  <span className="font-medium">{dias} días</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total estimado</span>
                  <span className="font-bold text-[#8B0000] text-xl">
                    ${costoTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                * El pago se realiza al momento de recoger el vehículo.
              </p>
            </div>

            {/* Notas adicionales */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <label className="block font-semibold text-gray-900 mb-3">
                Notas adicionales <span className="text-gray-400 font-normal text-sm">(opcional)</span>
              </label>
              <textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
                placeholder="Ej: Necesito el vehículo con tanque lleno, hora de recogida preferida, etc."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] resize-none"
              />
            </div>

            {/* Botón confirmar */}
            <Button
              onClick={handleConfirm}
              loading={submitting}
              size="lg"
              className="w-full"
            >
              Confirmar Reserva
            </Button>

            <p className="text-xs text-gray-400 text-center">
              Al confirmar aceptas que la reserva está sujeta a aprobación por nuestro equipo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;