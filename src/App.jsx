// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import History from './pages/History';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/Settings';
import { UserProvider } from './context/UserContext';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail    from './pages/VerifyEmail';
import ResetPassword  from './pages/ResetPassword';
import Comments from './pages/Comments';
import NewRequestsPage from './pages/NewRequestsPage';
import PendingQuotesPage from './pages/PendingQuotesPage';
import BottomNavigation from './components/BottomNavigation';
import Payment from './pages/Payment';
import Onboarding from './pages/Onboarding'; // <-- 1. AÑADIR ESTA LÍNEA
import Support from './pages/Support';

// Componente temporal para rutas que aún no existen 
const ComingSoon = ({ pageName }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}>
    <h1 style={{ color: '#4f46e5', marginBottom: '1rem' }}>
      {pageName}
    </h1>
    <p style={{ color: '#6b7280' }}>
      Esta página está en desarrollo
    </p>
  </div>
);

// Estilos globales
const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  body: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    backgroundColor: '#f8fafc',
    overflowX: 'hidden'
  },
  '@media (max-width: 640px)': {
    'input, select, textarea': {
      fontSize: '16px'
    }
  }
};

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.tipo_usuario !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // 👇 2. RESTAURAR ESTA LÓGICA
  // Si no ha hecho el onboarding y no está ya en /onboarding, se redirige
  if (user.onboarded === 0 && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};


// Layout principal (simplificado por ahora)
const MainLayout = ({ children }) => {
  return (
    <div style={{ paddingBottom: '70px', minHeight: '100vh' }}>
      {children}
      <BottomNavigation />
    </div>
  );
};

function App() {
  // Aplicar estilos globales
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = Object.entries(globalStyles)
      .map(([selector, properties]) => {
        if (typeof properties === 'string') return selector;
        
        const props = Object.entries(properties)
          .map(([prop, value]) => `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
          .join(' ');
          
        return `${selector} { ${props} }`;
      })
      .join('\n');
      
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/historial" element={
            <ProtectedRoute>
              <MainLayout>
                <History />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Rutas protegidas con layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* 👇 3. AÑADIR LA RUTA DE ONBOARDING */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding onComplete={() => window.location.href = '/dashboard'} />
            </ProtectedRoute>
          } />


          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <ComingSoon pageName="Perfil" />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/services" element={
            <ProtectedRoute>
              <MainLayout>
                <Services />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <MainLayout>
                <ComingSoon pageName="Órdenes" />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/comments" element={
            <ProtectedRoute>
              <MainLayout>
                <Comments />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/support" element={
            <ProtectedRoute>
              <MainLayout>
                <Support />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Rutas de administrador */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="administrador">
              <MainLayout>
                <AdminPanel />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/solicitudes-nuevas" element={
            <ProtectedRoute requiredRole="administrador">
              <MainLayout>
                <NewRequestsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/presupuestos-pendientes" element={
            <ProtectedRoute requiredRole="administrador">
              <MainLayout>
                <PendingQuotesPage />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Payment page */}
          <Route
            path="/payment/:solicitudId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Payment />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="administrador">
              <MainLayout>
                <ComingSoon pageName="Gestión de Usuarios" />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;