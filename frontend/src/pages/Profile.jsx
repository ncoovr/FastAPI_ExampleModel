import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, User, X } from 'lucide-react';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('stream_user_id');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    fetch(`http://localhost:8000/users/${userId}`)
      .then(res => res.json())
      .then(data => setUserData(data));
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('stream_user_id');
    navigate('/');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      alert("Por favor selecciona el video y la miniatura.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('user_id', userId);
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);

    try {
      const response = await fetch('http://localhost:8000/videos/upload', {
        method: 'POST',
        body: formData, 
      });

      if (response.ok) {
        alert("¡Video subido con éxito!");
        setShowUploadModal(false);
        window.location.reload();
      } else {
        alert("Error al subir el video.");
      }
    } catch (error) {
      console.error("Error en la subida:", error);
    }
  };

  if (!userData) return <h2 style={{ color: 'white', textAlign: 'center' }}>Cargando perfil...</h2>;

  return (
    <div>
      <div style={{ backgroundColor: '#18181b', padding: '30px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#27272a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <User size={40} color="#1db954" />
          </div>
          <div>
            <h1 style={{ margin: '0 0 5px 0', color: 'white' }}>{userData.name}</h1>
            <p style={{ margin: 0, color: '#a1a1aa' }}>{userData.email}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setShowUploadModal(!showUploadModal)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1db954', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Upload size={18} /> {showUploadModal ? 'Cancelar' : 'Subir Video'}
          </button>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </div>

      {showUploadModal && (
        <form onSubmit={handleUpload} style={{ backgroundColor: '#18181b', padding: '30px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #1db954' }}>
          <h2 style={{ margin: '0 0 20px 0', display: 'flex', justifyContent: 'space-between' }}>
            Publicar nuevo contenido
            <X size={24} style={{ cursor: 'pointer', color: '#a1a1aa' }} onClick={() => setShowUploadModal(false)} />
          </h2>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px' }}>Título del video</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', backgroundColor: '#27272a', color: 'white', border: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px' }}>Descripción</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', backgroundColor: '#27272a', color: 'white', border: 'none', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' }} />
            </div>
            
            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px' }}>Archivo de Video (.mp4)</label>
              <input type="file" accept="video/mp4,video/x-m4v,video/*" required onChange={e => setVideoFile(e.target.files[0])} style={{ width: '100%', padding: '10px', backgroundColor: '#27272a', borderRadius: '6px', color: 'white' }} />
            </div>
            <div style={{ flex: '1 1 45%' }}>
              <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '8px' }}>Miniatura (.jpg, .png)</label>
              <input type="file" accept="image/*" required onChange={e => setThumbnailFile(e.target.files[0])} style={{ width: '100%', padding: '10px', backgroundColor: '#27272a', borderRadius: '6px', color: 'white' }} />
            </div>
          </div>

          <button type="submit" style={{ marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#1db954', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
            Subir a la plataforma
          </button>
        </form>
      )}

      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Mis Publicaciones</h2>
      <section className="video-grid" style={{ padding: 0 }}>
        {!userData.videos || userData.videos.length === 0 ? (
          <p style={{ color: '#a1a1aa' }}>Aún no has publicado ningún video.</p>
        ) : (
          userData.videos.map((video) => (
            <article key={video.id} className="video-card" onClick={() => navigate(`/watch/${video.id}`)}>
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