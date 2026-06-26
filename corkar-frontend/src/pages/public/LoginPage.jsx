// ============================================================
// LoginPage.jsx — Página de inicio de sesión
// ------------------------------------------------------------
// Formulario de login con validación. Al autenticarse
// correctamente, AuthContext redirige según el rol del usuario:
// - ADMIN  → /admin
// - CLIENTE → /catalogo
// ============================================================

import { useState }       from 'react';
import { Link }           from 'react-router-dom';
import { useForm }        from 'react-hook-form';
import { toast }          from 'react-hot-toast';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth }        from '../../context/AuthContext';
import { login }          from '../../services/auth.service';
import Button             from '../../components/ui/Button';
import Input              from '../../components/ui/Input';

const LoginPage = () => {
  const { loginUser }                 = useAuth();
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // react-hook-form maneja el estado y validación del formulario
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data);
      toast.success(`¡Bienvenido, ${response.user.nombre}!`);
      loginUser(response.user, response.token);
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al iniciar sesión';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 pt-24">
      <div className="w-full max-w-md">

        {/* Tarjeta del formulario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

          {/* Encabezado rojo */}
          <div className="bg-[#8B0000] px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
              <LogIn className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
            <p className="text-red-200 text-sm mt-1">Accede a tu cuenta CorKar</p>
          </div>

          {/* Formulario */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {/* Email */}
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un correo válido'
                  }
                })}
              />

              {/* Contraseña */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    className={`
                      w-full px-3 py-2 pr-10 border rounded-lg text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent
                      transition-colors duration-200
                      ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                    {...register('password', {
                      required: 'La contraseña es obligatoria',
                      minLength: {
                        value: 6,
                        message: 'Mínimo 6 caracteres'
                      }
                    })}
                  />
                  {/* Botón mostrar/ocultar contraseña */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Botón submit */}
              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="w-full mt-2"
              >
                Iniciar Sesión
              </Button>
            </form>

            {/* Separador */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">¿No tienes cuenta?</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Link a registro */}
            <Link
              to="/registro"
              className="flex items-center justify-center w-full py-2.5 px-4 border-2 border-[#8B0000] text-[#8B0000] rounded-lg text-sm font-medium hover:bg-[#8B0000] hover:text-white transition-all duration-200"
            >
              Crear cuenta nueva
            </Link>
          </div>
        </div>

        {/* Link volver al inicio */}
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="hover:text-[#8B0000] transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;