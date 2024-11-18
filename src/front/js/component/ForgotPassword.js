import React, { useState } from "react";
import "../../styles/forgotPassword.css";

export const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://orange-telegram-69v46wjjw5xwhprw-3001.app.github.dev/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Se ha enviado un correo para restablecer tu contraseña.");
            } else {
                setMessage(data.error || "Hubo un error al procesar tu solicitud.");
            }
        } catch (error) {
            setMessage("Error al conectar con el servidor.");
        }
    };

    const handleClose = () => {
        window.location.href = "/home";
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={handleClose}>
                    &times;
                </button>
                <h2>¿Has olvidado tu contraseña?</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">
                        Enviar
                    </button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};
