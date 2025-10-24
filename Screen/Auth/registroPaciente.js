import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../../components/ThemeContext";
import { registrarPaciente, obtenerEpsPublico } from "../../Src/Service/PacienteService";
import { useEffect } from "react";

export default function RegisterPatientScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [eps, setEps] = useState("");
  const [Rh, setRh] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());



  const [showDatePicker, setShowDatePicker] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [epsList, setEpsList] = useState([]);
  const [loadingEps, setLoadingEps] = useState(true);


  // listar ciudades(API)
  const [ciudadesList, setCiudadesList] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(true);

  // 🔹 Solo Boyacá
  const departamentosPermitidos = [7];

  useEffect(() => {
    const cargarCiudades = async () => {
      try {
        setLoadingCiudades(true);
        const res = await fetch("https://api-colombia.com/api/v1/city");
        if (!res.ok) throw new Error("Error al obtener las ciudades");

        const data = await res.json();

        // 🔹 Filtrar las ciudades que pertenecen a Boyacá
        const filtradas = data.filter(ciudad =>
          departamentosPermitidos.includes(ciudad.departmentId)
        );

        setCiudadesList(filtradas);
      } catch (error) {
        console.error("Error cargando ciudades:", error);
        Alert.alert("Error", "No se pudieron cargar las ciudades de Boyacá.");
      } finally {
        setLoadingCiudades(false);
      }
    };

    cargarCiudades();
  }, []);




  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingEps(true);
      const response = await obtenerEpsPublico();
      if (response.success) {
        setEpsList(response.data);
      } else {
        Alert.alert("Error", "No se pudieron cargar las EPS disponibles.");
      }
      setLoadingEps(false);
    };

    cargarDatos();
  }, []);

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const adjustedDate = new Date(
        selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
      );
      setFechaNacimiento(adjustedDate);
    }
    setShowDatePicker(Platform.OS === "ios");
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const userData = {
          nombre,
          apellido,
          documento,
          correo,
          clave,
          celular,
          ciudad,
          id_eps: eps,
          Rh,
          genero,
          fecha_nacimiento: fechaNacimiento.toISOString().split("T")[0],
        };

        const result = await registrarPaciente(userData);

        if (result.success) {
          Alert.alert("Registro exitoso", result.message);
          navigation.navigate("Login");
        } else {
          Alert.alert("Error de registro", result.message);
        }
      } catch (error) {
        console.error("Error inesperado en registro:", error.response?.data || error.message);

        if (error.response?.status === 422) {
          const errors = error.response.data.errors;
          const firstError = Object.values(errors)[0][0];
          Alert.alert("Error de validación", firstError);
        } else {
          Alert.alert("Error", "Ocurrió un error inesperado durante el registro.");
        }
      }

    }
  };

  const validateForm = () => {
    if (
      !nombre ||
      !apellido ||
      !documento ||
      !celular ||
      !correo ||
      !clave ||
      !confirmarClave ||
      !eps ||
      !Rh ||
      !genero ||
      !ciudad
    ) {
      Alert.alert("Error de registro", "Todos los campos son obligatorios.");
      return false;
    }
    if (clave !== confirmarClave) {
      Alert.alert("Error de registro", "Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    title: {
      color: theme.text,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      marginTop: 40,
    },
    form: {
      backgroundColor: theme.cardBackground,
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
    },
    input: {
      backgroundColor: theme.background,
      color: theme.text,
      height: 50,
      paddingHorizontal: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 12,
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 12,
      height: 50,
      paddingHorizontal: 15,
    },
    passwordInput: {
      flex: 1,
      height: "100%",
      color: theme.text,
      fontSize: 16,
    },
    dateText: {
      flex: 1,
      color: fechaNacimiento ? theme.text : theme.subtitle,
      fontSize: 16,
    },
    picker: {
      backgroundColor: theme.background,
      color: theme.text,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 12,
    },
    pickerContainer: {
      backgroundColor: theme.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 12,
      justifyContent: 'center',
    },
    registerBtn: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "center",
    },
    registerText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
    },
    loginBtn: {
      backgroundColor: "transparent",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.primary,
    },
    loginText: {
      color: theme.primary,
      fontWeight: "bold",
      fontSize: 18,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      style={{ backgroundColor: theme.background }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Paciente</Text>

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
            placeholder="Cédula o documento de identidad"
            placeholderTextColor={theme.subtitle}
            value={documento}
            keyboardType="phone-pad"
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

          {/* Fecha de nacimiento */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {fechaNacimiento.toLocaleDateString("es-CO")}
            </Text>
            <Ionicons name="calendar-outline" size={24} color={theme.subtitle} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={fechaNacimiento}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={theme.subtitle}
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
          />

          {/* Contraseña */}
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
              <Ionicons
                name={secureText ? "eye-off" : "eye"}
                size={22}
                color={theme.subtitle}
              />
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
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons
                name={secureText ? "eye-off" : "eye"}
                size={22}
                color={theme.subtitle}
              />
            </TouchableOpacity>
          </View>

                    {/**Picker de ciudades */}
          {loadingCiudades
            ? <ActivityIndicator color={theme.primary} style={{ marginVertical: 20 }} />
            : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={ciudad}
                  style={{ color: theme.text }}
                  onValueChange={(itemValue) => setCiudad(itemValue)}
                >
                  <Picker.Item label="Seleccione su ciudad" value="" />
                  {ciudadesList.map((c, idx) => (
                    <Picker.Item key={idx} label={c.name || c.city || c.nombre} value={c.name || c.city || c.nombre} />
                  ))}
                </Picker>
              </View>
            )
          }

          {/* Select EPS */}
          {loadingEps ? (
            <ActivityIndicator color={theme.primary} style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={eps}
                style={{ color: theme.text }}
                onValueChange={(itemValue) => setEps(itemValue)}
              >
                <Picker.Item label="Seleccione su EPS" value="" />
                {epsList.map((item) => (
                  <Picker.Item key={item.id} label={item.nombre} value={item.id} />
                ))}
              </Picker>
            </View>
          )}

          {/* Select Rh */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={Rh}
              style={{ color: theme.text }}
              onValueChange={(itemValue) => setRh(itemValue)}
            >
              <Picker.Item label="Seleccione su tipo de sangre" value="" />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
            </Picker>
          </View>

          {/* Select Género */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={genero}
              style={{ color: theme.text }}
              onValueChange={(itemValue) => setGenero(itemValue)}
            >
              <Picker.Item label="Seleccione su género" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
            </Picker>
          </View>

          {/* Botones */}
          <TouchableOpacity
            style={[styles.registerBtn, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color={theme.text} />
            ) : (
              <Text style={styles.registerText}>Registrar Paciente</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, { borderColor: theme.primary }]}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
