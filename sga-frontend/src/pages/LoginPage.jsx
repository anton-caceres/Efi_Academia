import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(correo, contraseña);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h2>Iniciar sesión</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        Accedé al sistema con tu cuenta.
      </p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-full" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" style={{ textDecoration: 'underline' }}>
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
