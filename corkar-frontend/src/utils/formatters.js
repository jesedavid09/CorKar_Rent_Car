// ============================================================
// utils/formatters.js — Funciones de formato reutilizables
// ------------------------------------------------------------
// Centraliza el formato de fechas, precios y textos para que
// toda la app muestre los datos de forma consistente.
// ============================================================

// Formatea un número como precio en pesos dominicanos
// Ejemplo: 1500 → "RD$ 1,500.00"
export const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
        currencyDisplay: 'symbol',
    }).format(amount).replace('DOP', 'RD$');
};

// Formatea una fecha ISO a formato legible en español dominicano
// Ejemplo: "2024-06-15" → "15 de junio de 2024"
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Formatea una fecha corta
// Ejemplo: "2024-06-15" → "15/06/2024"
export const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-DO');
};

// Traduce los estados de reserva al español para mostrar en la UI
export const formatEstadoReserva = (estado) => {
  const estados = {
    PENDIENTE:  'Pendiente',
    APROBADA:   'Aprobada',
    RECHAZADA:  'Rechazada',
    ACTIVA:     'Activa',
    COMPLETADA: 'Completada',
    CANCELADA:  'Cancelada',
  };
  return estados[estado] || estado;
};

// Traduce los estados de incidente
export const formatEstadoIncidente = (estado) => {
  const estados = {
    ABIERTO:    'Abierto',
    EN_PROCESO: 'En proceso',
    RESUELTO:   'Resuelto',
  };
  return estados[estado] || estado;
};

// Traduce los estados del vehículo
export const formatEstadoVehiculo = (estado) => {
  const estados = {
    DISPONIBLE:   'Disponible',
    RENTADO:      'Rentado',
    MANTENIMIENTO:'En mantenimiento',
    INACTIVO:     'Inactivo',
  };
  return estados[estado] || estado;
};