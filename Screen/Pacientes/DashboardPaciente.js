import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function DashboardScreen({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            {/* Header y Título */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Clínica los Andes</Text>
                    <Text style={styles.subtitle}>Panel del Paciente</Text>
                </View>
                <View style={styles.headerIcons}>
                    <Ionicons name="sunny-outline" size={24} color="#a1a1aa" />
                </View>
            </View>

            {/* Saludo y botón de cita */}
            <View style={styles.welcomeCard}>
                <Text style={styles.welcomeText}>Bienvenido, Juan Pérez</Text>
                <Text style={styles.welcomeSubText}>¿Necesitas programar una nueva cita? Estamos aquí para ayudarte.</Text>
                <TouchableOpacity
                    style={styles.newAppointmentBtn}
                    onPress={() => navigation.navigate("NuevaCita")}
                >
                    <Ionicons name="add-circle-outline" size={22} color="white" />
                    <Text style={styles.newAppointmentText}>Nueva Cita</Text>
                </TouchableOpacity>
            </View>

            {/* Próximas citas */}
            <Text style={styles.sectionTitle}>Próximas Citas</Text>
            <View style={styles.appointmentsContainer}>
                {/* Cita 1 */}
                <View style={styles.appointmentCard}>
                    <View style={styles.appointmentInfo}>
                        <Text style={styles.doctorName}>Dr. Ana García</Text>
                        <Text style={styles.specialty}>Cardiología</Text>
                        <View style={styles.appointmentDetails}>
                            <Ionicons name="calendar-outline" size={16} color="#a1a1aa" />
                            <Text style={styles.infoText}>2024-03-15</Text>
                            <Ionicons name="time-outline" size={16} color="#a1a1aa" style={{ marginLeft: 15 }} />
                            <Text style={styles.infoText}>10:00 AM</Text>
                            <FontAwesome5 name="map-marker-alt" size={16} color="#a1a1aa" style={{ marginLeft: 15 }} />
                            <Text style={styles.infoText}>Consulta 201</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.viewDetailsBtn}>
                        <Text style={styles.viewDetailsText}>Ver Detalles</Text>
                    </TouchableOpacity>
                </View>

                {/* Cita 2 */}
                <View style={styles.appointmentCard}>
                    <View style={styles.appointmentInfo}>
                        <Text style={styles.doctorName}>Dr. Carlos Mendoza</Text>
                        <Text style={styles.specialty}>Medicina General</Text>
                        <View style={styles.appointmentDetails}>
                            <Ionicons name="calendar-outline" size={16} color="#a1a1aa" />
                            <Text style={styles.infoText}>2024-03-20</Text>
                            <Ionicons name="time-outline" size={16} color="#a1a1aa" style={{ marginLeft: 15 }} />
                            <Text style={styles.infoText}>2:30 PM</Text>
                            <FontAwesome5 name="map-marker-alt" size={16} color="#a1a1aa" style={{ marginLeft: 15 }} />
                            <Text style={styles.infoText}>Consulta 105</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.viewDetailsBtn}>
                        <Text style={styles.viewDetailsText}>Ver Detalles</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Acciones rápidas (tarjetas inferiores) */}
            <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("HistorialMedico")}>
                    <FontAwesome5 name="file-medical" size={28} color="#f4f4f5" />
                    <Text style={styles.actionCardTitle}>Historial Médico</Text>
                    <Text style={styles.actionCardSubtitle}>Ver expediente médico</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                    <Ionicons name="call" size={28} color="#f4f4f5" />
                    <Text style={styles.actionCardTitle}>Contacto</Text>
                    <Text style={styles.actionCardSubtitle}>Llamar a la clínica</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                    <Ionicons name="person-circle-outline" size={28} color="#f4f4f5" />
                    <Text style={styles.actionCardTitle}>Mi Perfil</Text>
                    <Text style={styles.actionCardSubtitle}>Actualizar información</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a", // Fondo oscuro
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
        color: "#f4f4f5",
        marginRight: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#a1a1aa",
        fontWeight: "400",
    },
    headerIcons: {
        flexDirection: "row",
    },
    welcomeCard: {
        backgroundColor: "#1e293b", // Tarjeta de bienvenida más oscura
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#f4f4f5",
        marginBottom: 5,
    },
    welcomeSubText: {
        fontSize: 14,
        color: "#a1a1aa",
        marginBottom: 15,
    },
    newAppointmentBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b82f6",
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
        color: "#f4f4f5",
        marginVertical: 15,
    },
    appointmentsContainer: {
        marginBottom: 20,
    },
    appointmentCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1e293b",
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
        color: "#f4f4f5",
    },
    specialty: {
        fontSize: 14,
        color: "#a1a1aa",
        marginBottom: 5,
    },
    appointmentDetails: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoText: {
        color: "#a1a1aa",
        fontSize: 12,
        marginLeft: 5,
    },
    viewDetailsBtn: {
        backgroundColor: "#3b82f6",
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
        backgroundColor: "#1e293b",
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    actionCardTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#f4f4f5",
        marginTop: 5,
    },
    actionCardSubtitle: {
        fontSize: 10,
        color: "#a1a1aa",
        textAlign: "center",
    },
});