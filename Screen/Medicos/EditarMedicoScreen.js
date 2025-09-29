import React, { useState, useContext, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert,ActivityIndicator} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "../../Src/Service/Conexion";
import { updateMedicoPerfil } from "../../Src/Service/MedicoService"; 

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

        if (!token || role !== "doctor") {
          Alert.alert("Error", "Permiso denegado.");
          navigation.goBack();
          return;
        }
        
        const response = await apiConexion.get("/me/doctor", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user || response.data;

        setNombre(userData.nombre || "");
        setApellido(userData.apellido || "");
        setDocumento(String(userData.documento || ""));
        setCelular(userData.celular || "");
        setCorreo(userData.correo || "");

      } catch (error) {
        console.error("Error al cargar el perfil para edición:", error);
        Alert.alert("Error de Carga", "No se pudieron cargar los datos del perfil.");
      } finally {
        setLoadingInitial(false);
      }
    };

    CargarDatos();
  }, []);

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoadingUpdate(true);
    try {
        const userData = {
          nombre,
          apellido,
          documento,
          correo,
          celular
        };

        const result = await updateMedicoPerfil(userData);

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
        !nombre || !apellido || !documento || !celular || !correo
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
          editable={false} // El documento no debería ser editable
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
          placeholder="Correo electrónico"
          placeholderTextColor={theme.subtitle}
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

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