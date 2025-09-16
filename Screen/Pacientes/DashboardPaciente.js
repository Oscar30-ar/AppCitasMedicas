import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";

export default function DashboardScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header y Título */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: theme.text }]}>Clínica los Andes</Text>
                    <Text style={[styles.subtitle, { color: theme.subtitle }]}>Panel del Paciente</Text>
                </View>
              {/* Boton de modo oscuro */}
                <View style={styles.headerIcons}>
                    <ThemeSwitcher /> 
                </View>
            </View>

            {/* Saludo y botón de cita */}
            <View style={[styles.welcomeCard, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.welcomeText, { color: theme.text }]}>Bienvenido, Juan Pérez</Text>
                <Text style={[styles.welcomeSubText, { color: theme.subtitle }]}>¿Necesitas programar una nueva cita? Estamos aquí para ayudarte.</Text>
                <TouchableOpacity
                    style={[styles.newAppointmentBtn, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate("NuevaCita")}
                >
                    <Ionicons name="add-circle-outline" size={22} color="white" />
                    <Text style={styles.newAppointmentText}>Nueva Cita</Text>
                </TouchableOpacity>
            </View>

            {/* Próximas citas */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Próximas Citas</Text>
            <View style={styles.appointmentsContainer}>
                {/* Cita 1 */}
                <View style={[styles.appointmentCard, { backgroundColor: theme.cardBackground }]}>
                    <View style={styles.appointmentInfo}>
                        <Text style={[styles.doctorName, { color: theme.text }]}>Dr. Ana García</Text>
                        <Text style={[styles.specialty, { color: theme.subtitle }]}>Cardiología</Text>
                        <View style={styles.appointmentDetails}>
                            <Ionicons name="calendar-outline" size={16} color={theme.subtitle} />
                            <Text style={[styles.infoText, { color: theme.subtitle }]}>2024-03-15</Text>
                            <Ionicons name="time-outline" size={16} color={theme.subtitle} style={{ marginLeft: 15 }} />
                            <Text style={[styles.infoText, { color: theme.subtitle }]}>10:00 AM</Text>
                            <FontAwesome5 name="map-marker-alt" size={16} color={theme.subtitle} style={{ marginLeft: 15 }} />
                            <Text style={[styles.infoText, { color: theme.subtitle }]}>Consulta 201</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.viewDetailsBtn, { backgroundColor: theme.primary }]}>
                        <Text style={styles.viewDetailsText}>Ver Detalles</Text>
                    </TouchableOpacity>
                </View>

                {/* Cita 2 */}
                <View style={[styles.appointmentCard, { backgroundColor: theme.cardBackground }]}>
                    <View style={styles.appointmentInfo}>
                        <Text style={[styles.doctorName, { color: theme.text }]}>Dr. Carlos Mendoza</Text>
                        <Text style={[styles.specialty, { color: theme.subtitle }]}>Medicina General</Text>
                        <View style={styles.appointmentDetails}>
                            <Ionicons name="calendar-outline" size={16} color={theme.subtitle} />
                            <Text style={[styles.infoText, { color: theme.subtitle }]}>2024-03-20</Text>
                            <Ionicons name="time-outline" size={16} color={theme.subtitle} style={{ marginLeft: 15 }} />
                            <Text style={[styles.infoText, { color: theme.subtitle }]}>2:30 PM</Text>
                            <FontAwesome5 name="map-marker-alt" size={16} color={theme.subtitle} style={{ marginLeft: 15 }} />
                            <Text style={[styles.infoText, { color: theme.subtitle }]}>Consulta 105</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.viewDetailsBtn, { backgroundColor: theme.primary }]}>
                        <Text style={styles.viewDetailsText}>Ver Detalles</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Acciones rápidas (tarjetas inferiores) */}
            <View style={styles.actionsGrid}>
                <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.cardBackground }]} onPress={() => navigation.navigate("HistorialMedico")}>
                    <FontAwesome5 name="file-medical" size={28} color={theme.text} />
                    <Text style={[styles.actionCardTitle, { color: theme.text }]}>Historial Médico</Text>
                    <Text style={[styles.actionCardSubtitle, { color: theme.subtitle }]}>Ver expediente médico</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.cardBackground }]}>
                    <Ionicons name="call" size={28} color={theme.text} />
                    <Text style={[styles.actionCardTitle, { color: theme.text }]}>Contacto</Text>
                    <Text style={[styles.actionCardSubtitle, { color: theme.subtitle }]}>Llamar a la clínica</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.cardBackground }]}>
                    <Ionicons name="person-circle-outline" size={28} color={theme.text} />
                    <Text style={[styles.actionCardTitle, { color: theme.text }]}>Mi Perfil</Text>
                    <Text style={[styles.actionCardSubtitle, { color: theme.subtitle }]}>Actualizar información</Text>
                </TouchableOpacity>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginRight: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "400",
    },
    headerIcons: {
        flexDirection: "row",
    },
    welcomeCard: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    welcomeSubText: {
        fontSize: 14,
        marginBottom: 15,
    },
    newAppointmentBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderRadius: 8,
    },
    newAppointmentText: {
        color: "white",
        fontWeight: "bold",
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 15,
    },
    appointmentsContainer: {
        marginBottom: 20,
    },
    appointmentCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    appointmentInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    specialty: {
        fontSize: 14,
        marginBottom: 5,
    },
    appointmentDetails: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoText: {
        fontSize: 12,
        marginLeft: 5,
    },
    viewDetailsBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    viewDetailsText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    actionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginHorizontal: -5,
        marginTop: 10,
    },
    actionCard: {
        width: "30%",
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    actionCardTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 5,
    },
    actionCardSubtitle: {
        fontSize: 10,
        textAlign: "center",
    },
});