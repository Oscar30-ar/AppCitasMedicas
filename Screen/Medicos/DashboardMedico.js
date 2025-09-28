import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, ActivityIndicator, } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

// Contextos y servicios
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import apiConexion from "../../Src/Service/Conexion";
import { obtenerEstadisticas, obtenerCitasHoy } from "../../Src/Service/MedicoService";
import {logout} from "../../Src/Service/AuthService";
const StatCard = ({ title, value, iconName, iconColor, theme }) => {
    const stylesCard = StyleSheet.create({
        card: {
            width: "32%",
            padding: 15,
            borderRadius: 12,
            backgroundColor: theme.cardBackground,
            alignItems: "flex-start",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
        },
        iconCircle: {
            width: 35,
            height: 35,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
            backgroundColor: iconColor + "10",
        },
        value: {
            fontSize: 22,
            fontWeight: "bold",
            color: theme.text,
        },
        title: {
            fontSize: 12,
            color: theme.subtitle,
            marginTop: 4,
        },
    });

    return (
        <View style={stylesCard.card}>
            <View style={stylesCard.iconCircle}>
                <Ionicons name={iconName} size={18} color={iconColor} />
            </View>
            <Text style={stylesCard.value}>{value}</Text>
            <Text style={stylesCard.title}>{title}</Text>
        </View>
    );
};


function AppointmentItem({ appointment, theme, navigation }) {

    // 🎨 Función que define el color según el estado
    const getStatusStyle = (status) => {
        const lower = status?.toLowerCase?.() || "";
        switch (lower) {
            case "confirmada":
                return { backgroundColor: "#10b981", textColor: "#ffffff" }; // Verde
            case "pendiente":
                return { backgroundColor: "#facc15", textColor: "#000000" }; // Amarillo
            case "cancelada":
                return { backgroundColor: "#ef4444", textColor: "#ffffff" }; // Rojo
            default:
                return { backgroundColor: theme.border, textColor: theme.text };
        }
    };

    const { backgroundColor, textColor } = getStatusStyle(appointment.estado);

    return (
        <View
            style={[
                styles.appointmentCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
        >
            <View style={styles.infoContainer}>
                {/* Nombre del paciente */}
                <Text style={[styles.patientName, { color: theme.text }]}>
                    {appointment.nombrePaciente}
                    <Text style={{ fontWeight: "normal", color: theme.subtitle, fontSize: 14 }}>
                        {" "}
                        ({appointment.tipoConsulta || "Consulta"})
                    </Text>
                </Text>

                {/* Estado */}
                <View style={[styles.statusChip, { backgroundColor }]}>
                    <Text style={[styles.statusText, { color: textColor }]}>
                        {appointment.estado?.toUpperCase()}
                    </Text>
                </View>

                {/* Hora */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                    <Ionicons name="time-outline" size={14} color={theme.subtitle} />
                    <Text style={[styles.timeText, { color: theme.subtitle }]}>
                        {appointment.hora}
                    </Text>
                </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.historyBtn, { backgroundColor: theme.border }]}
                    onPress={() =>
                        Alert.alert("Historial", `Ver historial de ${appointment.nombrePaciente}`)
                    }
                >
                    <Text style={[styles.historyText, { color: theme.text }]}>Ver Historial</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.attendBtn, { backgroundColor: theme.primary }]}
                    onPress={() => Alert.alert("Atender", `Atendiendo a ${appointment.nombrePaciente}`)}
                >
                    <Text style={styles.attendText}>Atender</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


export default function DashboardMedico({ setUserToken }) {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [citasHoy, setCitasHoy] = useState([]);
    const [stats, setStats] = useState({ citasHoy: 0, pacientesTotales: 0, pendientes: 0 });


    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                const role = await AsyncStorage.getItem("rolUser");

                if (!token || !role) {
                    Alert.alert("Sesión no encontrada", "Redirigiendo al login...");
                    await AsyncStorage.multiRemove(["userToken", "rolUser"]);
                    setUserToken(null);
                    return;
                }

                // --- PERFIL ---
                let url = "";
                if (role === "paciente") url = "/me/paciente";
                if (role === "doctor") url = "/me/doctor";
                if (role === "recepcionista") url = "/me/recepcionista";
                const response = await apiConexion.get(url, { headers: { Authorization: `Bearer ${token}` } });
                setUsuario(response.data.user || response.data);

                // --- CITAS HOY ---
                const responseCitas = await obtenerCitasHoy();
                if (responseCitas.success) setCitasHoy(responseCitas.data);

                // --- ESTADÍSTICAS ---
                const stats = await obtenerEstadisticas();
                setStats(stats);
            } catch (error) {
                console.error("Error cargando datos:", error);
                Alert.alert("Error", "No se pudieron cargar los datos. Intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

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


    // 🔸 Navegación rápida (botones principales)

    const navigateToScreen = (screen) => {
        const mensajes = {
            MisPacientes: "Implementar: Ir a Mis Pacientes",
            Reportes: "Implementar: Ir a Reportes Médicos",
            Recetas: "Implementar: Gestión de Recetas",
            Horarios: "Implementar: Gestión de Horarios",
        };

        if (mensajes[screen]) {
            Alert.alert("Navegación", mensajes[screen]);
        } else if (screen === "NuevaCita") {
            navigation.navigate("NuevaCita");
        } else {
            navigation.navigate(screen);
        }
    };

    // 🔸 Pantalla de carga
    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    // 🔸 Render principal
    const today = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={[styles.logo, { backgroundColor: theme.cardBackground }]}>
                        <FontAwesome5 name="heartbeat" size={40} color={theme.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>Clínica los Andes</Text>
                    <Text style={[styles.subtitle, { color: theme.subtitle }]}>Panel del Médico</Text>
                </View>

                <View style={styles.headerIcons}>
                    <ThemeSwitcher />
                    <TouchableOpacity onPress={() => setShowLogoutModal(true)} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bienvenida */}
            <View style={[styles.welcomeCard, { backgroundColor: theme.cardBackground }]}>
                <View style={styles.row}>
                    <FontAwesome5 name="stethoscope" size={20} color={theme.primary} style={{ marginRight: 10 }} />
                    <Text style={[styles.welcomeText, { color: theme.text }]}>
                        Bienvenido, Dr. {usuario?.nombre} {usuario?.apellido}
                    </Text>
                </View>

                <View style={styles.doctorInfo}>
                    <Text style={[styles.doctorDetail, { color: theme.subtitle }]}>
                        <Ionicons name="medical-outline" size={14} color={theme.subtitle} /> Especialidad:{" "}
                        {usuario?.especialidad}
                    </Text>
                </View>
            </View>

            {/* Estadísticas */}
            <View style={styles.statsRow}>
                <StatCard title="Citas Hoy" value={stats.citasHoy} iconName="calendar-outline" iconColor={theme.primary} theme={theme} />
                <StatCard title="Pacientes Totales" value={stats.pacientesTotales} iconName="people-outline" iconColor="#059669" theme={theme} />
                <StatCard title="Pendientes" value={stats.pendientes} iconName="time-outline" iconColor="#f97316" theme={theme} />
            </View>


            {/* Agenda del día */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Agenda de Hoy - {today}</Text>
            <View style={styles.appointmentsContainer}>
                {citasHoy.length > 0 ? (
                    citasHoy.map((cita) => (
                        <AppointmentItem
                            key={cita.id}
                            appointment={{
                                nombrePaciente: `${cita.pacientes?.nombre} ${cita.pacientes?.apellido}`,
                                tipoConsulta: cita.consultorio,
                                hora: cita.hora,
                                estado: cita.estado,
                            }}
                            theme={theme}
                            navigation={navigation}
                        />
                    ))
                ) : (
                    <Text style={{ color: theme.subtitle, textAlign: "center", padding: 15 }}>
                        No tienes citas agendadas para hoy.
                    </Text>
                )}
            </View>


            {/* Herramientas rápidas */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Herramientas Rápidas</Text>
            <View style={styles.actionsGrid}>
                {[
                    { icon: "people-outline", title: "Mis Pacientes", subtitle: "Lista completa", screen: "MisPacientes" },
                    { icon: "bar-chart-outline", title: "Reportes", subtitle: "Estadísticas médicas", screen: "Reportes" },
                    { icon: "document-text-outline", title: "Recetas", subtitle: "Gestionar prescripciones", screen: "Recetas" },
                    { icon: "calendar-outline", title: "Horarios", subtitle: "Gestionar disponibilidad", screen: "Horarios" },
                ].map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.actionCard, { backgroundColor: theme.cardBackground }]}
                        onPress={() => navigateToScreen(item.screen)}
                    >
                        <Ionicons name={item.icon} size={32} color={theme.primary} />
                        <Text style={[styles.actionTitle, { color: theme.text }]}>{item.title}</Text>
                        <Text style={[styles.actionSubtitle, { color: theme.subtitle }]}>{item.subtitle}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Modal de logout */}
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

// 🔹 Estilos globales del Dashboard
const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20 },
    center: { justifyContent: "center", alignItems: "center" },

    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    titleContainer: { flex: 1, alignItems: "center" },
    logo: {
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        elevation: 5,
    },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
    subtitle: { fontSize: 16, fontWeight: "400" },
    headerIcons: { flexDirection: "row", position: "absolute", right: 0, top: 0 },
    logoutBtn: { marginLeft: 15 },

    // Bienvenida
    welcomeCard: { padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
    welcomeText: { fontSize: 20, fontWeight: "bold" },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    doctorInfo: { marginVertical: 10 },
    doctorDetail: { fontSize: 14, fontWeight: "500", marginBottom: 2 },

    actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    primaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    primaryBtnText: { color: "white", fontWeight: "bold", fontSize: 14, marginLeft: 8 },
    outlineBtn: {
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 2,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    outlineText: { fontWeight: "bold", fontSize: 14 },

    // Estadísticas
    statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },

    // Agenda
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
    appointmentsList: { marginBottom: 20 },

    // Herramientas rápidas
    actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 10 },
    actionCard: {
        width: "48%",
        borderRadius: 12,
        padding: 20,
        alignItems: "flex-start",
        justifyContent: "center",
        marginBottom: 15,
        elevation: 3,
    },
    actionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
    actionSubtitle: { fontSize: 12 },
    appointmentCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        borderWidth: 1,
    },
    infoContainer: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    statusChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
        marginTop: 4,
        marginBottom: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "bold",
    },
    timeText: {
        fontSize: 14,
        marginLeft: 5,
    },
    buttonsContainer: {
        flexDirection: "row",
        marginLeft: 10,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    attendBtn: {
        backgroundColor: "#2563eb", // Azul primario
    },
    attendText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },
    historyText: {
        fontWeight: "600",
        fontSize: 12,
    },

});
