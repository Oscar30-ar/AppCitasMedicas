import React, { useContext, useState } from "react";
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Modal,Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { logout } from "../../Src/Service/AuthService";
import { useNavigation } from "@react-navigation/native";

const settingsOptions = [
  {
    icon: <Ionicons name="document-text-outline" size={26} color="#3b82f6" />,
    title: "Términos de Uso",
    subtitle: "Leer los términos y condiciones",
    action: "terms",
  },
  {
    icon: <Ionicons name="key-outline" size={26} color="#3b82f6" />,
    title: "Cambiar Contraseña",
    subtitle: "Actualizar tu contraseña",
    action: "changePassword",
  },
  {
    icon: <Ionicons name="log-out-outline" size={26} color="#3b82f6" />,
    title: "Cerrar Sesión",
    subtitle: "Salir de tu cuenta",
    action: "logout",
  },
];

export default function ConfiguracionPaciente({ setUserToken }) {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleOptionPress = (action) => {
    if (action === "terms") {
      navigation.navigate("TerminosUso");
    } else if (action === "changePassword") {
      navigation.navigate("CambiarContrasena");
    } else if (action === "logout") {
      setShowLogoutModal(true);
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      Alert.alert(
        "¡Éxito!",
        "Has cerrado sesión correctamente.",
        [{ text: "Aceptar", onPress: () => setUserToken(null) }],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Configuración</Text>
      </View>

      {/* Opciones */}
      <View>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}
            onPress={() => handleOptionPress(option.action)}
          >
            <View style={styles.iconContainer}>{option.icon}</View>
            <View style={styles.textContainer}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{option.title}</Text>
              <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color={theme.subtitle} />
          </TouchableOpacity>
        ))}
      </View>


      <View style={styles.themeSwitcherContainer}>
        <ThemeSwitcher />
      </View>


      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Cerrar Sesión</Text>
            <Text style={[styles.modalMessage, { color: theme.subtitle }]}>
              ¿Estás seguro de que quieres cerrar tu sesión?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelLogout}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmButton, { backgroundColor: theme.primary }]}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.modalConfirmText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 18,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.1)",
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  settingSubtitle: {
    fontSize: 13,
  },
  themeSwitcherContainer: {
    marginTop: 30,
  },

  // Modal estilos (igual al dashboard)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#94a3b8",
  },
  modalCancelText: {
    color: "#94a3b8",
    fontWeight: "bold",
  },
  modalConfirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "white",
    fontWeight: "bold",
  },
});
