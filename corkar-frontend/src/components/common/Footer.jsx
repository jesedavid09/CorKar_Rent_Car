import { Link } from "react-router-dom";
import { Car, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna 1 — Marca */}
        <div>
          <div className="mb-4">
            <img
              src="/src/assets/images/logo2.png"
              alt="CorKar Rent Car"
              className="h-14 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-sm leading-relaxed">
            Tu mejor opción para alquiler de vehículos en República Dominicana.
            Flota moderna, precios accesibles y servicio de confianza.
          </p>
        </div>

        {/* Columna 2 — Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/catalogo"
                className="hover:text-white transition-colors"
              >
                Catálogo de vehículos
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link
                to="/registro"
                className="hover:text-white transition-colors"
              >
                Registrarse
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3 — Contacto */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-[#8B0000]" />
              <span>+1 (829) 625-5746</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-[#8B0000]" />
              <span>corkarrentcar@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={35} className="text-[#8B0000]" />
              <span>
                Av. Marginal de Las Américas, k.m. 9, Olympus Motor, Tropical
                del Este, Santo Domingo Este, Santo Domingo, República
                Dominicana
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} CorKar Rent Car. Todos los derechos
        reservados.
      </div>
    </footer>
  );
};

export default Footer;
