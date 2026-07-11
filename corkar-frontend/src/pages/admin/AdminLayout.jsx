// ============================================================
// AdminLayout.jsx — Layout compartido del panel administrativo
// ------------------------------------------------------------
// Sidebar de navegación + área de contenido.
// Todas las páginas admin usan este layout.
// ============================================================

import { useState }            from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, Calendar,
  Users, AlertTriangle, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo        from '../../assets/images/logo.png';

const menuItems = [
  { to: '/admin',            icon: <LayoutDashboard size={18} />, label: 'Dashboard'   },
  { to: '/admin/vehiculos',  icon: <Car size={18} />,             label: 'Vehículos'   },
  { to: '/admin/reservas',   icon: <Calendar size={18} />,        label: 'Reservas'    },
  { to: '/admin/clientes',   icon: <Users size={18} />,           label: 'Clientes'    },
  { to: '/admin/incidentes', icon: <AlertTriangle size={18} />,   label: 'Incidentes'  },
];

const AdminLayout = ({ children }) => {
  const { logoutUser, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Overlay oscuro cuando sidebar está abierto en móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-56 bg-[#111827] flex flex-col z-40
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        {/* Logo / Título */}
        <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <img src={logo} alt="CorKar" className="h-10 w-auto object-contain brightness-0 invert" />
            <p className="text-xs text-gray-400 mt-2">Panel Administrativo</p>
          </div>
          {/* Botón cerrar en móvil */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menú */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#8B0000] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Usuario y logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <p className="text-xs text-gray-400 px-3 mb-2">
            {user?.nombre} {user?.apellido}
          </p>
          <button
            onClick={logoutUser}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all w-full"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Topbar móvil */}
        <div className="lg:hidden bg-[#111827] px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <Menu size={24} />
          </button>
          <img src={logo} alt="CorKar" className="h-8 w-auto object-contain brightness-0 invert" />
          <span className="text-xs text-gray-400 ml-1">Panel Admin</span>
        </div>

        {/* Contenido */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;