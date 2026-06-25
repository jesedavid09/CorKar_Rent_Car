// Spinner de carga centrado en pantalla
const LoadingSpinner = ({ text = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <svg className="animate-spin h-10 w-10 text-[#8B0000]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
};

export default LoadingSpinner;