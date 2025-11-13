import { useState } from "react";
import { FiSend, FiMail, FiUser } from "react-icons/fi";

export default function ContactPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      setError("Por favor completá todos los campos.");
      return;
    }

    // Simulación de envío (no hay backend real para contacto)
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setSuccess("Tu consulta fue registrada. Gracias por contactarte.");
      setNombre("");
      setCorreo("");
      setMensaje("");
    }, 700);
  }

  return (
    <div className="card contact-container">
      <div className="contact-header">
        <h2>Contacto y soporte</h2>
        <p>
          Si tenés dudas sobre el funcionamiento del Sistema de Gestión Académica
          o detectás algún problema, podés dejar tu consulta a continuación.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-row">
          <div className="contact-field">
            <label>
              <FiUser /> Nombre
            </label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="contact-field">
            <label>
              <FiMail /> Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
        </div>

        <div className="contact-field">
          <label>Mensaje</label>
          <textarea
            placeholder="Describí tu consulta o problema..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={4}
          />
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button className="btn btn-full" type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : (
            <>
              <FiSend /> Enviar consulta
            </>
          )}
        </button>
      </form>

      <p className="contact-note">
        Esta sección simula el envío de consultas a soporte académico. En un entorno
        de producción, se integraría con un servicio de correo o sistema de tickets.
      </p>
    </div>
  );
}
