// ============================================================
// services/auth.service.js — Llamadas a la API de auth
// ------------------------------------------------------------
// Encapsula todas las peticiones HTTP relacionadas con
// autenticación. Los componentes llaman a estas funciones
// en lugar de usar axios directamente.
// ============================================================

import api from './api';

// Registrar un nuevo cliente
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; // { user, token }
};

// Iniciar sesión
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // { user, token }
};

// Obtener el perfil del usuario logueado
export const getMe = async () => {
    const response = await api.get('/users/me');
    return response.data;
};