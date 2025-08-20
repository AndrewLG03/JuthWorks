// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Validar fuerza de contraseña acorde al backend
const validatePassword = password => {
  const minLength = 8;
  const errors = [];
  if (password.length < minLength) errors.push(`Debe tener al menos ${minLength} caracteres`);
  if (!/[A-Z]/.test(password)) errors.push('Debe contener al menos una letra mayúscula');
  if (!/[a-z]/.test(password)) errors.push('Debe contener al menos una letra minúscula');
  if (!/\d/.test(password)) errors.push('Debe contener al menos un número');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Debe contener al menos un carácter especial');
  return errors;
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cedula: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    email: '',
    usuario: '',
    contrasena: '',
    tipo_usuario: 'Personal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setPasswordErrors([]);
  };

  const validateForm = () => {
    const required = ['cedula', 'primer_nombre', 'primer_apellido', 'email', 'usuario', 'contrasena'];
    for (let field of required) {
      if (!formData[field]) {
        setError('Todos los campos marcados con * son obligatorios');
        return false;
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Correo electrónico inválido');
      return false;
    }
    const pwdErrors = validatePassword(formData.contrasena);
    if (pwdErrors.length) {
      setPasswordErrors(pwdErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setPasswordErrors([]);
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log('Register response:', data);

      if (res.ok) {
        if (data.needsVerification) {
          if (data.userId) {
            // **CAMBIO CLAVE**: Redirigir a la página de verificación dedicada.
            // Pasamos el userId como un parámetro en la URL.
            navigate(`/verify-email?userId=${data.userId}`);
          } else {
            setError('ID de usuario no recibido del servidor para verificación');
            console.error('Missing userId in response', data);
          }
        } else {
          // Si no necesita verificación, va directo al login.
          navigate('/login');
        }
      } else {
        console.warn('Register failed:', data);
        if (data.passwordErrors) setPasswordErrors(data.passwordErrors);
        setError(data.error || `Error ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error('Register fetch error:', err);
      setError('No se pudo conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  // Íconos SVG (sin cambios)
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const UserIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const BriefcaseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );

  // Estilos (sin cambios)
  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'system-ui, -apple-system, sans-serif' },
    header: { textAlign: 'center', marginBottom: '2rem' },
    title: { fontSize: '3rem', fontWeight: 'bold', color: '#4f46e5', lineHeight: '1.2', margin: '0' },
    underline: { width: '120px', height: '2px', backgroundColor: '#1f2937', margin: '0.5rem auto 0' },
    card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '2rem 1.5rem', width: '100%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto' },
    formTitle: { fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', color: '#111827' },
    formSubtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' },
    inputContainer: { marginBottom: '1.25rem' },
    input: { width: '100%', padding: '0.75rem 0', paddingRight: '2.5rem', border: 'none', borderBottom: '2px solid #d1d5db', backgroundColor: 'transparent', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s ease' },
    eyeButton: { position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '0.25rem' },
    userTypeContainer: { marginBottom: '1.5rem' },
    userTypeLabel: { display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', textAlign: 'center' },
    userTypeButtons: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
    userTypeButton: { padding: '1rem 0.5rem', borderRadius: '12px', border: '2px solid #d1d5db', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', backgroundColor: 'white', cursor: 'pointer' },
    userTypeButtonSelected: { borderColor: '#4f46e5', backgroundColor: '#ede9fe' },
    iconContainer: { width: '50px', height: '50px', borderRadius: '12px', border: '2px dashed #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', backgroundColor: '#f9fafb' },
    userTypeText: { fontWeight: '500', fontSize: '0.85rem', color: '#374151' },
    button: { width: '100%', padding: '0.875rem', borderRadius: '50px', border: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', marginBottom: '0.75rem' },
    submitButton: { backgroundColor: '#4f46e5', color: 'white' },
    loading: { opacity: 0.7, cursor: 'not-allowed' },
    errorMessage: { marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.875rem' },
    warningMessage: { marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '8px', fontSize: '0.875rem' }
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

      {/* Register Form */}
      <div style={styles.card}>
        <h2 style={styles.formTitle}>Crear Cuenta</h2>
        <p style={styles.formSubtitle}>Completa todos los campos para registrarte</p>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        {passwordErrors.length > 0 && (
          <ul style={styles.warningMessage}>
            {passwordErrors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}

        <form onSubmit={handleSubmit}>
          {/* Cédula */}
          <div style={styles.inputContainer}>
            <input name="cedula" type="text" style={styles.input} value={formData.cedula} onChange={handleChange} placeholder="Cédula *" required />
          </div>

          {/* Primer Nombre */}
          <div style={styles.inputContainer}>
            <input name="primer_nombre" type="text" style={styles.input} value={formData.primer_nombre} onChange={handleChange} placeholder="Primer Nombre *" required />
          </div>

          {/* Segundo Nombre */}
          <div style={styles.inputContainer}>
            <input name="segundo_nombre" type="text" style={styles.input} value={formData.segundo_nombre} onChange={handleChange} placeholder="Segundo Nombre" />
          </div>

          {/* Primer Apellido */}
          <div style={styles.inputContainer}>
            <input name="primer_apellido" type="text" style={styles.input} value={formData.primer_apellido} onChange={handleChange} placeholder="Primer Apellido *" required />
          </div>

          {/* Segundo Apellido */}
          <div style={styles.inputContainer}>
            <input name="segundo_apellido" type="text" style={styles.input} value={formData.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido" />
          </div>

          {/* Email */}
          <div style={styles.inputContainer}>
            <input name="email" type="email" style={styles.input} value={formData.email} onChange={handleChange} placeholder="Correo Electrónico *" required />
          </div>

          {/* Usuario */}
          <div style={styles.inputContainer}>
            <input name="usuario" type="text" style={styles.input} value={formData.usuario} onChange={handleChange} placeholder="Usuario *" required />
          </div>

          {/* Contraseña */}
          <div style={{ ...styles.inputContainer, position: 'relative' }}>
            <input name="contrasena" type={showPassword ? "text" : "password"} style={styles.input} value={formData.contrasena} onChange={handleChange} placeholder="Contraseña *" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* User Type Selection */}
          <div style={styles.userTypeContainer}>
            <label style={styles.userTypeLabel}>
              Indicar tipo de Usuario
            </label>
            <div style={styles.userTypeButtons}>
              <button type="button" style={{ ...styles.userTypeButton, ...(formData.tipo_usuario === 'Personal' && styles.userTypeButtonSelected) }} onClick={() => setFormData({ ...formData, tipo_usuario: 'Personal' })}>
                <div style={styles.iconContainer}><UserIcon /></div>
                <span style={styles.userTypeText}>Personal</span>
              </button>
              <button type="button" style={{ ...styles.userTypeButton, ...(formData.tipo_usuario === 'Empresa' && styles.userTypeButtonSelected) }} onClick={() => setFormData({ ...formData, tipo_usuario: 'Empresa' })}>
                <div style={styles.iconContainer}><BriefcaseIcon /></div>
                <span style={styles.userTypeText}>Empresa</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" style={{ ...styles.button, ...styles.submitButton, ...(loading && styles.loading) }} disabled={loading}>
            {loading ? 'Registrando...' : 'Siguiente'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;