// frontend/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService, apiHelpers } from '../api';

const handleReset = async (e) => {
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
    await authService.resetPassword(userId, code, password);
    navigate('/login');
  } catch (error) {
    const errorDetails = apiHelpers.handleError(error);
    setServerError(errorDetails.data?.error || 'Error al cambiar contraseña');
  } finally {
    setLoading(false);
  }

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