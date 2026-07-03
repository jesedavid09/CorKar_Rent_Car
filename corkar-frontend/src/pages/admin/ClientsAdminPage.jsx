// ============================================================
// ClientsAdminPage.jsx — Gestión de clientes
// ============================================================

import { useState, useEffect }  from 'react';
import { toast }                from 'react-hot-toast';
import { Search, Users, Mail, Phone, CreditCard } from 'lucide-react';
import axios                    from 'axios';
import api                      from '../../services/api';
import { formatDate }           from '../../utils/formatters';
import LoadingSpinner            from '../../components/ui/LoadingSpinner';
import AdminLayout               from './AdminLayout';

const ClientsAdminPage = () => {
  const [clients,  setClients]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/users');
        setClients(response.data);
      } catch {
        toast.error('Error cargando clientes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = clients.filter(c =>
    !busqueda ||
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.cedula?.includes(busqueda)
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">

        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} clientes registrados</p>
        </div>

        {/* Búsqueda */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o cédula..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          />
        </div>

        {/* Tabla */}
        {loading ? (
          <LoadingSpinner text="Cargando clientes..." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left border-b border-gray-200">
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Contacto</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cédula</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rol</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Registrado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#8B0000] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {client.nombre[0]}{client.apellido[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {client.nombre} {client.apellido}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                            <Mail size={12} className="text-gray-400" />
                            {client.email}
                          </span>
                          {client.telefono && (
                            <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                              <Phone size={12} className="text-gray-400" />
                              {client.telefono}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                          <CreditCard size={12} className="text-gray-400" />
                          {client.cedula || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          client.rol === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {client.rol}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {formatDate(client.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No se encontraron clientes
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ClientsAdminPage;