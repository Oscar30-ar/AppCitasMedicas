import React, { useState, useContext, useEffect } from 'react';
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
import { editarHorario } from '../../Src/Service/MedicoService';
import { useRoute } from '@react-navigation/native';

export default function EditarHorarioScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const route = useRoute();
  const horario = route.params?.horario;

  // Estados
  const [diaSemana, setDiaSemana] = useState('');
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaFin, setHoraFin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // 🔹 Cargar los datos recibidos
  useEffect(() => {
    if (horario) {
      setDiaSemana(horario.dia_semana || 'Lunes');

      // Convertir hora_inicio y hora_fin a objetos Date
      const [hInicio, mInicio] = (horario.hora_inicio || '08:00').split(':');
      const inicioDate = new Date();
      inicioDate.setHours(hInicio, mInicio, 0, 0);

      const [hFin, mFin] = (horario.hora_fin || '17:00').split(':');
      const finDate = new Date();
      finDate.setHours(hFin, mFin, 0, 0);

      setHoraInicio(inicioDate);
      setHoraFin(finDate);
      setIsDataReady(true);
    }
  }, [horario]);

  const formatTime = (date) => date.toTimeString().split(' ')[0].slice(0, 5);

  const handleGuardar = async () => {
    if (!horaInicio || !horaFin) {
      Alert.alert("Error", "Debes seleccionar las horas de inicio y fin.");
      return;
    }

    if (horaInicio >= horaFin) {
      Alert.alert("Error", "La hora de inicio debe ser anterior a la hora de fin.");
      return;
    }

    setLoading(true);
    const horarioData = {
      dia_semana: diaSemana,
      hora_inicio: formatTime(horaInicio),
      hora_fin: formatTime(horaFin),
    };

    try {
      const response = await editarHorario(horario.id, horarioData);
      if (response.success) {
        Alert.alert("Éxito", "Horario actualizado correctamente.", [
          { text: "Aceptar", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Error", response.message || "No se pudo actualizar el horario.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Alert.alert("Error", "Ocurrió un problema al actualizar el horario.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Si los datos aún no se cargan, mostrar un loader
  if (!isDataReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Cargando datos del horario...</Text>
      </View>
    );
  }

  // 🔹 Estilos
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: theme.background },
    title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 20, textAlign: 'center' },
    label: { color: theme.text, marginTop: 15, fontSize: 16, marginBottom: 5 },
    pickerContainer: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.border,
      backgroundColor: theme.cardBackground,
    },

    input: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginTop: 5,
      marginBottom: 15,
      justifyContent: 'center',
      backgroundColor: theme.cardBackground,
      borderColor: theme.border,
      height: 50,
    },
    button: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: theme.primary,
      marginTop: 30,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });

  // 🔹 Vista principal
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Horario</Text>

      {/* Día de la semana */}
      <Text style={styles.label}>Día de la semana</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={diaSemana}
          enabled={false}
          onValueChange={(itemValue) => setDiaSemana(itemValue)}
          style={{ color: theme.text }}
        >
          {dias.map((dia) => (
            <Picker.Item key={dia} label={dia} value={dia} />
          ))}
        </Picker>
      </View>

      {/* Hora de inicio */}
      <Text style={styles.label}>Hora de Inicio</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowInicioPicker(true)}>
        <Text style={{ color: theme.text }}>{formatTime(horaInicio)}</Text>
      </TouchableOpacity>
      {showInicioPicker && (
        <DateTimePicker
          value={horaInicio}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedTime) => {
            setShowInicioPicker(false);
            if (selectedTime) setHoraInicio(selectedTime);
          }}
        />
      )}

      {/* Hora de fin */}
      <Text style={styles.label}>Hora de Fin</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowFinPicker(true)}>
        <Text style={{ color: theme.text }}>{formatTime(horaFin)}</Text>
      </TouchableOpacity>
      {showFinPicker && (
        <DateTimePicker
          value={horaFin}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedTime) => {
            setShowFinPicker(false);
            if (selectedTime) setHoraFin(selectedTime);
          }}
        />
      )}

      {/* Botón Guardar */}
      <TouchableOpacity onPress={handleGuardar} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Actualizar Horario</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
