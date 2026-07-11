import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, MapPin, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex flex-col">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden -mt-16">
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://res.cloudinary.com/tyycka6w/image/upload/v1783803260/hero-bg_sij7om.jpg')" }}
        />

        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#2d1010]/70" />

        {/* Línea decorativa roja */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B0000]" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl drop-shadow-lg">
            Renta el vehículo <span className="text-[#8B0000]">perfecto</span>{" "}
            para tu viaje
          </h1>
          <p className="text-gray-300 text-lg max-w-xl drop-shadow">
            Flota moderna, precios accesibles y servicio de confianza. Reserva
            en minutos y viaja con tranquilidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              to="/catalogo"
              className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#6B0000] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 text-sm"
            >
              Ver vehículos disponibles
              <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/registro"
                className="flex items-center gap-2 border border-white/50 hover:border-white hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 text-sm"
              >
                Crear cuenta gratis
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="bg-[#8B0000] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "50+", label: "Vehículos disponibles" },
            { value: "500+", label: "Clientes satisfechos" },
            { value: "5★", label: "Calificación promedio" },
            { value: "24/7", label: "Atención al cliente" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-red-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-500 mt-3">
              Reserva tu vehículo en 4 simples pasos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Elige tu vehículo",
                desc: "Explora nuestro catálogo y filtra por tipo, precio o transmisión.",
              },
              {
                step: "02",
                title: "Crea tu cuenta",
                desc: "Regístrate gratis en minutos con tu cédula y datos básicos.",
              },
              {
                step: "03",
                title: "Solicita la reserva",
                desc: "Selecciona las fechas y recibe una cotización al instante.",
              },
              {
                step: "04",
                title: "Recoge y viaja",
                desc: "Aprobada la reserva, recoge el vehículo y disfruta tu viaje.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#8B0000] text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              ¿Por qué elegir CorKar?
            </h2>
            <p className="text-gray-500 mt-3">
              Tu tranquilidad es nuestra prioridad
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="text-[#8B0000]" size={32} />,
                title: "Vehículos asegurados",
                desc: "Toda nuestra flota cuenta con seguro completo para tu tranquilidad durante el viaje.",
              },
              {
                icon: <Clock className="text-[#8B0000]" size={32} />,
                title: "Reserva en minutos",
                desc: "Proceso 100% digital. Solicita tu reserva desde cualquier dispositivo en cualquier momento.",
              },
              {
                icon: <MapPin className="text-[#8B0000]" size={32} />,
                title: "Cobertura nacional",
                desc: "Atendemos en Santo Domingo y principales ciudades de la República Dominicana.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-gray-100 hover:border-[#8B0000]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "María González",
                location: "Santo Domingo",
                review:
                  "Excelente servicio. El vehículo estaba en perfectas condiciones y el proceso de reserva fue muy sencillo.",
              },
              {
                name: "Carlos Martínez",
                location: "Santiago",
                review:
                  "Muy buena experiencia. Los precios son los mejores del mercado y la atención al cliente es de primera.",
              },
              {
                name: "Ana Rodríguez",
                location: "La Romana",
                review:
                  "Rápido, fácil y confiable. Ya es la tercera vez que rento con CorKar y siempre quedo satisfecha.",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{item.review}"
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-[#8B0000] flex items-center justify-center text-white font-bold text-sm">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="bg-[#111827] text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            ¿Listo para tu próximo viaje?
          </h2>
          <p className="text-gray-400">
            Explora nuestra flota y reserva el vehículo ideal para ti hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogo"
              className="flex items-center justify-center gap-2 bg-[#8B0000] hover:bg-[#6B0000] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200"
            >
              Ver catálogo
              <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/registro"
                className="flex items-center justify-center border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200"
              >
                Registrarse gratis
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
