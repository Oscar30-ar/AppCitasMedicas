import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";

const settingsOptions = [
  {
    icon: <Feather name="shield" size={26} color="#3b82f6" />,
    title: "Privacidad y Seguridad",
    subtitle: "Gestionar tus datos y permisos",
  },
  {
    icon: <Ionicons name="help-circle-outline" size={26} color="#3b82f6" />,
    title: "Centro de Ayuda",
    subtitle: "Preguntas frecuentes y soporte",
  },
  {
    icon: <Ionicons name="information-circle-outline" size={26} color="#3b82f6" />,
    title: "Acerca de",
    subtitle: "Información de la aplicación y versión",
  },
];

export default function ConfiguracionRecepcionista() {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 30,
    },
    header: {
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
    },
    settingCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
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
      backgroundColor: theme.background,
      padding: 10,
      borderRadius: 12,
    },
    textContainer: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 17,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 13,
      color: theme.subtitle,
    },
        themeSwitcherContainer: {
        top:-247,
        
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración</Text>
      </View>

      <View>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.settingCard}>
            <View style={styles.iconContainer}>{option.icon}</View>
            <View style={styles.textContainer}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color={theme.subtitle} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.themeSwitcherContainer}>
        <ThemeSwitcher />
      </View>
    </ScrollView>
  );
}
