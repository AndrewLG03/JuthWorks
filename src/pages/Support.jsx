// frontend/src/pages/Support.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import BottomNavigation from '../components/BottomNavigation';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, Send, CheckCircle } from 'lucide-react';

    const Support = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    
    // Estados para el formulario de contacto
    const [formData, setFormData] = useState({
        asunto: '',
        mensaje: '',
        tipo: 'consulta' // consulta, problema, sugerencia
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    // Enviar formulario de soporte
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.asunto.trim() || !formData.mensaje.trim()) {
        setError('Por favor, completa todos los campos obligatorios.');
        return;
        }

        try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5000/api/support', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
            ...formData,
            usuario_id: user?.id_usuario
            })
        });

        if (!response.ok) {
            throw new Error('Error al enviar el mensaje de soporte');
        }

        setSuccess(true);
        setFormData({
            asunto: '',
            mensaje: '',
            tipo: 'consulta'
        });

        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    const supportOptions = [
        {
        icon: <MessageCircle size={24} />,
        title: 'Chat en Vivo',
        description: 'Habla directamente con nuestro equipo',
        action: () => alert('Función de chat en desarrollo'),
        color: '#10b981'
        },
        {
        icon: <Phone size={24} />,
        title: 'Llamada Telefónica',
        description: '+506 8894-8567',
        action: () => window.open('tel:+50688948567'),
        color: '#3b82f6'
        },
        {
        icon: <Mail size={24} />,
        title: 'Email',
        description: 'soporte@juthworks.com',
        action: () => window.open('mailto:soporte@juthworks.com'),
        color: '#8b5cf6'
        },
        {
        icon: <HelpCircle size={24} />,
        title: 'Preguntas Frecuentes',
        description: 'Encuentra respuestas rápidas',
        action: () => alert('FAQ en desarrollo'),
        color: '#f59e0b'
        }
    ];

    return (
        <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingBottom: '80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column'
        }}>
        {/* Header */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            gap: '16px'
        }}>
            <button
            onClick={() => navigate(-1)}
            style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: 'none',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4a5568',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            >
            <ArrowLeft size={24} />
            </button>
            <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.025em'
            }}>
            🛟 Soporte
            </h1>
        </div>

        {/* Mensaje de Bienvenida */}
        <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '24px',
            margin: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
            <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.4)',
            flexShrink: 0
            }}>
            🛟
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
                ? `¡Hola, ${user.primer_nombre}!\n ¡Estamos aquí para ayudarte! 💪`
                : ''}
                
            </h2>
            <p style={{
                fontSize: '16px',
                color: '#4a5568',
                margin: 0,
                fontWeight: '500'
            }}>
                Elige cómo prefieres contactarnos o envíanos un mensaje.
            </p>
            </div>
        </div>

        {/* Contenido Principal */}
        <div style={{
            flex: 1,
            padding: '0 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}>
            {/* Opciones de Contacto */}
            <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
            }}>
            {supportOptions.map((option, index) => (
                <div
                key={index}
                onClick={option.action}
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                >
                <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: option.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                }}>
                    {option.icon}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: '0 0 4px 0'
                    }}>
                    {option.title}
                    </h3>
                    <p style={{
                    fontSize: '14px',
                    color: '#4a5568',
                    margin: 0
                    }}>
                    {option.description}
                    </p>
                </div>
                </div>
            ))}
            </div>

            {/* Formulario de Contacto */}
            <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
            <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0 0 20px 0',
                letterSpacing: '-0.025em'
            }}>
                📝 Envíanos un Mensaje
            </h2>

            {success && (
                <div style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                border: '1px solid #10b981',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
                }}>
                <CheckCircle size={20} color="#059669" />
                <span style={{ color: '#065f46', fontWeight: '600' }}>
                    ¡Mensaje enviado exitosamente! Te contactaremos pronto.
                </span>
                </div>
            )}

            {error && (
                <div style={{
                background: '#fed7d7',
                border: '1px solid #e53e3e',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
                color: '#c53030'
                }}>
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Tipo de Consulta */}
                <div>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                }}>
                    Tipo de Consulta
                </label>
                <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    backgroundColor: '#fff',
                    transition: 'border-color 0.3s ease',
                    fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                    <option value="consulta">💬 Consulta General</option>
                    <option value="problema">⚠️ Problema Técnico</option>
                    <option value="sugerencia">💡 Sugerencia</option>
                </select>
                </div>

                {/* Asunto */}
                <div>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                }}>
                    Asunto *
                </label>
                <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    placeholder="Describe brevemente tu consulta..."
                    style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    backgroundColor: '#fff',
                    transition: 'border-color 0.3s ease',
                    fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                </div>

                {/* Mensaje */}
                <div>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                }}>
                    Mensaje *
                </label>
                <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos más detalles sobre tu consulta..."
                    rows={5}
                    style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    backgroundColor: '#fff',
                    transition: 'border-color 0.3s ease',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                </div>

                {/* Botón Enviar */}
                <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '18px 32px',
                    background: loading 
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    letterSpacing: '0.025em'
                }}
                onMouseOver={(e) => {
                    if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                    }
                }}
                onMouseOut={(e) => {
                    if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                    }
                }}
                >
                {loading ? (
                    <>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid transparent',
                        borderTop: '2px solid #fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    Enviando...
                    </>
                ) : (
                    <>
                    <Send size={20} />
                    Enviar Mensaje
                    </>
                )}
                </button>
            </form>
            </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Keyframes para animaciones */}
        <style>{`
            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
        `}</style>
        </div>
    );
    };

export default Support;