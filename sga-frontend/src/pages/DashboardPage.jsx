import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiCalendar, FiUserCheck } from 'react-icons/fi';

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
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Rol: <strong>{user?.rol}</strong>
        </p>

        <div
          style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.8rem'
          }}
        >
          {isAdmin && (
            <div className="mini-card">
              <FiBookOpen />
              <h3>Administración</h3>
              <p>Gestioná asignaturas y clases del sistema.</p>
              <Link to="/admin/subjects" className="mini-card-link">
                Ir a asignaturas
              </Link>
            </div>
          )}

          {isProfesor && (
            <div className="mini-card">
              <FiCalendar />
              <h3>Clases a cargo</h3>
              <p>Consultá tus clases y estudiantes inscriptos.</p>
              <Link to="/classes" className="mini-card-link">
                Ver mis clases
              </Link>
            </div>
          )}

          {isEstudiante && (
            <>
              <div className="mini-card">
                <FiCalendar />
                <h3>Oferta de clases</h3>
                <p>Inscribite a las materias disponibles.</p>
                <Link to="/classes" className="mini-card-link">
                  Ver clases
                </Link>
              </div>
              <div className="mini-card">
                <FiUserCheck />
                <h3>Mi horario</h3>
                <p>Revisá tus inscripciones y horario semanal.</p>
                <Link to="/schedule" className="mini-card-link">
                  Ver horario
                </Link>
              </div>
            </>
          )}
        </div>
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
