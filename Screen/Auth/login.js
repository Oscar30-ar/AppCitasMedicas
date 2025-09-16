import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Image } from "react-native"; // Importa Image
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";

// (Tu componente UserForm no necesita cambios para esto)
const UserForm = ({ userType, password, setPassword, navigation, lic_medica, setLic_medica, email, setEmail, codEmpleado, setCodEmpleado }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.formContainer}>

      <Text style={styles.formTitle}>Acceso para {userType}</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#a1a1aa"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#a1a1aa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {userType === "Doctor" && (
        <TextInput
          style={styles.input}
          placeholder="Número de licencia médica"
          placeholderTextColor="#a1a1aa"
          value={lic_medica}
          onChangeText={setLic_medica}
        />
      )}

      {userType === "Recepcionista" && (
        <TextInput
          style={styles.input}
          placeholder="Código de empleado"
          placeholderTextColor="#a1a1aa"
          value={codEmpleado}
          onChangeText={setCodEmpleado}
        />
      )}

      <TouchableOpacity>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("DashboardPaciente")}>
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* NUEVA IMAGEN DE PORTADA */}
      <Image
        source={{ uri: "https://example.com/coverImage.png" }}
        // Asegúrate de que esta ruta sea correcta o usa una URL: { uri: 'https://example.com/your-image.jpg' }
        style={styles.coverImage}
        resizeMode="cover" // Ajusta la imagen para cubrir el área sin distorsionar
      />

      <View style={styles.header}>
        {/* Aquí podrías colocar tu icono del corazón si quieres que esté más arriba */}
        <View style={styles.logoContainer}>
          <FontAwesome5 name="heartbeat" size={40} color="#38bdf8" />
        </View>
        <Text style={styles.headerTitle}>Clínica los Andes</Text>
        <Text style={styles.headerSubtitle}>Inicia sesión en tu cuenta</Text>
      </View>

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

      

      {renderForm()}

      {/* Boton de modo oscuro */}
      
        <ThemeSwitcher/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    // paddingHorizontal: 20, // Quitado para que la imagen ocupe todo el ancho
    paddingVertical: 0, // Quitado para que la imagen ocupe todo el alto al inicio
  },
  // NUEVO ESTILO PARA LA IMAGEN DE PORTADA
  coverImage: {
    width: '100%',   // Ocupa todo el ancho
    height: 200,     // Altura fija, ajusta según necesites
    borderBottomLeftRadius: 30, // Bordes redondeados inferiores
    borderBottomRightRadius: 30,
    marginBottom: 20, // Espacio entre la imagen y el encabezado
  },
  header: {
    alignItems: "center",
    marginBottom: 20, // Ajustado para dar más espacio si la imagen tiene marginBottom
    paddingHorizontal: 20, // Agregado para restaurar el padding horizontal al contenido
  },
  logoContainer: { // Para el icono del corazón
    backgroundColor: '#fff', // Fondo blanco como en la imagen de referencia
    borderRadius: 35, // Para que sea circular
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    // Sombra sutil para darle profundidad
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e4e4e7",
    marginTop: 5,
    marginBottom: 20, // Ajustado para dar espacio al selector de rol
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 6,
    marginBottom: 30,
    marginHorizontal: 20, // Agregado para que el selector de rol no ocupe todo el ancho
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
    marginHorizontal: 20, // Agregado para que el formulario no ocupe todo el ancho
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
  themeSwitcherContainer: {
    marginTop: 40, // espacio desde el form hacia abajo
    marginBottom: 20, // margen inferior
    alignItems: "center", // centrado
  },

});