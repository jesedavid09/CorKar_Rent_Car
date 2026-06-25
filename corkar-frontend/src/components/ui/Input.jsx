// Input reutilizable con soporte para label, error y helper text
const Input = ({
  label,
  error,
  helper,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent
          transition-colors duration-200
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
          ${className}
        `}
        {...props}
      />
      {error  && <p className="text-xs text-red-600">{error}</p>}
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </div>
  );
};

export default Input;