import { Link } from "react-router-dom";
import { FiLogIn, FiUserPlus, FiBookOpen } from "react-icons/fi";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="landing-overlay" />

        <div className="landing-content">
          <h1 className="landing-title">
            Sistema de Gestión Académica Universitaria
          </h1>
          <p className="landing-subtitle">
            Organización, eficiencia y claridad en un solo lugar.
          </p>

          <div className="landing-buttons">
            <Link to="/login" className="btn landing-btn">
              <FiLogIn /> Iniciar sesión
            </Link>
            <Link to="/register" className="btn btn-outline landing-btn">
              <FiUserPlus /> Registrarme
            </Link>
          </div>
        </div>
      </div>

      <section className="landing-features-section">
        <h2 className="landing-features-title">Funciones principales</h2>

        <div className="landing-features">
          <div className="landing-feature-card">
            <FiBookOpen className="landing-feature-icon" />
            <h3>Clases y Asignaturas</h3>
            <p>Accedé a toda tu actividad académica de forma clara.</p>
          </div>

          <div className="landing-feature-card">
            <FiUserPlus className="landing-feature-icon" />
            <h3>Gestión por Roles</h3>
            <p>Admin, profesor y estudiante: cada uno con su vista.</p>
          </div>

          <div className="landing-feature-card">
            <FiLogIn className="landing-feature-icon" />
            <h3>Ingreso Seguro</h3>
            <p>Autenticación con JWT y rutas protegidas.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
