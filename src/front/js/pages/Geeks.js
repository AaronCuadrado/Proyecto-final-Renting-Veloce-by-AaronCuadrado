import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/geeks.css";

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      <h1>¡Gracias a 4Geeks Academy por todo!</h1>
      <div className="requisitos">
        <h2>Requisitos Mínimos del Proyecto</h2>
        <ul>
          <li>✔️ Buen diseño(en mi opinion).</li>
          <li>✔️ Sistema de registro, autenticacion y restablecimiento de contraseña.</li>
          <li>✔️ Contraseñas cifradas.</li>
          <li>✔️ Backend con una API personalizada para gestionar las transacciones.</li>
          <li>✔️ Diseño responsivo para diferentes dispositivos.</li>
          <li>✔️ Tres vistas de contenido adicionales y CRUD</li>
          <ul> 
            {/* CRUD Create(crear), Read(leer), Update, (actualizar), Delete(eliminar) */}
            <li>✔️ Inicio.</li>
            <li>✔️ Explorador de vehiculos.</li>
            <li>✔️ Reservas de vehiculos.</li>
            <li>✔️ Administración de vehiculos.</li>
            <li>✔️ Perfil de usuario.</li>
          </ul>
          <li>✔️ Integracion con API externa. Stripe en este caso.</li>
        </ul>
      </div>
      <div className="boton-container">
        <button onClick={() => navigate("/home")}>Mi Proyecto Final</button>
      </div>
    </div>
  );
};

export default Inicio;
