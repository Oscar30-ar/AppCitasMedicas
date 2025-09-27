import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function ContactoScreen() {
    const handleCall = () => {
        Linking.openURL("tel:+1234567890"); // Reemplaza con el número real
    };

    const handleEmail = () => {
        Linking.openURL("mailto:contacto@clinicaandes.com"); // Reemplaza con el email real
    };

    const handleMap = () => {
        // Navegar al mapa o abrir enlace
        Linking.openURL("https://maps.app.goo.gl/BuJ9m1VDeXDCE43ZA"); // Reemplaza con la URL real
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <FontAwesome5 name="heartbeat" size={30} color="#3b82f6" />
                </View>
                <Text style={styles.pageTitle}>Contacto</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Ponte en contacto con nosotros para cualquier consulta o emergencia.
                </Text>

                <View style={styles.contactItem}>
                    <Ionicons name="call" size={24} color="#3b82f6" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Teléfono</Text>
                        <TouchableOpacity onPress={handleCall}>
                            <Text style={styles.contactValue}>+57 (312) 288-4645</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.contactItem}>
                    <Ionicons name="mail" size={24} color="#3b82f6" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Correo Electrónico</Text>
                        <TouchableOpacity onPress={handleEmail}>
                            <Text style={styles.contactValue}>clinicaLosAndes@gmail.com</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.contactItem}>
                    <Ionicons name="logo-facebook" size={24} color="#3d6cd9ff" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Facebook</Text>
                            <Text style={styles.contactValue}>Clinica Los Andes</Text>
                    </View>
                </View>

                <View style={styles.contactItem}>
                    <Ionicons name="logo-instagram" size={24} color="#3d6cd9ff" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Instagram</Text>
                            <Text style={styles.contactValue}>Clinica Los Andes</Text>
                    </View>
                </View>

                <View style={styles.contactItem}>
                    <Ionicons name="time" size={24} color="#3b82f6" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Horarios</Text>
                        <Text style={styles.contactValue}>Lunes - Viernes: 8:00 AM - 6:00 PM</Text>
                        <Text style={styles.contactValue}>Sábados: 9:00 AM - 2:00 PM</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    logoContainer: {
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: "#1e293b",
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#f4f4f5",
        textAlign: "center",
    },
    content: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        color: "#d1d5db",
        textAlign: "center",
        marginBottom: 30,
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e293b",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    contactInfo: {
        marginLeft: 15,
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        color: "#94a3b8",
        fontWeight: "bold",
    },
    contactValue: {
        fontSize: 16,
        color: "#f4f4f5",
        marginTop: 2,
    },
});