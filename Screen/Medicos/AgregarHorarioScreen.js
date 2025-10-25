import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../components/ThemeContext';
import { crearHorario } from '../../Src/Service/MedicoService';

export default function AgregarHorarioScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [diaSemana, setDiaSemana] = useState('Lunes');
  const [trabajaTarde, setTrabajaTarde] = useState(false); // 🔹 Controla si trabaja en la tarde

  const horasManana = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];
  const horasTarde = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const [horaInicioManana, setHoraInicioManana] = useState("08:00");
  const [horaFinManana, setHoraFinManana] = useState("12:00");
  const [horaInicioTarde, setHoraInicioTarde] = useState("14:00");
  const [horaFinTarde, setHoraFinTarde] = useState("18:00");
  const [loading, setLoading] = useState(false);

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const handleGuardar = async () => {
    if (horaInicioManana >= horaFinManana) {
      Alert.alert("Error", "La hora de inicio de la mañana debe ser anterior a la hora de fin.");
      return;
    }

    if (trabajaTarde && horaInicioTarde >= horaFinTarde) {
      Alert.alert("Error", "La hora de inicio de la tarde debe ser anterior a la hora de fin.");
      return;
    }

    setLoading(true);
    try {
      const horarioManana = {
        dia_semana: diaSemana,
        hora_inicio: horaInicioManana,
        hora_fin: horaFinManana,
      };

      const resp1 = await crearHorario(horarioManana);
      if (resp1.status === 409 || resp1?.code === "overlap") {
        Alert.alert("⚠️ Advertencia", resp1.message || "Ya existe una franja que se solapa.");
        setLoading(false);
        return;
      }

      let resp2 = { success: false };
      if (trabajaTarde) {
        const horarioTarde = {
          dia_semana: diaSemana,
          hora_inicio: horaInicioTarde,
          hora_fin: horaFinTarde,
        };
        resp2 = await crearHorario(horarioTarde);
        if (resp2.status === 409 || resp2?.code === "overlap") {
          Alert.alert("⚠️ Advertencia", resp2.message || "Ya existe una franja que se solapa.");
          setLoading(false);
          return;
        }
      }

      if (resp1.success || resp2.success) {
        Alert.alert("✅ Éxito", "Horarios agregados correctamente.", [
          { text: "Aceptar", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "No se pudieron guardar los horarios.");
      }
    } catch (error) {
      console.error("Error al guardar horario:", error);
      Alert.alert("Error", "Ocurrió un problema al guardar los horarios.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: theme.background },
    title: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 20, textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.primary, marginTop: 25, marginBottom: 10 },
    label: { color: theme.text, marginTop: 10, fontSize: 16 },
    pickerContainer: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.border,
      backgroundColor: theme.cardBackground,
      marginBottom: 20,
    },
    rowSwitch: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    button: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: theme.primary,
      marginTop: 30,
      marginBottom: 40,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agregar Horario por Día</Text>

      {/* Día */}
      <Text style={styles.label}>Día de la semana</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={diaSemana} onValueChange={setDiaSemana} style={{ color: theme.text }}>
          {dias.map((dia) => (
            <Picker.Item key={dia} label={dia} value={dia} />
          ))}
        </Picker>
      </View>

      {/* Mañana */}
      <Text style={styles.sectionTitle}>🌅 Por la mañana</Text>
      <Text style={styles.label}>Hora de inicio</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={horaInicioManana} onValueChange={setHoraInicioManana} style={{ color: theme.text }}>
          {horasManana.map((h) => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Hora de fin</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={horaFinManana} onValueChange={setHoraFinManana} style={{ color: theme.text }}>
          {horasManana.map((h) => (
            <Picker.Item key={h} label={h} value={h} />
          ))}
        </Picker>
      </View>

      {/* Switch para habilitar horario de tarde */}
      <View style={styles.rowSwitch}>
        <Text style={styles.sectionTitle}>🌇 Trabaja en la tarde</Text>
        <Switch
          value={trabajaTarde}
          onValueChange={setTrabajaTarde}
          thumbColor={trabajaTarde ? theme.primary : "#ccc"}
        />
      </View>

      {/* Tarde (solo si trabajaTarde === true) */}
      {trabajaTarde && (
        <>
          <Text style={styles.label}>Hora de inicio</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={horaInicioTarde} onValueChange={setHoraInicioTarde} style={{ color: theme.text }}>
              {horasTarde.map((h) => (
                <Picker.Item key={h} label={h} value={h} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Hora de fin</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={horaFinTarde} onValueChange={setHoraFinTarde} style={{ color: theme.text }}>
              {horasTarde.map((h) => (
                <Picker.Item key={h} label={h} value={h} />
              ))}
            </Picker>
          </View>
        </>
      )}

      {/* Guardar */}
      <TouchableOpacity onPress={handleGuardar} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar Horario</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
