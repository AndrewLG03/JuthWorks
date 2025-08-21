// frontend/src/pages/AdminRequests.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import { adminService, apiHelpers } from '../api';

const fetchNewRequests = async () => {
  setLoading(true);
  try {
    const data = await adminService.getNewRequests();
    setRequests(data);
  } catch (error) {
    console.error(error);
    const errorDetails = apiHelpers.handleError(error);
    toast.error(errorDetails.data?.error || 'No se pudieron cargar las solicitudes');
  } finally {
    setLoading(false);
  }
};

const handleSendQuote = async (id) => {
  const precio = prompt('Ingresa precio estimado:');
  if (!precio) return;
  
  try {
    await adminService.sendQuote(id, parseFloat(precio), '');
    toast.success('Presupuesto enviado');
    fetchNewRequests();
  } catch (error) {
    const errorDetails = apiHelpers.handleError(error);
    toast.error(errorDetails.data?.error || 'Error enviando presupuesto');
  }
};

const handleApprove = async (id) => {
  try {
    await adminService.approveRequest(id, '');
    toast.success('Solicitud aprobada');
    fetchNewRequests();
  } catch (error) {
    const errorDetails = apiHelpers.handleError(error);
    toast.error(errorDetails.data?.error || 'Error aprobando solicitud');
  }
};

const handleReject = async (id) => {
  try {
    await adminService.rejectRequest(id, '');
    toast.info('Solicitud rechazada');
    fetchNewRequests();
  } catch (error) {
    const errorDetails = apiHelpers.handleError(error);
    toast.error(errorDetails.data?.error || 'Error rechazando solicitud');
  }

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

export default AdminRequests;