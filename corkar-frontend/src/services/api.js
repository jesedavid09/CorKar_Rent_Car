// ============================================================
// services/api.js — Cliente HTTP centralizado con Axios
// ------------------------------------------------------------
// Crea una instancia de Axios preconfigurada con:
// - La URL base del backend
// - Interceptores que agregan el token JWT automáticamente
//   a cada petición que requiere autenticación
//
// Todos los servicios importan esta instancia en lugar de
// usar fetch o axios directamente, para no repetir config.
// ============================================================

import axios from 'axios';

// URL base del backend. En desarrollo apunta a localhost.
// En producción cambiaremos esto a la URL de Render/Railway.
const API_URL = 'http://localhost:3000/api';

// Creamos la instancia de Axios con configuración base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Interceptor de peticiones ─────────────────────────────────
// Se ejecuta automáticamente ANTES de cada petición.
// Lee el token guardado en localStorage y lo agrega al header.
// Así no tenemos que agregar el token manualmente en cada llamada.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('corkar_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Interceptor de respuestas ─────────────────────────────────
// Se ejecuta automáticamente cuando llega una respuesta.
// Si el servidor devuelve 401 (token expirado o inválido),
// limpiamos el localStorage y redirigimos al login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('corkar_token');
            localStorage.removeItem('corkar_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;