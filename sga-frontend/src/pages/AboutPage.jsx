import { FiSettings, FiUserCheck, FiAward } from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="card about-container">
      <section className="about-header">
        <h2>Acerca del Sistema de Gestión Académica</h2>
        <p>
          Este sistema fue desarrollado como proyecto académico para gestionar
          de forma integrada usuarios, asignaturas, clases e inscripciones en
          un entorno universitario.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <FiSettings className="about-icon" />
          <h3>Objetivo</h3>
          <p>
            Centralizar la información académica y facilitar el trabajo de
            administración, docentes y estudiantes.
          </p>
        </div>

        <div className="about-card">
          <FiUserCheck className="about-icon" />
          <h3>Perfiles de usuario</h3>
          <ul>
            <li><strong>Administrador:</strong> gestiona asignaturas y clases.</li>
            <li><strong>Profesor:</strong> administra sus clases y ve inscriptos.</li>
            <li><strong>Estudiante:</strong> se inscribe a clases y consulta su horario.</li>
          </ul>
        </div>

        <div className="about-card">
          <FiAward className="about-icon" />
          <h3>Características destacadas</h3>
          <ul>
            <li>Autenticación con JWT y rutas protegidas.</li>
            <li>Generación de reportes en PDF.</li>
            <li>Vista de horario semanal para estudiantes.</li>
          </ul>
        </div>
      </section>

      <section className="about-footer">
        <p>
          El enfoque del proyecto no es solo técnico, sino también orientado a la
          experiencia de usuario, buscando que la interfaz sea clara, moderna y
          cercana a sistemas académicos reales.
        </p>
      </section>
    </div>
  );
}
