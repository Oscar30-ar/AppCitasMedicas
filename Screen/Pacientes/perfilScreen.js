import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottonComponent from "../../components/BottonComponent";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";

export default function perfilScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);

    const userData = {
        nombre: "Juan",
        apellido: "Pérez",
        documento: "123456789",
        email: "juan.perez@example.com",
        telefono: "+57 300 123 4567",
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header de la pantalla */}
            <View style={styles.header}>
                <Ionicons name="person-circle-outline" size={80} color={theme.text} />
                <Text style={[styles.profileName, { color: theme.text }]}>
                    {userData.nombre} {userData.apellido}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.subtitle }]}>
                    {userData.email}
                </Text>
            </View>

            {/* Sección de Datos Personales */}
            <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: theme.text, borderBottomColor: theme.border },
                    ]}
                >
                    Datos Personales
                </Text>

                <View style={styles.infoRow}>
                    <Ionicons name="document-text-outline" size={20} color={theme.subtitle} />
                    <Text style={[styles.infoLabel, { color: theme.subtitle }]}>Documento:</Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                        {userData.documento}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color={theme.subtitle} />
                    <Text style={[styles.infoLabel, { color: theme.subtitle }]}>
                        Correo Electrónico:
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                        {userData.email}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color={theme.subtitle} />
                    <Text style={[styles.infoLabel, { color: theme.subtitle }]}>Teléfono:</Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                        {userData.telefono}
                    </Text>
                </View>
            </View>

            {/* Botón para editar perfil */}
            <BottonComponent
                title="Editar Perfil"
                onPress={() => navigation.navigate("EditarPaciente")}
                style={[styles.editButton, { backgroundColor: theme.primary }]}
            />

            {/* Botón de cambiar tema más abajo */}
            <View style={styles.themeSwitcherContainer}>
                <ThemeSwitcher />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
        marginTop: 60,
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    profileEmail: {
        fontSize: 14,
    },
    infoCard: {
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    infoLabel: {
        fontWeight: "bold",
        marginLeft: 10,
        width: 160,
    },
    infoValue: {
        flex: 1,
    },
    editButton: {
        marginBottom: 40, // separa el botón de "Editar perfil" del switcher
    },
    themeSwitcherContainer: {
        top:-410,// baja bastante el switcher
        alignItems: "center", // opcional, para centrarlo
    },
});
