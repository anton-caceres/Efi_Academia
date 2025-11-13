import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchSubjects() {
      try {
        setLoadingSubjects(true);
        const { data } = await axios.get(`${API_URL}/subjects`);
        setSubjects(data);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          setErrorSubjects('No autorizado para ver asignaturas');
        } else {
          setErrorSubjects('Error al cargar asignaturas');
        }
      } finally {
        setLoadingSubjects(false);
      }
    }

    fetchSubjects();
  }, [authLoading, user]);

  const isAdmin = user?.rol === 'admin';
  const isProfesor = user?.rol === 'profesor';
  const isEstudiante = user?.rol === 'estudiante';

  if (authLoading) {
    return <p>Cargando sesión...</p>;
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Bienvenido, {user?.nombre}</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Rol: <strong>{user?.rol}</strong>
        </p>

        {isAdmin && (
          <>
            <h3>Panel de administrador</h3>
            <p>Elegí una opción de gestión:</p>
            <div className="grid" style={{ marginTop: '0.75rem' }}>
              <Link to="/admin/subjects" className="btn">
                Gestionar asignaturas
              </Link>
            </div>
          </>
        )}

        {isProfesor && (
          <>
            <h3>Panel de profesor</h3>
            <ul>
              <li>Ver mis clases (sección Clases)</li>
              <li>Ver inscripciones a mis clases (sección Inscripciones)</li>
            </ul>
          </>
        )}

        {isEstudiante && (
          <>
            <h3>Panel de estudiante</h3>
            <ul>
              <li>Ver oferta de clases e inscribirme (sección Clases)</li>
              <li>Ver mis inscripciones y descargar PDF (sección Inscripciones)</li>
            </ul>
          </>
        )}
      </div>

      <div className="card">
        <h2>Asignaturas (vista rápida)</h2>
        {loadingSubjects && <p>Cargando asignaturas...</p>}
        {errorSubjects && <p className="error-text">{errorSubjects}</p>}
        {!loadingSubjects && !errorSubjects && subjects.length === 0 && (
          <p>No hay asignaturas cargadas.</p>
        )}
        {!loadingSubjects && subjects.length > 0 && (
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
