// frontend/src/pages/Settings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Moon, Sun, Trash2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

const LOCAL_KEY_ONBOARD = 'hasSeenOnboarding_v1';
const LOCAL_KEY_DARK = 'app_dark_mode_v1';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, fetchWithAuth, token } = useUser();
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_KEY_DARK) === 'true';
    } catch {
      return false;
    }
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Aplicar clase en body para estilos globales (útil para Tailwind / CSS)
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem(LOCAL_KEY_DARK, darkMode ? 'true' : 'false');
    } catch (e) {
      console.warn('No se pudo persistir el modo oscuro en localStorage', e);
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  // Intentará eliminar la cuenta si existe el endpoint; si no, muestra mensaje
  const confirmDeleteAccount = async () => {
    if (!window.confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.')) return;
    setLoadingDelete(true);
    try {
      // Ajusta la URL si tu endpoint es otro
      const res = await (typeof fetchWithAuth === 'function'
        ? fetchWithAuth('/api/users/me', { method: 'DELETE' })
        : fetch('http://localhost:5000/api/users/me', {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
          }));

      if (res.ok) {
        alert('Cuenta eliminada. Volviendo al inicio.');
        logout();
        navigate('/login');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'No se pudo eliminar la cuenta desde el servidor.');
      }
    } catch (err) {
      console.warn('Error eliminando cuenta:', err);
      alert('Error conectando al servidor. Intenta más tarde.');
    } finally {
      setLoadingDelete(false);
      setShowDeleteModal(false);
    }
  };

  // Reset onboarding: borra localStorage y sincroniza con backend si hay token
    // Reset onboarding: borra localStorage y sincroniza con backend si hay token
  const resetOnboarding = async () => {
    if (!confirm('¿Deseas ver el onboarding de nuevo la próxima vez que abras la app?')) return;
    setLoadingReset(true);

    try {
      // borrar local
      localStorage.removeItem(LOCAL_KEY_ONBOARD);

      // intentar sincronizar con backend usando fetchWithAuth (which now resolves API_BASE)
      if (typeof fetchWithAuth === 'function') {
        const res = await fetchWithAuth('/api/users/me/onboarding', {
          method: 'POST',
          body: JSON.stringify({ onboarded: false })
        });

        if (res.ok) {
          alert('Onboarding reiniciado y sincronizado con servidor.');
        } else if (res.status === 401) {
          // token inválido / expirado
          alert('Onboarding reiniciado localmente. Tu sesión expiró o el token no es válido — por favor inicia sesión de nuevo para sincronizar.');
          // opcional: logout automático
          // logout();
        } else if (res.status === 404) {
          alert('Onboarding reiniciado localmente. El endpoint de servidor no existe (404).');
        } else {
          alert('Onboarding reiniciado localmente. No fue posible sincronizar con el servidor (status ' + res.status + ').');
        }
      } else {
        // fallback: ya borramos local, informar
        alert('Onboarding reiniciado localmente.');
      }
    } catch (err) {
      console.error('Error reiniciando onboarding:', err);
      alert('Onboarding reiniciado localmente. Ocurrió un error al intentar contactar al servidor.');
    } finally {
      setLoadingReset(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: darkMode ? '#111827' : '#f5f5f5',
      color: darkMode ? '#e5e7eb' : '#111827',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: darkMode ? '#0f172a' : 'white',
      borderBottom: `1px solid ${darkMode ? '#111827' : '#e5e5e5'}`,
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: darkMode ? '#e5e7eb' : '#6b7280',
      marginRight: '1rem'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '700',
      margin: 0
    },
    content: {
      padding: '1rem'
    },
    section: {
      backgroundColor: darkMode ? '#0b1220' : 'white',
      borderRadius: '12px',
      marginBottom: '1rem',
      overflow: 'hidden',
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.06)'
    },
    sectionTitle: {
      fontSize: '1.05rem',
      fontWeight: '700',
      padding: '1rem 1rem 0.5rem',
      color: darkMode ? '#e5e7eb' : '#111827',
      borderBottom: `1px solid ${darkMode ? '#111827' : '#f0f0f0'}`,
      margin: 0
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderBottom: `1px solid ${darkMode ? '#111827' : '#f0f0f0'}`,
      cursor: 'pointer'
    },
    optionLast: { borderBottom: 'none' },
    optionLeft: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    optionIcon: { width: '24px', height: '24px', color: darkMode ? '#e5e7eb' : '#666' },
    optionText: { fontSize: '1rem', color: darkMode ? '#e5e7eb' : '#111827' },
    optionSubtext: { fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: 2 },
    toggle: {
      position: 'relative',
      width: '50px',
      height: '26px',
      backgroundColor: darkMode ? '#4f46e5' : '#e5e7eb',
      borderRadius: '999px',
      cursor: 'pointer'
    },
    toggleButton: {
      position: 'absolute',
      top: '2px',
      left: darkMode ? '28px' : '2px',
      width: '22px',
      height: '22px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'left 0.2s ease'
    },
    logoutButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      margin: '1rem 0'
    },
    deleteButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: 'transparent',
      color: '#ef4444',
      border: '2px solid #ef4444',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer'
    },
    smallBtn: {
      padding: '0.5rem 0.75rem',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600'
    },
    modal: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
    },
    modalContent: {
      backgroundColor: darkMode ? '#0b1220' : 'white',
      borderRadius: '12px', padding: '2rem', maxWidth: '420px', width: '100%', textAlign: 'center'
    },
    modalTitle: { fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: darkMode ? '#e5e7eb' : '#111827' },
    modalText: { fontSize: '1rem', marginBottom: '1.5rem', color: darkMode ? '#9ca3af' : '#6b7280' },
    modalButtons: { display: 'flex', gap: '1rem', justifyContent: 'center' },
    modalButton: { padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: '700', cursor: 'pointer', border: 'none' },
    cancelButton: { backgroundColor: darkMode ? '#111827' : '#e5e7eb', color: darkMode ? '#e5e7eb' : '#111827' },
    confirmButton: { backgroundColor: '#ef4444', color: 'white' }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => navigate('/dashboard')}
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={styles.title}>Configuración</h1>
      </div>

      <div style={styles.content}>
        {/* Cuenta */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Cuenta</h2>
          <div
            style={styles.option}
            onClick={() => navigate('/profile')}
            role="button"
            tabIndex={0}
          >
            <div style={styles.optionLeft}>
              <User style={styles.optionIcon} />
              <div>
                <div style={styles.optionText}>Editar Perfil</div>
                <div style={styles.optionSubtext}>
                  {user ? `${user.primer_nombre} ${user.primer_apellido}` : 'Usuario'}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ ...styles.option, ...styles.optionLast }}
            onClick={resetOnboarding}
            role="button"
            tabIndex={0}
          >
            <div style={styles.optionLeft}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v7l4 2" />
                <path d="M21 12a9 9 0 1 1-9-9" />
              </svg>
              <div>
                <div style={styles.optionText}>Ver onboarding de nuevo</div>
                <div style={styles.optionSubtext}>
                  {loadingReset ? 'Reiniciando...' : 'Se mostrará la próxima vez que abras la app'}
                </div>
              </div>
            </div>
            <div>
              <button
                style={{ ...styles.smallBtn, backgroundColor: '#e5e7eb' }}
                onClick={(e) => { e.stopPropagation(); resetOnboarding(); }}
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Apariencia</h2>
          <div style={{ ...styles.option, ...styles.optionLast }}>
            <div style={styles.optionLeft}>
              {darkMode ? <Moon style={styles.optionIcon} /> : <Sun style={styles.optionIcon} />}
              <div>
                <div style={styles.optionText}>Tema de la app</div>
                <div style={styles.optionSubtext}>
                  {darkMode ? 'Modo oscuro activado' : 'Modo claro activado'}
                </div>
              </div>
            </div>

            <div
              style={styles.toggle}
              onClick={() => setDarkMode(dm => !dm)}
              role="button"
              tabIndex={0}
              aria-pressed={darkMode}
            >
              <div style={styles.toggleButton} />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>

        <button
          style={styles.deleteButton}
          onClick={handleDeleteAccount}
        >
          <Trash2 style={{ marginRight: 8 }} />
          Eliminar Cuenta
        </button>
      </div>

      {/* Modal de confirmación eliminar */}
      {showDeleteModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>¿Eliminar cuenta?</h3>
            <p style={styles.modalText}>
              Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.cancelButton }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.confirmButton }}
                onClick={confirmDeleteAccount}
                disabled={loadingDelete}
              >
                {loadingDelete ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;