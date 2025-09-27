import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TerminosUsoScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <FontAwesome5 name="heartbeat" size={30} color="#3b82f6" />
                </View>
                <Text style={styles.title}>Términos de Uso</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
                <Text style={styles.text}>
                    Al acceder y utilizar la aplicación Clínica los Andes, aceptas cumplir con estos términos de uso.
                    Si no estás de acuerdo, por favor no utilices la aplicación.
                </Text>

                <Text style={styles.sectionTitle}>2. Uso de la Aplicación</Text>
                <Text style={styles.text}>
                    La aplicación está destinada únicamente para pacientes registrados de la Clínica los Andes.
                    Debes proporcionar información veraz y mantenerla actualizada.
                </Text>

                <Text style={styles.sectionTitle}>3. Privacidad y Datos</Text>
                <Text style={styles.text}>
                    Respetamos tu privacidad. Tus datos médicos y personales están protegidos según las leyes aplicables.
                    Consulta nuestra política de privacidad para más detalles.
                </Text>

                <Text style={styles.sectionTitle}>4. Responsabilidades</Text>
                <Text style={styles.text}>
                    La aplicación es una herramienta de apoyo. No reemplaza consultas médicas presenciales.
                    La clínica no se hace responsable por decisiones tomadas basadas únicamente en la información de la app.
                </Text>

                <Text style={styles.sectionTitle}>5. Modificaciones</Text>
                <Text style={styles.text}>
                    Nos reservamos el derecho de modificar estos términos en cualquier momento.
                    Te notificaremos de cambios significativos.
                </Text>

                <Text style={styles.sectionTitle}>6. Contacto</Text>
                <Text style={styles.text}>
                    Para preguntas sobre estos términos, contacta a nuestro equipo de soporte.
                </Text>
            </View>
        </ScrollView>
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#f4f4f5",
        textAlign: "center",
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#3b82f6",
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: "#d1d5db",
        lineHeight: 24,
    },
});