// frontend/src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { API_BASE, apiHelpers } from '../api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe ser usado dentro de UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  });
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t ? t : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => setLoading(false), []);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData || null);
    setToken(jwtToken || null);
    if (userData) localStorage.setItem('user', JSON.stringify(userData));
    if (jwtToken) localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // sanitizeToken: quita comillas simples o dobles al inicio/final si las hubiese
  const sanitizeToken = (t) => {
    if (!t) return null;
    if (typeof t !== 'string') return String(t);
    return t.replace(/^['"]|['"]$/g, '').trim();
  };

  // fetchWithAuth actualizado para usar axios pero mantener la misma interfaz
  const fetchWithAuth = async (url, opts = {}) => {
    try {
      // Convertir rutas relativas /api => API_BASE + /api
      const finalUrl = (typeof url === 'string' && url.startsWith('/api')) ? url : url;
      
      // Preparar configuración para axios
      const axiosConfig = {
        method: opts.method || 'GET',
        url: finalUrl,
        data: opts.body,
        headers: opts.headers || {},
        ...opts // Para cualquier otra opción que se pase
      };

      // Si hay body y es string (JSON), parsearlo
      if (typeof axiosConfig.data === 'string') {
        try {
          axiosConfig.data = JSON.parse(axiosConfig.data);
        } catch (e) {
          // Si no se puede parsear, dejarlo como string
        }
      }

      // Usar la instancia de axios que ya tiene los interceptores configurados
      const response = await api(axiosConfig);
      
      // Crear un objeto similar a fetch Response para mantener compatibilidad
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.statusText,
        json: () => Promise.resolve(response.data),
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      // Manejar errores de axios y convertirlos a formato fetch-like
      if (error.response) {
        return {
          ok: false,
          status: error.response.status,
          statusText: error.response.statusText,
          json: () => Promise.resolve(error.response.data),
          data: error.response.data,
          headers: error.response.headers
        };
      } else {
        // Error de red o configuración
        throw error;
      }
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUser: (u) => { 
        const nu = { ...user, ...u }; 
        setUser(nu); 
        localStorage.setItem('user', JSON.stringify(nu)); 
      },
      loading,
      isAuthenticated: !!user,
      fetchWithAuth,
      // Nuevas utilidades para usar con api.js
      apiHelpers,
      API_BASE
    }}>
      {children}
    </UserContext.Provider>
  );
};