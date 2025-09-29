import apiConexion from "./Conexion";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const obtenerPacientes = async () => {
  try {
    const response = await apiConexion.get("/pacientes");
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    return { success: false, data: [] };
  }
};

export const getEspecialidades = async () => {
    try {
        const response = await apiConexion.get("/especialidades");
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error en getEspecialidades:", error.response?.data || error.message);
        return { success: false, message: "No se pudieron cargar las especialidades." };
    }
};

export const agregarMedico = async (medicoData) => {
    try {
        const response = await apiConexion.post("/doctores", medicoData);
        if (response.status === 201) {
            return { success: true, message: "Médico agregado exitosamente." };
        }
        return { success: false, message: "No se pudo agregar al médico." };
    } catch (error) {
        console.error("Error en agregarMedico:", error.response?.data || error.message);
        const message = error.response?.data?.message || "Ocurrió un error en el servidor.";
        return { success: false, message };
    }
};


export const obtenerDoctores = async () => {
  try {
    const response = await apiConexion.get("/doctores");
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    return { success: false, data: [] };
  }
};

export const buscarPacientePorNombreOCedula = async (query) => {
  try {
    const response = await apiConexion.get(`/pacientes/buscar`, {
      params: { q: query },
    });
    console.log("🩺 Resultado búsqueda:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en buscarPacientePorNombreOCedula:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al buscar pacientes por nombre o cédula.",
    };
  }
};

export const listardoc = async () => {
  try {
    const response = await apiConexion.get("/listardoc");
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    return { success: false, data: [] };
  }
};

// Buscar paciente por cédula
export const buscarPacientePorDocumento = async (documento) => {
  try {
    const response = await apiConexion.get(`/pacientes/documento/${documento}`);
    if (response.status === 200 && response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: "Paciente no encontrado." };
  } catch (error) {
    console.error("Error al buscar paciente:", error.response?.data || error.message);
    return { success: false, message: "Error en el servidor al buscar paciente." };
  }
};

//creer cita

export const crearCita = async (citaData) => {
  try {
    const response = await apiConexion.post("/citas", citaData);
    if (response.status === 201) {
      return { success: true, data: response.data.data };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error("Error en crearCita:", error.response?.data || error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Error al crear la cita" 
    };
  }
};


export const obtenerEstadisticasRecepcion = async () => {
  try {
    const response = await apiConexion.get("/recepcion/estadisticas");
    console.log("📊 Estadísticas recibidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo estadísticas:", error);
    return { success: false, message: "Error al obtener estadísticas" };
  }
};

export const obtenerCitasHoy = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await apiConexion.get("/citas-hoy-recepcion", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data, // las citas vienen aquí
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error al cargar las citas de hoy.",
      };
    }
  } catch (error) {
    console.error("❌ Error al obtener las citas de hoy:", error);
    return {
      success: false,
      message: "Error de conexión al cargar las citas.",
    };
  }
};

export const updateRecepcionistaPerfil = async (userData) => {
    try {
        const response = await apiConexion.put('/me/recepcionista', userData);
        return { success: true, message: "Perfil actualizado correctamente. Los cambios se reflejarán la próxima vez que inicie sesión.", user: response.data };
    } catch (error) {
        console.error("Error en updateMedicoPerfil:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Error al actualizar el perfil del médico";
        return { success: false, message: errorMessage };
    }
};

export async function eliminarCuentaRecepcionista() {
    try {
        const token = await AsyncStorage.getItem("userToken");
        
        if (!token) {
            return { success: false, message: "No hay sesión activa." };
        }

        const response = await apiConexion.delete('/eliminarCuenta');

        if (response.data && response.data.success) {
            await AsyncStorage.multiRemove(["userToken", "rolUser", "userData"]);
            return { success: true, message: response.data.message };
        } else {
            return { success: false, message: response.data.message || "Error al eliminar la cuenta." };
        }
        
    } catch (error) {
        console.error("Error en el servicio de eliminación de cuenta del recepcionista:", error.response?.data || error.message);
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

export const actualizarEstadoCita = async (id, estado) => {
  try {
    const response = await apiConexion.put(`/citas/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error("Error en actualizarEstadoCita:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al actualizar el estado de la cita.",
    };
  }
};

export const eliminarDoctor = async (id) => {
  try {
    const response = await apiConexion.delete(`/doctores/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en eliminarDoctor:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al eliminar el doctor.",
    };
  }
};