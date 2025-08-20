import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get('userId');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerify = async e => {
        e.preventDefault();
        if (!code.trim()) {
            setError('Ingresa el código recibido');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, verificationCode: code.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'Código inválido o expirado');
            }
        } catch (err) {
            console.error('Verification fetch error:', err);
            setError('Error de conexión al verificar');
        } finally {
            setLoading(false);
        }
    };

    // Estilos tomados de Register.jsx para consistencia visual
    const styles = {
        container: { minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'system-ui, -apple-system, sans-serif' },
        header: { textAlign: 'center', marginBottom: '2rem' },
        title: { fontSize: '3rem', fontWeight: 'bold', color: '#4f46e5', lineHeight: '1.2', margin: '0' },
        underline: { width: '120px', height: '2px', backgroundColor: '#1f2937', margin: '0.5rem auto 0' },
        card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '2rem 1.5rem', width: '100%', maxWidth: '400px' },
        formTitle: { fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', color: '#111827' },
        formSubtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' },
        inputContainer: { marginBottom: '1.25rem' },
        input: { width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '2px solid #d1d5db', backgroundColor: 'transparent', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s ease', textAlign: 'center', letterSpacing: '0.5em' },
        button: { width: '100%', padding: '0.875rem', borderRadius: '50px', border: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', marginBottom: '0.75rem' },
        submitButton: { backgroundColor: '#4f46e5', color: 'white' },
        loading: { opacity: 0.7, cursor: 'not-allowed' },
        errorMessage: { marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center' },
        successMessage: { marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>
                    Juth<br />
                    Works
                </h1>
                <div style={styles.underline}></div>
            </div>
            <div style={styles.card}>
                <h2 style={styles.formTitle}>Verifica tu correo</h2>
                <p style={styles.formSubtitle}>Hemos enviado un código a tu email. Ingrésalo para activar tu cuenta.</p>
                
                {error && <div style={styles.errorMessage}>{error}</div>}
                
                {success ? (
                    <>
                        <div style={styles.successMessage}>¡Email verificado exitosamente!</div>
                        <button
                            onClick={() => navigate('/login')}
                            style={{ ...styles.button, ...styles.submitButton }}
                        >
                            Ir al Login
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleVerify}>
                        <div style={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="------"
                                value={code}
                                onChange={e => { setCode(e.target.value); setError(''); }}
                                style={styles.input}
                                disabled={loading}
                                maxLength="6"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!code || loading}
                            style={{
                                ...styles.button,
                                ...styles.submitButton,
                                ...(loading && styles.loading),
                                marginTop: '1rem'
                            }}
                        >
                            {loading ? 'Verificando...' : 'Verificar Cuenta'}
                        </button>
                    </form>
                )}
                 {!success && (
                    <Link to="/login" style={{ display: 'block', marginTop: '1rem', color: '#4F46E5', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Volver al Login
                    </Link>
                 )}
            </div>
        </div>
    );
};

export default VerifyEmail;