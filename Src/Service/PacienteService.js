import * as Notifications from "expo-notifications";
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

// Obtener todas las EPS (público)
export const obtenerEpsPublico = async () => {
  try {
    // Asumiendo que el endpoint /eps es público o se ajustará para serlo
    const response = await apiConexion.get("/listarEpsPublico");
    if (response.status === 200 && response.data.success) {
      return { success: true, data: response.data.data };
    }
    return { success: false, data: [], message: "No se pudieron cargar las EPS." };
  } catch (error) {
    console.error("Error en obtenerEpsPublico:", error.response?.data || error.message);
    return { success: false, message: "Error al cargar las EPS." };
  }
};

//Editar Perfil Paciente
export const updatePacientePerfil = async (userData) => {
  try {
    const response = await apiConexion.put('/editar/me/paciente', userData);
    return { success: true, message: " Perfil actualizado correctamente, por favor inicie sesión nuevamente para ver los cambios.", user: response.data };
  } catch (error) {
    console.error("Error en updatePacientePerfil:", error);
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

//Proximas citas pendientes
export const ProximasCitasPendientes = async () => {
  try {
    const response = await apiConexion.get('/citas/proximas/pendientes');
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al obtener próximas citas:", error);
    return {
      success: false,
      message: "No se pudieron cargar las próximas citas."
    };
  }
};


//Proximas citas confirmadas
export const ProximasCitasConfirmadas = async () => {
  try {
    const response = await apiConexion.get('/citas/proximas/confirmadas');
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al obtener próximas citas:", error);
    return {
      success: false,
      message: "No se pudieron cargar las próximas citas."
    };
  }
};

//Cambiar contraseña
export const CambiarContraseña = async (current_password, new_password) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await apiConexion.post('/paciente/change-password', {
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

//Eliminar cuenta
export async function eliminarCuentaPaciente() {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      return { success: false, message: "No hay sesión activa." };
    }

    const response = await apiConexion.delete('/eliminarCuenta/paciente', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.data && response.data.success) {
      await AsyncStorage.multiRemove(["userToken", "rolUser"]);
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message || "Error al eliminar la cuenta." };
    }

  } catch (error) {
    console.error("Error en el servicio de eliminación de cuenta:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || "Error de red o servidor al eliminar.";
    return { success: false, message: errorMessage };
  }
}

// 🔹 Crear cita
export const crearCita = async (data) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await apiConexion.post("/paciente/crear-cita", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      "Ocurrió un error al crear la cita. Inténtalo más tarde.";
    return { success: false, message: msg };
  }
};

// 🔹 Listar doctores
export const listardoc = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await apiConexion.get("/listar/doctores/agendar-cita", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // 💡 CORRECCIÓN: La respuesta de la API para doctores está directamente en `response.data`.
    if (response.status === 200 && response.data.success) {
      return { success: true, data: response.data.data }; // La API devuelve { success: true, data: [...] }
    }
    return { success: false, data: [], message: "No se pudieron cargar los doctores." };
  } catch (error) {
    console.error("Error listando doctores:", error.response?.data || error.message);
    return { success: false, data: [], message: error.response?.data?.message || "Error al listar doctores" };
  }
};

// 🔹 Verificar disponibilidad del doctor
export const verificarDisponibilidad = async (doctorId, fecha, hora) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await apiConexion.get(`/disponibilidad/agendar-cita/${doctorId}`, {
      params: { fecha, hora },
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      disponible: response.data.disponible,
      mensaje: response.data.mensaje,
    };
  } catch (error) {
    console.error("Error verificando disponibilidad:", error);
    return {
      success: false,
      disponible: false,
      mensaje:
        error.response?.data?.message || "No se pudo verificar la disponibilidad",
    };
  }
};

// 🔹 Reprogramar cita del paciente
export const reprogramarCitaPaciente = async (citaId, datosReprogramacion) => {
  try {
    // El interceptor de Axios se encargará de añadir el token de autorización
    const response = await apiConexion.put(`/paciente/citas/${citaId}/reprogramar`, datosReprogramacion);
    if (response.data.success) {
      return { success: true, message: response.data.message || "Cita reprogramada correctamente." };
    }
    return { success: false, message: response.data.message || "No se pudo reprogramar la cita." };
  } catch (error) {
    console.error("Error en el servicio de reprogramarCitaPaciente:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Ocurrió un error al intentar reprogramar la cita.",
    };
  }
};

// 🔹 Cancelar cita del paciente
export const cancelarCitaPaciente = async (citaId) => {
  try {
    // El interceptor de Axios se encargará de añadir el token de autorización
    const response = await apiConexion.put(`/paciente/citas/${citaId}/estado`, { estado: 'cancelada' });
    if (response.status === 200) {
      return { success: true, message: response.data.message || "Cita cancelada correctamente." };
    }
    return { success: false, message: "No se pudo procesar la cancelación." };
  } catch (error) {
    console.error("Error en el servicio de cancelarCitaPaciente:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Ocurrió un error al intentar cancelar la cita.",
    };
  }
};

// Guardar token Expo en backend
export const guardarTokenNotificacion = async () => {
  try {
    // 1️⃣ Solicitar permisos al usuario
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permiso de notificaciones no concedido");
      return { success: false, message: "Permiso no concedido" };
    }

    // 2️⃣ Obtener el token único del dispositivo
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Token obtenido:", token);

    // 3️⃣ Enviar el token al backend
    const response = await apiConexion.post("/paciente/guardar-token", { token });

    if (response.data.success) {
      await AsyncStorage.setItem("expo_token", token);
      console.log("✅ Token guardado correctamente en el servidor.");
      return { success: true, message: "Token guardado correctamente" };
    } else {
      console.error("❌ Error al guardar token:", response.data.message);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error al guardar token de notificación:", error);
    return { success: false, message: "Error interno" };
  }
};