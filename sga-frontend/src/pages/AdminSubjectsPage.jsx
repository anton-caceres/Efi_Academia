import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminSubjectsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    try {
      setLoadingList(true);
      const { data } = await axios.get(`${API_URL}/subjects`);
      setSubjects(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar asignaturas');
    } finally {
      setLoadingList(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoadingCreate(true);

    try {
      const { data } = await axios.post(`${API_URL}/subjects`, {
        nombre,
        descripcion
      });
      setSuccess('Asignatura creada correctamente');
      setNombre('');
      setDescripcion('');
      setSubjects((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al crear asignatura');
    } finally {
      setLoadingCreate(false);
    }
  }

  if (user?.rol !== 'admin') {
    return (
      <div className="card">
        <h2>Acceso restringido</h2>
        <p>Solo los administradores pueden gestionar asignaturas.</p>
        <Link to="/dashboard" className="btn" style={{ marginTop: '1rem' }}>
          Volver al dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Crear asignatura</h2>
        <form className="form-grid" onSubmit={handleCreate}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Descripción (opcional)</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" className="btn btn-full" disabled={loadingCreate}>
            {loadingCreate ? 'Creando...' : 'Crear asignatura'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Listado de asignaturas</h2>
        {loadingList && <p>Cargando asignaturas...</p>}
        {!loadingList && subjects.length === 0 && <p>No hay asignaturas cargadas.</p>}
        {!loadingList && subjects.length > 0 && (
          <ul>
            {subjects.map((s) => (
              <li key={s.id}>
                <strong>{s.nombre}</strong>
                {s.descripcion && <span> — {s.descripcion}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
