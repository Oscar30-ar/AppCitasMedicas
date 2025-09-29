import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { obtenerMisCitas } from "../../Src/Service/MedicoService";

function AppointmentItem({ appointment, theme }) {
  const getStatusStyle = (status) => {
    const lower = status?.toLowerCase?.() || "";
    switch (lower) {
      case "confirmada": return { backgroundColor: "#10b981", textColor: "#fff" };
      case "pendiente": return { backgroundColor: "#facc15", textColor: "#000" };
      case "cancelada": return { backgroundColor: "#ef4444", textColor: "#fff" };
      default: return { backgroundColor: theme.border, textColor: theme.text };
    }
  };

  const { backgroundColor, textColor } = getStatusStyle(appointment.estado);

  return (
    <View style={[styles.appointmentCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.infoContainer}>
        <Text style={[styles.patientName, { color: theme.text }]}>
          {appointment.nombrePaciente}
          <Text style={{ fontWeight: "normal", color: theme.subtitle, fontSize: 14 }}>
            {" "}({appointment.tipoConsulta || "Consulta"})
          </Text>
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
          <Ionicons name="time-outline" size={14} color={theme.subtitle} />
          <Text style={[styles.timeText, { color: theme.subtitle }]}>{appointment.hora}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={[styles.statusChip, { backgroundColor }]}>
          <Text style={[styles.statusText, { color: textColor }]}>{appointment.estado?.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

export default function AgendaHoy() {
  const { theme } = useContext(ThemeContext);
  const [citasHoy, setCitasHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const responseCitas = await obtenerMisCitas();
        if (responseCitas.success) {
          setCitasHoy(responseCitas.data);
        }
      } catch (error) {
        console.error("Error cargando citas:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarCitas();
  }, []);

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background, flex: 1 }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Agenda de Hoy - {today}</Text>
      <View style={styles.appointmentsContainer}>
        {citasHoy.length > 0 ? (
          citasHoy.map((cita) => (
            <AppointmentItem
              key={cita.id}
              appointment={{
                nombrePaciente: `${cita.pacientes?.nombre} ${cita.pacientes?.apellido}`,
                tipoConsulta: cita.consultorio,
                hora: cita.hora,
                estado: cita.estado,
                paciente: cita.pacientes,
              }}
              theme={theme}
            />
          ))
        ) : (
          <Text style={{ color: theme.subtitle, textAlign: "center", padding: 15 }}>
            No tienes citas agendadas para hoy.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  appointmentsContainer: { marginBottom: 20 },
  appointmentCard: {
    padding: 15, borderRadius: 12, marginBottom: 10,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, elevation: 2,
  },
  infoContainer: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: "bold" },
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  statusText: { fontSize: 11, fontWeight: "bold" },
  timeText: { fontSize: 14, marginLeft: 5 },
  buttonsContainer: { flexDirection: "row", marginLeft: 10 },
  center: { justifyContent: "center", alignItems: "center" },
});
