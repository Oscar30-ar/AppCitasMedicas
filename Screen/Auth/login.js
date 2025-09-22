import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; 
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { loginUser } from "../../Src/Service/AuthService";
import UserForm from "../../components/UserForm"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation, setUserToken  }) {
  const { theme } = useContext(ThemeContext);
  const [userType, setUserType] = useState("Paciente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Por favor ingresa correo y contraseña.");
    return;
  }

  setLoading(true);
  try {
    const result = await loginUser(email, password, userType);
    console.log("Resultado login:", result);

    if (result.success) {
      await AsyncStorage.setItem("userToken", result.token);
      await AsyncStorage.setItem("userRole", result.role);
      Alert.alert("Éxito", "Inicio de sesión exitoso", [
        {
          text: "Ok",
          onPress: () => {
            setUserToken(result.token);
          },
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
            onPress={() => {
              setUserType("Paciente");
              clearInputs();
            }}
          >
            <FontAwesome5
              name="user-injured"
              size={20}
              color={userType === "Paciente" ? theme.background : theme.text}
            />
            <Text
              style={[
                styles.roleTabText,
                { color: userType === "Paciente" ? theme.background : theme.text },
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
            onPress={() => {
              setUserType("Doctor");
              clearInputs();
            }}
          >
            <FontAwesome5
              name="user-md"
              size={20}
              color={userType === "Doctor" ? theme.background : theme.text}
            />
            <Text
              style={[
                styles.roleTabText,
                { color: userType === "Doctor" ? theme.background : theme.text },
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
            onPress={() => {
              setUserType("Recepcionista");
              clearInputs();
            }}
          >
            <FontAwesome5
              name="user-tie"
              size={20}
              color={userType === "Recepcionista" ? theme.background : theme.text}
            />
            <Text
              style={[
                styles.roleTabText,
                { color: userType === "Recepcionista" ? theme.background : theme.text },
              ]}
            >
              Recep.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Renderizado del único formulario */}
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
});