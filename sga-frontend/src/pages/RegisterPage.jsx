import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiUserPlus, FiUser, FiMail, FiLock } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('estudiante');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/register`, {
        nombre,
        correo,
        contraseña,
        rol
      });

      setOkMsg('Usuario registrado correctamente. Ya podés iniciar sesión.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          'Error al registrar usuario. Verificá los datos.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>
          <FiUserPlus /> Crear cuenta
        </h2>
        <p className="auth-subtitle">
          Registrá un nuevo usuario para acceder al sistema académico.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label>
              <FiUser /> Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre y apellido"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label>Rol</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {error && <p className="error-text">{error}</p>}
          {okMsg && <p className="success-text">{okMsg}</p>}

          <button className="btn btn-full" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-footer-text">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="auth-link">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
