// ============================================================
// IncidentPage.jsx — Reporte de incidentes
// ------------------------------------------------------------
// Permite al cliente reportar un problema con un vehículo
// rentado. Solo puede reportar incidentes de sus propias
// reservas activas.
// ============================================================

import { useState, useEffect }     from 'react';
import { useNavigate, Link }       from 'react-router-dom';
import { useForm }                 from 'react-hook-form';
import { toast }                   from 'react-hot-toast';
import { AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react';
import { getMyReservations }       from '../../services/reservations.service';
import { createIncident }          from '../../services/incidents.service';
import { formatDate }              from '../../utils/formatters';
import Button                      from '../../components/ui/Button';
import Input                       from '../../components/ui/Input';
import LoadingSpinner              from '../../components/ui/LoadingSpinner';

const TIPOS_INCIDENTE = [
  'Accidente de tránsito',
  'Daño mecánico',
  'Daño en carrocería',
  'Problema con llantas',
  'Problema eléctrico',
  'Robo o intento de robo',
  'Problema con frenos',
  'Otro',
];

const IncidentPage = () => {
  const navigate                        = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Carga solo las reservas activas del cliente
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyReservations();
        // Solo puede reportar incidentes en reservas activas o aprobadas
        const activas = data.filter(r =>
          ['ACTIVA', 'APROBADA'].includes(r.estado)
        );
        setReservations(activas);
      } catch {
        toast.error('Error cargando tus reservas');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createIncident(data);
      setConfirmed(true);
      toast.success('Incidente reportado exitosamente');
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al reportar el incidente';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="pt-24">
      <LoadingSpinner text="Cargando tus reservas..." />
    </div>
  );

  // ── Pantalla de confirmación ──────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Incidente Reportado!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tu reporte fue enviado exitosamente. Nuestro equipo lo revisará
            y se pondrá en contacto contigo a la brevedad posible.
          </p>
          <div className="flex flex-col gap-3 w-full mt-2">
            <Link
              to="/mis-reservas"
              className="w-full py-3 bg-[#8B0000] hover:bg-[#6B0000] text-white rounded-xl font-semibold text-center transition-colors"
            >
              Ver mis reservas
            </Link>
            <Link
              to="/"
              className="w-full py-3 border border-gray-300 text-gray-700 hover:border-gray-400 rounded-xl font-semibold text-center transition-colors text-sm"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <Link
          to="/mis-reservas"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B0000] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Volver a mis reservas
        </Link>

        {/* Tarjeta del formulario */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Encabezado */}
          <div className="bg-[#8B0000] px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Reportar Incidente</h1>
                <p className="text-red-200 text-sm mt-0.5">
                  Informa cualquier problema con tu vehículo rentado
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="px-8 py-8">
            {reservations.length === 0 ? (
              // Sin reservas activas
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <AlertTriangle className="text-gray-400" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900">Sin reservas activas</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Solo puedes reportar incidentes en reservas que estén
                  activas o aprobadas.
                </p>
                <Link
                  to="/mis-reservas"
                  className="mt-2 text-[#8B0000] hover:underline text-sm font-medium"
                >
                  Ver mis reservas
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                {/* Reserva asociada */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Reserva asociada
                  </label>
                  <select
                    className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] ${
                      errors.reservationId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    {...register('reservationId', {
                      required: 'Selecciona la reserva afectada'
                    })}
                  >
                    <option value="">Selecciona una reserva...</option>
                    {reservations.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.vehicle?.marca} {r.vehicle?.modelo} —{' '}
                        {formatDate(r.fechaInicio)} al {formatDate(r.fechaFin)}
                      </option>
                    ))}
                  </select>
                  {errors.reservationId && (
                    <p className="text-xs text-red-600">{errors.reservationId.message}</p>
                  )}
                </div>

                {/* Tipo de incidente */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Tipo de incidente
                  </label>
                  <select
                    className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] ${
                      errors.tipo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    {...register('tipo', {
                      required: 'Selecciona el tipo de incidente'
                    })}
                  >
                    <option value="">Selecciona el tipo...</option>
                    {TIPOS_INCIDENTE.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                  {errors.tipo && (
                    <p className="text-xs text-red-600">{errors.tipo.message}</p>
                  )}
                </div>

                {/* Descripción */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Descripción del incidente
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe con detalle qué ocurrió, cuándo y dónde. Incluye cualquier información relevante que pueda ayudar a nuestro equipo."
                    className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] resize-none ${
                      errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    {...register('descripcion', {
                      required: 'La descripción es obligatoria',
                      minLength: {
                        value: 20,
                        message: 'Por favor describe el incidente con más detalle (mínimo 20 caracteres)'
                      }
                    })}
                  />
                  {errors.descripcion && (
                    <p className="text-xs text-red-600">{errors.descripcion.message}</p>
                  )}
                </div>

                {/* URL de foto (opcional) */}
                <Input
                  label="URL de foto del incidente (opcional)"
                  type="url"
                  placeholder="https://..."
                  helper="Si tienes una foto, sube la imagen a cualquier servicio y pega el enlace aquí"
                  error={errors.fotoUrl?.message}
                  {...register('fotoUrl')}
                />

                {/* Aviso */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    En caso de accidente o emergencia, contacta primero a las
                    autoridades correspondientes. Este reporte es adicional y no
                    reemplaza los procedimientos legales.
                  </p>
                </div>

                {/* Botón */}
                <Button
                  type="submit"
                  loading={submitting}
                  size="lg"
                  className="w-full"
                >
                  Enviar Reporte
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentPage;