import React, { useState, useEffect } from "react";
import "../../styles/profile.css";

export const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch("${BACKEND_URL}api/users/1", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                setUsername(data.username);
            } else {
                setError("Error al cargar los datos del usuario");
            }
        } catch (err) {
            console.error("Error al conectar con el servidor", err);
            setError("Error al conectar con el servidor");
        }
    };

    const handleUsernameChange = async () => {
        try {
            const response = await fetch("${BACKEND_URL}api/users/1", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username }),
            });

            if (response.ok) {
                setMessage("Nombre de usuario actualizado con éxito");
                fetchUserData();
            } else {
                const data = await response.json();
                setError(data.error || "Error al actualizar el nombre de usuario");
            }
        } catch (err) {
            console.error("Error al conectar con el servidor", err);
            setError("Error al conectar con el servidor");
        }
    };

    const handlePasswordChange = async () => {
        try {
            const response = await fetch("${BACKEND_URL}api/users/1/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                setMessage("Contraseña actualizada con éxito");
                setCurrentPassword("");
                setNewPassword("");
            } else {
                const data = await response.json();
                setError(data.error || "Error al actualizar la contraseña");
            }
        } catch (err) {
            console.error("Error al conectar con el servidor", err);
            setError("Error al conectar con el servidor");
        }
    };

    return (
        <div className="profile-container">
            <h2>Mi Perfil</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            {userData ? (
                <div className="profile-details">
                    <div className="profile-field">
                        <label>Nombre de Usuario:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button onClick={handleUsernameChange}>Actualizar</button>
                    </div>
                    <div className="profile-field">
                        <label>Email:</label>
                        <p>{userData.email}</p>
                    </div>
                    <div className="profile-field">
                        <label>Cambiar Contraseña:</label>
                        <input
                            type="password"
                            placeholder="Contraseña Actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button onClick={handlePasswordChange}>Actualizar Contraseña</button>
                    </div>
                </div>
            ) : (
                <p>Cargando datos del perfil...</p>
            )}
        </div>
    );
};
