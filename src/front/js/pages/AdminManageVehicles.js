import React, { useState, useEffect } from "react";
import "../../styles/admin/adminManageVehicle.css";

export const AdminManageVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [editVehicle, setEditVehicle] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    
    useEffect(() => {
        fetchVehicles();
    }, []);

    
    const fetchVehicles = async () => {
        try {
            const response = await fetch("https://vigilant-system-pj7pv9xx997pf97x5-3001.app.github.dev/api/vehicles", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setVehicles(data);
            } else {
                setError("Error al cargar los vehículos");
            }
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            setError("Error al conectar con el servidor");
        }
    };

    
    const handleEdit = (vehicle) => {
        setEditVehicle(vehicle);
        setFormValues(vehicle);
    };

    
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://vigilant-system-pj7pv9xx997pf97x5-3001.app.github.dev/api/vehicles/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setMessage("Vehículo eliminado con éxito");
                setVehicles(vehicles.filter((v) => v.id !== id));
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Error al eliminar el vehículo");
            }
        } catch (err) {
            console.error("Error deleting vehicle:", err);
            setError("Error al conectar con el servidor");
        }
    };

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://vigilant-system-pj7pv9xx997pf97x5-3001.app.github.dev/api/vehicles/${editVehicle.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formValues),
            });
            if (response.ok) {
                setMessage("Vehículo actualizado con éxito");
                setEditVehicle(null);
                fetchVehicles();
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Error al actualizar el vehículo");
            }
        } catch (err) {
            console.error("Error updating vehicle:", err);
            setError("Error al conectar con el servidor");
        }
    };

    return (
        <div className="admin-manage-vehicles">
            <h2>Gestionar Vehículos</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            {editVehicle ? (
                <form onSubmit={handleSubmitEdit} className="edit-form">
                    <h3>Editar Vehículo</h3>
                    <label>Marca:</label>
                    <input
                        type="text"
                        name="brand"
                        value={formValues.brand || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Modelo:</label>
                    <input
                        type="text"
                        name="model"
                        value={formValues.model || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Año:</label>
                    <input
                        type="number"
                        name="year"
                        value={formValues.year || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Color:</label>
                    <input
                        type="text"
                        name="color"
                        value={formValues.color || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Precio Mensual (€):</label>
                    <input
                        type="number"
                        name="monthly_price"
                        value={formValues.monthly_price || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>URL de Imagen:</label>
                    <input
                        type="text"
                        name="image_url"
                        value={formValues.image_url || ""}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={() => setEditVehicle(null)}>
                        Cancelar
                    </button>
                </form>
            ) : (
                <table className="vehicles-table">
                    <thead>
                        <tr>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Color</th>
                            <th>Precio Mensual (€)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.brand}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.year}</td>
                                <td>{vehicle.color}</td>
                                <td>{vehicle.monthly_price}</td>
                                <td>
                                    <button onClick={() => handleEdit(vehicle)}>
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(vehicle.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
