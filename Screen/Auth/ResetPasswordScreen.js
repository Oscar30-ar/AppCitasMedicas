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
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { resetPassword } from "../../Src/Service/AuthService";

export default function ResetPasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const [correo, setCorreo] = useState("");
  const [token, setToken] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleResetPassword = async () => {
    if (!correo || !token || !clave || !confirmarClave) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (clave !== confirmarClave) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(correo, token, clave);
      if (response.success) {
        Alert.alert("Éxito", response.message, [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", response.message || "Token inválido o expirado.");
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      Alert.alert("Error", "Ocurrió un problema. Inténtalo nuevamente.");
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
        <Text style={[styles.title, { color: theme.text }]}>Restablecer Contraseña</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Ingresa tu correo, el token que recibiste y tu nueva contraseña.
        </Text>
      </View>

      <View style={styles.form}>
        {/* Correo */}
        <View style={[styles.inputContainer, { borderColor: theme.border }]}>
          <Ionicons name="mail-outline" size={20} color={theme.subtitle} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Correo electrónico"
            placeholderTextColor={theme.subtitle}
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
          />
        </View>

        {/* Token */}
        <View style={[styles.inputContainer, { borderColor: theme.border }]}>
          <Ionicons name="key-outline" size={20} color={theme.subtitle} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Token recibido en el correo"
            placeholderTextColor={theme.subtitle}
            autoCapitalize="none"
            value={token}
            onChangeText={setToken}
          />
        </View>

        {/* Contraseña */}
        <View style={[styles.inputContainer, { borderColor: theme.border }]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.subtitle} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Nueva contraseña"
            placeholderTextColor={theme.subtitle}
            secureTextEntry={secureText}
            value={clave}
            onChangeText={setClave}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Ionicons name={secureText ? "eye-off" : "eye"} size={22} color={theme.subtitle} />
          </TouchableOpacity>
        </View>

        {/* Confirmar Contraseña */}
        <View style={[styles.inputContainer, { borderColor: theme.border }]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.subtitle} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Confirmar contraseña"
            placeholderTextColor={theme.subtitle}
            secureTextEntry={secureText}
            value={confirmarClave}
            onChangeText={setConfirmarClave}
          />
        </View>

        {/* Botón */}
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
  container: { flex: 1, padding: 20 },
  header: { alignItems: "center", marginBottom: 30, marginTop: 50 },
  logoContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
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
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
