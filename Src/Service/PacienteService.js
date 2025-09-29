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

// Buscar pacientes (para recepcionista)
export const buscarPacientes = async (query) => {
    try {
        const response = await apiConexion.get(`/pacientes/buscar?q=${query}`);
        if (response.data.success) {
            return { success: true, data: response.data.data };
        }
        return { success: false, message: "No se encontraron pacientes." };
    } catch (error) {
        console.error("Error en buscarPacientes:", error.response?.data || error.message);
        return { success: false, message: "Error al conectar con el servidor." };
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

export async function eliminarCuentaPaciente() {
    try {
        const token = await AsyncStorage.getItem("userToken");
        
        if (!token) {
            return { success: false, message: "No hay sesión activa." };
        }

        // Llama al endpoint 'eliminarCuenta' usando el método DELETE
        const response = await apiConexion.delete('eliminarCuenta', {
            headers: {
                Authorization: `Bearer ${token}`, // Envía el token para identificar al usuario
            }
        });

        // La API de Laravel devuelve un objeto JSON con success: true
        if (response.data && response.data.success) {
            // Limpiamos el almacenamiento local después de la eliminación exitosa en el backend
            await AsyncStorage.multiRemove(["userToken", "rolUser"]);
            return { success: true, message: response.data.message };
        } else {
            // Maneja el caso en que el backend no devuelve success: true
            return { success: false, message: response.data.message || "Error al eliminar la cuenta." };
        }
        
    } catch (error) {
        console.error("Error en el servicio de eliminación de cuenta:", error.response?.data || error.message);
        // Captura el mensaje de error del servidor (si existe)
        const errorMessage = error.response?.data?.message || "Error de red o servidor al eliminar.";
        return { success: false, message: errorMessage };
    }
}