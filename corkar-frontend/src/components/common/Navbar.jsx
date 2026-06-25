import { useState, useEffect } from 'react';
import { Link, NavLink }       from 'react-router-dom';
import { Menu, X }             from 'lucide-react';
import { useAuth }             from '../../context/AuthContext';
import logo                    from '../../assets/images/logo2.png';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logoutUser } = useAuth();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,   setScrolled]    = useState(false);

  // Detecta el scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Estilos dinámicos según scroll y página
  const navBg = scrolled
    ? 'bg-white shadow-md border-b border-gray-200'
    : 'bg-transparent';

  const linkClass = ({ isActive }) => `
    text-sm font-medium px-3 py-2 rounded-lg border transition-all duration-200
    ${scrolled
      ? isActive
        ? 'text-[#8B0000] border-[#8B0000] bg-red-50'
        : 'text-gray-700 border-transparent hover:text-[#8B0000] hover:border-[#8B0000] hover:bg-red-50'
      : isActive
        ? 'text-white border-white bg-white/10'
        : 'text-white border-transparent hover:border-white hover:bg-white/10'
    }
  `;

  const textColor    = scrolled ? 'text-gray-500' : 'text-white/80';
  const nameColor    = scrolled ? 'text-gray-700' : 'text-white';
  const burgerColor  = scrolled ? 'text-gray-700' : 'text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="CorKar Rent Car"
              className={`h-15 w-auto object-contain transition-all duration-300 ${
                scrolled ? '' : 'brightness-0 invert'
              }`}
            />
          </Link>

          {/* Links escritorio */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/"         className={linkClass}>Inicio</NavLink>
            <NavLink to="/catalogo" className={linkClass}>Vehículos</NavLink>

            {isAuthenticated ? (
              <>
                {isAdmin
                  ? <NavLink to="/admin"        className={linkClass}>Panel Admin</NavLink>
                  : <NavLink to="/mis-reservas" className={linkClass}>Mis Reservas</NavLink>
                }
                <div className={`flex items-center gap-3 ml-2 pl-3 border-l ${scrolled ? 'border-gray-200' : 'border-white/20'}`}>
                  <span className={`text-sm ${textColor}`}>
                    Hola, <span className={`font-medium ${nameColor}`}>{user?.nombre}</span>
                  </span>
                  <button
                    onClick={logoutUser}
                    className={`text-sm font-medium px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                      scrolled
                        ? 'border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white'
                        : 'border-white text-white hover:bg-white hover:text-[#8B0000]'
                    }`}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <div className={`flex items-center gap-2 ml-2 pl-3 border-l ${scrolled ? 'border-gray-200' : 'border-white/20'}`}>
                <NavLink to="/login" className={linkClass}>Iniciar sesión</NavLink>
                <Link
                  to="/registro"
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                    scrolled
                      ? 'bg-[#8B0000] text-white hover:bg-[#6B0000]'
                      : 'bg-white text-[#8B0000] hover:bg-gray-100'
                  }`}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            className={`md:hidden transition-colors ${burgerColor}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className={`md:hidden pb-4 flex flex-col gap-2 border-t pt-4 ${
            scrolled ? 'bg-white border-gray-100' : 'bg-[#111827]/95 border-white/10'
          }`}>
            {['/', '/catalogo'].map((path, i) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium px-2 py-2 rounded-lg transition-all ${
                  scrolled
                    ? 'text-gray-700 hover:text-[#8B0000] hover:bg-red-50'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {i === 0 ? 'Inicio' : 'Vehículos'}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link to="/mis-reservas" onClick={() => setMenuOpen(false)}
                    className={`text-sm font-medium px-2 py-2 rounded-lg transition-all ${scrolled ? 'text-gray-700 hover:text-[#8B0000] hover:bg-red-50' : 'text-white hover:bg-white/10'}`}>
                    Mis Reservas
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className={`text-sm font-medium px-2 py-2 rounded-lg transition-all ${scrolled ? 'text-gray-700 hover:text-[#8B0000] hover:bg-red-50' : 'text-white hover:bg-white/10'}`}>
                    Panel Admin
                  </Link>
                )}
                <div className="border-t border-gray-100 pt-2 mt-1">
                  <p className="text-xs text-gray-400 px-2 mb-2">Hola, {user?.nombre}</p>
                  <button onClick={logoutUser}
                    className="w-full text-left text-sm font-medium text-[#8B0000] px-2 py-2 rounded-lg hover:bg-red-50 transition-all">
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium px-2 py-2 rounded-lg transition-all ${scrolled ? 'text-gray-700 hover:text-[#8B0000] hover:bg-red-50' : 'text-white hover:bg-white/10'}`}>
                  Iniciar sesión
                </Link>
                <Link to="/registro" onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium bg-[#8B0000] text-white px-4 py-2 rounded-lg hover:bg-[#6B0000] transition-all text-center">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;