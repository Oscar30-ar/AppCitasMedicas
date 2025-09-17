import { NavigationContainer} from '@react-navigation/native';
import NavegacionPrincipal from "./NavegacionPrincipal";
import AuthNavegacion from "./AuthNavegacion";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect, useRef, use} from 'react';
import { AppState, ActivityIndicator, View, StyleSheet } from 'react-native';
export default function AppNavegacion(){
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const appState = useRef(AppState.currentState);

    const loadToken = async() => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            setUserToken(token);
        } catch (error) {
            console.error("Error al cargar el token desde AsyncStorage: ", error);
        } finally{
            setIsLoading(false);
        }
    };

    //Se ejecuta cuando el componente se monta por primera vez
    useEffect(() => {
        loadToken(); 
    }, []);

    //se ejecuta cuando hay cambio de estado en la app (inactiva/activa/Background)
    useEffect(()=>{
        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                console.log("La app ha vuelto a primer plano, verificando token...");
                loadToken();
            }
            appState.current =  nextAppState;
        };
        const subircription = AppState.addEventListener("change", handleAppStateChange);
    },[]);

    //se ejecuta en un intervalo de 2 segundos
    useEffect(()=>{
        const interval = setInterval(()=>{

        },2000);
        return () => clearInterval(interval);
    },[]);



    return(
        <NavigationContainer>
           {userToken ? <NavegacionPrincipal/> : <AuthNavegacion/>}
        </NavigationContainer>
    );
}