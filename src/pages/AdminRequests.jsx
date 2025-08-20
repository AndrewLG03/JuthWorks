// frontend/src/pages/AdminRequests.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';  // tu hook para obtener el token
import { toast } from 'react-toastify';

export default function AdminRequests() {
  const { token } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNewRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/solicitudes-nuevas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewRequests();
  }, []);

  const handleSendQuote = async (id) => {
    const precio = prompt('Ingresa precio estimado:');
    if (!precio) return;
    try {
      await fetch('http://localhost:5000/api/admin/enviar-presupuesto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ solicitud_id: id, precio_estimado: parseFloat(precio), notas_admin: '' })
      });
      toast.success('Presupuesto enviado');
      fetchNewRequests();
    } catch {
      toast.error('Error enviando presupuesto');
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/aprobar-presupuesto/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notas_admin: '' })
      });
      toast.success('Solicitud aprobada');
      fetchNewRequests();
    } catch {
      toast.error('Error aprobando solicitud');
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/rechazar-presupuesto/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notas_admin: '' })
      });
      toast.info('Solicitud rechazada');
      fetchNewRequests();
    } catch {
      toast.error('Error rechazando solicitud');
    }
  };

  if (loading) return <p className="p-4">Cargando solicitudes...</p>;
  if (requests.length === 0) return <p className="p-4">No hay solicitudes nuevas.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Solicitudes Nuevas</h1>
      {requests.map(req => (
        <div key={req.id} className="border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p><strong>Cliente:</strong> {req.primer_nombre} {req.primer_apellido} ({req.username})</p>
              <p><strong>Servicio:</strong> {req.servicio_nombre}</p>
              <p><strong>Descripción:</strong> {req.descripcion}</p>
              <p><strong>Fecha:</strong> {new Date(req.fecha_solicitud).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleSendQuote(req.id)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 block w-full text-center"
              >
                Enviar Presupuesto
              </button>
              <button
                onClick={() => handleApprove(req.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 block w-full text-center"
              >
                Aprobar
              </button>
              <button
                onClick={() => handleReject(req.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 block w-full text-center"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}