import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Watch() {
  const { id } = useParams(); // Obtenemos el ID del video desde la URL
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Si por alguna razón el ID es "undefined", no hacemos la petición
    if (!id || id === "undefined") return;

    // 1. Cargar detalles del video
    fetch(`http://localhost:8000/videos/${id}`)
      .then(res => res.json())
      .then(data => {
        // Blindaje: Verificamos si el backend devolvió un error (ej. 404)
        if (data.detail) {
          console.error("Video no encontrado o error:", data.detail);
        } else {
          setVideo(data);
        }
      })
      .catch(err => console.error("Error cargando video:", err));

    // 2. Cargar lista de comentarios blindada
    fetch(`http://localhost:8000/videos/${id}/comments`)
      .then(res => res.json())
      .then(data => {
        // Blindaje: Solo guardamos si realmente es una lista (array)
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error("Error en comentarios:", data);
          setComments([]); // Mantenemos el estado como lista vacía para evitar el crash
        }
      })
      .catch(err => console.error("Error cargando comentarios:", err));
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // POST para guardar el comentario en la base de datos
    fetch(`http://localhost:8000/videos/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newComment,
        user_id: parseInt(localStorage.getItem('stream_user_id')), // ¡Ahora usa tu ID real!
        video_id: parseInt(id)
      })
    })
    .then(res => res.json())
    .then(data => {
      // Actualiza la lista en pantalla instantáneamente sumando el nuevo
      setComments([...comments, data]);
      setNewComment(""); 
    })
    .catch(err => console.error("Error al publicar comentario:", err));
  };

  // Pantalla de carga mientras llega la respuesta del backend
  if (!video) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando reproductor...</h2>;

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      
      {/* SECCIÓN IZQUIERDA: Reproductor y Metadatos */}
      <section style={{ flex: '1 1 65%', minWidth: '300px' }}>
        {/* Contenedor del video */}
        <div style={{ width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
          <video 
            src={video.video_url} 
            controls 
            autoPlay 
            style={{ width: '100%', height: '100%' }}
          >
            Tu navegador no soporta la etiqueta de video.
          </video>
        </div>

        {/* Detalles del video */}
        <div style={{ marginTop: '20px' }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>{video.title}</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '20px' }}>
            <span>Publicado por Usuario ID: {video.user_id}</span>
            <span>{video.views} vistas</span>
          </div>
          <div style={{ backgroundColor: '#18181b', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{video.description}</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN DERECHA: Comentarios */}
      <aside style={{ flex: '1 1 30%', minWidth: '300px', backgroundColor: '#18181b', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>Comentarios</h3>
        
        {/* Formulario de envío */}
        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Añade un comentario..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#27272a', color: 'white', border: 'none', resize: 'vertical', minHeight: '60px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ alignSelf: 'flex-end', backgroundColor: '#1db954', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            Comentar
          </button>
        </form>

        {/* Lista renderizada */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {comments.length === 0 ? (
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', textAlign: 'center' }}>Sé el primero en comentar.</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
                {/* Avatar genérico */}
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3f3f46', flexShrink: 0 }}></div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#a1a1aa' }}>Usuario {c.user_id}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

    </div>
  );
}