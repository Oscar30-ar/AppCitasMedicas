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
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../../components/ThemeContext";
import { agregarMedico, getEspecialidades, listarConsultoriosDisponibles, obtenerDoctores } from "../../Src/Service/RecepcionService";

export default function AgregarMedicoScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [especialidadId, setEspecialidadId] = useState(null);
  const [consultorioId, setConsultorioId] = useState(null);


  // Datos para el Picker
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  // Estados de UI
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(true);
  const [loadingConsultorios, setLoadingConsultorios] = useState(true);
  const [loadingDoctores, setLoadingDoctores] = useState(true);

  // Cargar datos para los Pickers (Especialidades, Consultorios y Doctores)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resEspecialidades, resConsultorios, resDoctores] = await Promise.all([
          getEspecialidades(),
          listarConsultoriosDisponibles(),
          obtenerDoctores()
        ]);

        if (resEspecialidades.success) setEspecialidades(resEspecialidades.data);
        else Alert.alert("Error", "No se pudieron cargar las especialidades.");

        if (resConsultorios.success) setConsultorios(resConsultorios.data);
        else Alert.alert("Error", "No se pudieron cargar los consultorios.");

        if (resDoctores.success) setDoctores(resDoctores.data);
        else Alert.alert("Error", "No se pudieron cargar los doctores.");
      } catch (error) {
        Alert.alert("Error de Conexión", "No se pudieron cargar los datos necesarios para el formulario.");
      }
      setLoadingEspecialidades(false);
      setLoadingConsultorios(false);
      setLoadingDoctores(false);
    };
    cargarDatos();
  }, []);

  const handleAgregar = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      const medicoData = {
        nombre,
        apellido,
        documento,
        correo,
        clave,
        celular,
        especialidades: [especialidadId],
        id_consultorio: consultorioId,
      };

      const result = await agregarMedico(medicoData);

      if (result.success) {
        Alert.alert(
          "Éxito",
          "Médico agregado correctamente.",
          [{ text: "Aceptar", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Error de Registro", result.message || "No se pudo agregar al médico.");
      }
    } catch (error) {
      console.error("Error inesperado al agregar médico:", error);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!nombre || !apellido || !documento || !celular || !correo || !clave || !confirmarClave || !especialidadId || !consultorioId) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return false;
    }
    if (clave !== confirmarClave) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const styles = getStyles(theme);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Agregar Nuevo Médico</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={theme.subtitle}
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor={theme.subtitle}
            value={apellido}
            onChangeText={setApellido}
          />
          <TextInput
            style={styles.input}
            placeholder="Documento de identidad"
            placeholderTextColor={theme.subtitle}
            value={documento}
            keyboardType="numeric"
            onChangeText={setDocumento}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor={theme.subtitle}
            value={celular}
            keyboardType="phone-pad"
            onChangeText={setCelular}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={theme.subtitle}
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor={theme.subtitle}
              secureTextEntry={secureText}
              value={clave}
              onChangeText={setClave}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons name={secureText ? "eye-off" : "eye"} size={22} color={theme.subtitle} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar contraseña"
              placeholderTextColor={theme.subtitle}
              secureTextEntry={secureText}
              value={confirmarClave}
              onChangeText={setConfirmarClave}
            />
          </View>

          {loadingEspecialidades ? <ActivityIndicator color={theme.primary} /> : (
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
          )}

          {loadingConsultorios ? <ActivityIndicator color={theme.primary} /> : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={consultorioId}
                onValueChange={(itemValue) => setConsultorioId(itemValue)}
                style={{ color: theme.text }}
                dropdownIconColor={theme.text}
              >
                <Picker.Item label="Seleccione un consultorio" value={null} />
                {consultorios.map((e) => (
                  <Picker.Item key={e.id} label={e.nombre} value={e.id} />
                ))}
              </Picker>
            </View>
          )}

          <TouchableOpacity
            style={[styles.registerBtn, { backgroundColor: theme.primary }]}
            onPress={handleAgregar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.registerText}>Agregar Médico</Text>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 15,
    height: 50,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    color: theme.text,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: theme.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 15,
  },
  registerBtn: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});