// frontend/src/pages/Services.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Settings, Camera, ArrowLeft, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { useUser } from '../context/UserContext';
import { servicesService, apiHelpers } from '../api';

const Services = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const fileInputRef = useRef(null);
  
  // Estados del componente
  const [currentService, setCurrentService] = useState('construccion');
  const [currentStep, setCurrentStep] = useState(1);
  const [maintenanceType, setMaintenanceType] = useState('electrico');
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  // Configuración de tipos de mantenimiento
  const maintenanceTypes = {
    electrico: 'Mantenimiento Eléctrico',
    plomeria: 'Plomería',
    general: 'Mantenimiento General'
  };

  // Descripciones de servicios
  const serviceDescriptions = {
    construccion: `Construcción completa desde cero para tu hogar o negocio.

• Planificación y diseño arquitectónico
• Gestión de permisos y documentación
• Construcción con materiales de calidad
• Supervisión técnica especializada
• Entrega con garantías completas

Perfecto para proyectos nuevos que requieren una construcción integral desde los cimientos.`,
    
    remodelacion: `Transformamos y modernizamos tus espacios existentes.

• Remodelación de cocinas y baños
• Ampliaciones y modificaciones
• Cambio de pisos y acabados
• Actualización de instalaciones
• Diseño de interiores personalizado

Ideal para renovar, ampliar o modernizar tu hogar sin partir de cero.`,
    
    mantenimiento: `Servicios especializados de mantenimiento y reparación.

• Reparaciones eléctricas y de plomería
• Mantenimiento preventivo
• Solución de problemas urgentes
• Instalaciones y conexiones
• Revisiones técnicas periódicas

Perfecto para mantener tu hogar en óptimas condiciones y solucionar problemas específicos.`
  };

  // Función para obtener servicios
  const fetchServices = async () => {
    try {
      const servicesData = await servicesService.getServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      const errorDetails = apiHelpers.handleError(error);
      // Manejar error apropiadamente
    }
  };

  // Efecto para cargar servicios al montar el componente
  useEffect(() => {
    fetchServices();
  }, []);

  // Manejar carga de fotos
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (selectedPhotos.length + files.length > 5) {
      alert('Máximo 5 fotos permitidas');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} es muy grande. Máximo 5MB por foto.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedPhotos(prev => [...prev, ...validFiles]);
      
      // Crear previews
      const newPreviews = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      
      setPhotoPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Remover foto
  const removePhoto = (index) => {
    // Liberar URL del objeto
    URL.revokeObjectURL(photoPreviews[index].url);
    
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Manejar navegación hacia atrás
  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate('/');
    }
  };

  // Manejar siguiente paso
  const handleNext = () => {
    if (currentService === 'mantenimiento' && !maintenanceType) {
      alert('Selecciona un tipo de mantenimiento');
      return;
    }
    setCurrentStep(2);
  };

  // Manejar envío del servicio
  const handleSubmitService = async () => {
    if (!user) {
      alert('Debes estar logueado para solicitar un servicio');
      return;
    }
    if (!title.trim() || !description.trim()) {
      alert('El título y la descripción son obligatorios');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Determinar el tipo de servicio y descripción final
      let finalDescription = description;
      if (currentService === 'mantenimiento') {
        finalDescription = `${maintenanceTypes[maintenanceType]}: ${description}`;
      }
      
      const serviceMap = {
        construccion: 1,
        remodelacion: 2,
        mantenimiento: 3
      };
      
      const serviceId = serviceMap[currentService];
      
      // Crear la solicitud de servicio
      const serviceData = {
        usuario_id: user.id,
        servicio_id: serviceId,
        descripcion: `${title} - ${finalDescription}`
      };
      
      const result = await servicesService.requestService(serviceData);
      const solicitudId = result.solicitudId;
      
      // Si hay fotos, subirlas
      if (selectedPhotos.length > 0) {
        try {
          await servicesService.uploadPhotos(solicitudId, selectedPhotos);
        } catch (photoError) {
          console.error('Error al subir fotos:', photoError);
        }
      }
      
      alert('¡Solicitud de servicio enviada exitosamente!');
      navigate('/orders');
    } catch (error) {
      console.error('Error:', error);
      const errorDetails = apiHelpers.handleError(error);
      alert('Error al enviar solicitud: ' + (errorDetails.data?.error || errorDetails.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente Header
  const Header = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e5e5',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <ArrowLeft 
        style={{ width: '24px', height: '24px', color: '#6b7280', cursor: 'pointer' }}
        onClick={handleBack}
      />
      <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', letterSpacing: '-0.025em' }}>
        {currentStep === 1 ? 'Juth Works' : 'Detalles del Servicio'}
      </h1>
      <Settings 
        style={{ width: '24px', height: '24px', color: '#6b7280', cursor: 'pointer' }}
        onClick={() => navigate('/settings')}
      />
    </div>
  );

  // Componente para el paso 1: Selección de servicio
  const ServiceSelection = () => (
    <>
      <InfoSection />
      <ServiceTabs />
      <ServiceContent />
      <DescriptionBox service={currentService} />
      {currentService === 'mantenimiento' && <MaintenanceTypeSelector />}
      <NextButton />
    </>
  );

  // Componente para el paso 2: Detalles del servicio
  const ServiceDetails = () => (
    <div style={{ padding: '24px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#1f2937', 
          marginBottom: '8px',
          letterSpacing: '-0.025em'
        }}>
          {currentService === 'construccion' && 'Construcción desde Cero'}
          {currentService === 'remodelacion' && 'Remodelación'}
          {currentService === 'mantenimiento' && maintenanceTypes[maintenanceType]}
        </h2>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Completa los detalles de tu solicitud
        </p>
      </div>

      {/* Sección de fotos */}
      <div style={{ 
        marginBottom: '32px', 
        backgroundColor: '#fff', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '16px', 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '16px'
        }}>
          📷 Fotos (Opcional)
        </label>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f9fafb',
            transition: 'all 0.3s ease'
          }}
        >
          <Upload style={{ width: '40px', height: '40px', color: '#6b7280', margin: '0 auto 12px' }} />
          <p style={{ color: '#374151', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
            Toca para subir fotos
          </p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Máximo 5 fotos, 5MB cada una
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          style={{ display: 'none' }}
        />

        {/* Vista previa de fotos */}
        {selectedPhotos.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
              gap: '12px' 
            }}>
              {photoPreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={preview.url}
                    alt={`Preview ${index}`}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb'
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <X style={{ width: '14px', height: '14px', color: '#fff' }} />
                  </button>
                </div>
              ))}
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
              {selectedPhotos.length} foto(s) seleccionada(s)
            </p>
          </div>
        )}
      </div>

      {/* Campo de título */}
      <div style={{ 
        marginBottom: '24px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '12px', 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '16px'
        }}>
          ✏️ Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setTitleFocused(true)}
          onBlur={() => setTitleFocused(false)}
          placeholder="Ej: Reparación de baño principal"
          style={{
            width: '100%',
            padding: '16px',
            border: `2px solid ${titleFocused ? '#4f46e5' : '#e5e7eb'}`,
            borderRadius: '12px',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backgroundColor: titleFocused ? '#fafafa' : '#fff',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Campo de descripción */}
      <div style={{ 
        marginBottom: '32px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '12px', 
          fontWeight: '600', 
          color: '#1f2937',
          fontSize: '16px'
        }}>
          📝 Descripción *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={() => setDescriptionFocused(true)}
          onBlur={() => setDescriptionFocused(false)}
          placeholder="Describe detalladamente lo que necesitas..."
          rows={5}
          style={{
            width: '100%',
            padding: '16px',
            border: `2px solid ${descriptionFocused ? '#4f46e5' : '#e5e7eb'}`,
            borderRadius: '12px',
            fontSize: '16px',
            outline: 'none',
            resize: 'vertical',
            minHeight: '120px',
            transition: 'all 0.3s ease',
            backgroundColor: descriptionFocused ? '#fafafa' : '#fff',
            fontFamily: 'inherit',
            lineHeight: '1.5'
          }}
        />
      </div>

      {/* Botón de enviar */}
      <button 
        onClick={handleSubmitService}
        disabled={isSubmitting || !title.trim() || !description.trim()}
        style={{
          width: '100%',
          background: isSubmitting || !title.trim() || !description.trim() 
            ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
            : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#fff',
          padding: '18px 0',
          borderRadius: '16px',
          border: 'none',
          fontWeight: '700',
          fontSize: '18px',
          cursor: isSubmitting || !title.trim() || !description.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          letterSpacing: '0.025em',
          transform: 'translateY(0)'
        }}
      >
        {isSubmitting ? '⏳ Enviando...' : '🚀 Enviar Solicitud'}
      </button>
    </div>
  );

  const InfoSection = () => (
    <div style={{ margin: '20px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #7c2d92 0%, #9333ea 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(124, 45, 146, 0.3)'
        }}>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Juth</span>
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
    </div>
  );

  const ServiceIcon = ({ type }) => {
    const iconStyle = { width: '56px', height: '56px', color: '#fff' };
    
    if (type === 'construccion' || type === 'remodelacion') {
      return (
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.3)'
        }}>
          <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      );
    }
    
    return null;
  };

  const MaintenanceIcons = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '32px' }}>
      <div style={{
        width: '76px',
        height: '76px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)'
      }}>
        <svg style={{ width: '40px', height: '40px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div style={{
        width: '76px',
        height: '76px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
      }}>
        <svg style={{ width: '40px', height: '40px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </div>
      <div style={{
        width: '76px',
        height: '76px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
      }}>
        <svg style={{ width: '40px', height: '40px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    </div>
  );

  const DescriptionBox = ({ service }) => (
    <div style={{ margin: '0 20px 32px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '16px',
        padding: '32px',
        minHeight: '140px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          color: '#374151', 
          fontSize: '15px', 
          lineHeight: '1.7',
          whiteSpace: 'pre-line'
        }}>
          {serviceDescriptions[service]}
        </div>
      </div>
    </div>
  );

  const MaintenanceTypeSelector = () => (
    <div style={{ margin: '0 20px 32px' }}>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: '#1f2937', 
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        Tipo de Mantenimiento
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(maintenanceTypes).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMaintenanceType(key)}
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              border: `2px solid ${maintenanceType === key ? '#4f46e5' : '#e5e7eb'}`,
              background: maintenanceType === key 
                ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
                : '#fff',
              color: maintenanceType === key ? '#fff' : '#374151',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              boxShadow: maintenanceType === key 
                ? '0 10px 15px -3px rgba(79, 70, 229, 0.3)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  const NextButton = () => (
    <div style={{ padding: '0 20px 32px' }}>
      <button 
        onClick={handleNext}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#fff',
          padding: '16px 0',
          borderRadius: '16px',
          border: 'none',
          fontWeight: '700',
          fontSize: '18px',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
          transition: 'all 0.3s ease',
          letterSpacing: '0.025em'
        }}
      >
        ➡️ Siguiente
      </button>
    </div>
  );

  const ServiceTabs = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '20px', flexWrap: 'wrap' }}>
      <button
        onClick={() => setCurrentService('construccion')}
        style={{
          padding: '12px 20px',
          borderRadius: '25px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: currentService === 'construccion' 
            ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
            : '#e5e7eb',
          color: currentService === 'construccion' ? '#fff' : '#374151',
          boxShadow: currentService === 'construccion' 
            ? '0 8px 12px -2px rgba(79, 70, 229, 0.3)' 
            : 'none'
        }}
      >
        🏗️ Construcción desde Cero
      </button>
      <button
        onClick={() => setCurrentService('remodelacion')}
        style={{
          padding: '12px 20px',
          borderRadius: '25px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: currentService === 'remodelacion' 
            ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
            : '#e5e7eb',
          color: currentService === 'remodelacion' ? '#fff' : '#374151',
          boxShadow: currentService === 'remodelacion' 
            ? '0 8px 12px -2px rgba(79, 70, 229, 0.3)' 
            : 'none'
        }}
      >
        🔨 Remodelación
      </button>
      <button
        onClick={() => setCurrentService('mantenimiento')}
        style={{
          padding: '12px 20px',
          borderRadius: '25px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: currentService === 'mantenimiento' 
            ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
            : '#e5e7eb',
          color: currentService === 'mantenimiento' ? '#fff' : '#374151',
          boxShadow: currentService === 'mantenimiento' 
            ? '0 8px 12px -2px rgba(79, 70, 229, 0.3)' 
            : 'none'
        }}
      >
        🔧 Mantenimiento
      </button>
    </div>
  );

  const ServiceContent = () => {
    const titles = {
      construccion: 'Construcción desde Cero',
      remodelacion: 'Remodelación',
      mantenimiento: 'Mantenimiento'
    };

    return (
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#1f2937', 
          marginBottom: '20px',
          letterSpacing: '-0.025em'
        }}>
          {titles[currentService]}
        </h2>
        {currentService === 'mantenimiento' ? <MaintenanceIcons /> : <ServiceIcon type={currentService} />}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#fafafa'
    }}>
      <Header />
      
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: currentStep === 1 ? '#fff' : '#fafafa' }}>
        {currentStep === 1 ? <ServiceSelection /> : <ServiceDetails />}
      </div>

      {/* Bottom Navigation - solo mostrar en el paso 1 */}
      {currentStep === 1 && <BottomNavigation />}
    </div>
  );
};

export default Services;