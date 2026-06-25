// ============================================================
// context/AuthContext.jsx — Estado global de autenticación
// ------------------------------------------------------------
// React Context permite compartir el estado del usuario logueado
// con cualquier componente sin pasar props manualmente nivel
// por nivel (prop drilling).
//
// Expone:
// - user: datos del usuario logueado (o null si no hay sesión)
// - token: JWT guardado
// - login(): guarda usuario y token, redirige según rol
// - logout(): limpia todo y redirige al login
// - isAuthenticated: booleano
// - isAdmin: booleano
// ============================================================

import { createContext, useContext, useState, useEffect, Children } from "react";
import { useNavigate } from 'react-router-dom';

//Creamos el contexto vacío
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // Inicializamos el estado leyendo localStorage.
    // Así el usuario no pierde su sesión al recargar la página.
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('corkar_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken ] = useState(() => {
        return localStorage.getItem('corkar_token') || null;
    });

    // Función que se llama después de un login o registro exitoso
    const loginUser = (userData, userToken) => {
        // Guardamos en estado de React
        setUser(userData);
        setToken(userToken);

        //Persistimos en localStorage para sobrevivir recargas
        localStorage.setItem('corkar_user', JSON.stringify(userData));
        localStorage.setItem('corkar_token', userToken);

        // Redirigimos según el rol del usuario
        if (userData.rol === 'ADMIN') {
            navigate('/admin');
        }else {
            navigate('/catalogo');
        }
    };

    // Función de cierre de sesión
    const logoutUser = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('corkar_user');
        localStorage.removeItem('corkar_token');
        navigate('/login');
    };

    // Valores y funciones que estarán disponibles en toda la app
    const value = {
        user,
        token,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,    // true si hay usuario logueando
        isAdmin: user?.rol === 'ADMIN', //true si el rol es ADMIN
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
// Uso: const { user, loginUser, isAdmin } = useAuth();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};