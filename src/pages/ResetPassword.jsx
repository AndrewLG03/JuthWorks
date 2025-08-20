// frontend/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const validatePassword = pwd => {
  const errs = [];
  if (pwd.length < 8) errs.push('Debe tener al menos 8 caracteres');
  if (!/[A-Z]/.test(pwd)) errs.push('Debe contener al menos una letra mayúscula');
  if (!/[a-z]/.test(pwd)) errs.push('Debe contener al menos una letra minúscula');
  if (!/\d/.test(pwd)) errs.push('Debe contener al menos un número');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errs.push('Debe contener al menos un carácter especial');
  return errs;
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const code   = searchParams.get('code');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async e => {
    e.preventDefault();
    const pwdErr = validatePassword(password);
    if (pwdErr.length) {
      setErrors(pwdErr);
      return;
    }
    if (password !== confirm) {
      setErrors(['Las contraseñas no coinciden']);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, verificationCode: code, newPassword: password })
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setServerError(data.error || 'Error al cambiar contraseña');
      }
    } catch {
      setServerError('Error de conexión al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', fontFamily: 'sans-serif' }}>
      <h2>Restablecer Contraseña</h2>
      {errors.length > 0 && (
        <ul style={{ background: '#fee2e2', color: '#b91c1c', padding: '.5rem', borderRadius: 4 }}>
          {errors.map((e,i) => <li key={i}>{e}</li>)}
        </ul>
      )}
      {serverError && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '.5rem', borderRadius: 4, margin: '1rem 0' }}>
          {serverError}
        </div>
      )}
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '.75rem', margin: '.75rem 0', borderRadius: 4, border: '1px solid #d1d5db' }}
        />
        <input
          type="password"
          placeholder="Repetir contraseña"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={{ width: '100%', padding: '.75rem', margin: '.75rem 0', borderRadius: 4, border: '1px solid #d1d5db' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '.75rem',
            background: loading ? '#A5B4FC' : '#4F46E5',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Cambiando...' : 'Cambiar contraseña'}
        </button>
      </form>
      <Link to="/login" style={{ display: 'block', marginTop: '1rem', color: '#4F46E5', textAlign: 'center' }}>
        Volver al Login
      </Link>
    </div>
  );
};

export default ResetPassword;