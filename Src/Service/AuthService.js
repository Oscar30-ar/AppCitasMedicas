import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "./Conexion";

export const loginUser = async (email, password, role) => {
  try {
    const response = await fetch("http://192.168.101.73:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: email, clave: password, role }), 
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, token: data.token, role: data.role, user: data.user };
    } else {
      return { success: false, message: data.error || "Login fallido" };
    }
  } catch (error) {
    console.error("Error en loginUser:", error);
    return { success: false, message: "Error de conexión" };
  }
};


export const logout = async () => {
    try {
        // Elimina el token de AsyncStorage directamente para cerrar la sesión localmente
        await AsyncStorage.removeItem("userToken");
        console.log("Sesión cerrada correctamente.");

        // No es necesario llamar al endpoint /logout desde el cliente si el token ya ha sido eliminado.
        // La validación del token puede ser manejada por la expiración en el servidor.
        return { success: true, message: "Sesión cerrada correctamente" };
    } catch (error) {
        console.error("Error inesperado en logout:", error.message);
        return { success: false, message: "Ocurrió un error al intentar cerrar la sesión." };
    }
};