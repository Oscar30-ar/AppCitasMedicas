import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../components/ThemeContext";
import {
  crearCita,
  listardoc,
  verificarDisponibilidad,
} from "../../Src/Service/PacienteService";

export default function NuevaCitaPacienteScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [pacienteId, setPacienteId] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState("08:00");
  const [descripcion, setDescripcion] = useState("");
  const [disponible, setDisponible] = useState(null);

  const [doctores, setDoctores] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generar intervalos de 15 minutos (08:00 - 17:00)
  const generarHoras = () => {
    const horas = [];
    for (let h = 8; h < 17; h++) {
      for (let m of [0, 15, 30, 45]) {
        horas.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    setHorasDisponibles(horas);
  };

  // Cargar doctores y datos del paciente
  useEffect(() => {
    const cargar = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setPacienteId(parsedUser.id);
        }

        const resDoctores = await listardoc();
        if (resDoctores.success) setDoctores(resDoctores.data);
        generarHoras();
      } catch (err) {
        Alert.alert("Error", "No se pudieron cargar los datos iniciales.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // Verificar disponibilidad al cambiar doctor, fecha u hora
  useEffect(() => {
    const verificar = async () => {
      if (!doctorId || !fecha || !hora) return;

      const fechaLocal = fecha.toLocaleDateString("fr-CA"); // formato YYYY-MM-DD (sin +1 día)
      const result = await verificarDisponibilidad(doctorId, fechaLocal, hora);
      setDisponible(result);
    };
    verificar();
  }, [doctorId, fecha, hora]);

  // Manejar cambio de fecha (sin desfase)
  const onChangeFecha = (event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event?.type === "dismissed") return;

    if (selectedDate) {
      const fixedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setFecha(fixedDate);
    }
  };

  // Crear cita
  const handleCrearCita = async () => {
  if (!doctorId) {
    Alert.alert("Error", "Selecciona un doctor");
    return;
  }

  // ⚠️ Si no está disponible, salimos inmediatamente
  if (!disponible?.disponible) {
    Alert.alert("Error", disponible?.mensaje || "No disponible");
    return;
  }

  try {
    const cita = {
      id_paciente: pacienteId,
      id_doctor: doctorId,
      fecha: new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0],
      hora,
      estado: "pendiente",
      descripcion: descripcion || "Cita solicitada por el paciente.",
    };

    const res = await crearCita(cita);

    // 🚫 Si el backend responde con error, mostramos la alerta y detenemos el flujo
    if (!res.success) {
      Alert.alert("Error", res.message || "No se pudo crear la cita.");
      return; // ← Detiene completamente el proceso aquí
    }

    // ✅ Si todo sale bien
    Alert.alert("✅ Éxito", "Cita solicitada correctamente.", [
      { text: "Aceptar", onPress: () => navigation.goBack() },
    ]);
  } catch (error) {
    console.error("Error creando cita:", error);
    Alert.alert("Error", "Ocurrió un error inesperado al crear la cita.");
  }
};


  if (loading)
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Cargando...</Text>
      </View>
    );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Solicitar Nueva Cita</Text>

      {/* Doctor */}
      <Text style={{ color: theme.text, marginTop: 10 }}>Doctor</Text>
      <View
        style={[
          styles.pickerContainer,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
        ]}
      >
        <Picker
          selectedValue={doctorId}
          onValueChange={(itemValue) => setDoctorId(itemValue)}
          style={{ color: theme.text }}
        >
          <Picker.Item label="Seleccione un doctor..." value="" />
          {doctores.map((d) => (
            <Picker.Item key={d.id} label={`${d.nombre} ${d.apellido}`} value={d.id} />
          ))}
        </Picker>
      </View>

      {/* Fecha */}
      <Text style={{ color: theme.text, marginTop: 10 }}>Fecha</Text>
      <TouchableOpacity
        style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: theme.text }}>{fecha.toLocaleDateString("es-CO")}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={onChangeFecha}
        />
      )}

      {/* Hora */}
      <Text style={{ color: theme.text, marginTop: 10 }}>Hora</Text>
      <View
        style={[
          styles.pickerContainer,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
        ]}
      >
        <Picker
          selectedValue={hora}
          onValueChange={(itemValue) => setHora(itemValue)}
          style={{ color: theme.text }}
        >
          {horasDisponibles.map((h) => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>
      </View>

      {/* Mensaje de disponibilidad bonito 💚❤️ */}
      {doctorId && disponible && (
        <View
          style={[
            styles.disponibilidadBox,
            {
              backgroundColor: disponible.disponible ? "#E0F8E0" : "#FFE0E0",
              borderColor: disponible.disponible ? "#2E7D32" : "#C62828",
            },
          ]}
        >
          <Text
            style={{
              color: disponible.disponible ? "#2E7D32" : "#C62828",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            {disponible.mensaje}
          </Text>
        </View>
      )}

      {/* Motivo */}
      <Text style={{ color: theme.text, marginTop: 12 }}>Motivo de la consulta (opcional)</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Ej: Dolor de cabeza, control, etc."
        placeholderTextColor={theme.subtitle}
        style={[
          styles.input,
          {
            borderColor: theme.border,
            backgroundColor: theme.cardBackground,
            color: theme.text,
            height: 80,
            textAlignVertical: "top",
          },
        ]}
        multiline
      />

      {/* Botón */}
      <TouchableOpacity
        onPress={handleCrearCita}
        style={[styles.button, { backgroundColor: theme.primary, marginTop: 18, opacity: isSubmitting ? 0.7 : 1 }]}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Solicitar Cita</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    marginBottom: 14,
    justifyContent: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 10,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disponibilidadBox: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
});
