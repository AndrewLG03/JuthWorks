// frontend/src/pages/NewRequestsPage.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function NewRequestsPage() {
  const { token, user } = useUser();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificar si el usuario es administrador y cargar solicitudes
  useEffect(() => {
    if (!user || user.tipo_usuario !== 'administrador') {
      navigate('/dashboard');
    } else {
      fetchNew();
    }
  }, [user, navigate]);

  const fetchNew = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/solicitudes-nuevas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  // --- Funciones para manejar acciones del admin ---

  const handleSendQuote = async (id) => {
    const precio = prompt('Ingresa el precio estimado para el presupuesto (solo números):');
    if (!precio || isNaN(parseFloat(precio))) {
        if (precio !== null) { // Evita el toast si el usuario cancela el prompt
            toast.warn('Por favor, ingresa un precio válido.');
        }
        return;
    }
    try {
      await fetch('http://localhost:5000/api/admin/enviar-presupuesto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ solicitud_id: id, precio_estimado: parseFloat(precio), notas_admin: '' })
      });
      toast.success('Presupuesto enviado exitosamente');
      fetchNew(); // Recargar la lista de solicitudes
    } catch {
      toast.error('Error al enviar el presupuesto');
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas aprobar esta solicitud directamente?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/aprobar-presupuesto/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notas_admin: 'Aprobado directamente por el administrador.' })
      });
      toast.success('Solicitud aprobada');
      fetchNew();
    } catch {
      toast.error('Error al aprobar la solicitud');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas rechazar esta solicitud? Esta acción no se puede deshacer.')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/rechazar-presupuesto/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notas_admin: 'Rechazado por el administrador.' })
      });
      toast.info('Solicitud rechazada');
      fetchNew();
    } catch {
      toast.error('Error al rechazar la solicitud');
    }
  };

  // --- Estilos del Componente ---
  const styles = {
    page: { 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5', 
      fontFamily: 'system-ui, sans-serif',
      paddingBottom: '80px'
    },
    header: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '1rem', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #e0e0e0', 
      position: 'sticky', 
      top: 0, 
      zIndex: 10 
    },
    backButton: { 
      background: 'none', 
      border: 'none', 
      cursor: 'pointer', 
      display: 'flex', 
      color: '#333' 
    },
    title: { 
      margin: 0, 
      fontSize: '1.5rem', 
      fontWeight: 'bold', 
      color: '#333' 
    },
    loadingText: { 
      textAlign: 'center', 
      padding: '2rem', 
      color: '#666',
      fontSize: '1.1rem'
    },
    emptyText: { 
      textAlign: 'center', 
      padding: '2rem', 
      color: '#666',
      fontSize: '1.1rem'
    },
    requestCard: { 
      background: '#fff', 
      padding: '1.5rem', 
      margin: '1rem', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    },
    requestHeader: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #f0f0f0'
    },
    clientName: { 
      fontSize: '1.1rem', 
      fontWeight: 'bold', 
      color: '#333' 
    },
    username: { 
      fontSize: '0.9rem', 
      color: '#666',
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
      backgroundColor: '#fff3cd', 
      color: '#856404', 
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: '500',
      border: '1px solid #ffeaa7'
    },
    dateText: { 
      color: '#666',
      fontSize: '0.9rem'
    },
    actions: { 
      marginTop: '1.5rem', 
      paddingTop: '1rem',
      borderTop: '1px solid #f0f0f0',
      display: 'flex', 
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    actionBtn: { 
      flex: 1, 
      minWidth: '120px',
      padding: '0.6rem', 
      borderRadius: '6px', 
      border: 'none', 
      cursor: 'pointer', 
      fontWeight: 'bold',
      fontSize: '0.9rem',
      transition: 'opacity 0.2s'
    },
    send: { background: '#4f46e5', color: '#fff' },
    approve: { background: '#16a34a', color: '#fff' },
    reject: { background: '#dc2626', color: '#fff' }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton} title="Volver">
            <ArrowLeft size={24} />
          </button>
          <h1 style={styles.title}>Solicitudes Nuevas</h1>
        </header>
        <p style={styles.loadingText}>Cargando solicitudes...</p>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton} title="Volver">
          <ArrowLeft size={24} />
        </button>
        <h1 style={styles.title}>Solicitudes Nuevas</h1>
      </header>
      
      <main>
        {requests.length === 0 ? (
          <p style={styles.emptyText}>🎉 ¡Excelente! No hay solicitudes nuevas por revisar.</p>
        ) : (
          requests.map(r => (
            <article key={r.id} style={styles.requestCard}>
              <div style={styles.requestHeader}>
                <User size={24} color="#581c87" />
                <div>
                  <div style={styles.clientName}>{r.primer_nombre} {r.primer_apellido}</div>
                  <div style={styles.username}>@{r.username}</div>
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
                <span style={styles.infoText}>{r.descripcion}</span>
              </div>

              <div style={styles.infoRow}>
                <AlertCircle size={16} color="#b45309" style={styles.infoIcon} />
                <span style={styles.infoLabel}>Estado:</span>
                <span style={styles.statusBadge}>
                  <AlertCircle size={12} />
                  {r.estado}
                </span>
              </div>

              <div style={styles.infoRow}>
                <Calendar size={16} color="#666" style={styles.infoIcon} />
                <span style={styles.infoLabel}>Fecha:</span>
                <span style={styles.dateText}>
                  {new Date(r.fecha_solicitud).toLocaleString('es-CR')}
                </span>
              </div>

              {/* --- Botones de Acción --- */}
              <div style={styles.actions}>
                <button onClick={() => handleSendQuote(r.id)} style={{ ...styles.actionBtn, ...styles.send }}>
                  Enviar Presupuesto
                </button>
                <button onClick={() => handleApprove(r.id)} style={{ ...styles.actionBtn, ...styles.approve }}>
                  Aprobar
                </button>
                <button onClick={() => handleReject(r.id)} style={{ ...styles.actionBtn, ...styles.reject }}>
                  Rechazar
                </button>
              </div>
            </article>
          ))
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}