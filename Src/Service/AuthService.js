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
            message: error.response ? error.response.data : "Error de conexión",
        };
    }
};