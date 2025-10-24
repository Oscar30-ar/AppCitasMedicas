import React, { useState, useContext, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert,ActivityIndicator,Platform} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updatePacientePerfil, obtenerEpsPublico } from "../../Src/Service/PacienteService"; 
import apiConexion from "../../Src/Service/Conexion";

export default function EditarPacienteScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [epsId, setEpsId] = useState(null);
  const [Rh, setRh] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estados para los pickers dinámicos
  const [epsList, setEpsList] = useState([]);
  const [loadingEps, setLoadingEps] = useState(true);
  const [ciudadesList, setCiudadesList] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(true);

  // 🔹 Solo Boyacá
  const departamentosPermitidos = [7];

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    title: {
      color: theme.text,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      marginTop: 20,
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
    dateText: {
      flex: 1,
      color: theme.text,
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
    updateBtn: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "center",
    },
    updateText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
  });

  useEffect(() => {
    const CargarDatos = async () => {
      // Cargar Ciudades y EPS en paralelo
      const cargarDependencias = async () => {
        try {
          const [resCiudades, resEps] = await Promise.all([
            fetch("https://api-colombia.com/api/v1/city"),
            obtenerEpsPublico(),
          ]);

          // Procesar ciudades
          if (resCiudades.ok) {
            const dataCiudades = await resCiudades.json();
            const filtradas = dataCiudades.filter(ciudad =>
              departamentosPermitidos.includes(ciudad.departmentId)
            );
            setCiudadesList(filtradas);
          } else {
            console.error("Error al cargar ciudades");
          }

          // Procesar EPS
          if (resEps.success) {
            setEpsList(resEps.data);
          } else {
            Alert.alert("Error", "No se pudieron cargar las EPS.");
          }
        } catch (error) {
          console.error("Error cargando dependencias:", error);
          Alert.alert("Error", "No se pudieron cargar los datos para los selectores.");
        } finally {
          setLoadingCiudades(false);
          setLoadingEps(false);
        }
      };

      setLoadingInitial(true);
      try {
        const token = await AsyncStorage.getItem("userToken");
        const role = await AsyncStorage.getItem("rolUser");

        if (!token || role !== "paciente") {
          Alert.alert("Error", "Permiso denegado.");
          navigation.goBack();
          return;
        }

        // Iniciar carga de dependencias y perfil
        cargarDependencias();
        // 💡 CORRECCIÓN: Usar apiConexion.get para OBTENER el perfil, no update.
        const response = await apiConexion.get("/me/paciente", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 💡 CORRECCIÓN: Asegurar que se acceda a la propiedad correcta (`data` o `user`) que contiene el objeto del perfil.
        const userData = response.data.data || response.data.user || response.data;

        setNombre(userData.nombre || "");
        setApellido(userData.apellido || "");
        setDocumento(String(userData.documento || ""));
        setCelular(userData.celular || "");
        setCorreo(userData.correo || "");
        setCiudad(userData.ciudad || "");
        setEpsId(userData.id_eps || null); // Asumiendo que el backend devuelve id_eps
        setRh(userData.Rh || "");
        setGenero(userData.genero || "");

        if (userData.fecha_nacimiento) {
            const date = new Date(userData.fecha_nacimiento.split("T")[0]);
            setFechaNacimiento(date);
        }

      } catch (error) {
        console.error("Error al cargar el perfil para edición:", error);
        Alert.alert("Error de Carga", "No se pudieron cargar los datos del perfil.");
      } finally {
        setLoadingInitial(false);
      }
    };

    CargarDatos();
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fechaNacimiento;
    setShowDatePicker(Platform.OS === "ios");
    setFechaNacimiento(currentDate);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoadingUpdate(true);
    try {
        const userData = {
          nombre,
          apellido,
          documento,
          correo,
          celular,
          ciudad,
          id_eps: epsId,
          Rh,
          genero,
          fecha_nacimiento: fechaNacimiento.toISOString().split("T")[0],
        };

        const result = await updatePacientePerfil(userData);

        if (result.success) {
          Alert.alert("Éxito.", result.message);
          navigation.goBack();
        } else {
          Alert.alert("Error de Actualización", result.message);
        }
    } catch (error) {
        console.error("Error inesperado al actualizar perfil", error);
        Alert.alert(
          "Error",
          "Ocurrió un error inesperado durante la actualización."
        );
    } finally {
        setLoadingUpdate(false);
    }
  };

  const validateForm = () => {
    if (
        !nombre || !apellido || !documento || !celular || !correo || !epsId || !Rh || !genero || !ciudad
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };


  if (loadingInitial) {
    return (
        <View style={[styles.loadingContainer, {backgroundColor: theme.background}]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{color: theme.subtitle, marginTop: 10}}>Cargando datos...</Text>
        </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={[styles.form, {backgroundColor: theme.cardBackground}]}>
        <TextInput
          style={[styles.input, {backgroundColor: theme.background, color: theme.text, borderColor: theme.border}]}
          placeholder="Nombre"
          placeholderTextColor={theme.subtitle}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={[styles.input, {backgroundColor: theme.background, color: theme.text, borderColor: theme.border}]}
          placeholder="Apellido"
          placeholderTextColor={theme.subtitle}
          value={apellido}
          onChangeText={setApellido}
        />
        <TextInput
          style={[styles.input, {backgroundColor: theme.background, color: theme.text, borderColor: theme.border}]}
          placeholder="Cédula o documento de identidad"
          placeholderTextColor={theme.subtitle}
          value={documento}
          keyboardType="numeric"
          onChangeText={setDocumento}
          editable={true} 
        />
        <TextInput
          style={[styles.input, {backgroundColor: theme.background, color: theme.text, borderColor: theme.border}]}
          placeholder="Teléfono"
          placeholderTextColor={theme.subtitle}
          value={celular}
          keyboardType="phone-pad"
          onChangeText={setCelular}
        />

        {/* Picker de Ciudades */}
        {loadingCiudades ? (
          <ActivityIndicator color={theme.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={[styles.picker, {backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1}]}>
            <Picker
              selectedValue={ciudad}
              style={{ color: theme.text }}
              onValueChange={(itemValue) => setCiudad(itemValue)}
              dropdownIconColor={theme.subtitle}
            >
              <Picker.Item label="Seleccione su ciudad" value="" color={theme.subtitle} />
              {ciudadesList.map((c) => (
                <Picker.Item key={c.id} label={c.name} value={c.name} />
              ))}
            </Picker>
          </View>
        )}

        {/* Fecha de nacimiento */}
        <TouchableOpacity
          style={[styles.inputContainer, {backgroundColor: theme.background, borderColor: theme.border}]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateText, {color: theme.text}]}>
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
          style={[styles.input, {backgroundColor: theme.background, color: theme.text, borderColor: theme.border}]}
          placeholder="Correo electrónico"
          placeholderTextColor={theme.subtitle}
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        {/* Picker de EPS */}
        {loadingEps ? (
          <ActivityIndicator color={theme.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={[styles.picker, {backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1}]}>
            <Picker
              selectedValue={epsId}
              style={{ color: theme.text }}
              onValueChange={(itemValue) => setEpsId(itemValue)}
              dropdownIconColor={theme.subtitle}
            >
              <Picker.Item label="Seleccione su EPS" value={null} color={theme.subtitle} />
              {epsList.map((e) => (
                <Picker.Item key={e.id} label={e.nombre} value={e.id} />
              ))}
            </Picker>
          </View>
        )}

        <View style={[styles.picker, {backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1}]}>
        <Picker
          selectedValue={Rh}
          style={{ color: theme.text }}
          onValueChange={(itemValue) => setRh(itemValue)}
          dropdownIconColor={theme.subtitle}
        >
          <Picker.Item label="Seleccione su tipo de sangre" value="" color={theme.subtitle} />
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

        <View style={[styles.picker, {backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1}]}>
        <Picker
          selectedValue={genero}
          style={{ color: theme.text }}
          onValueChange={(itemValue) => setGenero(itemValue)}
          dropdownIconColor={theme.subtitle}
        >
          <Picker.Item label="Seleccione su género" value="" color={theme.subtitle} />
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Femenino" value="Femenino" />
        </Picker>
        </View>


        {/* Botón de Actualizar */}
        <TouchableOpacity
          style={[styles.updateBtn, { backgroundColor: theme.primary }]}
          onPress={handleUpdate}
          disabled={loadingUpdate}
          activeOpacity={0.7}
        >
          {loadingUpdate ? (
            <ActivityIndicator color={theme.text} />
          ) : (
            <Text style={styles.updateText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </View>
      <ThemeSwitcher />
    </ScrollView>
  );
}