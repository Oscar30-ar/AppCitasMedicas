import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { listarHorarios, eliminarHorario } from "../../Src/Service/MedicoService";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const MiHorarioScreen = () => {
  const navigation = useNavigation();
  const [horarios, setHorarios] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Cargar los horarios desde el backend
  const cargarHorarios = async () => {
    try {
      setLoading(true);
      const res = await listarHorarios();

      if (res.success) {
        // Agrupamos por día de la semana
        const agrupado = res.data.reduce((acc, item) => {
          const dia = item.dia_semana || "Sin día";
          if (!acc[dia]) acc[dia] = [];
          acc[dia].push(item);
          return acc;
        }, {});
        setHorarios(agrupado);
      } else {
        Alert.alert("Error", res.message || "No se pudieron obtener los horarios.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los horarios.");
      console.error("Error en cargarHorarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarHorarios();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarHorarios();
    setRefreshing(false);
  };

  const handleEditar = (item) => {
    // Navega y pasa el objeto horario completo
    navigation.navigate("EditarHorario", { horario: item });
  };

  const handleEliminar = async (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este horario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const res = await eliminarHorario(id);
            if (res.success) {
              Alert.alert("Éxito", "Horario eliminado correctamente.");
              cargarHorarios();
            } else {
              Alert.alert("Error", res.message || "No se pudo eliminar el horario.");
            }
          },
        },
      ]
    );
  };

  // Renderiza cada franja (fila con acciones)
  const renderFranja = (franja) => (
    <View key={String(franja.id)} style={styles.franjaContainer}>
      <Text style={styles.horas}>⏰ {franja.hora_inicio} - {franja.hora_fin}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditar(franja)} style={styles.iconAction}>
          <Ionicons name="create-outline" size={20} color="#00796B" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEliminar(franja.id)} style={[styles.iconAction, { marginLeft: 12 }]}>
          <Ionicons name="trash-outline" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderiza cada tarjeta día con sus franjas agrupadas y etiquetadas
  const renderItem = ({ item }) => {
    // item es un array [dia, franjas]
    const [dia, rawFranjas] = item;

    // Defensive: asegurarnos que franjas es un arreglo
    const franjas = Array.isArray(rawFranjas) ? rawFranjas : (rawFranjas ? [rawFranjas] : []);

    // Ordenar franjas por hora_inicio (string "HH:mm" funciona con localeCompare)
    const ordenadas = franjas.slice().sort((a, b) => {
      const aKey = a.hora_inicio || "";
      const bKey = b.hora_inicio || "";
      return aKey.localeCompare(bKey);
    });

    return (
      <View style={styles.card}>
        <Text style={styles.diaTitulo}>🗓️ {dia}</Text>

        {ordenadas.map((franja) => {
          // Determinar etiqueta según la hora de inicio
          const inicio = franja.hora_inicio || "00:00";

          const etiqueta =
            inicio < "13:00" ? "🌅 Mañana" :
            inicio < "18:00" ? "🌇 Tarde" : "🌙 Noche";

          return (
            <View key={String(franja.id)} style={styles.franja}>
              <Text style={styles.subtitulo}>{etiqueta}</Text>
              {renderFranja(franja)}
            </View>
          );
        })}
      </View>
    );
  };

  const handleAgregarDia = () => navigation.navigate("AgregarHorario");

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={{ marginTop: 10 }}>Cargando horarios...</Text>
      </View>
    );
  }

  const entries = Object.entries(horarios); // array de [dia, franjas]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Horario</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAgregarDia}>
          <Ionicons name="add-circle" size={26} color="#00796B" />
          <Text style={styles.addButtonText}>Agregar día</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <Text style={styles.empty}>No tienes horarios registrados.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item[0]}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default MiHorarioScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FB", padding: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  title: { fontSize: 22, fontWeight: "bold", color: "#333" },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E0F2F1", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  addButtonText: { color: "#00796B", fontWeight: "bold", marginLeft: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 10, padding: 15, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  diaTitulo: { fontSize: 18, fontWeight: "bold", color: "#00796B", marginBottom: 8 },
  franja: { marginTop: 8, paddingVertical: 6, borderTopWidth: 1, borderTopColor: "#e0e0e0" },
  subtitulo: { fontSize: 15, fontWeight: "600", color: "#555", marginBottom: 6 },
  franjaContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  horas: { fontSize: 16, color: "#333" },
  actions: { flexDirection: "row", alignItems: "center" },
  iconAction: { padding: 6, borderRadius: 6 },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#666" },
});
