import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, Image, ActivityIndicator, RefreshControl } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../../Src/Service/AuthService";
import apiConexion from "../../Src/Service/Conexion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProximasCitasConfirmadas, ProximasCitasPendientes, cancelarCitaPaciente } from "../../Src/Service/PacienteService";


export default function DashboardScreen({ setUserToken }) {
    console.log("DashboardScreen (Paciente) se está renderizando.");

    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [citasConfirmadas, setCitasConfirmadas] = useState([]);
    const [loadingCitas, setLoadingCitas] = useState(true); // Este loading ahora aplica a ambas listas
    const [citasPendientes, setCitasPendientes] = useState([]); // Cambiado a un array
    const [refreshing, setRefreshing] = useState(false);

    const getStatusColor = (estado) => {
        switch (estado) {
            case "confirmada":
                return "green";
            case "cancelada":
                return "red";
            case "pendiente":
                return "#grey";
            default:
                return theme.primary;
        }
    };

    const CargarPerfil = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const role = await AsyncStorage.getItem("rolUser");

            if (!token || !role) {
                Alert.alert("No se encontró sesión activa, redirigiendo al login");
                await AsyncStorage.multiRemove(["userToken", "rolUser"]);
                setUserToken(null);
                return;
            }

            let url = "";
            if (role === "paciente") url = "/me/paciente";
            if (role === "doctor") url = "/me/doctor";
            if (role === "recepcionista") url = "/me/recepcionista";

            const response = await apiConexion.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Perfil cargado:", response.data);
            setUsuario(response.data);

            await cargarCitas();
        } catch (error) {
            console.error("Error al cargar el perfil:", error);
            Alert.alert("Error", "Ocurrió un error al cargar el perfil.", [{ text: "OK" }]);
        } finally {
            setCargando(false);
            setRefreshing(false);
        }
    };

    const cargarCitas = async () => {
        try {
            setLoadingCitas(true);
            // 💡 CORRECCIÓN: Llamar a ambos servicios en paralelo para obtener citas pendientes y confirmadas.
            const [pendientesResult, confirmadasResult] = await Promise.all([
                ProximasCitasPendientes(),
                ProximasCitasConfirmadas()
            ]);

            // Procesar citas pendientes
            if (pendientesResult.success && Array.isArray(pendientesResult.data)) { // 💡 Ahora guardamos todas las citas pendientes
                setCitasPendientes(pendientesResult.data);
            } else {
                console.warn("No se pudieron cargar las citas pendientes:", pendientesResult.message);
                setCitasPendientes([]);
            }

            // Procesar citas confirmadas
            if (confirmadasResult.success && Array.isArray(confirmadasResult.data)) {
                setCitasConfirmadas(confirmadasResult.data); // Las citas confirmadas se mantienen igual
            } else {
                console.warn("No se pudieron cargar las citas confirmadas:", confirmadasResult.message);
                setCitasConfirmadas([]);
            }
        } catch (error) {
            console.error("Error al cargar las próximas citas:", error);
            Alert.alert("Error", "Ocurrió un error inesperado al cargar las próximas citas.");
        } finally {
            setLoadingCitas(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        CargarPerfil();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        CargarPerfil();
    };

    const handleCancelarCita = (citaId) => {
        Alert.alert(
            "Confirmar Cancelación",
            "¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Sí, Cancelar",
                    style: "destructive",
                    onPress: async () => {
                        const resultado = await cancelarCitaPaciente(citaId);
                        if (resultado.success) {
                            Alert.alert("Éxito", resultado.message);
                            setCitasPendientes(prevCitas => prevCitas.filter(cita => cita.id !== citaId)); // 💡 Filtra la cita cancelada
                        } else {
                            Alert.alert("Error", resultado.message);
                        }
                    },
                },
            ]
        );
    };

    if (cargando) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

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
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
            }
        >

            {/* Header con logo centrado */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
                        <FontAwesome5 name="heartbeat" size={40} color={theme.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>Clínica los Andes</Text>
                    <Text style={[styles.subtitle, { color: theme.subtitle }]}>Panel del Paciente</Text>
                </View>

                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={handleLogoutConfirmation} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bienvenida */}
            <View style={[styles.welcomeCard, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.welcomeText, { color: theme.text }]}>Bienvenid@, {usuario?.nombre} {usuario?.apellido}</Text>
                <Text style={[styles.welcomeSubText, { color: theme.subtitle }]}>
                    Revisa tus próximas citas y gestiona tu historial médico.
                </Text>
                <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate("NuevaCitaPaciente")}
                >
                    <Ionicons name="add-circle" size={18} color="white" />
                    <Text style={styles.quickActionButtonText}>Nueva Cita</Text>
                </TouchableOpacity>
            </View>
            {/*cita agendada */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Cita Agendada</Text>
            {loadingCitas ? (
                <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
            ) : citasPendientes.length > 0 ? ( // 💡 Ahora iteramos sobre el array de citas pendientes
                citasPendientes.map((cita) => (
                    <View key={cita.id} style={[styles.citaPendienteCard, { backgroundColor: theme.cardBackground, borderColor: theme.primary }]}>
                        <View style={styles.appointmentInfo}>
                            <Text style={[styles.doctorName, { color: theme.text }]}>
                                Dr. {cita.doctor?.nombre} {cita.doctor?.apellido}
                            </Text>
                            <Text style={[styles.descripcion, { color: theme.subtitle, marginTop: 4 }]}>
                                {cita.descripcion || "Sin descripción"}
                            </Text>
                            <View style={styles.appointmentDetails}>
                                
                                <Ionicons name="calendar-outline" size={16} color={theme.subtitle} />
                                <Text style={[styles.infoText, { color: theme.subtitle }]}>{cita.fecha}</Text>
                                <Ionicons name="time-outline" size={16} color={theme.subtitle} style={{ marginLeft: 15 }} />
                                <Text style={[styles.infoText, { color: theme.subtitle }]}>{cita.hora}</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.reprogramarButton, { backgroundColor: theme.primary }]}
                                onPress={() => navigation.navigate('ReprogramarCita', { cita: cita })}
                            >
                                <Ionicons name="calendar" size={18} color="#fff" />
                                <Text style={[styles.buttonText,{ color: "#fcfcfcff" , marginLeft:5}]}>Reprogramar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => handleCancelarCita(cita.id)}
                            >
                                <Ionicons name="close-circle" size={18} color="#fff" />
                                <Text style={[styles.buttonText, { color: "#fcfcfcff" , marginLeft:5}]}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
                <View style={[styles.noCitasCard, { backgroundColor: theme.cardBackground }]}>
                    <Text style={{ color: theme.subtitle, textAlign: "center" }}>
                        No tienes ninguna cita pendiente de confirmación.
                    </Text>
                </View>
            )}


            {/* Próximas citas */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Próximas Citas</Text>
            <View style={styles.appointmentsContainer}>
                {loadingCitas ? (
                    <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
                ) : citasConfirmadas.length === 0 ? (
                    <Text style={{ color: theme.subtitle, textAlign: "center", padding: 15, fontStyle: 'italic' }}>
                        No tienes citas confirmadas próximas.
                    </Text>
                ) : (
                    citasConfirmadas.map((cita) => (
                        <View key={cita.id} style={[styles.appointmentCard, { backgroundColor: theme.cardBackground }]}>
                            <View style={styles.appointmentInfo}>
                                <Text style={[styles.doctorName, { color: theme.text }]}>
                                    Dr. {cita.doctor?.nombre} {cita.doctor?.apellido}
                                </Text>
                                <Text style={[styles.descripcion, { color: theme.subtitle }]}>
                                    {cita.descripcion || "Sin descripción"}
                                </Text>
                                <View style={styles.appointmentDetails}>
                                    <Ionicons name="calendar-outline" size={16} color={theme.subtitle} />
                                    <Text style={[styles.infoText, { color: theme.subtitle }]}>{cita.fecha}</Text>
                                    <Ionicons name="time-outline" size={16} color={theme.subtitle} style={{ marginLeft: 15 }} />
                                    <Text style={[styles.infoText, { color: theme.subtitle }]}>{cita.hora}</Text>
                                    <FontAwesome5 name="map-marker-alt" size={16} color={theme.subtitle} style={{ marginLeft: 15 }} />
                                    <Text style={[styles.infoText, { color: theme.subtitle }]}>{cita.consultorio}</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.statusBtn,
                                    { backgroundColor: getStatusColor(cita.estado) }
                                ]}
                            >
                                <Text style={styles.statusText}>
                                    {cita.estado || "Sin Estado"}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    ))
                )}
            </View>


            {/* Acciones rápidas */}
            <View style={styles.actionsGrid}>
                <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.cardBackground }]} onPress={() => navigation.navigate("HistorialMedico")}>
                    <FontAwesome5 name="file-medical" size={28} color={theme.text} />
                    <Text style={[styles.actionCardTitle, { color: theme.text }]}>Historial Médico</Text>
                    <Text style={[styles.actionCardSubtitle, { color: theme.subtitle }]}>Ver expediente médico</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.cardBackground }]} onPress={() => navigation.navigate("Contacto")}>
                    <Ionicons name="call" size={28} color={theme.text} />
                    <Text style={[styles.actionCardTitle, { color: theme.text }]}>Contacto</Text>
                    <Text style={[styles.actionCardSubtitle, { color: theme.subtitle }]}>Información de contacto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.cardBackground }]} onPress={() => navigation.navigate("Mapa")}>
                    <Ionicons name="map-outline" size={28} color={theme.text} />
                    <Text style={[styles.actionCardTitle, { color: theme.text }]}>Mapa</Text>
                    <Text style={[styles.actionCardSubtitle, { color: theme.subtitle }]}>Ver ubicación</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de confirmación de logout */}
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
    quickActionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    quickActionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    quickActionButtonOutline: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
    },
    quickActionButtonText: { color: "white", fontSize: 14, fontWeight: "600", marginLeft: 5 },
    citaPendienteCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    reprogramarButton: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: 5,
    },
    cancelButton: {
        flexDirection: 'row',
        backgroundColor: '#ef4444',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 5,
    },
    noCitasCard: {
        padding: 20,
        borderRadius: 12,
    },

    container: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        width: "100%",
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logoContainer: {
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logo: {
        width: 65,
        height: 65,
        borderRadius: 32,
    },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
    subtitle: { fontSize: 16, fontWeight: "400" },
    headerIcons: { flexDirection: "row", alignItems: "center" },
    logoutBtn: { marginLeft: 15 },
    welcomeCard: { padding: 20, borderRadius: 12, marginBottom: 20 },
    welcomeText: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    welcomeSubText: { fontSize: 14, marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 15 },
    appointmentsContainer: { marginBottom: 20 },
    appointmentCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderRadius: 12, marginBottom: 10 },
    appointmentInfo: { flex: 1 },
    doctorName: { fontSize: 16, fontWeight: "bold" },
    descripcion: { fontSize: 14, marginBottom: 5 },
    appointmentDetails: { flexDirection: "row", alignItems: "center" },
    infoText: { fontSize: 12, marginLeft: 5 },

    statusBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
    },
    statusText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold"
    },

    actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginHorizontal: -5, marginTop: 10 },
    actionCard: { width: "30%", borderRadius: 12, padding: 15, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    actionCardTitle: { fontSize: 12, fontWeight: "bold", marginTop: 5 },
    actionCardSubtitle: { fontSize: 10, textAlign: "center" },

    // Modal cerrar sesión
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