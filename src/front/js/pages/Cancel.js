import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/modalReserve.css"; 

export const Cancel = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/home"); 
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Pago Cancelado</h2>
                <p>La reserva no ha podido completarse. Por favor, inténtalo de nuevo más tarde.</p>
                <button className="button" onClick={handleGoHome}>
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};
