// frontend/src/pages/Onboarding.jsx
import React, { useState } from 'react';
import { userService, apiHelpers } from '../api';

const finishOnboarding = async () => {
  // 1. Actualizar el estado en el servidor.
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
  
  // 3. Llamar a la función onComplete para redirigir al dashboard.
  if (onComplete) {
    onComplete();
  }

  // La UI es la del modal, pero renderizada como una página completa.
  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 12, textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>Bienvenido a JuthWorks</h2>
          <p style={{ margin: 0, color: '#666' }}>Te mostramos cómo empezar en {totalSteps} pasos</p>
        </div>

        {/* Contenido del paso actual */}
        <div style={{ margin: '20px 0', minHeight: '80px', textAlign: 'center' }}>
          <h3>{stepsContent[step].title}</h3>
          <p>{stepsContent[step].description}</p>
        </div>

        {/* Indicador de progreso */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '16px 0' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              width: i === step ? '25px' : '10px',
              height: '10px',
              borderRadius: '5px',
              backgroundColor: i === step ? '#2563eb' : '#ccc',
              transition: 'width 0.3s ease'
            }}></div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' }}>
          {/* El botón de saltar ahora también finaliza el proceso */}
          <button onClick={finishOnboarding} style={btnStyleSecondary}>Saltar</button>

          {/* Botones de navegación */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={btnStyle}>Anterior</button>
            )}
            {step < totalSteps - 1 ? (
              <button onClick={() => setStep(s => s + 1)} style={btnStyle}>Siguiente</button>
            ) : (
              <button onClick={finishOnboarding} style={btnStyle}>Empezar</button>
            )}
          </div>
        </div>

        <div style={{ marginTop: 12, textAlign: 'center', color: '#999' }}>
          <small>Puedes ver esto de nuevo en Ajustes.</small>
        </div>
      </div>
    </div>
  );
}

// Estilos para que la página se vea como un modal superpuesto
const overlayStyle = {
  position: 'fixed', inset: 0, background: '#f0f4ff', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const cardStyle = {
  width: '90%', maxWidth: 420, background: '#fff', borderRadius: 12, padding: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column'
};
const btnStyle = {
  background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold'
};
const btnStyleSecondary = {
  background: 'transparent', color: '#555', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer'
};
