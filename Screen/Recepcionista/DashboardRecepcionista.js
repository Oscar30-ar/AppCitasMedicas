import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../../Src/Service/AuthService";

export default function DashboardRecepcionista({ setUserToken }) {
    console.log("DashboardScreen (Medico) se está renderizando."); 

    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutConfirmation = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = async () => {
        setShowLogoutModal(false);
        try {
            await logout();
            Alert.alert(
                "¡Éxito!",
                "Has cerrado sesión correctamente.",
                [
                    {
                        text: "Aceptar",
                        onPress: () => {
                            setUserToken(null);
                        }
                    }
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: theme.text }]}>Clínica los Andes</Text>
                    <Text style={[styles.subtitle, { color: theme.subtitle }]}>Panel del Recepcionista</Text>
                </View>
                <View style={styles.headerIcons}>
                    <ThemeSwitcher />
                    {/* Botón de logout */}
                    <TouchableOpacity onPress={handleLogoutConfirmation} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bienvenida */}
            <View style={[styles.welcomeCard, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.welcomeText, { color: theme.text }]}>Bienvenido, Recepcionista</Text>
                <Text style={[styles.welcomeSubText, { color: theme.subtitle }]}>
                    ¿Necesitas programar una nueva cita? Estamos aquí para ayudarte.
                </Text>
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

            {/* Acciones rápidas */}
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

            {/* Modal de confirmación personalizado */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLogoutModal}
                onRequestClose={handleCancelLogout}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Cerrar Sesión</Text>
                        <Text style={[styles.modalMessage, { color: theme.subtitle }]}>
                            ¿Estás seguro de que quieres cerrar tu sesión?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancelLogout}>
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalConfirmButton, { backgroundColor: theme.primary }]}
                                onPress={handleConfirmLogout}
                            >
                                <Text style={styles.modalConfirmText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 15
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    titleContainer: { flexDirection: "row", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginRight: 10 },
    subtitle: { fontSize: 16, fontWeight: "400" },
    headerIcons: { flexDirection: "row", alignItems: "center" },
    logoutBtn: { marginLeft: 15 },
    welcomeCard: { padding: 20, borderRadius: 12, marginBottom: 20 },
    welcomeText: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    welcomeSubText: { fontSize: 14, marginBottom: 15 },
    newAppointmentBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 8 },
    newAppointmentText: { color: "white", fontWeight: "bold", marginLeft: 8 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 15 },
    appointmentsContainer: { marginBottom: 20 },
    appointmentCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderRadius: 12, marginBottom: 10 },
    appointmentInfo: { flex: 1 },
    doctorName: { fontSize: 16, fontWeight: "bold" },
    specialty: { fontSize: 14, marginBottom: 5 },
    appointmentDetails: { flexDirection: "row", alignItems: "center" },
    infoText: { fontSize: 12, marginLeft: 5 },
    viewDetailsBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
    viewDetailsText: { color: "white", fontSize: 12, fontWeight: "bold" },
    actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginHorizontal: -5, marginTop: 10 },
    actionCard: { width: "30%", borderRadius: 12, padding: 15, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    actionCardTitle: { fontSize: 12, fontWeight: "bold", marginTop: 5 },
    actionCardSubtitle: { fontSize: 10, textAlign: "center" },

    // Estilos para el modal de cerrar sesion
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalCancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#94a3b8',
    },
    modalCancelText: {
        color: '#94a3b8',
        fontWeight: 'bold',
    },
    modalConfirmButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: 'white',
        fontWeight: 'bold',
    },
});