const getState = ({ getStore, setStore }) => {
    return {
        store: {
            isAuthenticated: false,
            user: null,
        },
        actions: {
            login: (user) => {
                setStore({ isAuthenticated: true, user });
                console.log("Inicio de sesión exitoso", user);
            },

            logout: async () => {
                try {
                    const response = await fetch("https://vigilant-system-pj7pv9xx997pf97x5-3001.app.github.dev/api/logout", {
                        method: "POST",
                        credentials: "include", // Asegura que las cookies se gestionen correctamente
                    });

                    if (response.ok) {
                        setStore({ isAuthenticated: false, user: null });
                        console.log("Cierre de sesión exitoso");
                    } else {
                        console.error("Error al cerrar sesión");
                    }
                } catch (error) {
                    console.error("Error al conectar con el backend para cerrar sesión:", error);
                }
            },

            syncAuth: async () => {
                try {
                    const response = await fetch("https://vigilant-system-pj7pv9xx997pf97x5-3001.app.github.dev/api/session-info", {
                        method: "GET",
                        credentials: "include", // Asegura que las cookies de sesión se envíen
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ isAuthenticated: true, user: data }); // Almacena directamente el usuario
                        console.log("Sesión sincronizada", data);
                    } else {
                        setStore({ isAuthenticated: false, user: null });
                        console.log("No hay sesión activa");
                    }
                } catch (error) {
                    console.error("Error al sincronizar sesión:", error);
                    setStore({ isAuthenticated: false, user: null });
                }
            },
        },
    };
};

export default getState;
