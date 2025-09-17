import React, { useState, useContext } from "react";
import {View,Text,TouchableOpacity,TextInput,StyleSheet,ScrollView,Image,Alert,} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons"; 
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { loginUser } from "../../Src/Service/AuthService";

const UserForm = ({
  userType,
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  loading,
  navigation,
}) => {
  const { theme } = useContext(ThemeContext);
  const [secureText, setSecureText] = useState(true);

  return (
    <View
      style={[styles.formContainer, { backgroundColor: theme.cardBackground }]}
    >
      <Text style={[styles.formTitle, { color: theme.text }]}>
        Acceso para {userType}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.background, color: theme.text },
        ]}
        placeholder="Correo Electrónico"
        placeholderTextColor={theme.subtitle}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text },
          ]}
          placeholder="Contraseña"
          placeholderTextColor={theme.subtitle}
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setSecureText(!secureText)}
        >
          <Ionicons
            name={secureText ? "eye-off" : "eye"}
            size={22}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={[styles.forgotText, { color: theme.primary }]}>
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: theme.primary }]}
        onPress={onLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>

      {userType === "Paciente" && (
        <TouchableOpacity
          style={[styles.registerBtn, { borderColor: theme.primary }]}
          onPress={() => navigation.navigate("Registro", { userType })}
        >
          <Text style={[styles.registerText, { color: theme.primary }]}>
            Registrarse
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// --- PANTALLA PRINCIPAL DE LOGIN ---
export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [userType, setUserType] = useState("Paciente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- FUNCION HANDLELOGIN ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email, password);
      console.log("Resultado login:", result);

      if (result.success) {
        Alert.alert("Éxito", "Inicio de sesión exitoso", [
          {
            text: "Ok",
            onPress: () => navigation.replace("DashboardPaciente"),
          },
        ]);
      } else {
        Alert.alert("Error de login", result.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error inesperado en login", error);
      Alert.alert(
        "Error",
        "Ocurrió un error inesperado al intentar iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        {/* Imagen de portada */}
        <Image
          source={{ uri: "https://example.com/coverImage.png" }}
          style={styles.coverImage}
          resizeMode="cover"
        />

        {/* Header */}
        <View style={styles.header}>
          <View
            style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}
          >
            <FontAwesome5 name="heartbeat" size={40} color={theme.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Clínica los Andes
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.subtitle }]}>
            Inicia sesión en tu cuenta
          </Text>
        </View>

        {/* Selector de roles */}
        <View
          style={[styles.roleSelector, { backgroundColor: theme.cardBackground }]}
        >
          <TouchableOpacity
            style={[
              styles.roleTab,
              userType === "Paciente" && { backgroundColor: theme.primary },
            ]}
            onPress={() => setUserType("Paciente")}
          >
            <FontAwesome5
              name="user-injured"
              size={20}
              color={userType === "Paciente" ? theme.background : theme.text}
            />
            <Text
              style={[
                styles.roleTabText,
                userType === "Paciente" && { color: theme.background },
              ]}
            >
              Paciente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleTab,
              userType === "Doctor" && { backgroundColor: theme.primary },
            ]}
            onPress={() => setUserType("Doctor")}
          >
            <FontAwesome5
              name="user-md"
              size={20}
              color={userType === "Doctor" ? theme.background : theme.text}
            />
            <Text
              style={[
                styles.roleTabText,
                userType === "Doctor" && { color: theme.background },
              ]}
            >
              Doctor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleTab,
              userType === "Recepcionista" && { backgroundColor: theme.primary },
            ]}
            onPress={() => setUserType("Recepcionista")}
          >
            <FontAwesome5
              name="user-tie"
              size={20}
              color={userType === "Recepcionista" ? theme.background : theme.text}
            />
            <Text
              style={[
                styles.roleTabText,
                userType === "Recepcionista" && { color: theme.background },
              ]}
            >
              Recep.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <UserForm
          userType={userType}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
          loading={loading}
          navigation={navigation}
        />
      </ScrollView>

      {/* Botón para cambiar tema */}
      <ThemeSwitcher />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 0,
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 12,
    padding: 6,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  roleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  roleTabText: {
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  formContainer: {
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  iconContainer: {
    padding: 5,
  },
  forgotText: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 24,
  },
  loginBtn: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  registerBtn: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  registerText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
