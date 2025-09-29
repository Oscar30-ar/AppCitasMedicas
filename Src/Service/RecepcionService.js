import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "./Conexion";

/**
 * Crea una nueva cita desde el panel de recepcionista.
 * @param {object} citaData - Datos de la cita { id_paciente, id_doctor, fecha, hora }.
 */
export const crearCita = async (citaData) => {
    try {
        // La recepcionista crea la cita como 'confirmada' por defecto.
        const response = await apiConexion.post("/citas", { ...citaData, estado: "confirmada" });

        if (response.data.success) {
            return { success: true, message: response.data.message || "Cita creada exitosamente." };
        }
        return { success: false, message: response.data.message || "No se pudo crear la cita." };

    } catch (error) {
        console.error("Error en servicio crearCita:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || "Error al conectar con el servidor." };
    }
};