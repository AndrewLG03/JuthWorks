import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Calendar, 
  Lock, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { paymentService, apiHelpers } from '../api';
import BottomNavigation from '../components/BottomNavigation';

const Payment = () => {
  const { solicitudId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [form, setForm] = useState({
    cedula: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    card_number: '',
    expiracion: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // Función para obtener el tipo de cambio desde el backend
  const fetchExchangeRate = async () => {
    try {
      setExchangeLoading(true);
      const result = await paymentService.getExchangeRate();
      
      if (result.success) {
        setExchangeRate(result.data);
        setLastUpdated(new Date(result.data.lastUpdated));
        
        if (result.error) {
          toast.error(result.error);
        } else if (result.warning) {
          toast.warning(result.warning);
        } else if (result.cached) {
          toast.info('Tipo de cambio obtenido desde cache');
        } else {
          const source = result.data.source || 'BCCR';
          toast.success(`Tipo de cambio actualizado desde ${source}`);
        }
      } else {
        throw new Error('No se pudo obtener el tipo de cambio');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      const errorDetails = apiHelpers.handleError(error);
      toast.error(errorDetails.data?.error || 'Error al obtener el tipo de cambio');
      
      // Mantener el fallback local solo como último recurso
      setExchangeRate({
        compra: 510.50,
        venta: 520.25,
        fecha: new Date().toISOString().split('T')[0],
        fallback: true
      });
      setLastUpdated(new Date());
    } finally {
      setExchangeLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await paymentService.processPayment({
        ...form,
        solicitud_id: parseInt(solicitudId)
      });
      toast.success('Pago realizado con éxito');
      navigate('/historial');
    } catch (error) {
      console.error(error);
      const errorDetails = apiHelpers.handleError(error);
      toast.error(errorDetails.data?.error || errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  // Estilos del componente (mantenemos los mismos estilos)
  const styles = {
    page: { 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5', 
      fontFamily: 'system-ui, sans-serif',
      paddingBottom: '80px'
    },
    header: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      padding: '1rem', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #e0e0e0', 
      position: 'sticky', 
      top: 0, 
      zIndex: 10 
    },
    backButton: { 
      background: 'none', 
      border: 'none', 
      cursor: 'pointer', 
      display: 'flex', 
      color: '#333' 
    },
    title: { 
      margin: 0, 
      fontSize: '1.5rem', 
      fontWeight: 'bold', 
      color: '#333' 
    },
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '1rem'
    },
    card: {
      background: '#fff',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
      marginBottom: '1rem'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #f0f0f0'
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#555',
      marginBottom: '1rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#555',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#4f46e5',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    paymentSummary: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      color: '#fff',
      padding: '1.5rem',
      borderRadius: '12px',
      textAlign: 'center',
      marginBottom: '1rem'
    },
    amount: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    amountLabel: {
      fontSize: '0.9rem',
      opacity: 0.9
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#4f46e5',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    submitButtonHover: {
      backgroundColor: '#4338ca'
    },
    submitButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    securityNote: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.8rem',
      color: '#666',
      marginTop: '1rem',
      padding: '0.75rem',
      backgroundColor: '#f8fafc',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    },
    exchangeCard: {
      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      color: '#fff',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '1rem'
    },
    exchangeHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem'
    },
    exchangeTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    refreshButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '6px',
      padding: '0.5rem',
      cursor: 'pointer',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      transition: 'background-color 0.2s'
    },
    exchangeRates: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    rateItem: {
      textAlign: 'center'
    },
    rateLabel: {
      fontSize: '0.8rem',
      opacity: 0.9,
      marginBottom: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem'
    },
    rateValue: {
      fontSize: '1.2rem',
      fontWeight: 'bold'
    },
    lastUpdated: {
      fontSize: '0.7rem',
      opacity: 0.8,
      textAlign: 'center',
      marginTop: '0.5rem'
    },
    exchangeLoading: {
      textAlign: 'center',
      opacity: 0.8
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton} title="Volver">
          <ArrowLeft size={24} />
        </button>
        <h1 style={styles.title}>Procesar Pago</h1>
      </header>

      <div style={styles.container}>
        {/* Tipo de Cambio del BCCR */}
        <div style={styles.exchangeCard}>
          <div style={styles.exchangeHeader}>
            <h3 style={styles.exchangeTitle}>
              <TrendingUp size={20} />
              Tipo de Cambio BCCR
            </h3>
            <button 
              onClick={fetchExchangeRate} 
              style={styles.refreshButton}
              disabled={exchangeLoading}
              title="Actualizar tipo de cambio"
            >
              <RefreshCw size={16} style={{ 
                animation: exchangeLoading ? 'spin 1s linear infinite' : 'none' 
              }} />
            </button>
          </div>
          
          {exchangeLoading ? (
            <div style={styles.exchangeLoading}>Actualizando tipo de cambio...</div>
          ) : exchangeRate ? (
            <>
              <div style={styles.exchangeRates}>
                <div style={styles.rateItem}>
                  <div style={styles.rateLabel}>
                    <TrendingDown size={14} />
                    Compra
                  </div>
                  <div style={styles.rateValue}>₡{exchangeRate.compra.toFixed(2)}</div>
                </div>
                <div style={styles.rateItem}>
                  <div style={styles.rateLabel}>
                    <TrendingUp size={14} />
                    Venta
                  </div>
                  <div style={styles.rateValue}>₡{exchangeRate.venta.toFixed(2)}</div>
                </div>
              </div>
              {lastUpdated && (
                <div style={styles.lastUpdated}>
                  {exchangeRate.fallback ? 
                    `Valores estimados (${exchangeRate.source || 'Fallback'})` : 
                    `Última actualización: ${lastUpdated.toLocaleTimeString('es-CR')}`
                  }
                </div>
              )}
            </>
          ) : (
            <div style={styles.exchangeLoading}>No se pudo cargar el tipo de cambio</div>
          )}
        </div>

        {/* Resumen del pago */}
        <div style={styles.paymentSummary}>
          <div style={styles.amount}>₡20,000</div>
          <div style={styles.amountLabel}>Solicitud #{solicitudId}</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Información Personal */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <User size={24} color="#4f46e5" />
              <h2 style={styles.cardTitle}>Información Personal</h2>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cédula</label>
              <input 
                name="cedula" 
                placeholder="Número de cédula" 
                value={form.cedula} 
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Primer Nombre</label>
                <input 
                  name="primer_nombre" 
                  placeholder="Primer nombre" 
                  value={form.primer_nombre} 
                  onChange={handleChange} 
                  required 
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Segundo Nombre</label>
                <input 
                  name="segundo_nombre" 
                  placeholder="Segundo nombre (opcional)" 
                  value={form.segundo_nombre} 
                  onChange={handleChange} 
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Primer Apellido</label>
                <input 
                  name="primer_apellido" 
                  placeholder="Primer apellido" 
                  value={form.primer_apellido} 
                  onChange={handleChange} 
                  required 
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Segundo Apellido</label>
                <input 
                  name="segundo_apellido" 
                  placeholder="Segundo apellido (opcional)" 
                  value={form.segundo_apellido} 
                  onChange={handleChange} 
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Información de la Tarjeta */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <CreditCard size={24} color="#4f46e5" />
              <h2 style={styles.cardTitle}>Información de Pago</h2>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Número de Tarjeta</label>
              <input 
                name="card_number" 
                placeholder="1234 5678 9012 3456" 
                value={form.card_number} 
                onChange={handleChange} 
                required 
                minLength={12} 
                maxLength={19}
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Calendar size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Fecha de Expiración
                </label>
                <input 
                  name="expiracion" 
                  placeholder="MM/YYYY" 
                  value={form.expiracion} 
                  onChange={handleChange} 
                  required 
                  pattern="^(0[1-9]|1[0-2])\/\d{4}$"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Lock size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  CVV
                </label>
                <input 
                  name="cvv" 
                  placeholder="123" 
                  value={form.cvv} 
                  onChange={handleChange} 
                  required 
                  minLength={3} 
                  maxLength={4}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
          >
            <CreditCard size={20} />
            {loading ? 'Procesando pago...' : 'Confirmar Pago ₡20,000'}
          </button>
        </form>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Payment;