import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { AppState, ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Navegaciones
import AuthNavegacion from "./AuthNavegacion";
import NavegacionMedico from './NavegacionMedico';
import NavegacionPaciente from './NavegacionPaciente';
import NavegacionRecepcionista from './NavegacionRecepcionista';

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

    useEffect(() => {
        loadToken();
    }, []);

    // Manejo de estados de la app (foreground/background)
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                console.log("La app volvió a primer plano, verificando token...");
                loadToken();
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => subscription.remove();
    }, []);

    // Mientras se carga AsyncStorage
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="blue" />
                <Text>Cargando...</Text>
            </View>
        );
    }

    const renderMainStack = () => {
        switch (userRole) {
            case "paciente":
                return <NavegacionPaciente setUserToken={setUserToken} />;
            case "doctor":
                return <NavegacionMedico setUserToken={setUserToken} />;
            case "recepcionista":
                return <NavegacionRecepcionista setUserToken={setUserToken} />;
            default:
                return <AuthNavegacion setUserToken={setUserToken} setUserRole={setUserRole} />;
        }
    };

    return (
        <NavigationContainer>
            {userToken ? renderMainStack() : <AuthNavegacion setUserToken={setUserToken} setUserRole={setUserRole}/>}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
