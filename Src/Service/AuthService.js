import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "./Conexion";

export const loginUser = async(correo, clave) => {
    try {
        const response = await apiConexion.post("/login", {correo, clave});
        const token = response.data.token;
        console.log("Respuesta del servidor: ", response.data)
        console.log("Token recibido: ", token);

        if (token) {
            await AsyncStorage.setItem("userToken", token);
        } else{
            console.error("No se recibio token en la respuesta.");
        }
        return { success: true, token};
    } catch (error) {
        console.error("Error al iniciar sesión. ", error.response ? error.response.data : error.message);

        return {
            success: false,
            message: error.response ? error.response.data : "Error de conexión"
        }
    }
}

export const logout = async (signOut) => {
    try {
        await apiConexion.post('/logout');
        await AsyncStorage.removeItem("userToken");
        console.log("Sesión cerrada correctamente.");
        
        // Llama a la función del contexto para actualizar el estado global
        if (signOut) {
            signOut();
        }
        return { success: true, message: "Sesión cerrada correctamente" };
    } catch (error) {
        console.error("Error al cerrar sesión: ", error.response ? error.response.data : error.message);
        // Aún si el API falla, nos aseguramos de que el token local se borre
        await AsyncStorage.removeItem("userToken");
        if (signOut) {
            signOut();
        }
        return { success: false, message: "Error al cerrar sesión, pero el token local fue eliminado." };
    }
};
