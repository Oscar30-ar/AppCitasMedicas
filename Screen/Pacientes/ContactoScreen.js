import React, { useContext } from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext"; 

export default function ContactoScreen() {
    const { theme } = useContext(ThemeContext);

    const handleCall = () => {
        Linking.openURL("tel:+573122884645");
    };

    const handleEmail = () => {
        Linking.openURL("mailto:clinicaLosAndes@gmail.com"); 
    };

    const handleMap = () => {
        Linking.openURL("https://maps.app.goo.gl/BuJ9m1VDeXDCE43ZA"); 
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
                    <FontAwesome5 name="heartbeat" size={30} color={theme.primary} />
                </View>
                <Text style={[styles.pageTitle, { color: theme.text }]}>Contacto</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.description, { color: theme.subtitle }]}>
                    Ponte en contacto con nosotros para cualquier consulta o emergencia.
                </Text>

                {/* --- ITEM: TELÉFONO --- */}
                <View style={[styles.contactItem, { backgroundColor: theme.cardBackground }]}>
                    {/* Icono con theme.primary */}
                    <Ionicons name="call" size={24} color={theme.primary} />
                    <View style={styles.contactInfo}>
                        {/* Label con theme.subtitle */}
                        <Text style={[styles.contactLabel, { color: theme.subtitle }]}>Teléfono</Text>
                        <TouchableOpacity onPress={handleCall}>
                            {/* Valor con theme.primary para que se destaque como clickeable */}
                            <Text style={[styles.contactValue, { color: theme.primary }]}>+57 (312) 288-4645</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- ITEM: CORREO ELECTRÓNICO --- */}
                <View style={[styles.contactItem, { backgroundColor: theme.cardBackground }]}>
                    {/* Icono con theme.primary */}
                    <Ionicons name="mail" size={24} color={theme.primary} />
                    <View style={styles.contactInfo}>
                        {/* Label con theme.subtitle */}
                        <Text style={[styles.contactLabel, { color: theme.subtitle }]}>Correo Electrónico</Text>
                        <TouchableOpacity onPress={handleEmail}>
                            {/* Valor con theme.primary para que se destaque como clickeable */}
                            <Text style={[styles.contactValue, { color: theme.primary }]}>clinicaLosAndes@gmail.com</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- ITEM: FACEBOOK (Se usa un color fijo para las marcas sociales) --- */}
                <View style={[styles.contactItem, { backgroundColor: theme.cardBackground }]}>
                    {/* Icono con color fijo de Facebook */}
                    <Ionicons name="logo-facebook" size={24} color="#3d6cd9" />
                    <View style={styles.contactInfo}>
                        {/* Label con theme.subtitle */}
                        <Text style={[styles.contactLabel, { color: theme.subtitle }]}>Facebook</Text>
                        {/* Valor con theme.text */}
                        <Text style={[styles.contactValue, { color: theme.text }]}>Clinica Los Andes</Text>
                    </View>
                </View>

                {/* --- ITEM: INSTAGRAM (Se usa un color fijo para las marcas sociales) --- */}
                <View style={[styles.contactItem, { backgroundColor: theme.cardBackground }]}>
                    {/* Icono con color fijo de Instagram */}
                    <Ionicons name="logo-instagram" size={24} color="#3d6cd9" />
                    <View style={styles.contactInfo}>
                        {/* Label con theme.subtitle */}
                        <Text style={[styles.contactLabel, { color: theme.subtitle }]}>Instagram</Text>
                        {/* Valor con theme.text */}
                        <Text style={[styles.contactValue, { color: theme.text }]}>Clinica Los Andes</Text>
                    </View>
                </View>

                {/* --- ITEM: HORARIOS --- */}
                <View style={[styles.contactItem, { backgroundColor: theme.cardBackground }]}>
                    {/* Icono con theme.primary */}
                    <Ionicons name="time" size={24} color={theme.primary} />
                    <View style={styles.contactInfo}>
                        {/* Label con theme.subtitle */}
                        <Text style={[styles.contactLabel, { color: theme.subtitle }]}>Horarios</Text>
                        {/* Valores con theme.text */}
                        <Text style={[styles.contactValue, { color: theme.text }]}>Lunes - Viernes: 8:00 AM - 6:00 PM</Text>
                        <Text style={[styles.contactValue, { color: theme.text }]}>Sábados: 9:00 AM - 2:00 PM</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    content: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
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
        fontWeight: "bold",
    },
    contactValue: {
        fontSize: 16,
        marginTop: 2,
    },
});