import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../../components/ThemeContext";
import { listarEspecialidades, listarDoctorPorId, actualizarMedico } from "../../Src/Service/RecepcionService";

export default function EditarMedicoScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { doctorId } = route.params;

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [especialidadId, setEspecialidadId] = useState(null);

  // Datos para el Picker
  const [especialidades, setEspecialidades] = useState([]);

  // Estados de UI
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Cargar datos iniciales del médico y especialidades
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resDoctor, resEspecialidades] = await Promise.all([
          listarDoctorPorId(doctorId),
          listarEspecialidades(),
        ]);

        if (resDoctor.success) {
          const doctor = resDoctor.data;
          setNombre(doctor.nombre);
          setApellido(doctor.apellido);
          setDocumento(doctor.documento);
          setCelular(doctor.celular);
          setCorreo(doctor.correo);
          if (doctor.especialidades && doctor.especialidades.length > 0) {
            setEspecialidadId(doctor.especialidades[0].id);
          }
        } else {
          Alert.alert("Error", "No se pudieron cargar los datos del médico.");
          navigation.goBack();
        }

        if (resEspecialidades.success) {
          setEspecialidades(resEspecialidades.data);
        }

      } catch (error) {
        console.error("Error cargando datos para editar médico:", error);
        Alert.alert("Error", "Ocurrió un error inesperado.");
      } finally {
        setLoadingInitial(false);
      }
    };
    cargarDatos();
  }, [doctorId]);

  const handleGuardarCambios = async () => {
    if (!nombre || !apellido || !documento || !celular || !correo || !especialidadId) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    setLoadingUpdate(true);
    try {
      const medicoData = {
        nombre,
        apellido,
        documento,
        correo,
        celular,
        especialidades: [especialidadId],
      };

      const result = await actualizarMedico(doctorId, medicoData);

      if (result.success) {
        Alert.alert(
          "Éxito",
          "Médico actualizado correctamente.",
          [{ text: "Aceptar", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Error de Actualización", result.message || "No se pudo actualizar el médico.");
      }
    } catch (error) {
      console.error("Error inesperado al actualizar médico:", error);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const styles = getStyles(theme);

  if (loadingInitial) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.subtitle, marginTop: 10 }}>Cargando datos del médico...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Editar Médico</Text>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor={theme.subtitle} value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor={theme.subtitle} value={apellido} onChangeText={setApellido} />
          <TextInput style={styles.input} placeholder="Documento" placeholderTextColor={theme.subtitle} value={documento} onChangeText={setDocumento} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor={theme.subtitle} value={celular} onChangeText={setCelular} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor={theme.subtitle} value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={especialidadId}
              onValueChange={(itemValue) => setEspecialidadId(itemValue)}
              style={{ color: theme.text }}
              dropdownIconColor={theme.text}
            >
              <Picker.Item label="Seleccione una especialidad" value={null} />
              {especialidades.map((e) => (
                <Picker.Item key={e.id} label={e.nombre} value={e.id} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={handleGuardarCambios}
            disabled={loadingUpdate}
          >
            {loadingUpdate ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveBtnText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  form: {
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 12,
  },
  input: {
    backgroundColor: theme.background,
    color: theme.text,
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: theme.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 15,
  },
  saveBtn: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});