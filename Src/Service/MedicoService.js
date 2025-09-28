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

