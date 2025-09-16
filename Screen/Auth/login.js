import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";

const UserForm = ({ userType, password, setPassword, navigation, lic_medica, setLic_medica, email, setEmail, codEmpleado, setCodEmpleado }) => {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    formContainer: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 24,
      marginHorizontal: 20,
    },
    formTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      backgroundColor: theme.background,
      color: theme.text,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 16,
    },
    forgotText: {
      color: theme.primary,
      fontSize: 14,
      textAlign: "right",
      marginBottom: 24,
    },
    loginBtn: {
      backgroundColor: theme.primary,
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
      borderColor: theme.primary,
    },
    registerText: {
      color: theme.primary,
      fontWeight: "bold",
      fontSize: 18,
    },
  });

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Acceso para {userType}</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor={theme.subtitle}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={theme.subtitle}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {userType === "Doctor" && (
        <TextInput
          style={styles.input}
          placeholder="Número de licencia médica"
          placeholderTextColor={theme.subtitle}
          value={lic_medica}
          onChangeText={setLic_medica}
        />
      )}

      {userType === "Recepcionista" && (
        <TextInput
          style={styles.input}
          placeholder="Código de empleado"
          placeholderTextColor={theme.subtitle}
          value={codEmpleado}
          onChangeText={setCodEmpleado}
        />
      )}

      <TouchableOpacity>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("DashboardPacientes")}>
        <Text style={styles.loginText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      {userType === "Paciente" && (
        <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate("Registro", { userType })}>
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function LoginScreen({ navigation }) {
  const [userType, setUserType] = useState("Paciente");
  const [password, setPassword] = useState("");
  const [lic_medica, setLic_medica] = useState("");
  const [email, setEmail] = useState("");
  const [codEmpleado, setCodEmpleado] = useState("");
  const { theme } = useContext(ThemeContext);

  const renderForm = () => {
    switch (userType) {
      case "Paciente":
        return <UserForm userType="Paciente" {...{ email, setEmail, password, setPassword, navigation }} />;
      case "Doctor":
        return <UserForm userType="Doctor" {...{ email, setEmail, password, setPassword, lic_medica, setLic_medica, navigation }} />;
      case "Recepcionista":
        return <UserForm userType="Recepcionista" {...{ email, setEmail, password, setPassword, codEmpleado, setCodEmpleado, navigation }} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles(theme).container]}>
        <Image
          source={{ uri: "https://example.com/coverImage.png" }}
          style={styles(theme).coverImage}
          resizeMode="cover"
        />

        <View style={styles(theme).header}>
          <View style={styles(theme).logoContainer}>
            <FontAwesome5 name="heartbeat" size={40} color={theme.primary} />
          </View>
          <Text style={[styles(theme).headerTitle]}>Clínica los Andes</Text>
          <Text style={[styles(theme).headerSubtitle]}>Inicia sesión en tu cuenta</Text>
        </View>

        <View style={[styles(theme).roleSelector]}>
          {/* Paciente */}
          <TouchableOpacity
            style={[styles(theme).roleTab, userType === "Paciente" && styles(theme).roleTabActive]}
            onPress={() => setUserType("Paciente")}
          >
            <FontAwesome5
              name="user-injured"
              size={20}
              color={userType === "Paciente" ? theme.background : theme.text}
            />
            <Text style={[styles(theme).roleTabText, userType === "Paciente" && styles(theme).roleTabTextActive]}>
              Paciente
            </Text>
          </TouchableOpacity>

          {/* Doctor */}
          <TouchableOpacity
            style={[styles(theme).roleTab, userType === "Doctor" && styles(theme).roleTabActive]}
            onPress={() => setUserType("Doctor")}
          >
            <FontAwesome5
              name="user-md"
              size={20}
              color={userType === "Doctor" ? theme.background : theme.text}
            />
            <Text style={[styles(theme).roleTabText, userType === "Doctor" && styles(theme).roleTabTextActive]}>
              Doctor
            </Text>
          </TouchableOpacity>

          {/* Recepcionista */}
          <TouchableOpacity
            style={[styles(theme).roleTab, userType === "Recepcionista" && styles(theme).roleTabActive]}
            onPress={() => setUserType("Recepcionista")}
          >
            <FontAwesome5
              name="user-tie"
              size={20}
              color={userType === "Recepcionista" ? theme.background : theme.text}
            />
            <Text style={[styles(theme).roleTabText, userType === "Recepcionista" && styles(theme).roleTabTextActive]}>
              Recep.
            </Text>
          </TouchableOpacity>
        </View>

        {renderForm()}
      </ScrollView>

      {/* Botón flotante para cambiar tema */}
      <ThemeSwitcher />
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.background,
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
    backgroundColor: theme.cardBackground,
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
    color: theme.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.subtitle,
    marginTop: 5,
    marginBottom: 20,
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: theme.cardBackground,
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
  roleTabActive: {
    backgroundColor: theme.primary,
  },
  roleTabText: {
    color: theme.subtitle,
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  roleTabTextActive: {
    color: theme.background,
  },
});
