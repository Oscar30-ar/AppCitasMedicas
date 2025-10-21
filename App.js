import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AppNavegacion from './Src/Navegation/AppNavegacion';
import { ThemeProvider } from './components/ThemeContext';
import * as Notiffications from "expo-notifications";
import { useEffect } from 'react';

export default function App() {
  useEffect(()=>{
    Notiffications.setNotificationHandler({
      handleNotification: async () => ({
        // shouldShowAlert: true, //muestra notificación como alerta
        shouldShowBanner: true,

        shouldPlaySound:true, // reproduce un sonido
        // shouldSetBadge: false, //NO cambia el icono de la app con un numero
        shouldShowList:true, //muestra en el centro de notificaciones
      }), 
    });

    const getPermisos = async () =>{
      const {status} = await Notiffications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert("Se requieren permisos para las notificaciones");
      }
    }
    getPermisos();
  },[]);
  return (
    <ThemeProvider>
      <StatusBar style="light" backgroundColor="#0f172a" />
       <AppNavegacion/>
    </ThemeProvider>
  );
};
