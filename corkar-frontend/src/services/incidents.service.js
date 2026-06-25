// ============================================================
// services/incidents.service.js — Llamadas a incidentes
// ============================================================

import api from "./api";

// Cliente: reportar incidente
export const createIncident = async (incidentData) => {
    const response = await api.post('/incidents', incidentData);
    return response.data;
};

// Admin: ver todos los incidentes
export const getAllIncidents = async () => {
    const response = await api.get('/incidents');
    return response.data;
};

// Admin: actualizar estado de incidente
export const updateIncidentEstado = async (id, estado) => {
    const response = await api.patch(`/incidents/${id}/estado`, { estado });
    return response.data;
};