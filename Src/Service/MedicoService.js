import apiConexion from "./Conexion";
import AsyncStorage from "@react-native-async-storage/async-storage";


//Estadisticas/tarjetas
export const obtenerEstadisticas = async () => {
  try {
    const response = await apiConexion.get("/doctor/estadisticas");
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error.response?.data || error.message);
    return { citasHoy: 0, pacientesTotales: 0, pendientes: 0 };
  }
};

export const obtenerMisCitas = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const res = await apiConexion.get("/doctor/citas", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data.data };
  } catch (error) {
    console.error("Error obteniendo citas:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Error de conexión" };
  }
};

//Mis pacientes
export const obtenerMisPacientes = async () => {
    try {
        const response = await apiConexion.get("/doctor/pacientes");

        if (response.status === 200) {
            return { 
                success: true, 
                data: response.data.data,
                message: "Pacientes cargados." 
            };
        } 
        
        return { 
            success: false, 
            data: [], 
            message: response.data.message || "Respuesta inesperada del servidor." 
        };

    } catch (error) {
        console.error("Error en obtenerMisPacientes:", error);

        // Manejo de errores de red o del servidor (4xx, 5xx)
        if (error.response) {
            // Error de respuesta del servidor (ej: 401 Unauthorized, 404 Not Found)
            return { 
                success: false, 
                data: [], 
                message: error.response.data.message || "Error al obtener la lista de pacientes." 
            };
        }
        
        // Error de red (sin conexión)
        return { 
            success: false, 
            data: [], 
            message: "No se pudo conectar con el servidor. Verifica tu conexión a internet." 
        };
    }
};

// Historial de un paciente específico
export const obtenerHistorialPaciente = async (pacienteId) => {
    try {
        const response = await apiConexion.get(`/doctor/pacientes/${pacienteId}/historial`);

        if (response.status === 200) {
            return {
                success: true,
                data: response.data.data,
                message: "Historial cargado."
            };
        }

        return {
            success: false,
            data: [],
            message: response.data.message || "Respuesta inesperada del servidor."
        };

    } catch (error) {
        console.error("Error en obtenerHistorialPaciente:", error);

        if (error.response) {
            return {
                success: false,
                data: [],
                message: error.response.data.message || "Error al obtener historial."
            };
        }

        return {
            success: false,
            data: [],
            message: "No se pudo conectar con el servidor. Verifica tu conexión a internet."
        };
    }
};

//Editar Perfil Medico
export const updateMedicoPerfil = async (userData) => {
    try {
        const response = await apiConexion.put('/me/doctor', userData);
        return { success: true, message: "Perfil actualizado correctamente. Los cambios se reflejarán la próxima vez que inicie sesión.", user: response.data };
    } catch (error) {
        console.error("Error en updateMedicoPerfil:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Error al actualizar el perfil del médico";
        return { success: false, message: errorMessage };
    }
};

//eliminar cuenta
export async function eliminarCuentaMedico() {
    try {
        const response = await apiConexion.delete('eliminarCuenta');

        if (response.data && response.data.success) {
            await AsyncStorage.multiRemove(["userToken", "rolUser", "userData"]);
            return { success: true, message: response.data.message };
        } else {
            return { success: false, message: response.data.message || "Error al eliminar la cuenta." };
        }
        
    } catch (error) {
        console.error("Error en el servicio de eliminación de cuenta del médico:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Error de red o servidor al eliminar.";
        return { success: false, message: errorMessage };
    }
}

//Cambiar contraseña
export const changePassword = async (current_password, new_password) => {
    try {
        const response = await apiConexion.post('/change-password', {
            current_password,
            new_password,
            new_password_confirmation: new_password,
        });

        return { 
            success: true, 
            message: response.data.message || "Contraseña cambiada correctamente." 
        };
    } catch (error) {
        console.error("Error en changePassword service:", error.response?.data || error.message);
        
        const errorMessage = error.response?.data?.message || "Error al cambiar la contraseña. Verifica la contraseña actual.";
        return { 
            success: false, 
            message: errorMessage 
        };
    }
};
