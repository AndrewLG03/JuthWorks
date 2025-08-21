// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Onboarding from './pages/Onboarding'; 
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

// Componente para verificar onboarding
const OnboardingChecker = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // Si el usuario no ha completado onboarding y no está en la página de onboarding
  if (user && user.onboarded === 0 && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
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
  
  return children;
};

// Layout principal
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
          
          {/* Ruta de onboarding - protegida pero sin verificación de onboarding */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          
          {/* Rutas protegidas con verificación de onboarding y layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <OnboardingChecker>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/historial" element={
            <ProtectedRoute>
              <OnboardingChecker>
                <MainLayout>
                  <History />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <OnboardingChecker>
                <MainLayout>
                  <ComingSoon pageName="Perfil" />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/services" element={
            <ProtectedRoute>
              <OnboardingChecker>
                <MainLayout>
                  <Services />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <OnboardingChecker>
                <MainLayout>
                  <ComingSoon pageName="Órdenes" />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/comments" element={
            <ProtectedRoute>
              <OnboardingChecker>
                <MainLayout>
                  <Comments />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/support" element={
            <ProtectedRoute>
              <OnboardingChecker>
                <MainLayout>
                  <Support />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <OnboardingChecker>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          {/* Rutas de administrador */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="administrador">
              <OnboardingChecker>
                <MainLayout>
                  <AdminPanel />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/solicitudes-nuevas" element={
            <ProtectedRoute requiredRole="administrador">
              <OnboardingChecker>
                <MainLayout>
                  <NewRequestsPage />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/presupuestos-pendientes" element={
            <ProtectedRoute requiredRole="administrador">
              <OnboardingChecker>
                <MainLayout>
                  <PendingQuotesPage />
                </MainLayout>
              </OnboardingChecker>
            </ProtectedRoute>
          } />

          {/* Payment page */}
          <Route
            path="/payment/:solicitudId"
            element={
              <ProtectedRoute>
                <OnboardingChecker>
                  <MainLayout>
                    <Payment />
                  </MainLayout>
                </OnboardingChecker>
              </ProtectedRoute>
            }
          />
          
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="administrador">
              <OnboardingChecker>
                <MainLayout>
                  <ComingSoon pageName="Gestión de Usuarios" />
                </MainLayout>
              </OnboardingChecker>
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