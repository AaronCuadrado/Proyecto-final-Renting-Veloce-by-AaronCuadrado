import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/navbar/modalLogin.css";

export const ModalLogin = ({ onClose }) => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("${BACKEND_URL}api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:"include",
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.error || "Error al iniciar sesión.");
                return;
            }

            const data = await response.json();
            console.log("Inicio de sesión exitoso", data);

            // Verifica si actions.login existe antes de llamarlo
            if (actions && typeof actions.login === "function") {
                actions.login(data.user); // Llama a la acción login con los datos del usuario
                onClose(); 
            } else {
                console.error("actions.login no está definido o no es una función.");
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
            setErrorMessage("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="submit-button">
                        Iniciar Sesión
                    </button>
                </form>
                <div className="forgot-password">
                    <button className="forgot-password-button" onClick={() => window.location.href = "/forgot-password"}>
                        ¿Has olvidado tu contraseña?
                    </button>
                </div>
            </div>
        </div>
    );
};
