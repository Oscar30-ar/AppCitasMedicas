import { StatusBar } from "expo-status-bar";
import AppNavegacion from "./Src/Navegation/AppNavegacion";
import { ThemeProvider } from "./components/ThemeContext";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useEffect } from "react";
import { getFCMToken } from "./Src/Service/PacienteService";
import { Platform } from "react-native";

// 🔹 Configurar cómo se muestran las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 🔹 Configurar canal de notificaciones (requerido por Android)
async function configurarCanalNotificaciones() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Notificaciones generales",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
    console.log("✅ Canal de notificaciones configurado correctamente");
  }
}

async function obtenerTokenFCM() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("🚫 Permisos para notificaciones no concedidos");
      return;
    }

    if (!Device.isDevice) {
      console.log("⚠️ No se puede generar token en emulador");
      return;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    console.log("✅ Token FCM generado:", token);
    return token;
  } catch (error) {
    console.error("❌ Error al obtener token:", error);
  }
}

export default function App() {
  useEffect(() => {
    configurarCanalNotificaciones();
    getFCMToken(); // o tu método guardarTokenNotificacion si ya lo tenés
  }, []);

  return (
    <ThemeProvider>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <AppNavegacion />
    </ThemeProvider>
  );
}
