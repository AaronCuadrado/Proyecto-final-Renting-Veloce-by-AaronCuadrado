import React, { useState } from "react";
import "../../styles/admin/adminAddVehicle.css";

export const AdminAddVehicle = () => {
    const [vehicleData, setVehicleData] = useState({
        brand: "",
        model: "",
        year: "",
        color: "",
        monthly_price: "",
        image_url: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setVehicleData({
            ...vehicleData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/vehicles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include", // Incluye las cookies de sesión
                body: JSON.stringify(vehicleData),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                setError("");
                setVehicleData({
                    brand: "",
                    model: "",
                    year: "",
                    color: "",
                    monthly_price: "",
                    image_url: "",
                });
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Error al agregar el vehículo");
            }
        } catch (err) {
            console.error("Error al conectar con el backend:", err);
            setError("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="admin-add-vehicle">
            <h2>Agregar Vehículo</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form className="formulario" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Marca:</label>
                    <input
                        type="text"
                        name="brand"
                        value={vehicleData.brand}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Modelo:</label>
                    <input
                        type="text"
                        name="model"
                        value={vehicleData.model}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Año:</label>
                    <input
                        type="number"
                        name="year"
                        value={vehicleData.year}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Color:</label>
                    <input
                        type="text"
                        name="color"
                        value={vehicleData.color}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Precio Mensual (€):</label>
                    <input
                        type="number"
                        name="monthly_price"
                        value={vehicleData.monthly_price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>URL de Imagen:</label>
                    <input
                        type="text"
                        name="image_url"
                        value={vehicleData.image_url}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group form-submit">
                    <button type="submit">Agregar Vehículo</button>
                </div>
            </form>
        </div>
    );
};
