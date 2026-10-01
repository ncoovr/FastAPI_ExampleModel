import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, User } from 'lucide-react';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('stream_user_id');

  useEffect(() => {
    if (!userId) {
      navigate('/'); // Si no está logueado, lo mandamos al Login
      return;
    }

    // Traer datos del usuario y sus videos desde FastAPI
    fetch(`http://localhost:8000/users/${userId}`)
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error("Error cargando perfil:", err));
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('stream_user_id');
    navigate('/');
  };

  if (!userData) return <h2 style={{ color: 'white', textAlign: 'center' }}>Cargando perfil...</h2>;

  return (
    <div>
      {/* Cabecera del Perfil */}
      <div style={{ backgroundColor: '#18181b', padding: '30px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#27272a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <User size={40} color="#1db954" />
          </div>
          <div>
            <h1 style={{ margin: '0 0 5px 0', color: 'white' }}>{userData.name}</h1>
            <p style={{ margin: 0, color: '#a1a1aa' }}>{userData.email} • ID: {userData.id}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1db954', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Upload size={18} /> Subir Video (Próximamente)
          </button>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>

      {/* Catálogo personal de videos */}
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Mis Publicaciones</h2>
      
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {!userData.videos || userData.videos.length === 0 ? (
          <p style={{ color: '#a1a1aa' }}>Aún no has publicado ningún video.</p>
        ) : (
          userData.videos.map((video) => (
            <article 
              key={video.id} 
              onClick={() => navigate(`/watch/${video.id}`)}
              style={{ backgroundColor: '#18181b', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <div style={{ height: '160px', backgroundImage: `url(${video.thumbnail_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#27272a' }}></div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#fff' }}>{video.title}</h3>
                <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.9rem' }}>{video.views} vistas</p>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}