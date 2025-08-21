// frontend/src/pages/PendingQuotesPage.jsx 
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, FileText, AlertCircle, DollarSign } from 'lucide-react';
import { adminService, apiHelpers } from '../api';

const PendingQuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingQuotes();
      setQuotes(data);
    } catch (error) {
      console.error(error);
      const errorDetails = apiHelpers.handleError(error);
      // Manejar error apropiadamente
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // --- Estilos ---
  const styles = {
    page: { 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5', 
      fontFamily: 'system-ui, sans-serif',
      paddingBottom: '80px' // Espacio para BottomNavigation
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
    quoteCard: { 
      background: '#fff', 
      padding: '1.5rem', 
      margin: '1rem', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    },
    quoteHeader: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
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
      fontStyle: 'italic'
    },
    infoRow: { 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: '0.5rem',
      marginBottom: '0.75rem'
    },
    infoIcon: { 
      marginTop: '0.1rem',
      flexShrink: 0
    },
    infoLabel: { 
      fontWeight: 'bold', 
      color: '#555',
      minWidth: '100px'
    },
    infoText: { 
      color: '#333',
      wordBreak: 'break-word',
      lineHeight: '1.4'
    },
    priceText: { 
      color: '#28a745',
      fontWeight: 'bold',
      fontSize: '1.1rem'
    },
    statusBadge: { 
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem', 
      backgroundColor: '#d1ecf1', 
      color: '#0c5460', 
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: '500',
      border: '1px solid #bee5eb'
    },
    dateText: { 
      color: '#666',
      fontSize: '0.9rem'
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton} title="Volver">
            <ArrowLeft size={24} />
          </button>
          <h1 style={styles.title}>Presupuestos Pendientes</h1>
        </header>
        <p style={styles.loadingText}>Cargando presupuestos...</p>
        <BottomNavigation />
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton} title="Volver">
            <ArrowLeft size={24} />
          </button>
          <h1 style={styles.title}>Presupuestos Pendientes</h1>
        </header>
        <p style={styles.emptyText}>No hay presupuestos pendientes.</p>
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
        <h1 style={styles.title}>Presupuestos Pendientes</h1>
      </header>
      
      <main>
        {quotes.map(q => (
          <article key={q.id} style={styles.quoteCard}>
            <div style={styles.quoteHeader}>
              <User size={20} color="#6b2e6b" />
              <div>
                <div style={styles.clientName}>
                  {q.primer_nombre} {q.primer_apellido}
                </div>
                <div style={styles.username}>@{q.username}</div>
              </div>
            </div>

            <div style={styles.infoRow}>
              <FileText size={16} color="#666" style={styles.infoIcon} />
              <span style={styles.infoLabel}>Servicio:</span>
              <span style={styles.infoText}>{q.servicio_nombre}</span>
            </div>

            <div style={styles.infoRow}>
              <DollarSign size={16} color="#28a745" style={styles.infoIcon} />
              <span style={styles.infoLabel}>Precio Base:</span>
              <span style={styles.priceText}>₡{q.precio_base?.toLocaleString('es-CR')}</span>
            </div>

            <div style={styles.infoRow}>
              <FileText size={16} color="#666" style={styles.infoIcon} />
              <span style={styles.infoLabel}>Descripción:</span>
              <span style={styles.infoText}>{q.descripcion}</span>
            </div>

            <div style={styles.infoRow}>
              <AlertCircle size={16} color="#0c5460" style={styles.infoIcon} />
              <span style={styles.infoLabel}>Estado:</span>
              <span style={styles.statusBadge}>
                <AlertCircle size={12} />
                {q.estado}
              </span>
            </div>

            <div style={styles.infoRow}>
              <Calendar size={16} color="#666" style={styles.infoIcon} />
              <span style={styles.infoLabel}>Fecha:</span>
              <span style={styles.dateText}>
                {new Date(q.fecha_solicitud).toLocaleString('es-CR')}
              </span>
            </div>
          </article>
        ))}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default PendingQuotesPage;