import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottonComponent from "../../components/BottonComponent";

export default function CrearCitasScreen({ navigation }) {
  const [specialty, setSpecialty] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [reason, setReason] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleCreateAppointment = () => {
    console.log("Cita a programar:", { specialty, date, time, reason });
    alert("Cita programada con éxito!");
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Programar Nueva Cita</Text>

      <View style={styles.form}>
        {/* Especialidad */}
        <View style={styles.inputWithIcon}>
          <Text style={styles.inputText}>{specialty || "Especialidad"}</Text>
          <Ionicons name="medkit-outline" size={24} color="#94a3b8" style={styles.icon} />
        </View>

        {/* Fecha */}
        <TouchableOpacity style={styles.inputWithIcon} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputText}>
            {date ? date.toISOString().split("T")[0] : "Seleccionar fecha"}
          </Text>
          <Ionicons name="calendar-outline" size={24} color="#94a3b8" style={styles.icon} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Hora */}
        <TouchableOpacity style={styles.inputWithIcon} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.inputText}>
            {time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Seleccionar hora"}
          </Text>
          <Ionicons name="time-outline" size={24} color="#94a3b8" style={styles.icon} />
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}

        {/* Motivo */}
        <View style={styles.inputWithIcon}>
          <Text style={[styles.inputText, { height: 100, textAlignVertical: "top" }]}>
            {reason || "Motivo de la cita"}
          </Text>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="#94a3b8" style={styles.icon} />
        </View>

        {/* Botón programar */}
        <TouchableOpacity style={styles.programBtn} onPress={handleCreateAppointment}>
          <Text style={styles.programText}>Programar Cita</Text>
        </TouchableOpacity>

        {/* Botón cancelar */}
        <BottonComponent
          title="Cancelar"
          onPress={() => navigation.goBack()}
          style={styles.cancelBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 10,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  inputText: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  icon: {
    marginLeft: 8,
  },
  programBtn: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  programText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: "transparent",
    borderColor: "#94a3b8",
    borderWidth: 1,
    marginTop: 10,
  },
});
