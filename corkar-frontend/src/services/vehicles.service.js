// ============================================================
// services/vehicles.service.js — Llamadas a la API de vehículos
// ============================================================

import api from './api';

// Obtener catálogo con filtros opcionales
// filters = { categoria, transmision, precioMax, estado }
export const getVehicles = async (filters = {}) => {
    const response = await api.get('/vehicles', { params: filters });
    return response.data;
};

// Obtener detalle de un vehículo por ID
export const getVehicleById = async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
};

// Crear vehículo (solo ADMIN)
export const createVehicle = async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
};

// Editar vehículo (solo ADMIN)
export const updateVehicle = async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
};

// Eliminar vehículo (solo ADMIN)
export const deleteVehicle = async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
};

// Subir imagen de vehículo
export const uploadVehicleImage = async (vehicleId, formData) => {
  const response = await api.post(`/images/vehicles/${vehicleId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Eliminar imagen
export const deleteVehicleImage = async (imageId) => {
  const response = await api.delete(`/images/${imageId}`);
  return response.data;
};

// Marcar imagen como principal
export const setImageAsPrimary = async (imageId) => {
  const response = await api.patch(`/images/${imageId}/primary`);
  return response.data;
};