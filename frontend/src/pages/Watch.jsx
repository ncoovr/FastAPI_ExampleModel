import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!id || id === "undefined") return;

    // 1. Cargar el video actual
    fetch(`http://localhost:8000/videos/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.detail) setVideo(data);
      });

    // 2. Cargar comentarios
    fetch(`http://localhost:8000/videos/${id}/comments`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      });

    // 3. NUEVO: Cargar videos recomendados (Catálogo completo menos el actual)
    fetch(`http://localhost:8000/videos/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filtramos para no recomendar el mismo video que ya estamos viendo
          const filtered = data.filter(v => v.id !== parseInt(id));
          setRecommended(filtered);
        }
      });
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    fetch(`http://localhost:8000/videos/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newComment,
        user_id: parseInt(localStorage.getItem('stream_user_id')),
        video_id: parseInt(id)
      })
    })
    .then(res => res.json())
    .then(data => {
      setComments([...comments, data]);
      setNewComment(""); 
    });
  };

  if (!video) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando reproductor...</h2>;

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      
      {/* SECCIÓN IZQUIERDA: Reproductor */}
      <section style={{ flex: '1 1 65%', minWidth: '300px' }}>
        <div style={{ width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
          <video src={video.video_url} controls autoPlay style={{ width: '100%', height: '100%' }}></video>
        </div>
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

      {/* SECCIÓN DERECHA: Comentarios y Recomendados */}
      <aside style={{ flex: '1 1 30%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Panel de Comentarios */}
        <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>Comentarios</h3>
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <textarea 
              value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Añade un comentario..."
              style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#27272a', color: 'white', border: 'none', resize: 'vertical', minHeight: '60px', boxSizing: 'border-box' }}
            />
            <button type="submit" style={{ alignSelf: 'flex-end', backgroundColor: '#1db954', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
              Comentar
            </button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {comments.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3f3f46', flexShrink: 0 }}></div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#a1a1aa' }}>Usuario {c.user_id}</p>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de Videos Recomendados */}
        <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>Recomendados para ti</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recommended.length === 0 ? <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>No hay más videos.</p> : null}
            {recommended.map(vid => (
              <div 
                key={vid.id} 
                onClick={() => navigate(`/watch/${vid.id}`)}
                style={{ display: 'flex', gap: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ width: '120px', height: '68px', backgroundImage: `url(${vid.thumbnail_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '6px', backgroundColor: '#27272a', flexShrink: 0 }}></div>
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{vid.title}</h4>
                  <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.8rem' }}>{vid.views} vistas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </aside>
    </div>
  );
}