import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

// ⚠️ Reemplaza esta URL con el enlace real del mapa de tu clínica
const MAPA_URL = "https://maps.app.goo.gl/BuJ9m1VDeXDCE43ZA";

// Función que se encarga de abrir la URL
const handleOpenLink = async (url) => {
    // Verifica si la URL se puede abrir
    const supported = await Linking.canOpenURL(url);

    if (supported) {
        await Linking.openURL(url);
    } else {
        console.error(`No se puede abrir la URL: ${url}`);
        // Opcional: Mostrar un mensaje de error al usuario
        alert(`No se pudo abrir el mapa. URL inválida.`);
    }
};

export default function MapaScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <FontAwesome5 name="heartbeat" size={30} color="#3b82f6" />
            </View>

            <Text style={styles.pageTitle}>Mapa de la Clínica</Text>

            <Text style={styles.placeholderText}>
                Toca el siguiente enlace para ver la ubicación en tu navegador/app de mapas:
            </Text>

            {/* Componente TouchableOpacity para hacer el texto clickeable */}
            <TouchableOpacity
                style={styles.linkContainer}
                onPress={() => handleOpenLink(MAPA_URL)}
            >
                {/* Texto del enlace */}
                <Text style={styles.linkText}>
                    Ver Ubicación 🗺️
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
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
        marginBottom: 20,
        textAlign: "center",
    },
    placeholderText: {
        fontSize: 16,
        color: "#d1d5db",
        textAlign: "center",
        marginBottom: 30, // Espacio antes del enlace
    },
    // Estilos para el contenedor del enlace (opcional, para darle padding)
    linkContainer: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#4f46e5', // Un color vibrante para que parezca botón/enlace
    },
    // Estilos para el texto del enlace
    linkText: {
        fontSize: 18,
        color: "#ffffff", // Color blanco o claro para el texto
        fontWeight: 'bold',
        textDecorationLine: 'underline', // Para que se vea como un enlace web
    },
    coverImage: {
        width: "100%",
        height: 200,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
});