import React, { useContext } from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
// 1. IMPORTAR ThemeContext
import { ThemeContext } from "../../components/ThemeContext";

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
    // 2. USAR ThemeContext
    const { theme } = useContext(ThemeContext);

    return (
        // 3. APLICAR COLORES DEL TEMA
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
                {/* El ícono puede usar theme.primary o theme.text */}
                <FontAwesome5 name="heartbeat" size={30} color={theme.primary} />
            </View>

            <Text style={[styles.pageTitle, { color: theme.text }]}>Mapa de la Clínica</Text>

            <Text style={[styles.placeholderText, { color: theme.subtitle }]}>
                Toca el siguiente enlace para ver la ubicación en tu navegador/app de mapas:
            </Text>

            {/* Componente TouchableOpacity para hacer el texto clickeable */}
            <TouchableOpacity
                style={[styles.linkContainer, { backgroundColor: theme.primary }]} // Usamos primary para el fondo del botón/enlace
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

// ----------------------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Eliminado: backgroundColor fijo
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
        // Eliminado: backgroundColor fijo
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        // Eliminado: color fijo
        marginBottom: 20,
        textAlign: "center",
    },
    placeholderText: {
        fontSize: 16,
        // Eliminado: color fijo
        textAlign: "center",
        marginBottom: 30, // Espacio antes del enlace
    },
    // Estilos para el contenedor del enlace (opcional, para darle padding)
    linkContainer: {
        padding: 12, // Aumentado un poco el padding para mejor tacto
        borderRadius: 8,
        // Eliminado: backgroundColor fijo (se aplica con theme.primary en el componente)
    },
    // Estilos para el texto del enlace
    linkText: {
        fontSize: 18,
        color: "#ffffff", // Dejamos el texto en blanco para que contraste con theme.primary
        fontWeight: 'bold',
        textDecorationLine: 'underline', // Para que se vea como un enlace web
    },
    // No se usa, pero lo mantengo por si acaso, sin colores fijos
    coverImage: {
        width: "100%",
        height: 200,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
});