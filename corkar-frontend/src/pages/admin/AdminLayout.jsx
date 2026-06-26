// ============================================================
// AdminLayout.jsx — Layout compartido del panel administrativo
// ------------------------------------------------------------
// Sidebar de navegación + área de contenido.
// Todas las páginas admin usan este layout.
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, Calendar,
  Users, AlertTriangle, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo        from '../../assets/images/logo2.png';

const menuItems = [
  { to: '/admin',            icon: <LayoutDashboard size={18} />, label: 'Dashboard'   },
  { to: '/admin/vehiculos',  icon: <Car size={18} />,             label: 'Vehículos'   },
  { to: '/admin/reservas',   icon: <Calendar size={18} />,        label: 'Reservas'    },
  { to: '/admin/clientes',   icon: <Users size={18} />,           label: 'Clientes'    },
  { to: '/admin/incidentes', icon: <AlertTriangle size={18} />,   label: 'Incidentes'  },
];

const AdminLayout = ({ children }) => {
  const { logoutUser, user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50 pt-16">

      {/* Sidebar */}
      <aside className="w-56 bg-[#111827] fixed top-16 left-0 bottom-0 flex flex-col z-40">

        {/* Logo / Título */}
        <div className="px-4 py-5 border-b border-white/10">
          <img src={logo} alt="CorKar" className="h-10 w-auto object-contain brightness-0 invert" />
          <p className="text-xs text-gray-400 mt-2">Panel Administrativo</p>
        </div>

        {/* Menú */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
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
      <main className="flex-1 ml-56 p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;