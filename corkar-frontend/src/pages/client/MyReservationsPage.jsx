// ============================================================
// MyReservationsPage.jsx — Historial de reservas del cliente
// ------------------------------------------------------------
// Muestra todas las reservas del cliente logueado con su
// estado actual y permite descargar cotización o contrato PDF.
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar, Car, FileText, Download, Plus, AlertTriangle } from 'lucide-react';
import {
  getMyReservations,
  downloadQuotation,
  downloadContract,
} from "../../services/reservations.service";
import { formatDate, formatEstadoReserva } from "../../utils/formatters";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

// Colores de badge según estado de la reserva
const estadoBadge = (estado) => {
  const map = {
    PENDIENTE: "bg-yellow-100 text-yellow-700",
    APROBADA: "bg-blue-100 text-blue-700",
    ACTIVA: "bg-green-100 text-green-700",
    COMPLETADA: "bg-gray-100 text-gray-600",
    RECHAZADA: "bg-red-100 text-red-700",
    CANCELADA: "bg-red-50 text-red-400",
  };
  return map[estado] || "bg-gray-100 text-gray-600";
};

// Descarga un blob como archivo
const descargarArchivo = (blob, nombre) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", nombre);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyReservations();
        setReservations(data);
      } catch {
        toast.error("Error cargando tus reservas");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDownloadQuotation = async (reservationId) => {
    setDownloading(`q-${reservationId}`);
    try {
      const blob = await downloadQuotation(reservationId);
      descargarArchivo(blob, `cotizacion_${reservationId}.pdf`);
      toast.success("Cotización descargada");
    } catch {
      toast.error("Error descargando cotización");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadContract = async (reservationId) => {
    setDownloading(`c-${reservationId}`);
    try {
      const blob = await downloadContract(reservationId);
      descargarArchivo(blob, `contrato_${reservationId}.pdf`);
      toast.success("Contrato descargado");
    } catch {
      toast.error("Error descargando contrato");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
            <p className="text-gray-500 mt-1">
              Historial de todas tus solicitudes de renta
            </p>
          </div>
          <Link
            to="/catalogo"
            className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#6B0000] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Nueva reserva
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Cargando tus reservas..." />
        ) : reservations.length === 0 ? (
          // Estado vacío
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Car className="text-gray-400" size={28} />
            </div>
            <h3 className="font-semibold text-gray-900">
              No tienes reservas aún
            </h3>
            <p className="text-sm text-gray-500">
              Explora nuestro catálogo y solicita tu primera reserva.
            </p>
            <Link
              to="/catalogo"
              className="mt-2 bg-[#8B0000] hover:bg-[#6B0000] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Ver vehículos disponibles
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Imagen del vehículo */}
                  <div className="flex-shrink-0">
                    {reservation.vehicle?.images?.[0] ? (
                      <img
                        src={reservation.vehicle.images[0].url}
                        alt=""
                        className="w-32 h-24 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-32 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Car className="text-gray-300" size={32} />
                      </div>
                    )}
                  </div>

                  {/* Info de la reserva */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {reservation.vehicle?.marca}{" "}
                          {reservation.vehicle?.modelo}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {reservation.vehicle?.anio}
                        </p>
                      </div>
                      {/* Badge de estado */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge(reservation.estado)}`}
                      >
                        {formatEstadoReserva(reservation.estado)}
                      </span>
                    </div>

                    {/* Fechas y costo */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar size={14} className="text-[#8B0000]" />
                        <span>{formatDate(reservation.fechaInicio)}</span>
                        <span className="text-gray-400">→</span>
                        <span>{formatDate(reservation.fechaFin)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="text-gray-400">·</span>
                        <span>{reservation.diasTotal} días</span>
                      </div>
                    </div>

                    {/* Costo y acciones */}
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <span className="text-xl font-bold text-[#8B0000]">
                          ${Number(reservation.costoTotal).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          total estimado
                        </span>
                      </div>

                      {/* Botones PDF */}
                      <div className="flex gap-2">
                        <Link
                          to="/incidente"
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-yellow-300 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors"
                        >
                          <AlertTriangle size={13} />
                          Reportar
                        </Link>
                        <button
                          onClick={() =>
                            handleDownloadQuotation(reservation.id)
                          }
                          disabled={downloading === `q-${reservation.id}`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:border-[#8B0000] hover:text-[#8B0000] transition-colors disabled:opacity-50"
                        >
                          <FileText size={13} />
                          {downloading === `q-${reservation.id}`
                            ? "Descargando..."
                            : "Cotización"}
                        </button>
                        {["APROBADA", "ACTIVA", "COMPLETADA"].includes(
                          reservation.estado,
                        ) && (
                          <button
                            onClick={() =>
                              handleDownloadContract(reservation.id)
                            }
                            disabled={downloading === `c-${reservation.id}`}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-colors disabled:opacity-50"
                          >
                            <Download size={13} />
                            {downloading === `c-${reservation.id}`
                              ? "Descargando..."
                              : "Contrato"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notas */}
                    {reservation.notas && (
                      <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-2">
                        Nota: {reservation.notas}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;
