// frontend/src/components/BottomNavigation.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  // Íconos SVG
  const DashboardIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#4f46e5" : "none"} stroke={active ? "#4f46e5" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9"/>
      <rect x="14" y="3" width="7" height="5"/>
      <rect x="14" y="12" width="7" height="9"/>
      <rect x="3" y="16" width="7" height="5"/>
    </svg>
  );

  const SupportIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#4f46e5" : "none"} stroke={active ? "#4f46e5" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4"/>
      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
      <path d="M13 12h3l2-2-2-2h-3"/>
      <path d="M11 12H8l-2-2 2-2h3"/>
    </svg>
  );

  const HomeIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#4f46e5" : "none"} stroke={active ? "#4f46e5" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  );

  const ServicesIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#4f46e5" : "none"} stroke={active ? "#4f46e5" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );

  const HistoryIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#4f46e5" : "none"} stroke={active ? "#4f46e5" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </svg>
  );

  const navigationItems = [
    {
      id: 'admin',
      label: 'Admin',
      icon: DashboardIcon,
      path: '/admin',
      adminOnly: true
    },
    {
      id: 'support',
      label: 'Soporte',
      icon: SupportIcon,
      path: '/support'
    },
    {
      id: 'home',
      label: 'Inicio',
      icon: HomeIcon,
      path: '/dashboard'
    },
    {
      id: 'services',
      label: 'Servicios',
      icon: ServicesIcon,
      path: '/services'
    },
    {
      id: 'history',
      label: 'Historial',
      icon: HistoryIcon,
      path: '/historial'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname === path;
  };

  const styles = {
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e5e5',
      padding: '0.5rem 0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    },
    navItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '0.5rem 0.75rem',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      minWidth: '60px'
    },
    navItemActive: {
      backgroundColor: '#f0f0ff'
    },
    label: {
      fontSize: '0.75rem',
      marginTop: '0.25rem',
      fontWeight: '500'
    },
    labelActive: {
      color: '#4f46e5'
    },
    labelInactive: {
      color: '#666'
    }
  };

  // Filtrar elementos de navegación según el tipo de usuario
  const visibleItems = navigationItems.filter(item => {
    if (item.adminOnly) {
      return user?.tipo_usuario === 'administrador';
    }
    return true;
  });

  return (
    <div style={styles.container}>
      {visibleItems.map((item) => {
        const active = isActive(item.path);
        const IconComponent = item.icon;
        
        return (
          <div
            key={item.id}
            style={{
              ...styles.navItem,
              ...(active && styles.navItemActive)
            }}
            onClick={() => handleNavigation(item.path)}
            onMouseOver={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = '#f8f8f8';
              }
            }}
            onMouseOut={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <IconComponent active={active} />
            <span style={{
              ...styles.label,
              ...(active ? styles.labelActive : styles.labelInactive)
            }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavigation;