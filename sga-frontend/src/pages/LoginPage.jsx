import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        correo,
        contraseña
      });

      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          'Error al iniciar sesión. Verificá tus datos.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>
          <FiLogIn /> Iniciar sesión
        </h2>
        <p className="auth-subtitle">
          Accedé al Sistema de Gestión Académica con tu correo institucional.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label>
              <FiMail /> Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div>
            <label>
              <FiLock /> Contraseña
            </label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Tu contraseña"
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-full" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-footer-text">
          ¿Todavía no tenés cuenta?{' '}
          <Link to="/register" className="auth-link">
            Registrate acá
          </Link>
        </p>
      </div>
    </div>
  );
}
