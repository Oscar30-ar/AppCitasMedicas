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
import { ThemeContext } from "../../components/ThemeContext";
import {
  crearCitaRecepcion,
  listardoc,
  buscarPacientePorDocumento,
  verificarDisponibilidadDoctor,
} from "../../Src/Service/RecepcionService";

export default function NuevaCitaRecepcionScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [cedulaPaciente, setCedulaPaciente] = useState("");
  const [pacienteId, setPacienteId] = useState(null);
  const [pacienteNombre, setPacienteNombre] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState("08:00");
  const [descripcion, setDescripcion] = useState("");
  const [disponible, setDisponible] = useState(null);

  const [doctores, setDoctores] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificando, setVerificando] = useState(false);

  // Generar intervalos de 15 minutos
  const generarHoras = () => {
    const horas = [];
    for (let h = 8; h < 18; h++) {
      for (let m of [0, 15, 30, 45]) {
        const horaStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        horas.push(horaStr);
      }
    }
    setHorasDisponibles(horas);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resDoctores = await listardoc();
        if (resDoctores.success && Array.isArray(resDoctores.data)) {
          setDoctores(resDoctores.data);
        } else {
          setDoctores([]);
        }
        generarHoras();
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los doctores.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Buscar paciente
  const handleBuscarPaciente = async () => {
    if (!cedulaPaciente.trim()) return;
    const res = await buscarPacientePorDocumento(cedulaPaciente.trim());
    if (res.success) {
      setPacienteId(res.data.id);
      setPacienteNombre(`${res.data.nombre} ${res.data.apellido}`);
    } else {
      setPacienteId(null);
      setPacienteNombre("⚠️ Paciente no encontrado");
    }
  };

  // Verificar disponibilidad
  useEffect(() => {
    const verificar = async () => {
      if (!doctorId || !fecha || !hora) return;
      setVerificando(true);
      setDisponible(null);
      try {
        const fechaISO = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]; // 🔹 Corrige el +1 día
        const result = await verificarDisponibilidadDoctor(doctorId, fechaISO, hora);
        setDisponible(result);
      } catch (err) {
        setDisponible({
          success: false,
          disponible: false,
          mensaje: "Error al verificar disponibilidad.",
        });
      } finally {
        setVerificando(false);
      }
    };
    verificar();
  }, [doctorId, fecha, hora]);

  // ✅ Fecha a partir de mañana
  const mañana = new Date();
  mañana.setDate(mañana.getDate() + 1);
  mañana.setHours(0, 0, 0, 0);

  const onChangeFecha = (event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event?.type === "dismissed") return;

    const nuevaFecha = new Date(selectedDate);
    nuevaFecha.setHours(0, 0, 0, 0);

    // 🚫 Si la fecha elegida es menor a mañana, corregirla automáticamente
    if (nuevaFecha < mañana) {
      Alert.alert("Fecha inválida", "Debe seleccionar una fecha a partir de mañana.");
      setFecha(mañana);
    } else {
      setFecha(nuevaFecha);
    }
  };


  const handleCrearCita = async () => {
    if (!pacienteId || !doctorId) {
      Alert.alert("Error", "Debes ingresar un paciente válido y seleccionar un doctor.");
      return;
    }

    if (!disponible?.disponible) {
      Alert.alert("Error", disponible?.mensaje || "El doctor no está disponible en ese horario.");
      return;
    }

    const citaData = {
      id_paciente: pacienteId,
      id_doctor: doctorId,
      fecha: new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0], // 🔹 Corrige el desfase
      hora,
      estado: "pendiente",
      descripcion: descripcion || "Cita agendada por recepcionista.",
    };

    const result = await crearCitaRecepcion(citaData);
    if (result.success) {
      Alert.alert("✅ Éxito", "Cita creada correctamente.", [
        { text: "Aceptar", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Error", result.message || "No se pudo crear la cita.");
    }
  };

  if (loading) {
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
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Agendar Cita</Text>

      {/* Documento del paciente */}
      <Text style={{ color: theme.text, marginTop: 10 }}>Documento del Paciente</Text>
      <TextInput
        value={cedulaPaciente}
        onChangeText={setCedulaPaciente}
        placeholder="Ingrese número de documento"
        placeholderTextColor={theme.subtitle}
        keyboardType="numeric"
        style={[
          styles.input,
          { borderColor: theme.border, backgroundColor: theme.cardBackground, color: theme.text },
        ]}
        onBlur={handleBuscarPaciente}
      />
      {pacienteNombre !== "" && (
        <Text
          style={{
            color: pacienteNombre.includes("⚠️") ? "red" : theme.primary,
            marginBottom: 10,
          }}
        >
          {pacienteNombre}
        </Text>
      )}

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
          minimumDate={mañana}
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

      {/* Cartel disponibilidad */}
      {verificando ? (
        <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: 10 }} />
      ) : (
        doctorId &&
        disponible && (
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
        )
      )}

      {/* Descripción */}
      <Text style={{ color: theme.text, marginTop: 10 }}>Motivo o Descripción</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Motivo o detalles de la cita"
        placeholderTextColor={theme.subtitle}
        multiline
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
      />

      {/* Botón */}
      <TouchableOpacity
        onPress={handleCrearCita}
        style={[styles.button, { backgroundColor: theme.primary, marginTop: 18 }]}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Guardar Cita</Text>
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
