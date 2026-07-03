// ============================================================
// IncidentsAdminPage.jsx — Gestión de incidentes
// ============================================================

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AlertTriangle, Search } from "lucide-react";
import {
  getAllIncidents,
  updateIncidentEstado,
} from "../../services/incidents.service";
import { formatDate, formatEstadoIncidente } from "../../utils/formatters";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AdminLayout from "./AdminLayout";

const estadoBadge = (estado) => {
  const map = {
    ABIERTO: "bg-red-100 text-red-700",
    EN_PROCESO: "bg-yellow-100 text-yellow-700",
    RESUELTO: "bg-green-100 text-green-700",
  };
  return map[estado] || "bg-gray-100 text-gray-600";
};

const IncidentsAdminPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await getAllIncidents();
      setIncidents(data);
    } catch {
      toast.error("Error cargando incidentes");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (id, nuevoEstado) => {
    setUpdating(id);
    try {
      await updateIncidentEstado(id, nuevoEstado);
      toast.success("Estado actualizado");
      loadIncidents();
    } catch {
      toast.error("Error actualizando estado");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = incidents.filter((i) => !filtro || i.estado === filtro);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Incidentes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {incidents.length} incidentes registrados
          </p>
        </div>

        {/* Filtro */}
        <div className="flex gap-3">
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          >
            <option value="">Todos los estados</option>
            <option value="ABIERTO">Abierto</option>
            <option value="EN_PROCESO">En proceso</option>
            <option value="RESUELTO">Resuelto</option>
          </select>
        </div>

        {/* Lista de incidentes */}
        {loading ? (
          <LoadingSpinner text="Cargando incidentes..." />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <AlertTriangle className="text-gray-300 mx-auto mb-3" size={32} />
            <p className="text-gray-400 text-sm">
              No hay incidentes registrados
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((incident) => (
              <div
                key={incident.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="text-[#8B0000]" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {incident.tipo}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {incident.reservation?.vehicle?.marca}{" "}
                        {incident.reservation?.vehicle?.modelo} •{" "}
                        {incident.reservation?.user?.nombre}{" "}
                        {incident.reservation?.user?.apellido}
                      </p>
                      <p className="text-xs text-gray-400">
                        Reportado el {formatDate(incident.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estadoBadge(incident.estado)}`}
                  >
                    {formatEstadoIncidente(incident.estado)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
                  {incident.descripcion}
                </p>

                {incident.fotoUrl && (
                  <a
                    href={incident.fotoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#8B0000] hover:underline"
                  >
                    Ver foto del incidente →
                  </a>
                )}

                {/* Botones de cambio de estado */}
                {incident.estado !== "RESUELTO" && (
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {incident.estado === "ABIERTO" && (
                      <button
                        onClick={() =>
                          handleUpdateEstado(incident.id, "EN_PROCESO")
                        }
                        disabled={updating === incident.id}
                        className="text-xs px-3 py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        Marcar en proceso
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleUpdateEstado(incident.id, "RESUELTO")
                      }
                      disabled={updating === incident.id}
                      className="text-xs px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      Marcar como resuelto
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default IncidentsAdminPage;
