import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemeContext } from '../../components/ThemeContext';
import { crearHorario } from '../../Src/Service/MedicoService';

export default function AgregarHorarioScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [diaSemana, setDiaSemana] = useState('Lunes');

  // Estados para horario de mañana
  const [horaInicioManana, setHoraInicioManana] = useState(new Date(new Date().setHours(8, 0, 0, 0)));
  const [horaFinManana, setHoraFinManana] = useState(new Date(new Date().setHours(12, 0, 0, 0)));

  // Estados para horario de tarde
  const [horaInicioTarde, setHoraInicioTarde] = useState(new Date(new Date().setHours(14, 0, 0, 0)));
  const [horaFinTarde, setHoraFinTarde] = useState(new Date(new Date().setHours(18, 0, 0, 0)));

  const [loading, setLoading] = useState(false);

  const [showPicker, setShowPicker] = useState({
    type: null,
    visible: false,
  });

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const formatTime = (date) => date.toTimeString().split(' ')[0].slice(0, 5);

  const handleGuardar = async () => {
    if (horaInicioManana >= horaFinManana) {
      Alert.alert("Error", "La hora de inicio de la mañana debe ser anterior a la hora de fin.");
      return;
    }

    if (horaInicioTarde >= horaFinTarde) {
      Alert.alert("Error", "La hora de inicio de la tarde debe ser anterior a la hora de fin.");
      return;
    }

    setLoading(true);

    try {
      // Guardar franja de la mañana
      const horarioManana = {
        dia_semana: diaSemana,
        hora_inicio: formatTime(horaInicioManana),
        hora_fin: formatTime(horaFinManana),
      };

      const horarioTarde = {
        dia_semana: diaSemana,
        hora_inicio: formatTime(horaInicioTarde),
        hora_fin: formatTime(horaFinTarde),
      };

      const resp1 = await crearHorario(horarioManana);
      const resp2 = await crearHorario(horarioTarde);

      if (resp1.success || resp2.success) {
        Alert.alert("Éxito", "Horarios agregados correctamente.", [
          { text: "Aceptar", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "No se pudieron guardar los horarios.");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al guardar los horarios.");
    } finally {
      setLoading(false);
    }
  };

  const handlePickerChange = (event, selectedTime) => {
    if (selectedTime) {
      switch (showPicker.type) {
        case "inicioManana":
          setHoraInicioManana(selectedTime);
          break;
        case "finManana":
          setHoraFinManana(selectedTime);
          break;
        case "inicioTarde":
          setHoraInicioTarde(selectedTime);
          break;
        case "finTarde":
          setHoraFinTarde(selectedTime);
          break;
      }
    }
    setShowPicker({ type: null, visible: false });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: theme.background },
    title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 20, textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.primary, marginTop: 25, marginBottom: 10 },
    label: { color: theme.text, marginTop: 10, fontSize: 16 },
    pickerContainer: {
      borderWidth: 1, borderRadius: 10, borderColor: theme.border,
      backgroundColor: theme.cardBackground, marginBottom: 20
    },
    input: {
      borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 5,
      justifyContent: 'center', backgroundColor: theme.cardBackground,
      borderColor: theme.border, height: 50
    },
    button: {
      padding: 15, borderRadius: 10, alignItems: 'center',
      backgroundColor: theme.primary, marginTop: 30, marginBottom: 40
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agregar Horario por Día</Text>

      {/* Selector de día */}
      <Text style={styles.label}>Día de la semana</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={diaSemana}
          onValueChange={(itemValue) => setDiaSemana(itemValue)}
          style={{ color: theme.text }}
        >
          {dias.map((dia) => (
            <Picker.Item key={dia} label={dia} value={dia} />
          ))}
        </Picker>
      </View>

      {/* Horario de la mañana */}
      <Text style={styles.sectionTitle}>🌅 Por la mañana</Text>

      <Text style={styles.label}>Hora de inicio</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker({ type: "inicioManana", visible: true })}
      >
        <Text style={{ color: theme.text }}>{formatTime(horaInicioManana)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Hora de fin</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker({ type: "finManana", visible: true })}
      >
        <Text style={{ color: theme.text }}>{formatTime(horaFinManana)}</Text>
      </TouchableOpacity>

      {/* Horario de la tarde */}
      <Text style={styles.sectionTitle}>🌇 En la tarde</Text>

      <Text style={styles.label}>Hora de inicio</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker({ type: "inicioTarde", visible: true })}
      >
        <Text style={{ color: theme.text }}>{formatTime(horaInicioTarde)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Hora de fin</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker({ type: "finTarde", visible: true })}
      >
        <Text style={{ color: theme.text }}>{formatTime(horaFinTarde)}</Text>
      </TouchableOpacity>

      {/* Selector de hora (aparece dinámicamente) */}
      {showPicker.visible && (
        <DateTimePicker
          value={
            showPicker.type.includes("Manana")
              ? showPicker.type === "inicioManana"
                ? horaInicioManana
                : horaFinManana
              : showPicker.type === "inicioTarde"
              ? horaInicioTarde
              : horaFinTarde
          }
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handlePickerChange}
        />
      )}

      {/* Botón Guardar */}
      <TouchableOpacity
        onPress={handleGuardar}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Guardar Horario</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
