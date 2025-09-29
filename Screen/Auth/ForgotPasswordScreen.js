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
import { requestPasswordReset } from "../../Src/Service/AuthService";

export default function ForgotPasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    // ✅ Validar que haya un correo
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico.");
      return;
    }

    // ✅ Validar formato del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Llamar correctamente a la API
      const result = await requestPasswordReset({ correo: email });

      if (result.success) {
        Alert.alert(
          "Éxito",
          result.message ||
            "Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.",
          [
            {
              text: "Aceptar",
              onPress: () => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate("Login");
                }
              },
            },
          ]
        );
        setEmail("");
      } else {
        Alert.alert("Error", result.message || "No se pudo procesar la solicitud.");
      }
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
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Enviar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={{ color: theme.primary, textAlign: "center", marginTop: 15 }}>
            Ya tengo el token
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { alignItems: "center", marginBottom: 30, marginTop: 50 },
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  form: { flex: 1 },
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
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  button: { paddingVertical: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
