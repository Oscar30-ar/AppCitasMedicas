import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { obtenerCitasHoy } from "../../Src/Service/RecepcionService";

export default function CitasHoyScreen() {
  const { theme } = useContext(ThemeContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarCitas = async () => {
    try {
      const response = await obtenerCitasHoy();
      if (response && response.success) {
        setCitas(response.data);
      } else {
        Alert.alert("Error", response?.message || "No se pudieron cargar las citas.");
      }
    } catch (error) {
      console.error("Error en cargarCitas:", error);
      Alert.alert("Error", "Error al cargar las citas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarCitas();
  };

  const getStatusColor = (status) => {
    if (!status) return "#D1D5DB";
    switch (status.trim().toLowerCase()) {
      case "confirmada":
        return "#0f8e37ff";
      case "pendiente":
        return "#5e5f5bff";
      case "cancelada":
        return "#EF4444";
      default:
        return "#D1D5DB";
    }
  };

  const handleCall = (telefono, nombre) => {
    if (!telefono) {
      Alert.alert("Error", `No hay número disponible para ${nombre}.`);
      return;
    }
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        <Ionicons name="calendar" size={18} color={theme.text} /> Citas Programadas para Hoy
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : citas.length === 0 ? (
        <Text style={{ color: theme.subtitle, textAlign: "center", marginTop: 30 }}>
          No hay citas programadas para hoy.
        </Text>
      ) : (
        citas.map((appointment) => (
          <View
            key={appointment.id}
            style={[
              styles.patientAppointmentCard,
              {
                backgroundColor: theme.cardBackground,
                borderLeftColor: getStatusColor(appointment.estado),
                borderLeftWidth: 6,
              },
            ]}
          >
            <View style={styles.patientNameRow}>
              <Text style={[styles.patientName, { color: theme.text }]}>
                {appointment.paciente?.nombre} {appointment.paciente?.apellido}
              </Text>
              <View
                style={[
                  styles.statusTag,
                  { backgroundColor: getStatusColor(appointment.estado) },
                ]}
              >
                <Text style={styles.statusText}>{appointment.estado}</Text>
              </View>
            </View>

            {/* Información del Paciente */}
            <View style={{ marginTop: 4 }}>
              <Text style={[styles.detail, { color: theme.subtitle }]}>
                📌 Doc: {appointment.paciente?.documento}
              </Text>
              <Text style={[styles.detail, { color: theme.subtitle }]}>
                📧 {appointment.paciente?.correo}
              </Text>
              <Text style={[styles.detail, { color: theme.subtitle }]}>
                🏥 EPS: {appointment.paciente?.eps?.nombre || "Sin EPS"}
              </Text>
              <Text style={[styles.detail, { color: theme.subtitle }]}>
                🩸 Sangre: {appointment.paciente?.Rh}
              </Text>
              <Text style={[styles.detail, { color: theme.subtitle }]}>
                🧬 Género: {appointment.paciente?.genero}
              </Text>
            </View>

            {/* Doctor y hora */}
            <Text style={[styles.detail, { marginTop: 8, color: theme.text }]}>
              👨‍⚕️ Dr. {appointment.doctor?.nombre} {appointment.doctor?.apellido}
            </Text>
            <Text style={[styles.detail, { color: theme.text }]}>
              ⏰ {appointment.hora}
            </Text>

            {/* Botón llamar */}
            <View style={styles.appointmentActions}>
              <TouchableOpacity
                style={[styles.actionButtonOutline, { borderColor: theme.primary }]}
                onPress={() =>
                  handleCall(appointment.pacientes?.celular, appointment.pacientes?.nombre)
                }
              >
                <Ionicons name="call" size={16} color={theme.primary} />
                <Text style={[styles.actionButtonTextOutline, { color: theme.primary, marginLeft: 5 }]}>
                  Llamar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  patientAppointmentCard: { padding: 15, borderRadius: 12, marginBottom: 10 },
  patientNameRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  patientName: { fontSize: 17, fontWeight: "bold" },
  statusTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15 },
  statusText: { color: "white", fontSize: 12, fontWeight: "600" },
  detail: { fontSize: 14, marginVertical: 1 },
  appointmentActions: { marginTop: 12, flexDirection: "row", justifyContent: "flex-end" },
  actionButtonOutline: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonTextOutline: { fontSize: 14, fontWeight: "bold" },
});
