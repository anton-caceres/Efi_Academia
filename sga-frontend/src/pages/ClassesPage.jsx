import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function ClassesPage() {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario para crear clase (admin / profesor)
  const [idAsignatura, setIdAsignatura] = useState('');
  const [idProfesor, setIdProfesor] = useState('');
  const [horario, setHorario] = useState('');
  const [salon, setSalon] = useState('');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState(null);

  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollMsg, setEnrollMsg] = useState(null);

  const isAdmin = user?.rol === 'admin';
  const isProfesor = user?.rol === 'profesor';
  const isEstudiante = user?.rol === 'estudiante';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [subjectsRes, classesRes] = await Promise.all([
          axios.get(`${API_URL}/subjects`),
          axios.get(`${API_URL}/classes`)
        ]);

        setSubjects(subjectsRes.data);
        setClasses(classesRes.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar datos de clases');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleCreateClass(e) {
    e.preventDefault();
    setCreateMsg(null);
    setError(null);
    setCreating(true);

    try {
      const payload = {
        id_asignatura: Number(idAsignatura),
        horario,
        salon
      };

      // Admin debe indicar id_profesor manualmente
      if (isAdmin) {
        payload.id_profesor = Number(idProfesor);
      }

      const { data } = await axios.post(`${API_URL}/classes`, payload);

      setClasses((prev) => [...prev, data]);
      setCreateMsg('Clase creada correctamente');
      setIdAsignatura('');
      setIdProfesor('');
      setHorario('');
      setSalon('');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al crear la clase');
    } finally {
      setCreating(false);
    }
  }

  async function handleEnroll(idClase) {
    setEnrollMsg(null);
    setError(null);
    setEnrollingId(idClase);

    try {
      await axios.post(`${API_URL}/enrollments`, {
        id_clase: idClase
      });

      setEnrollMsg('Inscripción realizada correctamente');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al inscribirse en la clase');
    } finally {
      setEnrollingId(null);
    }
  }

  if (!user) {
    return (
      <div className="card">
        <h2>Acceso restringido</h2>
        <p>Tenés que iniciar sesión para ver las clases.</p>
        <Link to="/login" className="btn" style={{ marginTop: '1rem' }}>
          Ir a login
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-2">
      {(isAdmin || isProfesor) && (
        <div className="card">
          <h2>{isAdmin ? 'Crear clase (Admin)' : 'Crear clase (Profesor)'}</h2>
          <form className="form-grid" onSubmit={handleCreateClass}>
            <div>
              <label>Asignatura</label>
              <select
                value={idAsignatura}
                onChange={(e) => setIdAsignatura(e.target.value)}
                required
              >
                <option value="">Seleccioná una asignatura</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            {isAdmin && (
              <div>
                <label>ID del profesor</label>
                <input
                  type="number"
                  value={idProfesor}
                  onChange={(e) => setIdProfesor(e.target.value)}
                  required
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  (Más adelante se puede mejorar para elegir profesor de una lista)
                </p>
              </div>
            )}

            <div>
              <label>Horario</label>
              <input
                type="text"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                placeholder="Ej: Lunes 10:00 - 12:00"
                required
              />
            </div>

            <div>
              <label>Salón</label>
              <input
                type="text"
                value={salon}
                onChange={(e) => setSalon(e.target.value)}
                placeholder="Ej: Aula 12"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            {createMsg && <p className="success-text">{createMsg}</p>}

            <button type="submit" className="btn btn-full" disabled={creating}>
              {creating ? 'Creando...' : 'Crear clase'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>
          {isAdmin && 'Todas las clases'}
          {isProfesor && 'Mis clases'}
          {isEstudiante && 'Oferta de clases'}
        </h2>

        {loading && <p>Cargando clases...</p>}
        {!loading && error && <p className="error-text">{error}</p>}
        {!loading && !error && classes.length === 0 && (
          <p>No hay clases cargadas.</p>
        )}

        {!loading && !error && classes.length > 0 && (
          <ul>
            {classes.map((c) => (
              <li key={c.id} style={{ marginBottom: '0.75rem' }}>
                <div>
                  <strong>
                    {c.asignatura ? c.asignatura.nombre : `Clase #${c.id}`}
                  </strong>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                    {c.profesor && (
                      <span>
                        Profesor: {c.profesor.nombre} ({c.profesor.correo}) ·{' '}
                      </span>
                    )}
                    <span>
                      Horario: {c.horario} · Salón: {c.salon}
                    </span>
                  </div>
                </div>

                {isEstudiante && (
                  <button
                    className="btn btn-outline"
                    style={{ marginTop: '0.25rem' }}
                    onClick={() => handleEnroll(c.id)}
                    disabled={enrollingId === c.id}
                  >
                    {enrollingId === c.id ? 'Inscribiendo...' : 'Inscribirme'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {enrollMsg && (
          <p className="success-text" style={{ marginTop: '0.5rem' }}>
            {enrollMsg}
          </p>
        )}
      </div>
    </div>
  );
}
