// frontend/src/pages/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, apiHelpers } from '../api';

const Onboarding = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const stepsContent = [
    {
      title: "¡Bienvenido a JuthWorks! 🎉",
      description: "Tu plataforma confiable para servicios de reparación y mantenimiento. Te mostraremos cómo empezar."
    },
    {
      title: "Solicita Servicios 🔧",
      description: "Navega por nuestros servicios y solicita el que necesites. Recibirás una cotización rápidamente."
    },
    {
      title: "Seguimiento en Tiempo Real 📱",
      description: "Mantente informado del progreso de tu solicitud desde el panel principal y el historial."
    },
    {
      title: "Soporte Siempre Disponible 💬",
      description: "¿Tienes dudas? Usa nuestra sección de comentarios y soporte para contactarnos."
    }
  ];

  const finishOnboarding = async () => {
    try {
      // 1. Actualizar el estado en el servidor
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (token && user) {
        try {
          await userService.updateOnboarding(true);
        } catch (error) {
          const errorDetails = apiHelpers.handleError(error);
          console.warn('No se pudo guardar el estado de onboarding en el servidor:', errorDetails.message);
        }
      }
      
      // 2. Actualizar el usuario en localStorage
      if (user) {
        user.onboarded = 1;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // 3. Redirigir al dashboard
      if (onComplete) {
        onComplete();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error finishing onboarding:', error);
      // Aún así redirigir al dashboard
      navigate('/dashboard');
    }
  };

  // Estilos para que la página se vea como un modal superpuesto
  const overlayStyle = {
    position: 'fixed', 
    inset: 0, 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 9999,
    padding: '1rem'
  };

  const cardStyle = {
    width: '90%', 
    maxWidth: 420, 
    background: '#fff', 
    borderRadius: 16, 
    padding: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
    display: 'flex', 
    flexDirection: 'column'
  };

  const btnStyle = {
    background: '#2563eb', 
    color: '#fff', 
    border: 'none', 
    padding: '12px 20px', 
    borderRadius: 8, 
    cursor: 'pointer', 
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };

  const btnStyleSecondary = {
    background: 'transparent', 
    color: '#666', 
    border: 'none', 
    padding: '12px 16px', 
    borderRadius: 8, 
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            color: '#1a202c',
            fontSize: '24px',
            fontWeight: '700'
          }}>
            Bienvenido a JuthWorks
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#666',
            fontSize: '16px'
          }}>
            Te mostramos cómo empezar en {totalSteps} pasos
          </p>
        </div>

        {/* Contenido del paso actual */}
        <div style={{ 
          margin: '24px 0', 
          minHeight: '120px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h3 style={{
            color: '#2563eb',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            {stepsContent[step].title}
          </h3>
          <p style={{
            color: '#4a5568',
            fontSize: '16px',
            lineHeight: '1.5',
            margin: 0
          }}>
            {stepsContent[step].description}
          </p>
        </div>

        {/* Indicador de progreso */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          margin: '20px 0' 
        }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              width: i === step ? '30px' : '10px',
              height: '10px',
              borderRadius: '5px',
              backgroundColor: i === step ? '#2563eb' : '#e2e8f0',
              transition: 'all 0.3s ease'
            }}></div>
          ))}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: 20, 
          alignItems: 'center' 
        }}>
          {/* Botón de saltar */}
          <button 
            onClick={finishOnboarding} 
            style={btnStyleSecondary}
            onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.color = '#666'}
          >
            Saltar
          </button>

          {/* Botones de navegación */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {step > 0 && (
              <button 
                onClick={() => setStep(s => s - 1)} 
                style={{
                  ...btnStyle,
                  background: '#e2e8f0',
                  color: '#4a5568'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#cbd5e0'}
                onMouseOut={(e) => e.currentTarget.style.background = '#e2e8f0'}
              >
                Anterior
              </button>
            )}
            {step < totalSteps - 1 ? (
              <button 
                onClick={() => setStep(s => s + 1)} 
                style={btnStyle}
                onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
              >
                Siguiente
              </button>
            ) : (
              <button 
                onClick={finishOnboarding} 
                style={{
                  ...btnStyle,
                  background: '#059669'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#047857'}
                onMouseOut={(e) => e.currentTarget.style.background = '#059669'}
              >
                ¡Empezar!
              </button>
            )}
          </div>
        </div>

        <div style={{ 
          marginTop: 16, 
          textAlign: 'center', 
          color: '#9ca3af',
          fontSize: '12px'
        }}>
          <small>Puedes ver esto de nuevo en Configuración.</small>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;