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

// Citas de hoy
export const obtenerCitasHoy = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.get("/doctor/citas/hoy", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener citas:", error.response?.data || error);
    return { success: false, message: "Error al obtener citas del día." };
  }
};
/**
 * 🔹 Marcar una cita como realizada
 */
export const marcarCitaRealizada = async (idCita) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.put(`/doctor/citas/${idCita}/realizada`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Error al marcar cita:", error.response?.data || error);
    return { success: false, message: "Error al marcar cita como realizada." };
  }
};

//Mis pacientes
export const obtenerMisPacientes = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await apiConexion.get("/doctor/mis-pacientes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo pacientes:", error.response?.data || error);
    return {
      success: false,
      message: "Error al obtener la lista de pacientes.",
    };
  }
};
// Historial de un paciente específico
export const obtenerHistorialPaciente = async (pacienteId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.get(`/doctor/pacientes/${pacienteId}/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener historial:", error.response?.data || error);
    return {
      success: false,
      message: "Error al obtener el historial del paciente.",
    };
  }
};

//Editar Perfil Medico
export const updateMedicoPerfil = async (userData) => {
    try {
        const response = await apiConexion.put('/me/doctor', userData);
        return { success: true, message: "Perfil actualizado correctamente.", user: response.data };
    } catch (error) {
        console.error("Error en updateMedicoPerfil:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Error al actualizar el perfil del médico";
        return { success: false, message: errorMessage };
    }
};

//eliminar cuenta
export async function eliminarCuentaMedico() {
    try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
            return { success: false, message: "No hay sesión activa." };
        }

        const response = await apiConexion.delete('/eliminarCuenta/medico', {
            headers: { Authorization: `Bearer ${token}` },
        });

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
export const changePasswordMedico = async (current_password, new_password) => {
    try {
                console.log("current password", current_password);

        const token = await AsyncStorage.getItem("userToken");

        const response = await apiConexion.post('/doctor/change-password', {
            current_password,
            new_password,
            new_password_confirmation: new_password,
        }, {
            headers: { Authorization: `Bearer ${token}` },
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

//Listar los horarios del médico 
export const listarHorarios = async () => {
  try {
    const response = await apiConexion.get("/ListarHorario");
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error al listar horarios:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al obtener los horarios.",
    };
  }
};

//  Crear horario
export const crearHorario = async (data) => {
  try {
    const res = await apiConexion.post("/CrearHorarios", data);
    return res.data;
  } catch (error) {
    if (error.response) {
      // Devolver mensaje y código
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message,
        code: error.response.data.code,
      };
    }
    return { success: false, message: "Error al conectar con el servidor." };
  }
};

// Editar horario
export const editarHorario = async (id, data) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.put(`/EditarHorario/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: res.data.message };
  } catch (error) {
    console.error("Error editando horario:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Error" };
  }
};

// Eliminar horario
export const eliminarHorario = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await apiConexion.delete(`/EliminarHorario/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: res.data.message };
  } catch (error) {
    console.error("Error eliminando horario:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Error" };
  }
};
