import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../../styles/navbar/navbarAfter.css";
import logo from "../../img/VELOCE.png";
import { Context } from "../store/appContext";

export const NavbarAfterLogin = () => {
    const { store, actions } = useContext(Context); 
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(
                "https://vigilant-system-pj7pv9xx997pf97x5-3001.app.github.dev/api/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (response.ok) {
                console.log("Sesión cerrada exitosamente");
                actions.logout();
                navigate("/home");
            } else {
                console.error("Error al cerrar sesión");
            }
        } catch (error) {
            console.error(
                "Error al conectar con el backend para cerrar sesión:",
                error
            );
        }
    };

    return (
        <div className="navbar">
            <div className="navbar-container">
                {/* Logo de la web */}
                <div className="navbar-logo">
                    <Link to="/home">
                        <img src={logo} alt="Veloce logo" className="logo" />
                    </Link>
                    <span className="navbar-title">Veloce Rent</span>
                </div>

                {/* Menú después de iniciar sesión */}
                <div className="navbar-buttons">
                    <Link to="/vehicles" className="navbar-link">
                        Ver Vehículos
                    </Link>
                    {store.user?.is_admin && (
                        <>
                            <Link to="/admin/add-vehicle" className="navbar-link">
                                Añadir Vehículo
                            </Link>
                            <Link to="/admin/manage-vehicles" className="navbar-link">
                                Gestionar Vehículos
                            </Link>
                        </>
                    )}
                    <Link to="/profile" className="navbar-link">
                         Mi Perfil
                    </Link>
                    <button
                        className="navbar-link logout-button"
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
