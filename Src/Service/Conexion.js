import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://10.2.233.151:8000/api";

const apiConexion = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Accept":"applicattion/json",
        "Content-Type":"application/json",
    },
});

const RutasPublicas = ['/login', 'registrar'];

apiConexion.interceptors.request.use(
    async(config) => {
        const EsRutaPublica = RutasPublicas.some(ruta => config.url.includes(ruta));
        if (!EsRutaPublica) {
            const userToken = await AsyncStorage.getItem("userToken");
        }
        if(userToken){
            config.headers.Authorization = `Bearer ${userToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiConexion.interceptors.response.use(
    (response) => response,

    async(error) => {
        const originalRequest = error.config;
        const EsRutaPublica = RutasPublicas.some(ruta => originalRequest.url.includes(ruta));

        if (error.response && error.response.status === 401 && !originalRequest._retry && !EsRutaPublica){
            originalRequest._retry = true;
            await AsyncStorage.removeItem("userToken"); //elimina el token guardado
            alert("Token invalido o expirado. Redirigido al login");
        }
        return Promise.reject(error);
    }
);

export default apiConexion;