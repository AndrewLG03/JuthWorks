// frontend/src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { FileText, Calendar, AlertCircle, DollarSign } from 'lucide-react';

const History = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lógica de fetch actualizada con header de autorización
        const response = await fetch(`http://localhost:5000/api/user-requests/${user.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
          throw new Error('Error al cargar el historial');
        }

        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  // Nueva función para manejar la navegación al pago
  const handlePay = (solicitudId) => {
    navigate(`/payment/${solicitudId}`);
  };

  const getStatusColor = (estado) => {
    const colors = {
      'pendiente': { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
      'en_revision': { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
      'aprobada': { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
      'en_proceso': { bg: '#e0e7ff', color: '#5b21b6', border: '#c4b5fd' },
      'completada': { bg: '#d1fae5', color: '#064e3b', border: '#6ee7b7' },
      'cancelada': { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' }
    };
    return colors[estado] || { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
  };

  const getStatusText = (estado) => {
    const texts = {
      'pendiente': 'Pendiente',
      'en_revision': 'En Revisión',
      'aprobada': 'Aprobada',
      'en_proceso': 'En Proceso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return texts[estado] || estado;
  };

  // Estilos del componente (originales + nuevo estilo para el botón)
  const styles = {
    page: { 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5', 
      fontFamily: 'system-ui, sans-serif',
      paddingBottom: '80px'
    },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #e0e0e0' 
    },
    title: { 
      fontSize: '18px', 
      fontWeight: '600', 
      margin: 0,
      color: '#333'
    },
    userInfo: { 
      backgroundColor: '#e8e8e8', 
      padding: '16px', 
      margin: '16px', 
      borderRadius: '12px', 
      fontWeight: '500',
      color: '#333'
    },
    content: { 
      flex: 1, 
      padding: '0 16px' 
    },
    loadingText: { 
      textAlign: 'center', 
      padding: '20px',
      fontSize: '1.1rem',
      color: '#666'
    },
    errorText: { 
      textAlign: 'center', 
      padding: '20px', 
      color: '#dc2626',
      fontSize: '1.1rem'
    },
    emptyText: { 
      textAlign: 'center', 
      padding: '20px',
      fontSize: '1.1rem',
      color: '#666'
    },
    requestCard: { 
      background: '#fff', 
      padding: '1.5rem', 
      marginBottom: '1rem', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    },
    requestHeader: { 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #f0f0f0'
    },
    requestNumber: { 
      fontSize: '1.2rem', 
      fontWeight: 'bold', 
      color: '#581c87',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    infoRow: { 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: '0.75rem',
      marginBottom: '0.75rem'
    },
    infoIcon: { 
      marginTop: '0.15rem',
      flexShrink: 0
    },
    infoLabel: { 
      fontWeight: 'bold', 
      color: '#555',
      minWidth: '90px'
    },
    infoText: { 
      color: '#333',
      wordBreak: 'break-word',
      lineHeight: '1.4'
    },
    statusBadge: { 
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem', 
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: '500'
    },
    dateText: { 
      color: '#666',
      fontSize: '0.9rem'
    },
    priceText: {
      color: '#059669',
      fontWeight: 'bold',
      fontSize: '1rem'
    },
    // Nuevo estilo para el botón de pago
    payBtn: { 
      marginTop: '1rem', 
      padding: '0.75rem', 
      width: '100%', 
      backgroundColor: '#4f46e5', 
      color: '#fff', 
      border: 'none', 
      borderRadius: '6px', 
      cursor: 'pointer', 
      fontWeight: '600',
      fontSize: '1rem'
    }
  };

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Historial de Servicios</h1>
        </div>
        <p style={styles.loadingText}>Por favor, inicia sesión para ver tu historial</p>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Historial de Servicios</h1>
      </div>
      
      <div style={styles.userInfo}>
        Historial de {user.primer_nombre} {user.primer_apellido}
      </div>
      
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingText}>
            <p>Cargando historial...</p>
          </div>
        ) : error ? (
          <div style={styles.errorText}>
            <p>Error: {error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={styles.emptyText}>
            <p>No tienes solicitudes de servicio aún</p>
          </div>
        ) : (
          requests.map((r) => {
            const statusColors = getStatusColor(r.estado);
            return (
              <article key={r.id} style={styles.requestCard}>
                <div style={styles.requestHeader}>
                  <div style={styles.requestNumber}>
                    <FileText size={20} />
                    {/* Usando el id real de la solicitud */}
                    Solicitud #{r.id}
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FileText size={16} color="#666" style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Servicio:</span>
                  <span style={styles.infoText}>{r.servicio_nombre}</span>
                </div>

                <div style={styles.infoRow}>
                  <FileText size={16} color="#666" style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Descripción:</span>
                  <span style={styles.infoText}>{r.descripcion || 'Sin descripción'}</span>
                </div>

                <div style={styles.infoRow}>
                  <AlertCircle size={16} color="#b45309" style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Estado:</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColors.bg,
                    color: statusColors.color,
                    border: `1px solid ${statusColors.border}`
                  }}>
                    <AlertCircle size={12} />
                    {getStatusText(r.estado)}
                  </span>
                </div>

                <div style={styles.infoRow}>
                  <Calendar size={16} color="#666" style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Fecha:</span>
                  <span style={styles.dateText}>
                    {/* Usando formato de fecha es-CR */}
                    {new Date(r.fecha_solicitud).toLocaleDateString('es-CR')}
                  </span>
                </div>

                <div style={styles.infoRow}>
                  <DollarSign size={16} color="#059669" style={styles.infoIcon} />
                  <span style={styles.infoLabel}>Precio:</span>
                  <span style={styles.priceText}>
                    {/* Lógica de precio actualizada */}
                    {r.precio_estimado ? `₡${Number(r.precio_estimado).toLocaleString()}` : 'Pago inicial pendiente'}
                  </span>
                </div>
                
                {/* Botón de pago condicional */}
                {r.estado === 'pendiente' && (
                  <button style={styles.payBtn} onClick={() => handlePay(r.id)}>
                    Pagar Adelanto ₡20,000
                  </button>
                )}
              </article>
            );
          })
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default History;