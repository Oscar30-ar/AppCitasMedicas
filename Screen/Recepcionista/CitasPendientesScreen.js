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
import { obtenerCitasPendientes, actualizarEstadoCita } from "../../Src/Service/RecepcionService";

export default function CitasPendientesScreen() {
  const { theme } = useContext(ThemeContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const cargarCitas = async () => {
    const res = await obtenerCitasPendientes();
    if (res.success) setCitas(res.data);
    else Alert.alert("Error", res.message);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarCitas();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmada":
        return "#10B981";
      case "pendiente":
        return "#FBBF24";
      case "cancelada":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const handleActualizarEstado = (id, nuevoEstado, nombrePaciente) => {
    Alert.alert(
      `${nuevoEstado === "confirmada" ? "Confirmar" : "Cancelar"} cita`,
      `¿Deseas ${nuevoEstado === "confirmada" ? "confirmar" : "cancelar"} la cita de ${nombrePaciente}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            setUpdatingId(id);
            const res = await actualizarEstadoCita(id, nuevoEstado);
            if (res.success) {
              setCitas((prev) =>
                prev.map((c) =>
                  c.id === id ? { ...c, estado: nuevoEstado } : c
                )
              );
              Alert.alert("Éxito", res.message);
            } else Alert.alert("Error", res.message);
            setUpdatingId(null);
          },
        },
      ]
    );
  };

  const handleCall = (telefono, nombre) => {
    if (!telefono) return Alert.alert("Sin número", `No hay teléfono disponible para ${nombre}`);
    Linking.openURL(`tel:${telefono}`).catch(() =>
      Alert.alert("Error", "No se pudo abrir la aplicación de llamadas.")
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
      }
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        <Ionicons name="notifications" size={16} color={theme.text} /> Citas Pendientes
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : citas.length === 0 ? (
        <Text style={{ color: theme.subtitle, textAlign: "center", marginTop: 30 }}>
          No hay citas pendientes.
        </Text>
      ) : (
        citas.map((cita) => (
          <View
            key={cita.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBackground,
                borderLeftColor: getStatusColor(cita.estado),
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.name, { color: theme.text }]}>
                {cita.paciente?.nombre} {cita.paciente?.apellido}
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getStatusColor(cita.estado) },
                ]}
              >
                <Text style={styles.badgeText}>{cita.estado}</Text>
              </View>
            </View>

            <Text style={[styles.info, { color: theme.subtitle }]}>
              Documento: {cita.paciente?.documento}
            </Text>
            <Text style={[styles.info, { color: theme.subtitle }]}>
              Correo: {cita.paciente?.correo}
            </Text>
            <Text style={[styles.info, { color: theme.subtitle }]}>
              Celular: {cita.paciente?.celular}
            </Text>


            <Text style={[styles.info, { color: theme.subtitle }]}>
              Médico: {cita.doctor?.nombre}
            </Text>
            <Text style={[styles.info, { color: theme.subtitle }]}>
              Fecha: {cita.fecha} - {cita.hora}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btnOutline, { borderColor: theme.primary }]}
                onPress={() =>
                  handleCall(cita.pacientes?.celular, cita.pacientes?.nombre)
                }
              >
                <Ionicons name="call-outline" size={16} color={theme.primary} />
                <Text style={[styles.btnText, { color: theme.primary }]}>Llamar</Text>
              </TouchableOpacity>

              {cita.estado === "pendiente" && (
                <>
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#10B981" }]}
                    onPress={() =>
                      handleActualizarEstado(
                        cita.id,
                        "confirmada",
                        cita.pacientes?.nombre
                      )
                    }
                    disabled={updatingId === cita.id}
                  >
                    <Text style={styles.btnTextWhite}>Confirmar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#EF4444" }]}
                    onPress={() =>
                      handleActualizarEstado(
                        cita.id,
                        "cancelada",
                        cita.pacientes?.nombre
                      )
                    }
                    disabled={updatingId === cita.id}
                  >
                    <Text style={styles.btnTextWhite}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: "white", fontSize: 12, fontWeight: "bold" },
  info: { fontSize: 14, marginTop: 5 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnTextWhite: { color: "white", fontWeight: "bold" },
  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  btnText: { fontWeight: "bold", marginLeft: 5 },
});
