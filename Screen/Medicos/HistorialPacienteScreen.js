import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { obtenerHistorialPaciente } from "../../Src/Service/MedicoService";

const EventCard = ({ item, theme }) => (
  <View
    style={[
      styles.eventCard,
      { backgroundColor: theme.cardBackground, borderColor: theme.border },
    ]}
  >
    <View style={styles.eventHeader}>
      <Ionicons name="medkit-outline" size={24} color={theme.primary} />
      <Text style={[styles.eventTitle, { color: theme.text }]}>
        Consulta médica
      </Text>
    </View>

    <Text style={[styles.eventDate, { color: theme.subtitle }]}>
      📅 {item.fecha} a las {item.hora}
    </Text>

    <Text style={[styles.eventDescription, { color: theme.text }]}>
      Descripción: {item.descripcion || "Sin detalles"}
    </Text>

    {item.estado && (
      <Text style={[styles.eventDoctor, { color: theme.subtitle }]}>
        Estado: {item.estado}
      </Text>
    )}

    {item.doctor && (
      <Text style={[styles.eventDoctor, { color: theme.subtitle }]}>
        Dr. {item.doctor.nombre} {item.doctor.apellido}
      </Text>
    )}
  </View>
);

export default function HistorialPacienteScreen({ route }) {
  const { theme } = useContext(ThemeContext);
  const { paciente } = route.params;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    if (!paciente?.id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const result = await obtenerHistorialPaciente(paciente.id);

      if (result.success && Array.isArray(result.data)) {
        setHistory(result.data);
      } else {
        Alert.alert("Error", result.message || "No se pudo cargar el historial.");
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      Alert.alert("Error", "Ocurrió un error al cargar el historial.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [paciente]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadHistory();
  }, [paciente]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.subtitle, marginTop: 10 }}>
          Cargando historial...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Encabezado Paciente */}
      <View style={styles.header}>
        <FontAwesome5 name="user-injured" size={50} color={theme.primary} />
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          {paciente.nombre} {paciente.apellido}
        </Text>
        <Text style={[styles.patientId, { color: theme.subtitle }]}>
          Documento: {paciente.documento}
        </Text>
      </View>

      {/* Lista de Citas */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard item={item} theme={theme} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: theme.subtitle, textAlign: "center", marginTop: 50 }}>
              Este paciente no tiene registros de citas.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 25 },
  pageTitle: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  patientId: { fontSize: 16 },
  eventCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    elevation: 3,
  },
  eventHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  eventTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 10 },
  eventDate: { fontSize: 14, marginBottom: 5 },
  eventDescription: { fontSize: 14, marginBottom: 5 },
  eventDoctor: { fontSize: 12, fontStyle: "italic" },
});
