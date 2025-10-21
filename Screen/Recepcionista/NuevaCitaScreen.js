import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemeContext } from "../../components/ThemeContext";
import {
  crearCita,
  listardoc,
  buscarPacientePorDocumento,
} from "../../Src/Service/RecepcionService";
import { Picker } from "@react-native-picker/picker";

export default function NuevaCitaScreen() {
  const { theme } = useContext(ThemeContext);

  const [cedulaPaciente, setCedulaPaciente] = useState("");
  const [pacienteId, setPacienteId] = useState(null);
  const [pacienteNombre, setPacienteNombre] = useState("");

  const [doctorId, setDoctorId] = useState("");
  const [consultorio, setConsultorio] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());

  const [doctores, setDoctores] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const cargarDoctores = async () => {
      const resDoctores = await listardoc();
      if (resDoctores.success) setDoctores(resDoctores.data);
    };
    cargarDoctores();
  }, []);

  // 🔎 Buscar paciente al escribir cédula
  const handleBuscarPaciente = async (doc) => {
    setPacienteNombre("");
    setPacienteId(null);

    if (!doc) return;

    const paciente = await buscarPacientePorDocumento(doc);
    if (paciente.success) {
      setPacienteId(paciente.data.id);
      setPacienteNombre(`${paciente.data.nombre} ${paciente.data.apellido}`);
    } else {
      setPacienteNombre("⚠️ Paciente no encontrado");
    }
  };

  const handleCrearCita = async () => {
    if (!pacienteId || !doctorId) {
      Alert.alert("Error", "Debes ingresar un paciente válido y seleccionar un doctor.");
      return;
    }

    const citaData = {
      id_paciente: pacienteId,
      id_doctor: doctorId,
      fecha: fecha.toISOString().split("T")[0],
      hora: hora.toTimeString().split(" ")[0].slice(0, 5),
      estado,
      consultorio: consultorio || "N/A",
      descripcion: descripcion || "Cita agendada por recepcionista",
    };

    const result = await crearCita(citaData);
    if (result.success) {
      Alert.alert("Éxito", "Cita creada correctamente");
      setCedulaPaciente("");
      setPacienteNombre("");
      setPacienteId(null);
      setDoctorId("");
      setConsultorio("");
      setEstado("pendiente");
      setDescripcion("");
      setFecha(new Date());
      setHora(new Date());
    } else {
      Alert.alert("Error", result.message || "No se pudo crear la cita");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Crear Cita</Text>

      {/* Documento del Paciente */}
      <Text style={{ color: theme.text }}>Documento del Paciente</Text>
      <TextInput
        value={cedulaPaciente}
        onChangeText={setCedulaPaciente}
        onBlur={() => handleBuscarPaciente(cedulaPaciente)} 
        placeholder="Ingrese el documento"
        placeholderTextColor={theme.subtitle}
        keyboardType="numeric"
        style={[
          styles.input,
          { borderColor: theme.border, backgroundColor: theme.cardBackground, color: theme.text },
        ]}
      />
      {pacienteNombre !== "" && (
        <Text style={{ color: pacienteNombre.includes("⚠️") ? "red" : theme.primary, marginBottom: 10 }}>
          {pacienteNombre}
        </Text>
      )}

      {/* Doctor */}
      <Text style={{ color: theme.text, marginTop: 15 }}>Doctor</Text>
      <Picker
        selectedValue={doctorId}
        onValueChange={(itemValue) => setDoctorId(itemValue)}
        style={{ backgroundColor: theme.cardBackground, color: theme.text }}
      >
        <Picker.Item label="Seleccione un doctor..." value="" />
        {doctores.map((d) => (
          <Picker.Item key={d.id} label={`${d.nombre} ${d.apellido}`} value={d.id} />
        ))}
      </Picker>

      {/* Fecha */}
      <Text style={{ color: theme.text, marginTop: 15 }}>Fecha</Text>
      <TouchableOpacity
        style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: theme.text }}>{fecha.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFecha(selectedDate);
          }}
        />
      )}

      {/* Hora */}
      <Text style={{ color: theme.text, marginTop: 15 }}>Hora</Text>
      <TouchableOpacity
        style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={{ color: theme.text }}>{hora.toTimeString().split(" ")[0].slice(0, 5)}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={hora}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setHora(selectedTime);
          }}
        />
      )}

      {/* Estado */}
      <Text style={{ color: theme.text, marginTop: 15 }}>Estado</Text>
      <Picker
        selectedValue={estado}
        onValueChange={(itemValue) => setEstado(itemValue)}
        style={{ backgroundColor: theme.cardBackground, color: theme.text }}
      >
        <Picker.Item label="Pendiente" value="pendiente" />
        <Picker.Item label="Confirmada" value="confirmada" />
        <Picker.Item label="Cancelada" value="cancelada" />
      </Picker>

      {/* Consultorio */}
      <Text style={{ color: theme.text, marginTop: 15 }}>Consultorio</Text>
      <TextInput
        value={consultorio}
        onChangeText={setConsultorio}
        placeholder="Ejemplo: 201"
        placeholderTextColor={theme.subtitle}
        style={[
          styles.input,
          { borderColor: theme.border, backgroundColor: theme.cardBackground, color: theme.text },
        ]}
      />

      {/* Descripción */}
      <Text style={{ color: theme.text, marginTop: 15 }}>Descripción</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Motivo o detalles de la cita"
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

      {/* Botón Guardar */}
      <TouchableOpacity onPress={handleCrearCita} style={[styles.button, { marginTop: 20 }]}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Guardar Cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
