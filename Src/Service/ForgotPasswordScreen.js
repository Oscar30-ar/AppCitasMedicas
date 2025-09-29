import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
// import { requestPasswordReset } from "../../Src/Service/AuthService"; // You'll need to create this service function

export default function ForgotPasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement the actual API call to your backend for password reset
      // Example:
      // const result = await requestPasswordReset(email);
      // if (result.success) {
      //   Alert.alert("Éxito", result.message || "Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.");
      //   navigation.goBack(); // Or navigate to a success screen
      // } else {
      //   Alert.alert("Error", result.message || "No se pudo procesar la solicitud. Inténtalo de nuevo.");
      // }

      // --- Placeholder for demonstration ---
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call delay
      Alert.alert(
        "Éxito",
        "Si tu correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña."
      );
      setEmail("");
      navigation.goBack();
      // --- End Placeholder ---

    } catch (error) {
      console.error("Error inesperado al solicitar restablecimiento de contraseña:", error);
      Alert.alert("Error", "Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
          <FontAwesome5 name="heartbeat" size={30} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>¿Olvidaste tu Contraseña?</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={[styles.inputContainer, { borderColor: theme.border }]}>
          <Ionicons name="mail-outline" size={20} color={theme.subtitle} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Correo electrónico"
            placeholderTextColor={theme.subtitle}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Restablecer Contraseña</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
  },
  logoContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});