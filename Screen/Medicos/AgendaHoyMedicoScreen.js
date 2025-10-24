import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import { ThemeContext } from "../../components/ThemeContext";
import { obtenerCitasHoy, marcarCitaRealizada } from "../../Src/Service/MedicoService";

export default function CitasHoyDoctorScreen() {
  const { theme } = useContext(ThemeContext);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarCitas = async () => {
    setLoading(true);
    const res = await obtenerCitasHoy();
    if (res.success) {
      setCitas(res.data);
    } else {
      setCitas([]);
      Alert.alert("Error", res.message || "No se pudieron cargar las citas de hoy.");
    }
    if (loading) setLoading(false);
    if (refreshing) setRefreshing(false);
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    cargarCitas();
  }, []);

  const handleMarcarRealizada = async (id) => {
    const res = await marcarCitaRealizada(id);
    if (res.success) {
      Alert.alert("✅ Éxito", "Cita marcada como realizada.");
      setCitas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado: "realizada" } : c))
      );
    } else {
      Alert.alert("Error", res.message || "No se pudo marcar la cita.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Cargando citas de hoy...</Text>
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
      <Text style={[styles.title, { color: theme.text }]}>Citas para Hoy</Text>

      {citas.length === 0 ? (
        <Text style={{ color: theme.subtitle, textAlign: "center", marginTop: 20 }}>
          No tienes citas programadas para hoy.
        </Text>
      ) : (
        citas.map((cita) => (
          <View key={cita.id} style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.cardTitle, { color: theme.primary }]}>
              {cita.paciente?.nombre} {cita.paciente?.apellido}
            </Text>
            <Text style={{ color: theme.text }}>Hora: {cita.hora}</Text>
            <Text style={{ color: theme.subtitle }}>Documento: {cita.paciente?.documento}</Text>
            <Text style={{ color: theme.subtitle }}>Estado: {cita.estado}</Text>

            {cita.estado !== "realizada" ? (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.primary }]}
                onPress={() => handleMarcarRealizada(cita.id)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Marcar como Realizada</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#4CAF50" }]}
                disabled
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>✔ Realizada</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  btn: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
