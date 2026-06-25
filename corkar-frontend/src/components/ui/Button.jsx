// Botón reutilizable con variantes de estilo y estados
const Button = ({
  children,
  variant  = 'primary', // primary | outline | danger | ghost
  size     = 'md',      // sm | md | lg
  loading  = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#8B0000] text-white hover:bg-[#6B0000] focus:ring-[#8B0000]',
    outline: 'border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white focus:ring-[#8B0000]',
    danger:  'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:   'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Cargando...
        </span>
      ) : children}
    </button>
  );
};

export default Button;