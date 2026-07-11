// ============================================================
// CatalogPage.jsx — Catálogo de vehículos con filtros
// ------------------------------------------------------------
// Muestra todos los vehículos disponibles con filtros por
// categoría, transmisión y precio máximo.
// ============================================================

import { useState, useEffect }        from 'react';
import { Link }                       from 'react-router-dom';
import { Search, Filter, X }          from 'lucide-react';
import { getVehicles }                from '../../services/vehicles.service';
import { formatPrice }                from '../../utils/formatters';
import LoadingSpinner                 from '../../components/ui/LoadingSpinner';
import Badge                          from '../../components/ui/Badge';

// Componente de tarjeta de vehículo
const VehicleCard = ({ vehicle }) => {
  const imagen = vehicle.images?.[0]?.url;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#8B0000]/30 transition-all duration-200 overflow-hidden group">

      {/* Imagen */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {imagen ? (
          <img
            src={imagen}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-100 to-gray-200">
            <svg viewBox="0 0 100 60" className="w-32 opacity-20" fill="#8B0000">
              <path d="M10,40 L15,20 Q20,10 35,10 L65,10 Q80,10 85,20 L90,40 L95,42 L95,50 L5,50 L5,42 Z"/>
              <circle cx="25" cy="50" r="8" fill="#555"/>
              <circle cx="75" cy="50" r="8" fill="#555"/>
            </svg>
            <span className="text-xs text-gray-400">{vehicle.marca} {vehicle.modelo}</span>
          </div>
        )}

        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-[#8B0000] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#8B0000]/20">
            {vehicle.category?.nombre}
          </span>
        </div>

        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            vehicle.estado === 'DISPONIBLE'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {vehicle.estado === 'DISPONIBLE' ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg">
          {vehicle.marca} {vehicle.modelo}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{vehicle.anio} • {vehicle.transmision === 'AUTOMATICA' ? 'Automático' : 'Manual'}</p>

        {/* Specs */}
        <div className="flex gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            👥 {vehicle.capacidad} personas
          </span>
          <span className="flex items-center gap-1">
            ⛽ {vehicle.combustible === 'GASOLINA' ? 'Gasolina' : vehicle.combustible}
          </span>
        </div>

        {/* Precio y botón */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[#8B0000]">
              ${vehicle.precioDia}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ día</span>
          </div>
          <Link
            to={`/vehiculo/${vehicle.id}`}
            className="bg-[#8B0000] hover:bg-[#6B0000] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Página principal del catálogo ─────────────────────────────
const CatalogPage = () => {
  const [vehicles,   setVehicles]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters,    setFilters]    = useState({
    categoria:    '',
    transmision:  '',
    precioMax:    '',
    busqueda:     '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Carga los vehículos al montar el componente
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async (activeFilters = {}) => {
    setLoading(true);
    try {
      const data = await getVehicles(activeFilters);
      setVehicles(data);

      // Extrae categorías únicas de los vehículos cargados
      const cats = [...new Map(
        data.map(v => [v.category.id, v.category])
      ).values()];
      setCategories(cats);
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Aplica filtros
  const handleFilter = () => {
    const activeFilters = {};
    if (filters.categoria)   activeFilters.categoria   = filters.categoria;
    if (filters.transmision) activeFilters.transmision = filters.transmision;
    if (filters.precioMax)   activeFilters.precioMax   = filters.precioMax;
    loadVehicles(activeFilters);
  };

  // Limpia todos los filtros
  const clearFilters = () => {
    setFilters({ categoria: '', transmision: '', precioMax: '', busqueda: '' });
    loadVehicles();
  };

  // Filtro de búsqueda por texto (local, sin llamada al backend)
  const filteredVehicles = vehicles.filter(v => {
    if (!filters.busqueda) return true;
    const q = filters.busqueda.toLowerCase();
    return (
      v.marca.toLowerCase().includes(q)  ||
      v.modelo.toLowerCase().includes(q) ||
      v.category.nombre.toLowerCase().includes(q)
    );
  });

  const hasActiveFilters = filters.categoria || filters.transmision || filters.precioMax;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Encabezado ───────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Vehículos</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Cargando...' : `${filteredVehicles.length} vehículos disponibles`}
          </p>

          {/* Barra de búsqueda */}
          <div className="flex gap-3 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por marca o modelo..."
                value={filters.busqueda}
                onChange={e => setFilters({ ...filters, busqueda: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-[#8B0000] text-white border-[#8B0000]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#8B0000] hover:text-[#8B0000]'
              }`}
            >
              <Filter size={16} />
              Filtros
              {hasActiveFilters && (
                <span className="bg-white text-[#8B0000] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-end">

              {/* Categoría */}
              <div className="flex flex-col gap-1 min-w-[180px]">
                <label className="text-xs font-medium text-gray-600">Categoría</label>
                <select
                  value={filters.categoria}
                  onChange={e => setFilters({ ...filters, categoria: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Transmisión */}
              <div className="flex flex-col gap-1 min-w-[160px]">
                <label className="text-xs font-medium text-gray-600">Transmisión</label>
                <select
                  value={filters.transmision}
                  onChange={e => setFilters({ ...filters, transmision: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                >
                  <option value="">Cualquiera</option>
                  <option value="AUTOMATICA">Automática</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>

              {/* Precio máximo */}
              <div className="flex flex-col gap-1 min-w-[160px]">
                <label className="text-xs font-medium text-gray-600">
                  Precio máximo: {filters.precioMax ? `$${filters.precioMax}/día` : 'Sin límite'}
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={filters.precioMax || 100}
                  onChange={e => setFilters({ ...filters, precioMax: e.target.value === '100' ? '' : e.target.value })}
                  className="accent-[#8B0000]"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-2">
                <button
                  onClick={handleFilter}
                  className="bg-[#8B0000] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6B0000] transition-colors"
                >
                  Aplicar
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:border-red-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} /> Limpiar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Grilla de vehículos ───────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <LoadingSpinner text="Cargando vehículos..." />
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No se encontraron vehículos</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-[#8B0000] hover:underline text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;