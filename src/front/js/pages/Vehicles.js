import React, { useContext, useEffect, useState } from "react";
import "../../styles/vehicles.css"; 
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Vehicles = () => {
    const { store } = useContext(Context);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("${BACKEND_URL}api/vehicles", {
                    method: "GET",
                });
                if (!response.ok) {
                    throw new Error("Error al cargar los vehículos");
                }
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar los vehículos.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleReserveClick = (vehicle) => {
        if (!store.user) {
            setShowModal(true);
            return;
        }
        navigate("/reserve", { state: { vehicle } });
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (loading) {
        return <p>Cargando vehículos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="vehicles-container">
            <h1>Vehículos Disponibles</h1>
            <div className="vehicles-grid">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="vehicle-card">
                        <img
                            src={vehicle.image_url}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="vehicle-image"
                        />
                        <div className="vehicle-info">
                            <h3>{`${vehicle.brand} ${vehicle.model}`}</h3>
                            <p>Color: {vehicle.color}</p>
                            <p>Año: {vehicle.year}</p>
                            <p>Precio mensual: {vehicle.monthly_price}€</p>
                            <button
                                className="reserve-button"
                                onClick={() => handleReserveClick(vehicle)}
                            >
                                Reservar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Hace falta iniciar sesión para reservar.</p>
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};
