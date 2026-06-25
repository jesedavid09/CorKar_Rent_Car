// ============================================================
// services/reservations.service.js — Llamadas a reservaciones
// ============================================================

import api from "./api";

// Cliente: crear reserva
export const createReservation = async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
};

// Cliente: ver mis reservas
export const getMyReservations = async () => {
    const response = await api.get('/reservations/mis-reservas');
    return response.data;
};

// Admin: ver todas las reservas
export const getAllReservations = async (filters = {}) => {
    const response = await api.get('/reservations', { params: filters });
    return response.data;
};

// Admin: cambiar eestado de reserva
export const updateReservationEstado = async (id, estado) => {
    const response = await api.patch(`/reservations/${id}/estado`, { estado });
    return response.data;
};

// Descargar cotización PDF
export const downloadQuotation = async (reservationId) => {
    const response = await api.get(`/documents/quotation/${reservationId}`, {
        responseType: 'blob', // Importante: indica que la respuesta es un archivo
    });
    return response.data;
};

// Descargar contrato PDF
export const downloadContract = async (reservationId) => {
    const response = await api.get(`/documents/contract/${reservationId}`, {
        responseType: 'blob',
    });
    return response.data;
};