import React, { useState } from "react";
import "../../styles/navbar/modalRegister.css";

export const ModalRegister = ({ onClose }) => {
    // Estados para los campos del formulario
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    // Valida el formulario antes de enviarlo
    const validateForm = () => {
        const newErrors = {};
        if (!username) newErrors.username = "El nombre de usuario es obligatorio.";
        if (!email.includes("@")) newErrors.email = "Introduce un email válido.";
        if (password.length < 6)
            newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
        if (password !== confirmPassword)
            newErrors.confirmPassword = "Las contraseñas no coinciden.";
        if (!birthdate) newErrors.birthdate = "La fecha de nacimiento es obligatoria.";

        return newErrors;
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Limpiar errores previos
        setSuccessMessage(""); // Limpiar mensaje de éxito

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            // Realizar la solicitud al backend
            const response = await fetch("https://proyecto-final-renting-veloce-by.onrender.com/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:"include",
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    birthdate,
                    is_admin: isAdmin,
                }),
            });

            // Manejar la respuesta del backend
            if (response.ok) {
                setSuccessMessage("¡Registro exitoso! Ahora puedes iniciar sesión.");
                setTimeout(() => {
                    onClose(); // Cerrar el modal después de unos segundos
                }, 2000);
            } else {
                const data = await response.json();
                setErrors({ general: data.error || "Error al registrar. Inténtalo de nuevo." });
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
            setErrors({ general: "Error al conectar con el servidor." });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Crear Cuenta</h2>
                {errors.general && <p className="error-message general">{errors.general}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Campo de Usuario */}
                    <div className="form-group">
                        <label>Nombre de Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Introduce tu nombre de usuario"
                        />
                        {errors.username && (
                            <span className="error-message">{errors.username}</span>
                        )}
                    </div>

                    {/* Campo de Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Introduce tu email"
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email}</span>
                        )}
                    </div>

                    {/* Campo de Contraseña */}
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introduce tu contraseña"
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password}</span>
                        )}
                    </div>

                    {/* Campo de Confirmar Contraseña */}
                    <div className="form-group">
                        <label>Repite la Contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Campo de Fecha de Nacimiento */}
                    <div className="form-group">
                        <label>Fecha de Nacimiento</label>
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                        />
                        {errors.birthdate && (
                            <span className="error-message">{errors.birthdate}</span>
                        )}
                    </div>
                        {/* Checkbox para Administrador */}
                        <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                            ¿Registrar como Administrador?
                        </label>
                        </div> 

                    {/* Botón de Enviar */}
                    <button type="submit" className="btn-submit">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};
