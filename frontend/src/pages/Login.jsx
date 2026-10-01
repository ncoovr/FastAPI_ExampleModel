import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Determinamos la ruta y el cuerpo de la petición según si es Login o Registro
    const endpoint = isLogin ? 'http://localhost:8000/login' : 'http://localhost:8000/users';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Ocurrió un error');
      }

      // Guardamos el ID del usuario en el almacenamiento local del navegador
      const userId = isLogin ? data.user_id : data.id;
      localStorage.setItem('stream_user_id', userId);

      // Redirigimos al catálogo
      navigate('/home');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form 
        onSubmit={handleSubmit}
        style={{ 
          backgroundColor: '#18181b', 
          padding: '40px', 
          borderRadius: '12px', 
          width: '100%', 
          maxWidth: '400px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#fff' }}>
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>

        {error && (
          <div style={{ backgroundColor: '#ef444420', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#a1a1aa', fontSize: '0.9rem' }}>Nombre</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: '#27272a', color: 'white', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#a1a1aa', fontSize: '0.9rem' }}>Correo Electrónico</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: '#27272a', color: 'white', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#a1a1aa', fontSize: '0.9rem' }}>Contraseña</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #27272a', backgroundColor: '#27272a', color: 'white', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: '#1db954', color: 'black', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}
        >
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>

        <p style={{ textAlign: 'center', margin: 0, color: '#a1a1aa', fontSize: '0.9rem' }}>
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: '#1db954', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </span>
        </p>
      </form>
    </div>
  );
}