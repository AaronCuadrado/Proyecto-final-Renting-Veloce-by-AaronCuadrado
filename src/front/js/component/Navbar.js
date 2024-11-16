import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar/navbar.css";
import logo from "../../img/VELOCE.png";
import { ModalRegister } from "../../component/ModalRegister";
import { ModalLogin }  from "../../component/ModalLogin";

export const Navbar = () => {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

    // Cleanup automático para evitar actualizaciones en componentes desmontados
    useEffect(() => {
        let isMounted = true;

        return () => {
            isMounted = false;
        };
    }, []);

    // Manejo de apertura de modales
    const openLoginModal = () => {
        setShowLoginModal(true);
    };

    const openRegisterModal = () => {
        setShowRegisterModal(true);
    };

    const toggleHamburgerMenu = () => {
        setShowHamburgerMenu(!showHamburgerMenu);
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

                {/* Menú hamburguesa */}
                <button className="hamburger-icon" onClick={toggleHamburgerMenu}>
                    &#9776; {/* codigo para el menu hamburguesa*/}
                </button>
                {showHamburgerMenu && (
                    <div className="hamburger-dropdown">
                        <Link to="/vehicles" className="navbar-link" onClick={toggleHamburgerMenu}>
                            Ver Vehículos
                        </Link>
                        <button className="navbar-link" onClick={() => {
                            openRegisterModal();
                            toggleHamburgerMenu();
                        }}>
                            Registrarse
                        </button>
                        <button className="navbar-link" onClick={() => {
                            openLoginModal();
                            toggleHamburgerMenu();
                        }}>
                            Iniciar Sesión
                        </button>
                    </div>
                )}
            </div>

            {/* Modales */}
            {showRegisterModal && (
                <ModalRegister onClose={() => setShowRegisterModal(false)} />
            )}
            {showLoginModal && <ModalLogin onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};
