import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import BottonComponent from "../../components/BottonComponent";

export default function perfilScreen({ navigation }) {
    // Aquí podrías obtener los datos del usuario de un estado o una API
    const userData = {
        nombre: "Juan",
        apellido: "Pérez",
        documento: "123456789",
        email: "juan.perez@example.com",
        telefono: "+57 300 123 4567"
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header de la pantalla */}
            <View style={styles.header}>
                <Ionicons name="person-circle-outline" size={80} color="#f4f4f5" />
                <Text style={styles.profileName}>{userData.nombre} {userData.apellido}</Text>
                <Text style={styles.profileEmail}>{userData.email}</Text>
            </View>

            {/* Sección de Datos Personales */}
            <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>Datos Personales</Text>
                
                <View style={styles.infoRow}>
                    <Ionicons name="document-text-outline" size={20} color="#a1a1aa" />
                    <Text style={styles.infoLabel}>Documento:</Text>
                    <Text style={styles.infoValue}>{userData.documento}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#a1a1aa" />
                    <Text style={styles.infoLabel}>Correo Electrónico:</Text>
                    <Text style={styles.infoValue}>{userData.email}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color="#a1a1aa" />
                    <Text style={styles.infoLabel}>Teléfono:</Text>
                    <Text style={styles.infoValue}>{userData.telefono}</Text>
                </View>
            </View>

            {/* Botón para editar perfil */}
            <BottonComponent 
                title="Editar Perfil" 
                onPress={() => navigation.navigate("EditarPaciente")} 
                style={styles.editButton}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a", // Fondo oscuro
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
        marginTop: 20,
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#f4f4f5",
        marginTop: 10,
    },
    profileEmail: {
        fontSize: 14,
        color: "#a1a1aa",
    },
    infoCard: {
        backgroundColor: "#1e293b",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#f4f4f5",
        marginBottom: 15,
        borderBottomColor: "#334155",
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    infoLabel: {
        color: "#94a3b8",
        fontWeight: "bold",
        marginLeft: 10,
        width: 120, // Ancho fijo para alinear
    },
    infoValue: {
        color: "#f4f4f5",
        flex: 1,
    },
    editButton: {
        backgroundColor: "#3b82f6", // Botón azul
    },
});