import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import BottonComponent from "../../components/BottonComponent";
import { ThemeContext } from "../../components/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "../../Src/Service/Conexion";
import { useNavigation } from "@react-navigation/native";

export default function PerfilScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const role = await AsyncStorage.getItem("rolUser");

      if (!token || !role) {
        Alert.alert("Error de autenticación", "Por favor inicia sesión nuevamente.");
        await AsyncStorage.multiRemove(["userToken", "rolUser"]);
        navigation.navigate("Login");
        return;
      }

      let url = "";
      if (role === "paciente") url = "/me/paciente";
      if (role === "doctor") url = "/me/doctor";
      if (role === "recepcionista") url = "/me/recepcionista";

      const response = await apiConexion.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.data) setUsuario(response.data.data);
      else setUsuario(response.data.user || response.data);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      Alert.alert("Error", "No se pudo cargar el perfil. Inténtalo más tarde.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarPerfil();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>No se pudo cargar el perfil.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color={theme.primary} />
        <Text style={[styles.profileName, { color: theme.text }]}>
          {usuario.nombre} {usuario.apellido}
        </Text>
      </View>

      {/* DATOS PERSONALES */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Datos Personales</Text>
        <InfoRow icon="id-card" lib="FontAwesome5" label="Documento" value={usuario.documento} theme={theme} />
        <InfoRow icon="mail-outline" lib="Ionicons" label="Correo" value={usuario.correo} theme={theme} />
        <InfoRow icon="call-outline" lib="Ionicons" label="Teléfono" value={usuario.celular || "No registrado"} theme={theme} />
        <InfoRow icon="home" lib="FontAwesome5" label="Ciudad" value={usuario.ciudad || "No registrada"} theme={theme} />
      </View>

      {/* INFORMACIÓN ADICIONAL */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Información Adicional</Text>
        <InfoRow
          icon="calendar-outline"
          lib="Ionicons"
          label="Fecha de nacimiento"
          value={usuario.fecha_nacimiento?.split("T")[0] || "No disponible"}
          theme={theme}
        />
        <InfoRow icon="tint" lib="FontAwesome5" label="Rh" value={usuario.Rh || "No disponible"} theme={theme} />
        <InfoRow
          icon="hospital"
          lib="FontAwesome5"
          label="EPS"
          value={usuario.eps?.nombre || "No disponible"}
          theme={theme}
        />
        <InfoRow icon="transgender-outline" lib="Ionicons" label="Género" value={usuario.genero || "No disponible"} theme={theme} />
      </View>

      {/* BOTÓN EDITAR PERFIL */}
      <BottonComponent
        title="Editar Perfil"
        onPress={() => navigation.navigate("EditarPaciente")}
        style={[styles.editButton, { backgroundColor: theme.primary }]}
      />
    </ScrollView>
  );
}

function InfoRow({ icon, lib = "Ionicons", label, value, theme }) {
  const IconComp = lib === "FontAwesome5" ? FontAwesome5 : Ionicons;
  return (
    <View style={styles.infoRow}>
      <IconComp name={icon} size={22} color={theme.subtitle} />
      <Text style={[styles.infoLabel, { color: theme.subtitle }]}>{label}:</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  centerContent: { justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 25, marginTop: 20 },
  profileName: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoLabel: { fontWeight: "600", marginLeft: 8, width: 130 },
  infoValue: { flex: 1 },
  editButton: { marginBottom: 30 },
  loadingText: { marginTop: 10 },
  errorText: { fontSize: 16, textAlign: "center" },
});
