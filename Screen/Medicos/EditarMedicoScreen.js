import React, { useState, useContext, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert,ActivityIndicator,Platform,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "../../Src/Service/Conexion";
import { updatePacientePerfil } from "../../Src/Service/PacienteService"; 

export default function EditarMedicoScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Estados del formulario inicializados a vacío/fecha actual
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [eps, setEps] = useState("");
  const [Rh, setRh] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

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
      setLoadingInitial(true);
      try {
        const token = await AsyncStorage.getItem("userToken");
        const role = await AsyncStorage.getItem("rolUser");

        if (!token || role !== "paciente") {
          Alert.alert("Error", "Permiso denegado.");
          navigation.navigate("DashboardPaciente");
          return;
        }
        
        const response = await apiConexion.get("/me/paciente", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user || response.data;

        setNombre(userData.nombre || "");
        setApellido(userData.apellido || "");
        setDocumento(String(userData.documento || ""));
        setCelular(userData.celular || "");
        setCorreo(userData.correo || "");
        setCiudad(userData.ciudad || "");
        setEps(userData.eps || "");
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
          eps,
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
        !nombre || !apellido || !documento || !celular || !correo || !eps || !Rh || !genero || !ciudad
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
        <TextInput
            style={[styles.input, {backgroundColor: theme.background, color: theme.text, borderColor: theme.border}]}
            placeholder="Ciudad"
            placeholderTextColor={theme.subtitle}
            value={ciudad}
            onChangeText={setCiudad}
        />

        {/* Fecha de nacimiento */}
        <TouchableOpacity
          style={[styles.inputContainer, {backgroundColor: theme.background, borderColor: theme.border}]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateText, {color: theme.text}]}>
            {fechaNacimiento.toISOString().split("T")[0]}
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

        <View style={[styles.picker, {backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1}]}>
        <Picker
          selectedValue={eps}
          style={{ color: theme.text }}
          onValueChange={(itemValue) => setEps(itemValue)}
          dropdownIconColor={theme.subtitle}
        >
          <Picker.Item label="Seleccione su EPS" value="" color={theme.subtitle} />
          <Picker.Item label="Sura" value="Sura" />
          <Picker.Item label="Sanitas" value="Sanitas" />
          <Picker.Item label="Nueva EPS" value="Nueva EPS" />
          <Picker.Item label="Compensar" value="Compensar" />
          <Picker.Item label="Otra" value="Otra" />
        </Picker>
        </View>

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
          <Picker.Item label="Otro" value="Otro" />
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