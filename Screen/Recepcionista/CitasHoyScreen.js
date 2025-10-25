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
      Alert.alert("Error", "Error al cargar las citas. Revisa la consola.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarCitas();
  }, []);

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
      Alert.alert("Error", `No hay número de teléfono disponible para ${nombre}.`);
      return;
    }

    const phoneNumber = `tel:${telefono}`;
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert("Error", "No se pudo abrir la aplicación de llamadas.");
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
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
        <View style={styles.appointmentsListContainer}>
          {citas.map((appointment) => (
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
              {/* 🔹 Info Paciente */}
              <View style={styles.patientInfo}>
                <View style={styles.patientNameRow}>
                  <Text style={[styles.patientName, { color: theme.text }]}>
                    {appointment.pacientes?.nombre} {appointment.pacientes?.apellido}
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

                <Text style={[styles.doctorInfo, { color: theme.subtitle }]}>
                  Médico: {appointment.doctor?.nombre}
                </Text>

                <View style={styles.appointmentDetails}>
                  <Ionicons name="time-outline" size={16} color={theme.subtitle} />
                  <Text style={[styles.infoText, { color: theme.subtitle, marginRight: 15 }]}>
                    {appointment.hora}
                  </Text>
                  <Ionicons name="call-outline" size={16} color={theme.subtitle} />
                  <Text style={[styles.infoText, { color: theme.subtitle }]}>
                    {appointment.pacientes?.celular || "N/A"}
                  </Text>
                </View>
              </View>

              {/* 🔹 Acciones */}
              <View style={styles.appointmentActions}>
                <TouchableOpacity
                  style={[styles.actionButtonOutline, { borderColor: theme.primary }]}
                  onPress={() =>
                    handleCall(appointment.pacientes?.celular, appointment.pacientes?.nombre)
                  }
                >
                  <Ionicons name="call" size={16} color={theme.primary} />
                  <Text
                    style={[
                      styles.actionButtonTextOutline,
                      { color: theme.primary, marginLeft: 5 },
                    ]}
                  >
                    Llamar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  appointmentsListContainer: { marginBottom: 10 },
  patientAppointmentCard: { padding: 15, borderRadius: 12, marginBottom: 10 },
  patientInfo: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
    marginBottom: 10,
  },
  patientNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  patientName: { fontSize: 17, fontWeight: "bold" },
  statusTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15 },
  statusText: { color: "white", fontSize: 12, fontWeight: "600" },
  doctorInfo: { fontSize: 14, marginBottom: 5 },
  appointmentDetails: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  infoText: { fontSize: 13, marginLeft: 5 },
  appointmentActions: { flexDirection: "row", justifyContent: "flex-end" },
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
