import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/videos/')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVideos(data);
        }
      })
      .catch(error => console.error("Error cargando videos:", error));
  }, []);

  return (
    <div>
      <div className="home-banner">
        <h1>Descubre nuevos videos</h1>
      </div>
      
      <section className="video-grid">
        {videos.length === 0 ? (
          <p style={{ color: '#a1a1aa' }}>No hay videos disponibles.</p>
        ) : (
          videos.map((video) => (
            <article 
              key={video.id} 
              className="video-card"
              onClick={() => navigate(`/watch/${video.id}`)}
            >
              <div style={{ 
                height: '160px', 
                backgroundImage: `url(${video.thumbnail_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#27272a'
              }}></div>
              
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {video.title}
                </h3>
                <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.9rem' }}>
                  {video.views} vistas • ID Usuario: {video.user_id}
                </p>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}