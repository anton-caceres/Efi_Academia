import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminSubjectsPage from './pages/AdminSubjectsPage';

function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>SGA Universitario</h1>
        <nav>
          {user ? (
            <>
              <Link to="/dashboard" className="btn-outline btn">Dashboard</Link>
              <span className="user-pill">{user.nombre} ({user.rol})</span>
              <button onClick={logout} className="btn btn-outline">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn">Registro</Link>
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

        {/* Ruta fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
