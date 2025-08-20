// frontend/src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe ser usado dentro de UserProvider');
  return context;
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  const fetchWithAuth = async (url, opts = {}) => {
    const final = { ...opts };
    final.headers = final.headers ? { ...final.headers } : {};

    // Convertir rutas relativas /api => API_BASE + /api
    const finalUrl = (typeof url === 'string' && url.startsWith('/api')) ? `${API_BASE}${url}` : url;

    // Obtener token (state o localStorage) y sanearlo
    const rawToken = token || localStorage.getItem('token') || '';
    const cleanToken = sanitizeToken(rawToken);

    if (cleanToken) final.headers = { ...final.headers, Authorization: `Bearer ${cleanToken}` };

    // Si hay body y no Content-Type y no es FormData, poner application/json
    if (final.body && !(final.body instanceof FormData)) {
      if (!Object.keys(final.headers).some(h => h.toLowerCase() === 'content-type')) {
        final.headers['Content-Type'] = 'application/json';
      }
    }

    return fetch(finalUrl, final);
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUser: (u) => { const nu = { ...user, ...u }; setUser(nu); localStorage.setItem('user', JSON.stringify(nu)); },
      loading,
      isAuthenticated: !!user,
      fetchWithAuth
    }}>
      {children}
    </UserContext.Provider>
  );
};