import React, { useContext } from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";

const MAPA_URL = "https://maps.app.goo.gl/BuJ9m1VDeXDCE43ZA";

// Función que se encarga de abrir la URL
const handleOpenLink = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
        await Linking.openURL(url);
    } else {
        console.error(`No se puede abrir la URL: ${url}`);
        alert(`No se pudo abrir el mapa. URL inválida.`);
    }
};

export default function MapaScreen() {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
                <FontAwesome5 name="heartbeat" size={30} color={theme.primary} />
            </View>

            <Text style={[styles.pageTitle, { color: theme.text }]}>Mapa de la Clínica</Text>

            <Text style={[styles.placeholderText, { color: theme.subtitle }]}>
                Toca el siguiente enlace para ver la ubicación en tu navegador/app de mapas:
            </Text>

            <TouchableOpacity
                style={[styles.linkContainer, { backgroundColor: theme.primary }]} 
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
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    placeholderText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
    },
    linkContainer: {
        padding: 12, 
        borderRadius: 8,
    },
    linkText: {
        fontSize: 18,
        color: "#ffffff", 
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    coverImage: {
        width: "100%",
        height: 200,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
});