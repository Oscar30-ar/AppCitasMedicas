import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";

// Datos de prueba que estaban en el Dashboard
const DUMMY_APPOINTMENTS = [
    { id: 1, patient: "Roberto Díaz", doctor: "Dr. Ana García", time: "11:00 AM", phone: "+1 234 567 8901", status: "En Espera" },
    { id: 2, patient: "Laura Vega", doctor: "Dr. Carlos Mendoza", time: "2:30 PM", phone: "+1 234 567 8902", status: "Confirmada" },
    { id: 3, patient: "Diego Herrera", doctor: "Dra. Sofía Ruiz", time: "4:00 PM", phone: "+1 234 567 8903", status: "Pendiente" },
];

export default function CitasHoyScreen() {
    const { theme } = useContext(ThemeContext);

    // Función para obtener el estilo del tag de estado
    const getStatusStyle = (status) => {
        switch (status) {
            case 'En Espera':
                return { backgroundColor: '#FBBF24' }; // Amarillo
            case 'Confirmada':
                return { backgroundColor: '#10B981' }; // Verde
            case 'Pendiente':
                return { backgroundColor: '#F87171' }; // Rojo claro
            default:
                return { backgroundColor: theme.subtitle };
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                <Ionicons name="notifications" size={16} color={theme.text} /> Gestión de Citas - 28 de septiembre de 2025
            </Text>
            <View style={styles.appointmentsListContainer}>
                {DUMMY_APPOINTMENTS.map((appointment) => (
                    <View key={appointment.id} style={[styles.patientAppointmentCard, { backgroundColor: theme.cardBackground }]}>
                        <View style={styles.patientInfo}>
                            <View style={styles.patientNameRow}>
                                <Text style={[styles.patientName, { color: theme.text }]}>{appointment.patient}</Text>
                                <View style={[styles.statusTag, getStatusStyle(appointment.status)]}>
                                    <Text style={styles.statusText}>{appointment.status}</Text>
                                </View>
                            </View>
                            <Text style={[styles.doctorInfo, { color: theme.subtitle }]}>
                                Médico: {appointment.doctor}
                            </Text>
                            <View style={styles.appointmentDetails}>
                                <Ionicons name="time-outline" size={16} color={theme.subtitle} />
                                <Text style={[styles.infoText, { color: theme.subtitle, marginRight: 15 }]}> {appointment.time}</Text>
                                <Ionicons name="call-outline" size={16} color={theme.subtitle} />
                                <Text style={[styles.infoText, { color: theme.subtitle }]}> {appointment.phone}</Text>
                            </View>
                        </View>
                        <View style={styles.appointmentActions}>
                            <TouchableOpacity style={[styles.actionButtonOutline, {borderColor: theme.primary}]} onPress={() => Alert.alert("Llamar", `Llamando a ${appointment.patient}`)}>
                                <Text style={[styles.actionButtonTextOutline, { color: theme.primary }]}>Llamar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]} onPress={() => Alert.alert("Confirmar", `Confirmando cita de ${appointment.patient}`)}>
                                <Text style={styles.actionButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        marginVertical: 15,
        paddingHorizontal: 5,
    },
    appointmentsListContainer: { 
        marginBottom: 10 
    },
    patientAppointmentCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    patientInfo: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 10,
        marginBottom: 10,
    },
    patientNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    patientName: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 15,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    doctorInfo: {
        fontSize: 14,
        marginBottom: 5,
    },
    appointmentDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    infoText: { 
        fontSize: 13, 
        marginLeft: 5 
    },
    appointmentActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    actionButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    actionButtonOutline: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    actionButtonTextOutline: {
        fontSize: 14,
        fontWeight: "bold",
    },
});