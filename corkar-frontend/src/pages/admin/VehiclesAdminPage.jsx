// ============================================================
// VehiclesAdminPage.jsx — Gestión de vehículos
// ------------------------------------------------------------
// El admin puede ver, crear, editar y cambiar el estado
// de los vehículos de la flota.
// ============================================================

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Search, Edit, Trash2, X, Save } from "lucide-react";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehicles.service";
import {
  uploadVehicleImage,
  deleteVehicleImage,
  setImageAsPrimary,
} from "../../services/vehicles.service";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AdminLayout from "./AdminLayout";
import api from "../../services/api";

const ESTADOS = ["DISPONIBLE", "RENTADO", "MANTENIMIENTO", "INACTIVO"];
const TRANSMISIONES = ["AUTOMATICA", "MANUAL"];
const COMBUSTIBLES = ["GASOLINA", "DIESEL", "ELECTRICO", "HIBRIDO"];

const estadoBadge = (estado) => {
  const map = {
    DISPONIBLE: "bg-green-100 text-green-700",
    RENTADO: "bg-blue-100 text-blue-700",
    MANTENIMIENTO: "bg-yellow-100 text-yellow-700",
    INACTIVO: "bg-gray-100 text-gray-500",
  };
  return map[estado] || "bg-gray-100 text-gray-600";
};

const estadoLabel = {
  DISPONIBLE: "Disponible",
  RENTADO: "Rentado",
  MANTENIMIENTO: "Mantenimiento",
  INACTIVO: "Inactivo",
};

// Formulario vacío por defecto
const emptyForm = {
  categoryId: "",
  marca: "",
  modelo: "",
  anio: "",
  placa: "",
  capacidad: 5,
  transmision: "AUTOMATICA",
  combustible: "GASOLINA",
  precioDia: "",
  estado: "DISPONIBLE",
  descripcion: "",
};

const VehiclesAdminPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [v, cats] = await Promise.all([
        getVehicles(),
        api.get("/vehicle-categories"),
      ]);
      setVehicles(v);
      setCategories(cats.data);
    } catch {
      // Si no existe el endpoint de categorías, las extraemos de los vehículos
      try {
        const v = await getVehicles();
        setVehicles(v);
        const cats = [
          ...new Map(v.map((veh) => [veh.category.id, veh.category])).values(),
        ];
        setCategories(cats);
      } catch {
        toast.error("Error cargando datos");
      }
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      categoryId: vehicle.categoryId,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      anio: vehicle.anio,
      placa: vehicle.placa,
      capacidad: vehicle.capacidad,
      transmision: vehicle.transmision,
      combustible: vehicle.combustible,
      precioDia: vehicle.precioDia,
      estado: vehicle.estado,
      descripcion: vehicle.descripcion || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateVehicle(editingId, {
          ...form,
          anio: parseInt(form.anio),
          capacidad: parseInt(form.capacidad),
          precioDia: parseFloat(form.precioDia),
        });
        toast.success("Vehículo actualizado");
      } else {
        await createVehicle({
          ...form,
          anio: parseInt(form.anio),
          capacidad: parseInt(form.capacidad),
          precioDia: parseFloat(form.precioDia),
        });
        toast.success("Vehículo creado exitosamente");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      const msg = error.response?.data?.error || "Error guardando vehículo";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este vehículo?")) return;
    try {
      await deleteVehicle(id);
      toast.success("Vehículo eliminado");
      loadData();
    } catch {
      toast.error("Error eliminando vehículo");
    }
  };

  const filtered = vehicles.filter(
    (v) =>
      !busqueda ||
      `${v.marca} ${v.modelo}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.placa.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleImageUpload = async (e, vehicleId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      await uploadVehicleImage(vehicleId, formData);
      toast.success("Imagen subida exitosamente");
      loadData();
    } catch {
      toast.error("Error subiendo imagen");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      await deleteVehicleImage(imageId);
      toast.success("Imagen eliminada");
      loadData();
    } catch {
      toast.error("Error eliminando imagen");
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await setImageAsPrimary(imageId);
      toast.success("Imagen principal actualizada");
      loadData();
    } catch {
      toast.error("Error actualizando imagen");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Vehículos
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {vehicles.length} vehículos en flota
            </p>
          </div>
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus size={16} />
            Agregar vehículo
          </Button>
        </div>

        {/* Búsqueda */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar por marca, modelo o placa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          />
        </div>

        {/* Tabla */}
        {loading ? (
          <LoadingSpinner text="Cargando vehículos..." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left border-b border-gray-200">
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Vehículo
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Categoría
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Placa
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Precio/día
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {v.marca} {v.modelo}
                        </p>
                        <p className="text-xs text-gray-400">
                          {v.anio} •{" "}
                          {v.transmision === "AUTOMATICA"
                            ? "Automático"
                            : "Manual"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">
                        {v.category?.nombre}
                      </td>
                      <td className="px-5 py-4 text-gray-600 font-mono text-xs">
                        {v.placa}
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">
                        ${Number(v.precioDia).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estadoBadge(v.estado)}`}
                        >
                          {estadoLabel[v.estado]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(v)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:border-[#8B0000] hover:text-[#8B0000] transition-colors"
                          >
                            <Edit size={12} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(v.id)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No se encontraron vehículos
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal crear/editar vehículo ───────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 text-lg">
                {editingId ? "Editar Vehículo" : "Agregar Vehículo"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              className="px-6 py-6 flex flex-col gap-4"
            >
              {/* Categoría */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                >
                  <option value="">Selecciona una categoría...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marca y Modelo */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Marca"
                  required
                  placeholder="Toyota"
                  value={form.marca}
                  onChange={(e) => setForm({ ...form, marca: e.target.value })}
                />
                <Input
                  label="Modelo"
                  required
                  placeholder="Corolla"
                  value={form.modelo}
                  onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                />
              </div>

              {/* Año, Placa y Capacidad */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Año"
                  type="number"
                  required
                  placeholder="2023"
                  min="2000"
                  max="2030"
                  value={form.anio}
                  onChange={(e) => setForm({ ...form, anio: e.target.value })}
                />
                <Input
                  label="Placa"
                  required
                  placeholder="A123456"
                  value={form.placa}
                  onChange={(e) => setForm({ ...form, placa: e.target.value })}
                />
                <Input
                  label="Capacidad"
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={form.capacidad}
                  onChange={(e) =>
                    setForm({ ...form, capacidad: e.target.value })
                  }
                />
              </div>

              {/* Transmisión, Combustible y Precio */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Transmisión
                  </label>
                  <select
                    value={form.transmision}
                    onChange={(e) =>
                      setForm({ ...form, transmision: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  >
                    <option value="AUTOMATICA">Automática</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Combustible
                  </label>
                  <select
                    value={form.combustible}
                    onChange={(e) =>
                      setForm({ ...form, combustible: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  >
                    {COMBUSTIBLES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0) + c.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Precio/día ($)"
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  placeholder="50.00"
                  value={form.precioDia}
                  onChange={(e) =>
                    setForm({ ...form, precioDia: e.target.value })
                  }
                />
              </div>

              {/* Estado (solo al editar) */}
              {editingId && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    value={form.estado}
                    onChange={(e) =>
                      setForm({ ...form, estado: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  >
                    {ESTADOS.map((s) => (
                      <option key={s} value={s}>
                        {estadoLabel[s]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Descripción */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Descripción{" "}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe las características del vehículo..."
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] resize-none"
                />
              </div>

              {/* Gestión de imágenes — solo al editar */}
              {editingId && (
                <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                  <label className="text-sm font-medium text-gray-700">
                    Imágenes del vehículo
                  </label>

                  {/* Imágenes actuales */}
                  {vehicles.find((v) => v.id === editingId)?.images?.length >
                    0 && (
                    <div className="flex gap-2 flex-wrap">
                      {vehicles
                        .find((v) => v.id === editingId)
                        ?.images?.map((img) => (
                          <div key={img.id} className="relative group">
                            <img
                              src={img.url}
                              alt=""
                              className={`w-20 h-16 object-cover rounded-lg border-2 ${
                                img.isPrimary
                                  ? "border-[#8B0000]"
                                  : "border-gray-200"
                              }`}
                            />
                            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              {!img.isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimary(img.id)}
                                  className="text-xs bg-white text-gray-800 px-1.5 py-0.5 rounded"
                                >
                                  ★
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(img.id)}
                                className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded"
                              >
                                ✕
                              </button>
                            </div>
                            {img.isPrimary && (
                              <span className="absolute -top-1 -right-1 bg-[#8B0000] text-white text-xs px-1 rounded">
                                ★
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Subir nueva imagen */}
                  <label
                    className={`flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-[#8B0000] transition-colors ${uploadingImg ? "opacity-50" : ""}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImg}
                      onChange={(e) => handleImageUpload(e, editingId)}
                    />
                    <span className="text-sm text-gray-500">
                      {uploadingImg
                        ? "⏳ Subiendo imagen..."
                        : "📷 Subir imagen"}
                    </span>
                  </label>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:border-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  loading={submitting}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {editingId ? "Guardar cambios" : "Crear vehículo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default VehiclesAdminPage;
