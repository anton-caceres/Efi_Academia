import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminSubjectsPage from './pages/AdminSubjectsPage';
import ClassesPage from './pages/ClassesPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import SchedulePage from './pages/SchedulePage';
import {
  FiHome,
  FiBookOpen,
  FiCalendar,
  FiUserCheck,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiClock
} from 'react-icons/fi';

function Layout({ children }) {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link-active' : ''}`;

  return (
    <div className="app">
      <header className="app-header">
        <h1>SGA Universitario</h1>
        <nav>
          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                <FiHome /> Inicio
              </NavLink>
              <NavLink to="/classes" className={linkClass}>
                <FiCalendar /> Clases
              </NavLink>
              <NavLink to="/enrollments" className={linkClass}>
                <FiUserCheck /> Inscripciones
              </NavLink>
              {user.rol === 'estudiante' && (
                <NavLink to="/schedule" className={linkClass}>
                  <FiClock /> Mi horario
                </NavLink>
              )}
              {user.rol === 'admin' && (
                <NavLink to="/admin/subjects" className={linkClass}>
                  <FiBookOpen /> Asignaturas
                </NavLink>
              )}
              <span className="user-pill">
                {user.nombre} ({user.rol})
              </span>
              <button onClick={logout} className="btn btn-outline">
                <FiLogOut /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                <FiLogIn /> Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                <FiUserPlus /> Registro
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <span>Sistema de Gestión Académica - Demo</span>
      </footer>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute>
              <AdminSubjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classes"
          element={
            <ProtectedRoute>
              <ClassesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/enrollments"
          element={
            <ProtectedRoute>
              <EnrollmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <SchedulePage />
            </ProtectedRoute>
          }
        />

        {/* Ruta fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
