// frontend/src/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Interceptor request: añade token automáticamente si existe
api.interceptors.request.use(config => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // no hacer nada si localStorage no está disponible
  }
  return config;
}, error => Promise.reject(error));

// Interceptor response: manejo básico errores
api.interceptors.response.use(
  res => res,
  err => {
    // ejemplo: si 401 -> podrías forzar logout centralizado
    // if (err.response && err.response.status === 401) { /* logout */ }
    return Promise.reject(err);
  }
);

// ============= AUTH SERVICES =============
export const authService = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/api/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/api/register', userData);
    return response.data;
  },

  // Verify email
  verifyEmail: async (userId, verificationCode) => {
    const response = await api.post('/api/verify-email', {
      userId,
      verificationCode
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (userId, verificationCode, newPassword) => {
    const response = await api.post('/api/reset-password', {
      userId,
      verificationCode,
      newPassword
    });
    return response.data;
  }
};

// ============= USER SERVICES =============
export const userService = {
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  // Update user
  updateUser: async (userData) => {
    const response = await api.put('/api/users/me', userData);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/api/users/me');
    return response.data;
  },

  // Update onboarding status
  updateOnboarding: async (onboarded) => {
    const response = await api.post('/api/users/me/onboarding', { onboarded });
    return response.data;
  },

  // Get user requests/history
  getUserRequests: async (userId) => {
    const response = await api.get(`/api/user-requests/${userId}`);
    return response.data;
  }
};

// ============= SERVICES =============
export const servicesService = {
  // Get all services
  getServices: async () => {
    const response = await api.get('/api/services');
    return response.data;
  },

  // Request service
  requestService: async (serviceData) => {
    const response = await api.post('/api/request-service', serviceData);
    return response.data;
  },

  // Upload photos for request
  uploadPhotos: async (solicitudId, photos) => {
    const formData = new FormData();
    photos.forEach(photo => {
      formData.append('photos', photo);
    });
    
    const response = await api.post(`/api/upload-photos/${solicitudId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// ============= ADMIN SERVICES =============
export const adminService = {
  // Get admin dashboard data
  getAdminRequests: async () => {
    const response = await api.get('/api/admin/requests');
    return response.data;
  },

  // Get new requests
  getNewRequests: async () => {
    const response = await api.get('/api/admin/solicitudes-nuevas');
    return response.data;
  },

  // Get pending quotes
  getPendingQuotes: async () => {
    const response = await api.get('/api/admin/presupuestos-pendientes');
    return response.data;
  },

  // Send quote
  sendQuote: async (solicitudId, precioEstimado, notasAdmin = '') => {
    const response = await api.post('/api/admin/enviar-presupuesto', {
      solicitud_id: solicitudId,
      precio_estimado: precioEstimado,
      notas_admin: notasAdmin
    });
    return response.data;
  },

  // Approve request
  approveRequest: async (solicitudId, notasAdmin = '') => {
    const response = await api.post(`/api/admin/aprobar-presupuesto/${solicitudId}`, {
      notas_admin: notasAdmin
    });
    return response.data;
  },

  // Reject request
  rejectRequest: async (solicitudId, notasAdmin = '') => {
    const response = await api.post(`/api/admin/rechazar-presupuesto/${solicitudId}`, {
      notas_admin: notasAdmin
    });
    return response.data;
  }
};

// ============= COMMENTS SERVICES =============
export const commentsService = {
  // Get comments with filters
  getComments: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/api/comments?${params.toString()}`);
    return response.data;
  },

  // Create comment
  createComment: async (texto, usuarioId = null) => {
    const response = await api.post('/api/comments', {
      texto,
      usuario_id: usuarioId
    });
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, texto) => {
    const response = await api.put(`/api/comments/${commentId}`, {
      texto
    });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  }
};

// ============= PAYMENT SERVICES =============
export const paymentService = {
  // Process payment
  processPayment: async (paymentData) => {
    const response = await api.post('/api/payment', paymentData);
    return response.data;
  },

  // Get exchange rate
  getExchangeRate: async () => {
    const response = await api.get('/api/exchange-rate');
    return response.data;
  }
};

// ============= SUPPORT SERVICES =============
export const supportService = {
  // Send support message
  sendSupportMessage: async (supportData) => {
    const response = await api.post('/api/support', supportData);
    return response.data;
  }
};

// ============= GENERIC API HELPERS =============
export const apiHelpers = {
  // Generic GET with auth
  get: async (url, config = {}) => {
    const response = await api.get(url, config);
    return response.data;
  },

  // Generic POST with auth
  post: async (url, data, config = {}) => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  // Generic PUT with auth
  put: async (url, data, config = {}) => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  // Generic DELETE with auth
  delete: async (url, config = {}) => {
    const response = await api.delete(url, config);
    return response.data;
  },

  // Handle axios errors
  handleError: (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      return {
        message: error.response.data?.error || error.response.data?.message || 'Error del servidor',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      return {
        message: 'Error de conexión - sin respuesta del servidor',
        status: null,
        data: null
      };
    } else {
      // Error en la configuración de la petición
      return {
        message: error.message || 'Error desconocido',
        status: null,
        data: null
      };
    }
  }
};

export default api;
export { API_BASE };