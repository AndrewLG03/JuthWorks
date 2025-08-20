// frontend/src/pages/Comments.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { commentsService, apiHelpers } from '../api';

// Cargar comentarios aplicando filtros
const fetchComments = useCallback(async () => {
  setLoading(true);
  try {
    const data = await commentsService.getComments(filters);
    setComments(data);
  } catch (error) {
    const errorDetails = apiHelpers.handleError(error);
    setError(errorDetails.data?.error || 'No se pudieron cargar los comentarios');
  } finally {
    setLoading(false);
  }
}, [filters]);

// Handler para crear comentario
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!texto.trim()) return;
  
  try {
    const newComment = await commentsService.createComment(texto, user?.id || null);
    setComments([newComment, ...comments]);
    setTexto('');
  } catch (error) {
    const errorDetails = apiHelpers.handleError(error);
    alert(errorDetails.data?.error || 'Error al enviar comentario');
  }
};

const handleSaveEdit = async (commentId) => {
  if (!editingText.trim()) return;
  
  try {
    const updatedComment = await commentsService.updateComment(commentId, editingText);
    setComments(comments.map(c => (c.id === commentId ? updatedComment : c)));
    handleCancelEdit();
  } catch (error) {
    const errorDetails = apiHelpers.handleError(error);
    alert(errorDetails.data?.error || 'Error al actualizar el comentario');
  }
};

// Handler para eliminar
const handleDelete = async (commentId) => {
  if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;
  
  try {
    await commentsService.deleteComment(commentId);
    setComments(comments.filter(c => c.id !== commentId));
  } catch (error) {
    const errorDetails = apiHelpers.handleError(error);
    alert(errorDetails.data?.error || 'Error al eliminar el comentario');
  }

  // --- Estilos ---
  const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'system-ui, sans-serif' },
    header: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 10 },
    backButton: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#333' },
    form: { padding: '1rem', background: '#fff', margin: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    textarea: { width: '100%', minHeight: '80px', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' },
    submitButton: { marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#6b2e6b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    filters: { padding: '1rem', background: '#fff', margin: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    filterInputs: { display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' },
    input: { padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' },
    clearButton: { background: '#777', color: 'white' },
    commentArticle: { background: '#fff', padding: '1rem', margin: '0 1rem 1rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' },
    commentHeader: { margin: 0, fontSize: '0.9rem', color: '#555', display: 'flex', justifyContent: 'space-between' },
    commentText: { margin: '0.5rem 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
    actions: { display: 'flex', gap: '1rem', marginTop: '0.75rem' },
    actionButton: { background: 'none', border: '1px solid', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton} title="Volver">
          <ArrowLeft size={24} />
        </button>
        <h1>Comentarios</h1>
      </header>
      
      <main>
        {/* Formulario para nuevo comentario */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder={user ? "Escribe tu comentario..." : "Inicia sesión para dejar un comentario."}
            style={styles.textarea}
            disabled={!user}
          />
          <button type="submit" style={styles.submitButton} disabled={!user || !texto.trim()}>
            <Send size={16} /> Enviar
          </button>
        </form>

        {/* Filtros de búsqueda */}
        <section style={styles.filters}>
          <h2 style={{marginTop: 0}}>Buscar Comentarios</h2>
          <div style={styles.filterInputs}>
            <input type="text" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Buscar en comentarios..." style={styles.input}/>
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} style={styles.input} title="Fecha de inicio"/>
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} style={styles.input} title="Fecha de fin"/>
            <button onClick={resetFilters} style={{...styles.submitButton, ...styles.clearButton}}>
                <XCircle size={16}/> Limpiar
            </button>
          </div>
        </section>

        {/* Lista de comentarios */}
        <section>
          {loading ? <p style={{textAlign: 'center'}}>Cargando comentarios…</p>
           : error ? <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
           : comments.length === 0 ? <p style={{textAlign: 'center'}}>No se encontraron comentarios.</p>
           : comments.map(c => (
              <article key={c.id} style={styles.commentArticle}>
                {editingCommentId === c.id ? (
                  // --- Vista de Edición ---
                  <div>
                    <textarea
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      style={{...styles.textarea, minHeight: '60px'}}
                    />
                    <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                      <button onClick={() => handleSaveEdit(c.id)} style={{...styles.submitButton, fontSize:'0.9rem'}}>Guardar</button>
                      <button onClick={handleCancelEdit} style={{...styles.submitButton, ...styles.clearButton, fontSize:'0.9rem'}}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  // --- Vista Normal ---
                  <>
                    <p style={styles.commentHeader}>
                      <strong>{c.primer_nombre ? `${c.primer_nombre} ${c.primer_apellido}` : 'Anónimo'}</strong>
                      <small>{new Date(c.creado_en).toLocaleString('es-CR')}</small>
                    </p>
                    <p style={styles.commentText}>{c.texto}</p>

                    {user && user.id === c.usuario_id && (
                      <div style={styles.actions}>
                        <button onClick={() => handleStartEdit(c)} style={{...styles.actionButton, color: '#007bff', borderColor: '#007bff'}}>
                          <Edit size={14} /> Editar
                        </button>
                        <button onClick={() => handleDelete(c.id)} style={{...styles.actionButton, color: '#dc3545', borderColor: '#dc3545'}}>
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    )}
                  </>
                )}
              </article>
            ))}
        </section>
      </main>
    </div>
  );
};

export default Comments;