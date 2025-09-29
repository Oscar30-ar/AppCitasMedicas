import apiConexion from "./Conexion";
import AsyncStorage from "@react-native-async-storage/async-storage";


//Estadisticas/tarjetas
export const obtenerEstadisticas = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await apiConexion.get("/doctor/estadisticas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error.response?.data || error.message);
    return { citasHoy: 0, pacientesTotales: 0, pendientes: 0 };
  }
};


//Citas hoy 

export const obtenerCitasHoy = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await apiConexion.get("/citas/hoy", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      return { success: true, data: response.data.data };
    }

    return { success: false, message: "No se pudieron cargar las citas de hoy." };
  } catch (error) {
    console.error("Error al obtener citas de hoy:", error.response?.data || error.message);
    return { success: false, message: "Error al conectar con el servidor." };
  }
};

//Mis pacientes
export const obtenerMisPacientes = async () => {
    try {
        // NOTA: Usualmente, el ID del médico se obtiene del token JWT
        // almacenado en el AsyncStorage o el contexto de autenticación.
        // Aquí asumimos que apiClient ya incluye el token en los headers.
        
        const response = await apiConexion.get("/doctor/pacientes");

        // Si la respuesta HTTP es 200 (OK)
        if (response.status === 200) {
            return { 
                success: true, 
                data: response.data.data, // Asegúrate que 'response.data.pacientes' es la lista
                message: "Pacientes cargados." 
            };
        } 
        
        // Manejo de otros códigos de estado exitosos pero no esperados
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

export async function eliminarCuentaMedico() {
    try {
        const token = await AsyncStorage.getItem("userToken");
        
        if (!token) {
            return { success: false, message: "No hay sesión activa." };
        }

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
