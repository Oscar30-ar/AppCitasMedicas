import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../../Src/Service/AuthService";
import apiConexion from "../../Src/Service/Conexion";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Datos dummy para simular KPIs y citas, ya que el componente original los tenía estáticos
const DUMMY_KPI_DATA = [
    { title: "Citas Hoy", value: 24, icon: "calendar-check", color: "#6D28D9" }, // Morado
    { title: "En Espera", value: 5, icon: "clock", color: "#FBBF24" }, // Amarillo
    { title: "Confirmadas", value: 19, icon: "check-circle", color: "#10B981" }, // Verde
    { title: "Canceladas", value: 3, icon: "times-circle", color: "#EF4444" }, // Rojo
];

export default function DashboardRecepcionista({ setUserToken }) {
    console.log("DashboardScreen (Recepcionista) se está renderizando.");

    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Lógica existente para cargar el perfil del usuario (NO SE MODIFICÓ)
    useEffect(() => {
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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Perfil cargado:", response.data);
                setUsuario(response.data.user || response.data);
            } catch (error) {
                console.error("Error al cargar el perfil:", error);

                Alert.alert(
                    "Error",
                    "Ocurrió un error al cargar el perfil. Redirigiendo al login.",
                    [
                        {
                            text: "OK",
                            onPress: async () => {
                                await AsyncStorage.multiRemove(["userToken", "rolUser"]);
                                setUserToken(null);
                            },
                        },
                    ]
                );
            } finally {
                setCargando(false);
            }
        };

        CargarPerfil();
    }, []);

    if (cargando) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    // Lógica existente para el cierre de sesión (NO SE MODIFICÓ)
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

    // Componente auxiliar para las tarjetas de KPIs
    const KPICard = ({ title, value, icon, color }) => (
        <View style={[styles.kpiCard, { backgroundColor: theme.cardBackground, borderColor: color, borderBottomWidth: 4 }]}>
            <View style={styles.kpiHeader}>
                <Text style={[styles.kpiValue, { color: theme.text }]}>{value}</Text>
                <FontAwesome5 name={icon} size={22} color={color} />
            </View>
            <Text style={[styles.kpiTitle, { color: theme.subtitle }]}>{title}</Text>
        </View>
    );

    // Componente auxiliar para las tarjetas de Módulos Principales
    const ModuleCard = ({ title, subtitle, icon, onPress }) => (
        <TouchableOpacity style={[styles.moduleCard, { backgroundColor: theme.cardBackground }]} onPress={onPress}>
            <Ionicons name={icon} size={30} color={theme.primary} />
            <Text style={[styles.moduleTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.moduleSubtitle, { color: theme.subtitle }]}>{subtitle}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>

            {/* Header con logo, título y botones de acción superior */}
           <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
                        <FontAwesome5 name="heartbeat" size={40} color={theme.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>Clínica los Andes</Text>
                    <Text style={[styles.subtitle, { color: theme.subtitle }]}>Panel de Recepción</Text>
                </View>
                
                <View style={styles.headerIcons}>
                    <ThemeSwitcher />
                    <TouchableOpacity onPress={handleLogoutConfirmation} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bienvenida y Acciones Rápidas (Fila de botones principales) */}
            <View style={[styles.welcomeCard, { backgroundColor: theme.cardBackground }]}>
                <View style={styles.welcomeRow}>
                    <Ionicons name="person" size={24} color={theme.primary} />
                    <Text style={[styles.welcomeText, { color: theme.text, marginLeft: 10 }]}>
                        Bienvenid@, {usuario?.nombre} {usuario?.apellido}
                    </Text>
                </View>
                <Text style={[styles.welcomeSubText, { color: theme.subtitle }]}>
                    Código de Empleado: EMP001 | Turno: Mañana
                </Text>

                {/* Acciones Rápidas (Nueva Cita, Buscar Paciente, Llamadas) */}
                <View style={styles.quickActionRow}>
                    <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: theme.primary }]}
                        onPress={() => navigation.navigate("GestionCitas")}
                    >
                        <Ionicons name="add-circle" size={18} color="white" />
                        <Text style={styles.quickActionButtonText}>Nueva Cita</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.quickActionButtonOutline, { borderColor: theme.primary }]}
                        onPress={() => navigation.navigate("BuscarPaciente")} // Asume la ruta de búsqueda
                    >
                        <Ionicons name="search" size={18} color={theme.primary} />
                        <Text style={[styles.quickActionButtonText, { color: theme.primary }]}>Buscar Paciente</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.quickActionButtonOutline, { borderColor: theme.primary }]}
                        onPress={() => Alert.alert("Llamadas", "Función de centro de llamadas iniciada.")} // Simulación de llamada
                    >
                        <Ionicons name="call" size={18} color={theme.primary} />
                        <Text style={[styles.quickActionButtonText, { color: theme.primary }]}>Llamadas</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Indicadores Clave (KPIs) */}
            <View style={styles.kpiGrid}>
                {DUMMY_KPI_DATA.map((kpi, index) => (
                    <KPICard key={index} {...kpi} />
                ))}
            </View>

            {/* Módulos Principales (Grid inferior) */}
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 15 }]}>Módulos de Gestión</Text>
            <View style={styles.mainModulesGrid}>
                <ModuleCard
                    title="Citas de Hoy"
                    subtitle="Gestionar agenda"
                    icon="today-outline"
                    onPress={() => navigation.navigate("CitasHoy")}
                />
                <ModuleCard
                    title="Agenda Médicos"
                    subtitle="Ver disponibilidad"
                    icon="calendar-outline"
                    onPress={() => navigation.navigate("AgendaMedicos")}
                />
                <ModuleCard
                    title="Registro Pacientes"
                    subtitle="Nuevos ingresos"
                    icon="people-circle-outline"
                    onPress={() => navigation.navigate("RegistroPacientes")}
                />
                <ModuleCard
                    title="Centro de Llamadas"
                    subtitle="Gestión telefónica"
                    icon="call-outline"
                    onPress={() => navigation.navigate("CentroLlamadas")}
                />
                <ModuleCard
                    title="Búsqueda"
                    subtitle="Pacientes y citas"
                    icon="search-circle-outline"
                    onPress={() => navigation.navigate("BuscarPaciente")}
                />
            </View>


            {/* Modal de confirmación de logout (NO SE MODIFICÓ) */}
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
                            <TouchableOpacity style={[styles.modalCancelButton, { borderColor: theme.subtitle }]} onPress={handleCancelLogout}>
                                <Text style={[styles.modalCancelText, { color: theme.subtitle }]}>Cancelar</Text>
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
        padding: 15,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleContainer: { flex: 1, alignItems: 'center' },
    logoContainer: {
        borderRadius: 50,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    subtitle: { fontSize: 16, fontWeight: '400' },
    headerIcons: { flexDirection: 'row', position: 'absolute', right: 0, top: 0 },
    logoutBtn: { marginLeft: 15 },

    // Welcome Card
    welcomeCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    welcomeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    welcomeText: { fontSize: 20, fontWeight: "bold" },
    welcomeSubText: { fontSize: 13, marginBottom: 15 },

    // Quick Action Row (New Appointment, Search, Call)
    quickActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    quickActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    quickActionButtonOutline: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
    },
    quickActionButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },

    // KPI Grid
    kpiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    kpiCard: {
        width: '48%', // Ajuste para 2 columnas
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    kpiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    kpiValue: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    kpiTitle: {
        fontSize: 14,
        fontWeight: '500',
    },

    // Appointments List
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 15 },

    // Main Modules Grid
    mainModulesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    moduleCard: {
        width: "48%", // Ajuste para 2 columnas
        borderRadius: 15,
        padding: 20,
        alignItems: "flex-start",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    moduleTitle: { fontSize: 15, fontWeight: "bold", marginTop: 10 },
    moduleSubtitle: { fontSize: 12, textAlign: "left" },


    // Modal styles (ajustados para usar theme.subtitle para el borde del botón de cancelar)
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
