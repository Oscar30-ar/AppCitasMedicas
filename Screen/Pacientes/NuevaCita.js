import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { BASE_URL } from "../../Src/Service/Conexion";

export default function NuevaCita() {
  const { theme } = useContext(ThemeContext);
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingDoctores, setLoadingDoctores] = useState(false);
  const [loadingHoras, setLoadingHoras] = useState(false);
  const [creandoCita, setCreandoCita] = useState(false);

  // 1. Cargar especialidades al iniciar
  useEffect(() => {
    const fetchEspecialidades = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get(`${BASE_URL}/api/especialidades`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEspecialidades(response.data);
      } catch (error) {
        console.error("Error al obtener especialidades:", error);
        Alert.alert("Error", "No se pudieron cargar las especialidades.");
      } finally {
        setLoading(false);
      }
    };
    fetchEspecialidades();
  }, []);

  // 2. Cargar doctores cuando se selecciona una especialidad
  useEffect(() => {
    const fetchDoctores = async () => {
      if (!especialidadSeleccionada) return;
      setLoadingDoctores(true);
      setDoctorSeleccionado(null);
      setHorasDisponibles([]);
      setFechaSeleccionada(null);
      setHoraSeleccionada(null);
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get(
          `${BASE_URL}/api/doctores/especialidad/${especialidadSeleccionada}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctores(response.data);
      } catch (error) {
        console.error("Error al obtener doctores:", error);
        Alert.alert("Error", "No se pudieron cargar los doctores.");
      } finally {
        setLoadingDoctores(false);
      }
    };
    fetchDoctores();
  }, [especialidadSeleccionada]);

  // 3. Cargar horas disponibles cuando se selecciona un doctor
  useEffect(() => {
    const fetchHorasDisponibles = async () => {
      if (!doctorSeleccionado) return;
      setLoadingHoras(true);
      setFechaSeleccionada(null);
      setHoraSeleccionada(null);
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get(
          `${BASE_URL}/api/citas/available-times/${doctorSeleccionado}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHorasDisponibles(response.data);
      } catch (error) {
        console.error("Error al obtener horarios:", error);
        Alert.alert("Error", "No se pudieron cargar los horarios disponibles.");
      } finally {
        setLoadingHoras(false);
      }
    };
    fetchHorasDisponibles();
  }, [doctorSeleccionado]);

  // 4. Crear la cita
  const handleCreateCita = async () => {
    if (!especialidadSeleccionada || !doctorSeleccionado || !fechaSeleccionada || !horaSeleccionada) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    setCreandoCita(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId"); // Asegúrate de guardar el ID del paciente al iniciar sesión

      const response = await axios.post(
        `${BASE_URL}/api/citas`,
        {
          id_paciente: userId,
          id_doctor: doctorSeleccionado,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          estado: "pendiente", // Estado inicial de la cita
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        Alert.alert("Éxito", "Cita creada exitosamente.");
        // Reiniciar el formulario
        setEspecialidadSeleccionada(null);
        setDoctorSeleccionado(null);
        setFechaSeleccionada(null);
        setHoraSeleccionada(null);
        setDoctores([]);
        setHorasDisponibles([]);
      } else {
        Alert.alert("Error", "No se pudo crear la cita. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al crear cita:", error);
      Alert.alert("Error", "Ocurrió un error inesperado al crear la cita.");
    } finally {
      setCreandoCita(false);
    }
  };

  const formattedDates = [...new Set(horasDisponibles.map(h => h.fecha))];
  const formattedTimes = fechaSeleccionada ? horasDisponibles.filter(h => h.fecha === fechaSeleccionada).map(h => h.hora) : [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
          <FontAwesome5 name="heartbeat" size={30} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Agendar Nueva Cita</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Sigue los pasos para reservar tu cita médica.
        </Text>
      </View>

      {/* Selector de Especialidad */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Selecciona una Especialidad</Text>
        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
            <Picker
              selectedValue={especialidadSeleccionada}
              onValueChange={(itemValue) => setEspecialidadSeleccionada(itemValue)}
              style={{ color: theme.text }}
              dropdownIconColor={theme.text}
            >
              <Picker.Item label="--- Selecciona una especialidad ---" value={null} />
              {especialidades.map((especialidad) => (
                <Picker.Item
                  key={especialidad.id}
                  label={especialidad.nombre}
                  value={especialidad.id}
                />
              ))}
            </Picker>
          </View>
        )}
      </View>

      {/* Selector de Doctor */}
      {especialidadSeleccionada && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Selecciona un Doctor</Text>
          {loadingDoctores ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
              <Picker
                selectedValue={doctorSeleccionado}
                onValueChange={(itemValue) => setDoctorSeleccionado(itemValue)}
                style={{ color: theme.text }}
                dropdownIconColor={theme.text}
              >
                <Picker.Item label="--- Selecciona un doctor ---" value={null} />
                {doctores.map((doctor) => (
                  <Picker.Item
                    key={doctor.id}
                    label={`${doctor.nombre} ${doctor.apellido}`}
                    value={doctor.id}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
      )}

      {/* Selector de Fecha */}
      {doctorSeleccionado && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Selecciona una Fecha</Text>
          {loadingHoras ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
              <Picker
                selectedValue={fechaSeleccionada}
                onValueChange={(itemValue) => setFechaSeleccionada(itemValue)}
                style={{ color: theme.text }}
                dropdownIconColor={theme.text}
              >
                <Picker.Item label="--- Selecciona una fecha ---" value={null} />
                {formattedDates.map((fecha, index) => (
                  <Picker.Item key={index} label={fecha} value={fecha} />
                ))}
              </Picker>
            </View>
          )}
        </View>
      )}

      {/* Selector de Hora */}
      {fechaSeleccionada && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Selecciona una Hora</Text>
          <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
            <Picker
              selectedValue={horaSeleccionada}
              onValueChange={(itemValue) => setHoraSeleccionada(itemValue)}
              style={{ color: theme.text }}
              dropdownIconColor={theme.text}
            >
              <Picker.Item label="--- Selecciona una hora ---" value={null} />
              {formattedTimes.map((hora, index) => (
                <Picker.Item key={index} label={hora} value={hora} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Botón de Confirmar Cita */}
      {horaSeleccionada && (
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: theme.primary }]}
          onPress={handleCreateCita}
          disabled={creandoCita}
        >
          {creandoCita ? (
            <ActivityIndicator color={theme.buttonText} />
          ) : (
            <Text style={[styles.confirmButtonText, { color: theme.buttonText }]}>Confirmar Cita</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
  },
  confirmButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});