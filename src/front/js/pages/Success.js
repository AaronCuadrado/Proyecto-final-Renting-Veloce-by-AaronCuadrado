import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/modalReserve.css";

export const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get("booking_id");

    const handleGoHome = () => {
        navigate("/home"); 
    };

    useEffect(() => {
        if (!bookingId) {
            console.error("No booking ID found");
            navigate("/"); 
        }
    }, [bookingId, navigate]);

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Reserva Confirmada</h2>
                <p>
                    ¡Tu reserva ha sido confirmada!
                    <br />
                    ID de la reserva: <strong>{bookingId}</strong>
                </p>
                <button className="button" onClick={handleGoHome}>
                    Volver a Inicio
                </button>
            </div>
        </div>
    );
};
