import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const UserForm = ({ userType, documento, setDocumento, password, setPassword, navigation }) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Acceso para {userType}</Text>
      <TextInput
        style={styles.input}
        placeholder="Documento de identidad"
        placeholderTextColor="#a1a1aa"
        value={documento}
        onChangeText={setDocumento}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#a1a1aa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>Ingresar</Text>
      </TouchableOpacity>
      {}
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
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");

  const renderForm = () => {
    switch (userType) {
      case "Paciente":
        return <UserForm userType="Paciente" {...{ documento, setDocumento, password, setPassword, navigation }} />;
      case "Doctor":
        return <UserForm userType="Doctor" {...{ documento, setDocumento, password, setPassword, navigation }} />;
      case "Recepcionista":
        return <UserForm userType="Recepcionista" {...{ documento, setDocumento, password, setPassword, navigation }} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bienvenido A Clinica Los Andes</Text>
        <Text style={styles.headerSubtitle}>Selecciona tu tipo de usuario para continuar.</Text>
      </View>

      {}
      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleTab, userType === "Paciente" && styles.roleTabActive]}
          onPress={() => setUserType("Paciente")}
        >
          <FontAwesome5 name="user-injured" size={20} color={userType === "Paciente" ? "#0f172a" : "#fff"} />
          <Text style={[styles.roleTabText, userType === "Paciente" && styles.roleTabTextActive]}>Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleTab, userType === "Doctor" && styles.roleTabActive]}
          onPress={() => setUserType("Doctor")}
        >
          <FontAwesome5 name="user-md" size={20} color={userType === "Doctor" ? "#0f172a" : "#fff"} />
          <Text style={[styles.roleTabText, userType === "Doctor" && styles.roleTabTextActive]}>Doctor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleTab, userType === "Recepcionista" && styles.roleTabActive]}
          onPress={() => setUserType("Recepcionista")}
        >
          <FontAwesome5 name="user-tie" size={20} color={userType === "Recepcionista" ? "#0f172a" : "#fff"} />
          <Text style={[styles.roleTabText, userType === "Recepcionista" && styles.roleTabTextActive]}>Recep.</Text>
        </TouchableOpacity>
      </View>

      {}
      {renderForm()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e4e4e7",
    marginTop: 5,
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 6,
    marginBottom: 30,
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
    backgroundColor: "#38bdf8",
  },
  roleTabText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  roleTabTextActive: {
    color: "#0f172a",
  },
  formContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 24,
  },
  formTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#334155",
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  forgotText: {
    color: "#3b82f6",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 24,
  },
  loginBtn: {
    backgroundColor: "#3b82f6",
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
    borderColor: "#3b82f6",
  },
  registerText: {
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: 18,
  },
});
