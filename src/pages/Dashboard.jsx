// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import BottomNavigation from '../components/BottomNavigation';
import { Settings } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Estado para la vista previa de comentarios
  const [commentsPreview, setCommentsPreview] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(null);

  // Efecto para obtener los comentarios al montar el componente (AJAX)
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        setErrorComments(null);

        const res = await fetch('http://localhost:5000/api/comments?limit=3');
        if (!res.ok) throw new Error('Error al cargar comentarios');
        
        const data = await res.json();
        setCommentsPreview(data);
      } catch (err) {
        setErrorComments(err.message);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, []);

  // Íconos SVG para las tarjetas
  const HistoryIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </svg>
  );

  const ServicesIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
  
  const handleCardClick = (route) => navigate(route);
  const handleSettingsClick = () => navigate('/settings');
  const goToComments = () => navigate('/comments');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingBottom: '80px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          letterSpacing: '-0.025em'
        }}>
          Juth Works
        </h1>
        <button
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: 'none',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4a5568',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onClick={handleSettingsClick}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Mensaje de Bienvenida */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '24px',
        margin: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          lineHeight: '1.2',
          boxShadow: '0 10px 20px rgba(102, 126, 234, 0.4)',
          flexShrink: 0
        }}>
          JUTH<br />WORKS
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontWeight: '700',
            fontSize: '20px',
            color: '#1a202c',
            margin: '0 0 8px 0',
            letterSpacing: '-0.025em'
          }}>
            {user
              ? `¡Hola, ${user.primer_nombre}! 👋`
              : '¡Bienvenido! 👋'}
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#4a5568',
            margin: 0,
            fontWeight: '500'
          }}>
            ¿Qué deseas hacer hoy?
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{
        flex: 1,
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Fila 1: Historial */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div 
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              minHeight: '140px'
            }}
            onClick={() => handleCardClick('/historial')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              marginBottom: '16px',
              color: '#667eea',
              background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
              borderRadius: '50%',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HistoryIcon />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              textAlign: 'center',
              margin: 0,
              letterSpacing: '-0.025em'
            }}>
              📋 Historial
            </h3>
          </div>
        </div>

        {/* Fila 2: Servicios */}
        <div 
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            minHeight: '160px'
          }}
          onClick={() => handleCardClick('/services')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={{
            marginBottom: '20px',
            color: '#667eea',
            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
            borderRadius: '50%',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ServicesIcon />
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a202c',
            textAlign: 'center',
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            🔧 Servicios
          </h3>
        </div>

        {/* Vista previa de comentarios */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '24px',
          marginTop: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ 
            margin: '0 0 20px', 
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a202c',
            letterSpacing: '-0.025em'
          }}>
            💬 Últimos comentarios
          </h2>

          {loadingComments && (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: '#4a5568'
            }}>
              <div style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '2px solid #e2e8f0',
                borderTop: '2px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ margin: '12px 0 0 0' }}>Cargando comentarios…</p>
            </div>
          )}
          
          {errorComments && (
            <p style={{ 
              color: '#e53e3e',
              backgroundColor: '#fed7d7',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #feb2b2'
            }}>
              {errorComments}
            </p>
          )}

          {!loadingComments && !errorComments && commentsPreview.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: '#718096'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💭</div>
              <p style={{ margin: 0, fontSize: '16px' }}>No hay comentarios aún.</p>
            </div>
          )}

          {!loadingComments && !errorComments && commentsPreview.map(c => (
            <div
              key={c.id_comentario}
              style={{
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={goToComments}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px -8px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <p style={{ 
                margin: '0 0 8px 0', 
                fontWeight: '600',
                color: '#2d3748',
                fontSize: '15px'
              }}>
                👤 {c.primer_nombre || 'Anónimo'}
              </p>
              <p style={{ 
                margin: '0 0 12px 0',
                color: '#4a5568',
                lineHeight: '1.5',
                fontSize: '14px'
              }}>
                {c.texto.length > 60
                  ? c.texto.substring(0, 57) + '...'
                  : c.texto
                }
              </p>
              <small style={{ 
                color: '#718096',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                📅 {new Date(c.creado_en).toLocaleDateString('es-CR')}
              </small>
            </div>
          ))}

          {!loadingComments && !errorComments && commentsPreview.length > 0 && (
            <button
              onClick={goToComments}
              style={{
                marginTop: '16px',
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                width: '100%',
                letterSpacing: '0.025em'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
                Ver todos los comentarios
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Keyframes para la animación de carga */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;