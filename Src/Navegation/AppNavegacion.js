import { NavigationContainer } from '@react-navigation/native';
import NavegacionPrincipal from "./NavegacionPrincipal";
import AuthNavegacion from "./AuthNavegacion";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef, use } from 'react';
import { AppState, ActivityIndicator, View, StyleSheet } from 'react-native';
import Medico_Stack from './Stack/MedicosStack'; 
import RecepcionistaStack from './Stack/RecepcionistaStack'; 
import Pacientes_Stack from './Stack/PacientesStack';

export default function AppNavegacion() {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const appState = useRef(AppState.currentState);

    const loadToken = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const role = await AsyncStorage.getItem("userRole");
            setUserToken(token);
            setUserRole(role);
        } catch (error) {
            console.error("Error al cargar el token desde AsyncStorage: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    //Se ejecuta cuando el componente se monta por primera vez
    useEffect(() => {
        loadToken();
    }, []);

    const renderMainStack = () => {
        switch (userRole) {
            case "Paciente":
                return <Pacientes_Stack setUserToken={setUserToken} />;
            case "Doctor":
                return <Medico_Stack setUserToken={setUserToken} />;
            case "Recepcionista":
                return <RecepcionistaStack setUserToken={setUserToken} />;
            default:
                return null;
        }
    }

    //se ejecuta cuando hay cambio de estado en la app (inactiva/activa/Background)
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                console.log("La app ha vuelto a primer plano, verificando token...");
                loadToken();
            }
            appState.current = nextAppState;
        };
        const subircription = AppState.addEventListener("change", handleAppStateChange);
    }, []);

    //se ejecuta en un intervalo de 2 segundos
    useEffect(() => {
        const interval = setInterval(() => {

        }, 2000);
        return () => clearInterval(interval);
    }, []);



    return (
        <NavigationContainer>
            {userToken ? (
                renderMainStack()
            ) : (
                <AuthNavegacion setUserToken={setUserToken} />
            )}
        </NavigationContainer>
    );
}