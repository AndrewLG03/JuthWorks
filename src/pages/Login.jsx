// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
    tipo_usuario: 'Personal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
      console.log('Login response (raw):', data); // <- VERIFICA qué te llega exactamente
      // data debería tener { user, token }
      login(data.user, data.token);
      // redirección
      if (data.user.tipo_usuario === 'administrador') navigate('/admin');
      else navigate('/dashboard');
    } else {
      setError(data.error || 'Error al iniciar sesión');
    }

    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Íconos SVG
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  const UserIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const BriefcaseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#4f46e5',
      lineHeight: '1.2',
      margin: '0'
    },
    underline: {
      width: '120px',
      height: '2px',
      backgroundColor: '#1f2937',
      margin: '0.5rem auto 0',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      padding: '2.5rem 2rem',
      width: '100%',
      maxWidth: '450px', // Aumentado para acomodar 3 opciones
    },
    formTitle: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '0.5rem',
      color: '#111827',
    },
    formSubtitle: {
      textAlign: 'center',
      color: '#6b7280',
      marginBottom: '2rem',
      fontSize: '0.95rem',
    },
    inputContainer: {
      marginBottom: '1.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 0',
      paddingRight: '2.5rem',
      border: 'none',
      borderBottom: '2px solid #d1d5db',
      backgroundColor: 'transparent',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: {
      borderBottomColor: '#4f46e5',
    },
    eyeButton: {
      position: 'absolute',
      right: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '0.25rem',
    },
    forgotPassword: {
      textAlign: 'right',
      marginBottom: '2rem',
    },
    forgotLink: {
      color: '#4f46e5',
      fontSize: '0.875rem',
      textDecoration: 'none',
    },
    userTypeContainer: {
      marginBottom: '2rem',
    },
    userTypeLabel: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    userTypeButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr', // Cambiado a 3 columnas
      gap: '0.75rem', // Reducido el gap
    },
    userTypeButton: {
      padding: '1.25rem 0.75rem', // Ajustado el padding
      borderRadius: '12px',
      border: '2px solid #d1d5db',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    userTypeButtonSelected: {
      borderColor: '#4f46e5',
      backgroundColor: '#ede9fe',
    },
    iconContainer: {
      width: '50px', // Reducido el tamaño
      height: '50px',
      borderRadius: '12px',
      border: '2px dashed #9ca3af',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.5rem', // Reducido el margen
      backgroundColor: '#f9fafb',
    },
    userTypeText: {
      fontWeight: '500',
      fontSize: '0.85rem', // Reducido el tamaño de fuente
      color: '#374151',
      textAlign: 'center',
    },
    button: {
      width: '100%',
      padding: '1rem',
      borderRadius: '50px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '1rem',
    },
    submitButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
    },
    submitButtonHover: {
      backgroundColor: '#4338ca',
    },
    registerButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
    },
    registerButtonHover: {
      backgroundColor: '#4338ca',
    },
    loading: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    errorMessage: {
      marginBottom: '1rem',
      padding: '0.75rem',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '8px',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          Juth<br />
          Works
        </h1>
        <div style={styles.underline}></div>
      </div>
      
      {/* Login Form */}
      <div style={styles.card}>
        <h2 style={styles.formTitle}>Inicia Sesión</h2>
        <p style={styles.formSubtitle}>Ingresa tu usuario y contraseña</p>
        
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Usuario Input */}
          <div style={styles.inputContainer}>
            <input
              name="usuario"
              type="text"
              style={styles.input}
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Usuario"
              required
            />
          </div>
          
          {/* Contraseña Input */}
          <div style={{...styles.inputContainer, position: 'relative'}}>
            <input
              name="contrasena"
              type={showPassword ? "text" : "password"}
              style={styles.input}
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          
          {/* Forgot Password */}
          <div style={styles.forgotPassword}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          {/* User Type Selection */}
          <div style={styles.userTypeContainer}>
            <label style={styles.userTypeLabel}>
              Indicar tipo de Usuario
            </label>
            <div style={styles.userTypeButtons}>
              <button
                type="button"
                style={{
                  ...styles.userTypeButton,
                  ...(formData.tipo_usuario === 'Personal' && styles.userTypeButtonSelected)
                }}
                onClick={() => setFormData({...formData, tipo_usuario: 'Personal'})}
              >
                <div style={styles.iconContainer}>
                  <UserIcon />
                </div>
                <span style={styles.userTypeText}>Personal</span>
              </button>
              
              <button
                type="button"
                style={{
                  ...styles.userTypeButton,
                  ...(formData.tipo_usuario === 'Empresa' && styles.userTypeButtonSelected)
                }}
                onClick={() => setFormData({...formData, tipo_usuario: 'Empresa'})}
              >
                <div style={styles.iconContainer}>
                  <BriefcaseIcon />
                </div>
                <span style={styles.userTypeText}>Empresa</span>
              </button>

              <button
                type="button"
                style={{
                  ...styles.userTypeButton,
                  ...(formData.tipo_usuario === 'administrador' && styles.userTypeButtonSelected)
                }}
                onClick={() => setFormData({...formData, tipo_usuario: 'administrador'})}
              >
                <div style={styles.iconContainer}>
                  <ShieldIcon />
                </div>
                <span style={styles.userTypeText}>Admin</span>
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            style={{
              ...styles.button,
              ...styles.submitButton,
              ...(loading && styles.loading)
            }}
            disabled={loading}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#4338ca')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#4f46e5')}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          
          {/* Register Button */}
          <Link to="/register">
            <button 
              type="button"
              style={{
                ...styles.button,
                ...styles.registerButton
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
            >
              Regístrate
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;