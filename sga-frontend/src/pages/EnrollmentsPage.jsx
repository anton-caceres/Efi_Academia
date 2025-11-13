import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { downloadSchedulePdf, downloadProfessorEnrollmentsPdf } from '../utils/pdfUtils';

const API_URL = import.meta.env.VITE_API_URL;

export default function EnrollmentsPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = user?.rol === 'admin';
  const isProfesor = user?.rol === 'profesor';
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
        setError('Error al cargar inscripciones');
      } finally {
        setLoading(false);
      }
    }

    fetchEnrollments();
  }, []);

  async function handleDelete(id) {
    setError(null);
    setActionMsg(null);
    setDeletingId(id);

    try {
      await axios.delete(`${API_URL}/enrollments/${id}`);
      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      setActionMsg('Inscripción eliminada correctamente');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al eliminar inscripción');
    } finally {
      setDeletingId(null);
    }
  }

  function handleDownloadStudentPdf() {
    downloadSchedulePdf(enrollments, user);
  }

  function handleDownloadProfessorPdf() {
    downloadProfessorEnrollmentsPdf(enrollments, user);
  }

  if (!user) {
    return (
      <div className="card">
        <h2>Acceso restringido</h2>
        <p>Tenés que iniciar sesión para ver las inscripciones.</p>
        <Link to="/login" className="btn" style={{ marginTop: '1rem' }}>
          Ir a login
        </Link>
      </div>
    );
  }

  const title = isAdmin
    ? 'Todas las inscripciones'
    : isProfesor
    ? 'Inscripciones a mis clases'
    : 'Mis inscripciones';

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap'
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {isEstudiante && enrollments.length > 0 && (
            <button className="btn" onClick={handleDownloadStudentPdf}>
              Descargar horario en PDF
            </button>
          )}
          {isProfesor && enrollments.length > 0 && (
            <button className="btn btn-outline" onClick={handleDownloadProfessorPdf}>
              Descargar lista de inscriptos
            </button>
          )}
        </div>
      </div>

      {loading && <p>Cargando inscripciones...</p>}
      {error && <p className="error-text">{error}</p>}
      {actionMsg && <p className="success-text">{actionMsg}</p>}

      {!loading && !error && enrollments.length === 0 && (
        <p>No hay inscripciones registradas.</p>
      )}

      {!loading && !error && enrollments.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <ul>
            {enrollments.map((e) => (
              <li key={e.id} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.9rem' }}>
                  <strong>
                    {e.clase?.asignatura
                      ? e.clase.asignatura.nombre
                      : `Clase #${e.id_clase}`}
                  </strong>
                  {e.clase && (
                    <span>
                      {' '}
                      · {e.clase.horario} · {e.clase.salon}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                  {isAdmin && e.estudiante && (
                    <div>
                      Estudiante: {e.estudiante.nombre} ({e.estudiante.correo})
                    </div>
                  )}
                  {isProfesor && e.estudiante && (
                    <div>
                      Estudiante: {e.estudiante.nombre} ({e.estudiante.correo})
                    </div>
                  )}
                  {isEstudiante && e.clase?.profesor && (
                    <div>
                      Profesor: {e.clase.profesor.nombre} (
                      {e.clase.profesor.correo})
                    </div>
                  )}
                  <div>Fecha de inscripción: {e.fecha_inscripcion}</div>
                </div>

                {(isAdmin || isEstudiante) && (
                  <button
                    className="btn btn-outline"
                    style={{ marginTop: '0.25rem' }}
                    onClick={() => handleDelete(e.id)}
                    disabled={deletingId === e.id}
                  >
                    {deletingId === e.id ? 'Eliminando...' : 'Cancelar inscripción'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
