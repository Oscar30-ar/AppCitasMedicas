// components/UserForm.js

import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "./ThemeContext";

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
          { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
        ]}
        placeholder="Correo Electrónico"
        placeholderTextColor={theme.subtitle}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={[styles.inputContainer, { borderColor: theme.border }]}>
        <TextInput
          style={[
            styles.passwordInput,
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
            color={theme.subtitle}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.forgotBtn}
        onPress={() => console.log("Forgot password pressed")}
      >
        <Text style={[styles.forgotText, { color: theme.primary }]}>
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: theme.primary }]}
        onPress={onLogin}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={theme.text} />
        ) : (
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      {userType === "Paciente" && (
        <TouchableOpacity
          style={[styles.registerBtn, { borderColor: theme.primary }]}
          onPress={() => navigation.navigate("Registro", { userType })}
          activeOpacity={0.7}
        >
          <Text style={[styles.registerText, { color: theme.primary }]}>
            Registrarse
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default UserForm;

const styles = StyleSheet.create({
  formContainer: {
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  iconContainer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotBtn: {
    marginBottom: 24,
    alignSelf: "flex-end",
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  loginBtn: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  registerBtn: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
  },
  registerText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});