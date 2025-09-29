import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "./Conexion";

export const loginUser = async (correo, clave, role) => {
  try {
    const response = await apiConexion.post("/login", { correo, clave, role });
    const token = response.data.token;

    console.log("Respuesta del servidor:", response.data);
    console.log("Token recibido:", token);

    if (token) {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("rolUser", role);
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.user));
      return {
        success: true,
        token,
        role: role,
        user: response.data.user,
      };
    } else {
      return {
        success: false,
        message: "No se recibió el token en la respuesta",
      };
    }
  } catch (error) {
    if (error.response) {
      console.log("Error al iniciar sesión:", error.response.data);
      return {
        success: false,
        message: error.response.data.message || "Error en las credenciales",
      };
    } else {
      console.log("Error al iniciar sesión:", error.message);
      return {
        success: false,
        message: "Error de conexión con el servidor",
      };
    }
  }
};



export const logout = async () => {
  try {
    await AsyncStorage.multiRemove(["userToken", "rolUser", "userData"]);
    console.log("Sesión cerrada correctamente.");
    return { success: true, message: "Sesión cerrada correctamente" };
  } catch (error) {
    console.error("Error inesperado en logout:", error.message);
    return { success: false, message: "Ocurrió un error al intentar cerrar la sesión." };
  }
};


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

export const requestPasswordReset = async ({ correo }) => {
  try {
    const response = await apiConexion.post("/password/forgot", { correo });
    return response.data;
  } catch (error) {
    console.error("Error en requestPasswordReset:", error.response?.data || error.message);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al solicitar restablecimiento.",
    };
  }
};


export const resetPassword = async (correo, token, clave) => {
  try {
    const response = await apiConexion.post("/password/reset", {
      correo,
      token,
      clave,
      clave_confirmation: clave, // por compatibilidad con Laravel
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || "Contraseña restablecida exitosamente.",
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Token inválido o expirado.",
      };
    }
  } catch (error) {
    console.error("❌ Error en resetPassword:", error.response?.data || error.message);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error de servidor al intentar restablecer la contraseña.",
    };
  }
};

