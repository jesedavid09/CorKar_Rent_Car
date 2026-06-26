// ============================================================
// RegisterPage.jsx — Página de registro de clientes
// ------------------------------------------------------------
// Formulario de registro con validación completa.
// Al registrarse exitosamente, el usuario queda logueado
// automáticamente y es redirigido al catálogo.
// ============================================================

import { useState }           from 'react';
import { Link }               from 'react-router-dom';
import { useForm }            from 'react-hook-form';
import { toast }              from 'react-hot-toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth }            from '../../context/AuthContext';
import { register as registerUser } from '../../services/auth.service';
import Button                 from '../../components/ui/Button';
import Input                  from '../../components/ui/Input';

const RegisterPage = () => {
  const { loginUser }                   = useAuth();
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  // Observamos el campo password para validar confirmación
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Eliminamos confirmPassword antes de enviar al backend
      const { confirmPassword, ...userData } = data;
      const response = await registerUser(userData);
      toast.success('¡Cuenta creada exitosamente!');
      loginUser(response.user, response.token);
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al crear la cuenta';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 pt-24">
      <div className="w-full max-w-lg">

        {/* Tarjeta del formulario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

          {/* Encabezado rojo */}
          <div className="bg-[#8B0000] px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
              <UserPlus className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
            <p className="text-red-200 text-sm mt-1">Únete a CorKar Rent Car</p>
          </div>

          {/* Formulario */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  type="text"
                  placeholder="Juan"
                  error={errors.nombre?.message}
                  {...register('nombre', {
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                  })}
                />
                <Input
                  label="Apellido"
                  type="text"
                  placeholder="Pérez"
                  error={errors.apellido?.message}
                  {...register('apellido', {
                    required: 'El apellido es obligatorio',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                  })}
                />
              </div>

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

              {/* Cédula y Teléfono */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cédula"
                  type="text"
                  placeholder="00100000001"
                  helper="Sin guiones"
                  error={errors.cedula?.message}
                  {...register('cedula', {
                    required: 'La cédula es obligatoria',
                    pattern: {
                      value: /^\d{11}$/,
                      message: '11 dígitos sin guiones'
                    }
                  })}
                />
                <Input
                  label="Teléfono"
                  type="text"
                  placeholder="8091234567"
                  error={errors.telefono?.message}
                  {...register('telefono', {
                    required: 'El teléfono es obligatorio',
                    pattern: {
                      value: /^\d{10}$/,
                      message: '10 dígitos sin guiones'
                    }
                  })}
                />
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    className={`
                      w-full px-3 py-2 pr-10 border rounded-lg text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent
                      ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                    {...register('password', {
                      required: 'La contraseña es obligatoria',
                      minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                    })}
                  />
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

              {/* Confirmar contraseña */}
              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: value =>
                    value === password || 'Las contraseñas no coinciden'
                })}
              />

              {/* Botón submit */}
              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="w-full mt-2"
              >
                Crear Cuenta
              </Button>
            </form>

            {/* Separador */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">¿Ya tienes cuenta?</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Link a login */}
            <Link
              to="/login"
              className="flex items-center justify-center w-full py-2.5 px-4 border-2 border-[#8B0000] text-[#8B0000] rounded-lg text-sm font-medium hover:bg-[#8B0000] hover:text-white transition-all duration-200"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>

        {/* Link volver */}
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="hover:text-[#8B0000] transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;