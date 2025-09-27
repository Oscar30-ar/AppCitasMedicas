import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "./Conexion";

//Registrar Paciente
export const registrarPaciente = async (userData) => {
    try {
        const response = await apiConexion.post('/registrarPaciente', userData);
        return { success: true, message: "Registro exitoso", user: response.data };
    } catch (error) {
        console.error("Error en registrarPaciente:", error);
        const errorMessage = error.response?.data?.message || "Error al registrar paciente";
        return { success: false, message: errorMessage };
    }
};


//Editar Perfil Paciente
export const updatePacientePerfil = async (userData) => {
    try {
        // Usa PUT para enviar el objeto completo de datos de usuario
        const response = await apiConexion.put('/me/paciente', userData);
        return { success: true, message: " Perfil actualizado correctamente, por favor inicie sesión nuevamente para ver los cambios.", user: response.data };
    } catch (error) {
        console.error("Error en updatePacientePerfil:", error);
        // El interceptor de apiConexion ya maneja errores 401
        const errorMessage = error.response?.data?.message || "Error al actualizar el perfil del paciente";
        return { success: false, message: errorMessage };
    }
};

//Historial Medico del Paciente 
export const HistorialMedico = async () => {
    try {
        const response = await apiConexion.get('/citas/historial-paciente'); 
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error al obtener historial médico:", error);
        return { 
            success: false, 
            message: "No se pudo cargar el historial médico." 
        };
    }
};

//Proximas citas 
export const ProximasCitas = async () => {
    try {
        const response = await apiConexion.get('/citas/proximas'); 
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error al obtener próximas citas:", error);
        return { 
            success: false, 
            message: "No se pudieron cargar las próximas citas." 
        };
    }
};