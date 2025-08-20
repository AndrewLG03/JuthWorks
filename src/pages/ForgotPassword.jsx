// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // ✅ usamos api.js

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // ✅ llamada real al backend
      await api.post('/auth/forgot-password', { email });

      setSuccess(true);

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };
 
  // Estilos
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      width: '100%',
      maxWidth: '28rem',
      textAlign: 'center',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1e40af',
    },
    description: {
      color: '#6b7280',
      marginBottom: '1.5rem',
    },
    inputContainer: {
      position: 'relative',
      marginBottom: '1.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
    },
    label: {
      position: 'absolute',
      left: '0.75rem',
      top: '0.75rem',
      color: '#9ca3af',
      pointerEvents: 'none',
      transition: 'all 0.2s ease',
    },
    labelFocused: {
      top: '0.25rem',
      fontSize: '0.75rem',
      color: '#2563eb',
    },
    button: {
      padding: '0.75rem',
      backgroundColor: '#2563eb',
      color: 'white',
      borderRadius: '0.5rem',
      fontWeight: '500',
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
    },
    buttonDisabled: {
      opacity: '0.7',
      cursor: 'not-allowed',
    },
    backLink: {
      display: 'block',
      marginTop: '1rem',
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500',
    },
    successMessage: {
      color: '#059669',
      backgroundColor: '#d1fae5',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Recuperar Contraseña</h1>
        
        {success ? (
          <>
            <div style={styles.successMessage}>
              Se ha enviado un enlace de recuperación a tu correo electrónico.
            </div>
            <p>Serás redirigido a la página de inicio de sesión en breve...</p>
          </>
        ) : (
          <>
            <p style={styles.description}>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            
            {error && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                borderRadius: '0.5rem',
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={styles.inputContainer}>
                <input
                  type="email"
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label 
                  style={email ? {...styles.label, ...styles.labelFocused} : styles.label}
                >
                  Correo Electrónico*
                </label>
              </div>
              
              <button 
                type="submit"
                style={{
                  ...styles.button,
                  ...(loading && styles.buttonDisabled)
                }}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          </>
        )}
        
        <Link to="/login" style={styles.backLink}>
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;