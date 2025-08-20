// frontend/src/components/OnboardingModal.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

// Clave para guardar en localStorage y no volver a mostrar el onboarding.
const LOCAL_KEY = 'hasSeenOnboarding_v1';

export default function OnboardingModal() {
  const { user, token, fetchWithAuth, updateUser } = useUser();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Si el usuario ya lo vio en esta sesión (localStorage), no hacer nada.
    const hasSeenLocally = localStorage.getItem(LOCAL_KEY);
    if (hasSeenLocally === 'true') {
      return;
    }

    // Si tenemos un usuario desde el contexto, verificamos su estado de onboarding.
    if (user) {
        // Si el estado del usuario ya dice que completó el onboarding,
        // lo guardamos en localStorage y no mostramos el modal.
        if (user.onboarded) {
            localStorage.setItem(LOCAL_KEY, 'true');
            setVisible(false);
        } else {
            // Si no lo ha completado, mostramos el modal.
            setVisible(true);
        }
    }
    // Si no hay usuario (es anónimo o está cargando), no se muestra.
    // Puedes cambiar esta lógica si quieres mostrarlo a usuarios anónimos.
  }, [user]); // El efecto se ejecuta cuando el estado del usuario cambia.

  if (!visible) return null;

  const totalSteps = 3;

  // Función para finalizar el onboarding
  const finish = async () => {
    // 1. Marcar como visto en localStorage para que no vuelva a aparecer en esta sesión.
    localStorage.setItem(LOCAL_KEY, 'true');
    
    // 2. Si hay un usuario logueado, enviar la actualización al servidor.
    if (token) {
      try {
        await fetchWithAuth('/api/users/me/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onboarded: true })
        });
        // 3. Actualizar el estado del usuario en el contexto global de la app.
        updateUser({ ...user, onboarded: 1 });
      } catch (e) {
        console.warn('No se pudo sincronizar el estado de onboarding con el servidor.', e);
      }
    }
    
    // 4. Ocultar el modal.
    setVisible(false);
  };

  // Función para saltar el tutorial
  const skip = () => {
    // Al saltar, también lo consideramos finalizado.
    finish();
  };

  const stepsContent = [
    {
      title: 'Paso 1: Crea una solicitud',
      description: 'Elige el servicio que necesitas, agrega una descripción detallada y adjunta fotos para mayor claridad.'
    },
    {
      title: 'Paso 2: Sube tus fotos',
      description: 'Añade imágenes desde tu dispositivo. Esto ayuda al técnico a entender mejor el problema antes de llegar.'
    },
    {
      title: 'Paso 3: Revisa y Chatea',
      description: 'Puedes ver el estado de tu solicitud en "Mis Solicitudes" y comunicarte directamente con el personal asignado.'
    }
  ];

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: 12, textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>Bienvenido a JuthWorks</h2>
          <p style={{ margin: 0, color: '#666' }}>Te mostramos cómo empezar en {totalSteps} pasos</p>
        </div>

        {/* Contenido del paso actual */}
        <div style={{ margin: '20px 0', minHeight: '80px' }}>
          <h3>{stepsContent[step].title}</h3>
          <p>{stepsContent[step].description}</p>
        </div>

        {/* Indicador de progreso */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '16px 0' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: i === step ? '#2563eb' : '#ccc'
                }}></div>
            ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' }}>
          {/* Botón de Saltar siempre visible */}
          <button onClick={skip} style={btnStyleSecondary}>Saltar</button>

          {/* Botones de navegación */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={btnStyleSecondary}>Anterior</button>
            )}
            {step < totalSteps - 1 ? (
              <button onClick={() => setStep(s => s + 1)} style={btnStyle}>Siguiente</button>
            ) : (
              <button onClick={finish} style={btnStyle}>Empezar</button>
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

// Estilos (mejorados ligeramente para centrar)
const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const cardStyle = {
  width: '90%', maxWidth: 420, background: '#fff', borderRadius: 12, padding: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
};
const btnStyle = {
  background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold'
};
const btnStyleSecondary = {
  background: 'transparent', color: '#555', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer'
};
