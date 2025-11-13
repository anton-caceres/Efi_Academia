import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const DAYS_ORDER = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function normalizeDay(horario = '') {
  const firstWord = horario.trim().split(' ')[0].toLowerCase();

  if (firstWord.startsWith('lun')) return 'Lunes';
  if (firstWord.startsWith('mar')) return 'Martes';
  if (firstWord.startsWith('mié') || firstWord.startsWith('mie')) return 'Miércoles';
  if (firstWord.startsWith('jue')) return 'Jueves';
  if (firstWord.startsWith('vie')) return 'Viernes';
  if (firstWord.startsWith('sáb') || firstWord.startsWith('sab')) return 'Sábado';

  return 'Otros';
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isEstudiante = user?.rol === 'estudiante';

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${API_URL}/enrollments`);
        setEnrollments(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar inscripciones para el horario');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const groupedByDay = useMemo(() => {
    const groups = {};
    enrollments.forEach((e) => {
      const horario = e.clase?.horario || '';
      const day = normalizeDay(horario);
      if (!groups[day]) groups[day] = [];
      groups[day].push(e);
    });
    return groups;
  }, [enrollments]);

  if (!user) {
    return (
      <div className="card">
        <h2>Acceso restringido</h2>
        <p>Tenés que iniciar sesión para ver tu horario.</p>
        <Link to="/login" className="btn" style={{ marginTop: '1rem' }}>
          Ir a login
        </Link>
      </div>
    );
  }

  if (!isEstudiante) {
    return (
      <div className="card">
        <h2>Solo para estudiantes</h2>
        <p>La vista de horario está disponible únicamente para usuarios con rol estudiante.</p>
        <Link to="/dashboard" className="btn" style={{ marginTop: '1rem' }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Mi horario semanal</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        Vista organizada por día. Cada bloque corresponde a una clase en la que estás inscripto.
      </p>

      {loading && <p>Cargando horario...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && enrollments.length === 0 && (
        <p>No tenés inscripciones registradas. Podés inscribirte desde la sección Clases.</p>
      )}

      {!loading && !error && enrollments.length > 0 && (
        <div className="schedule-grid">
          {DAYS_ORDER.map((day) => (
            <div key={day} className="schedule-column">
              <div className="schedule-column-header">{day}</div>
              <div className="schedule-column-body">
                {groupedByDay[day]?.length ? (
                  groupedByDay[day].map((e) => (
                    <div key={e.id} className="schedule-item">
                      <div className="schedule-item-title">
                        {e.clase?.asignatura?.nombre || `Clase #${e.id_clase}`}
                      </div>
                      <div className="schedule-item-meta">
                        <span className="schedule-badge">
                          {e.clase?.horario || 'Horario no especificado'}
                        </span>
                        <span className="schedule-badge subtle">
                          {e.clase?.salon || 'Sin salón'}
                        </span>
                      </div>
                      {e.clase?.profesor && (
                        <div className="schedule-prof">
                          {e.clase.profesor.nombre} ({e.clase.profesor.correo})
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="schedule-empty">Sin clases este día</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
