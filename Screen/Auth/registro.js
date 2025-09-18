import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";

export default function RegisterPatientScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fechaNacimiento;
    setShowDatePicker(Platform.OS === 'ios');
    setFechaNacimiento(currentDate);
  };

  const validateForm = () => {
    if (!nombre || !apellido || !documento || !telefono || !email || !password || !confirmPassword) {
      Alert.alert("Error de registro", "Todos los campos son obligatorios.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error de registro", "Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    if (validateForm()) {
      setLoading(true);
      console.log("Registrando paciente:", { nombre, apellido, documento, telefono, email, password, fechaNacimiento });
      
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Registro exitoso", "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.");
        navigation.navigate("Login");
      }, 2000);
    }
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} style={{ backgroundColor: theme.background }}>
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
            value={telefono}
            keyboardType="phone-pad"
            onChangeText={setTelefono}
          />

          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {fechaNacimiento.toISOString().split('T')[0]}
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
            value={email}
            onChangeText={setEmail}
          />
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor={theme.subtitle}
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons
                name={secureText ? "eye-off" : "eye"}
                size={22}
                color={theme.subtitle}
              />
            </TouchableOpacity>
          </View>

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
      <ThemeSwitcher />
    </ScrollView>
  );
}