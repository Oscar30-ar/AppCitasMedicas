import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido, Juan 👋</Text>
        <Text style={styles.subtitle}>CC: 12345678</Text>
      </View>

      {/* Cards resumen */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Ionicons name="calendar" size={28} color="#2563eb" />
          <Text style={styles.cardNumber}>5 días</Text>
          <Text style={styles.cardText}>Próxima Cita</Text>
        </View>
        <View style={styles.card}>
          <MaterialIcons name="monitor-heart" size={28} color="#dc2626" />
          <Text style={styles.cardNumber}>3</Text>
          <Text style={styles.cardText}>Este mes</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="notifications" size={28} color="#f59e0b" />
          <Text style={styles.cardNumber}>2</Text>
          <Text style={styles.cardText}>Recordatorios</Text>
        </View>
      </View>

      {/* Acciones rápidas */}
      <Text style={styles.sectionTitle}>Acciones rápidas</Text>
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.action, { backgroundColor: "#2563eb" }]}
          onPress={() => navigation.navigate("crearCitas")}
        >
          <Ionicons name="add-circle" size={22} color="white" />
          <Text style={styles.actionText}>Nueva Cita</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.action, { backgroundColor: "#22c55e" }]}>
          <Ionicons name="search" size={22} color="white" />
          <Text style={styles.actionText}>Buscar Doctor</Text>
        </TouchableOpacity>
      </View>

      {/* Próximas citas */}
      <Text style={styles.sectionTitle}>Próximas Citas</Text>
      <View style={styles.appointment}>
        <Text style={styles.doctor}>Dr. María González</Text>
        <Text style={styles.specialty}>Medicina General</Text>
        <Text style={styles.info}>📅 2024-01-15   🕒 10:30 AM</Text>
        <Text style={styles.info}>📍 Consultorio 201</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: "#3b82f6" }]}>
            <Text style={styles.btnText}>Reprogramar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: "#ef4444" }]}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 15 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#0f172a" },
  subtitle: { fontSize: 14, color: "#475569" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  cardNumber: { fontSize: 18, fontWeight: "bold", color: "#0f172a", marginTop: 5 },
  cardText: { fontSize: 12, color: "#64748b" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a", marginVertical: 10 },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionText: { color: "white", marginLeft: 8, fontWeight: "bold" },
  appointment: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  doctor: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
  specialty: { fontSize: 14, color: "#64748b", marginBottom: 5 },
  info: { fontSize: 14, color: "#334155", marginBottom: 3 },
  buttonsRow: { flexDirection: "row", marginTop: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
  btnText: { color: "white", fontWeight: "bold" },
});
