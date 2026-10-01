import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogIn, MonitorPlay, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('stream_user_id');

  const handleLogout = () => {
    localStorage.removeItem('stream_user_id');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/home" className="sidebar-logo">
        <MonitorPlay size={32} color="#1db954" />
        <span>U|STREAM</span>
      </Link>

      {/* Menú */}
      <nav className="sidebar-menu">
        <Link to="/home" className="nav-link">
          <Home size={20} /> <span>Inicio</span>
        </Link>
        
        {userId && (
          <Link to="/channel" className="nav-link">
            <User size={20} /> <span>Mi Perfil</span>
          </Link>
        )}

        {/* Zona inferior para el Login/Logout */}
        <div style={{ marginTop: 'auto' }}>
          {userId ? (
             <button onClick={handleLogout} className="nav-link logout">
               <LogOut size={20} /> <span>Salir</span>
             </button>
          ) : (
            <Link to="/" className="nav-link" style={{ color: '#1db954' }}>
              <LogIn size={20} /> <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
}