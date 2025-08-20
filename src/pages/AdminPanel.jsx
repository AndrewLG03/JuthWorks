// frontend/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import BottomNavigation from '../components/BottomNavigation';
import { Settings, Search, BarChart3, FileText, Users } from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesNuevas, setSolicitudesNuevas] = useState([]);
  const [presupuestosPendientes, setPresupuestosPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');

  // Verificar que el usuario sea administrador
  useEffect(() => {
    if (!user || user.tipo_usuario !== 'administrador') {
      navigate('/dashboard');
      return;
    }
    
    cargarDatosAdmin();
  }, [user, navigate]);

  const cargarDatosAdmin = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/requests');
      
      if (!response.ok) {
        throw new Error('Error al cargar datos');
      }
      
      const data = await response.json();
      setSolicitudes(data);
      
      // Filtrar solicitudes nuevas (pendientes)
      const nuevas = data.filter(s => s.estado === 'pendiente');
      setSolicitudesNuevas(nuevas);
      
      // Filtrar presupuestos pendientes (en revisión)
      const pendientes = data.filter(s => s.estado === 'en_revision');
      setPresupuestosPendientes(pendientes);
      
    } catch (error) {
      console.error('Error cargando datos admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorFecha = () => {
    if (!filtroFecha) return;
    
    const fechaSeleccionada = new Date(filtroFecha);
    const solicitudesFiltradas = solicitudes.filter(solicitud => {
      const fechaSolicitud = new Date(solicitud.fecha_solicitud);
      return fechaSolicitud.toDateString() === fechaSeleccionada.toDateString();
    });
    
    console.log('Solicitudes filtradas por fecha:', solicitudesFiltradas);
    // Aquí puedes implementar la lógica para mostrar las solicitudes filtradas
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingBottom: '80px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e5e5'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    settingsButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666'
    },
    infoSection: {
      backgroundColor: '#e8e8e8',
      borderRadius: '12px',
      padding: '1rem',
      margin: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    logoContainer: {
      width: '60px',
      height: '60px',
      backgroundColor: '#6b2e6b',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.8rem'
    },
    infoText: {
      flex: 1
    },
    infoTitle: {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: '#333',
      margin: '0 0 0.25rem 0'
    },
    mainContent: {
      padding: '0 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    filterSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    filterTitle: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#333'
    },
    searchContainer: {
      position: 'relative',
      flex: 1,
      maxWidth: '300px'
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '0.9rem',
      backgroundColor: 'white'
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6b7280'
    },
    cardRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem'
    },
    card: {
      backgroundColor: '#d0d0d0',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent'
    },
    smallCard: {
      flex: 1,
      minHeight: '150px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    largeCard: {
      width: '100%',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardContent: {
      textAlign: 'center'
    },
    cardTitle: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#333',
      margin: '0.5rem 0 0 0'
    },
    cardSubtitle: {
      fontSize: '0.9rem',
      color: '#666',
      margin: '0.25rem 0 0 0'
    },
    cardNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#6b2e6b',
      margin: '0.5rem 0'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px'
    },
    loadingText: {
      color: '#666',
      fontSize: '1rem'
    },
  };

  const handleCardHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.backgroundColor = '#c0c0c0';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    } else {
      e.currentTarget.style.backgroundColor = '#d0d0d0';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Juth Works</h1>
          <button style={styles.settingsButton}>
            <Settings size={24} />
          </button>
        </div>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Cargando datos...</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Juth Works</h1>
        <button
          style={styles.settingsButton}
          onClick={() => navigate('/settings')}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Sección de Información */}
      <div style={styles.infoSection}>
        <div style={styles.logoContainer}>
          JUTH<br />WORKS
        </div>
        <div style={styles.infoText}>
          <h2 style={styles.infoTitle}>Información</h2>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={styles.mainContent}>
        {/* Filtro por fecha */}
        <div style={styles.filterSection}>
          <span style={styles.filterTitle}>Filtrar por fecha</span>
        </div>

        {/* Barra de búsqueda */}
        <div style={styles.searchContainer}>
          <Search style={styles.searchIcon} size={20} />
          <input
            type="date"
            style={styles.searchInput}
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            placeholder="Seleccionar fecha"
          />
        </div>

        {/* Primera fila: Presupuestos Pendientes */}
        <div style={styles.cardRow}>
          <div 
            style={{...styles.card, ...styles.smallCard}}
            onClick={() => navigate('/admin/presupuestos-pendientes')}
            onMouseOver={(e) => handleCardHover(e, true)}
            onMouseOut={(e) => handleCardHover(e, false)}
          >
            <div style={styles.cardContent}>
              <FileText size={32} color="#6b2e6b" />
              <div style={styles.cardNumber}>{presupuestosPendientes.length}</div>
              <h3 style={styles.cardTitle}>Presupuestos</h3>
              <p style={styles.cardSubtitle}>Pendientes</p>
            </div>
          </div>
        </div>

        {/* Segunda fila: Solicitudes Nuevas */}
        <div style={styles.cardRow}>
          <div 
            style={{...styles.card, ...styles.smallCard}}
            onClick={() => navigate('/admin/solicitudes-nuevas')}
            onMouseOver={(e) => handleCardHover(e, true)}
            onMouseOut={(e) => handleCardHover(e, false)}
          >
            <div style={styles.cardContent}>
              <Users size={32} color="#6b2e6b" />
              <div style={styles.cardNumber}>{solicitudesNuevas.length}</div>
              <h3 style={styles.cardTitle}>Solicitudes Nuevas</h3>
            </div>
          </div>
        </div>

        {/* Tercera fila: Gráficos */}
        <div style={styles.cardRow}>
          <div 
            style={{...styles.card, ...styles.largeCard}}
            onClick={() => navigate('/admin/graficos')}
            onMouseOver={(e) => handleCardHover(e, true)}
            onMouseOut={(e) => handleCardHover(e, false)}
          >
            <div style={styles.cardContent}>
              <BarChart3 size={48} color="#6b2e6b" />
              <h3 style={styles.cardTitle}>Gráficos</h3>
              <p style={styles.cardSubtitle}>Estadísticas y reportes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AdminPanel;