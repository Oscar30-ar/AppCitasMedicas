import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { obtenerCitasHoy, actualizarEstadoCita } from "../../Src/Service/RecepcionService";

export default function CitasHoyScreen() {
    const { theme } = useContext(ThemeContext);
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const cargarCitas = async () => {
            setLoading(true);
            try {
                const response = await obtenerCitasHoy();
                console.log("GET /citas/hoy response:", response);
                if (response && response.success) {
                    setCitas(response.data);
                } else {
                    Alert.alert("Error", response?.message || "No se pudieron cargar las citas.");
                }
            } catch (error) {
                console.error("Error en cargarCitas:", error);
                Alert.alert("Error", "Error al cargar las citas. Revisa la consola.");
            } finally {
                setLoading(false);
            }
        };

        cargarCitas();
    }, []);

    const getStatusColor = (status) => {
        if (!status) return "#D1D5DB";
        switch (status.trim().toLowerCase()) {
            case "confirmada":
                return "#0f8e37ff";
            case "pendiente":
                return "#5e5f5bff";
            case "cancelada":
                return "#EF4444";
            default:
                return "#D1D5DB";
        }
    };

    const handleCall = (telefono, nombre) => {
        if (!telefono) {
            Alert.alert("Error", `No hay número de teléfono disponible para ${nombre}.`);
            return;
        }

        const phoneNumber = `tel:${telefono}`;
        Linking.openURL(phoneNumber).catch(() => {
            Alert.alert("Error", "No se pudo abrir la aplicación de llamadas.");
        });
    };

    // Función que hace la petición al backend y actualiza UI
    const confirmarCita = async (id, nombrePaciente) => {
        try {
            console.log("Iniciando confirmarCita para id:", id);
            setUpdatingId(id);

            const response = await actualizarEstadoCita(id, "confirmada");
            console.log("PUT /citas/:id/estado response:", response);

            if (response && response.success) {
                // Actualiza visualmente el estado sin recargar todo
                setCitas((prevCitas) =>
                    prevCitas.map((cita) =>
                        cita.id === id ? { ...cita, estado: "confirmada" } : cita
                    )
                );
                Alert.alert("Éxito", response.message || "La cita ha sido confirmada correctamente.");
            } else {
                Alert.alert("Error", response?.message || "No se pudo confirmar la cita.");
            }
        } catch (error) {
            console.error("Error en confirmarCita:", error);
            Alert.alert("Error", "Ocurrió un error al confirmar la cita. Revisa la consola.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleConfirmar = (id, nombrePaciente) => {
        Alert.alert(
            "Confirmar cita",
            `¿Deseas confirmar la cita de ${nombrePaciente}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: () => confirmarCita(id, nombrePaciente),
                },
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                <Ionicons name="notifications" size={16} color={theme.text} />
                {" "}Gestión de Citas - Hoy
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
            ) : citas.length === 0 ? (
                <Text style={{ color: theme.subtitle, textAlign: "center", marginTop: 30 }}>
                    No hay citas programadas para hoy.
                </Text>
            ) : (
                <View style={styles.appointmentsListContainer}>
                    {citas.map((appointment) => (
                        <View
                            key={appointment.id}
                            style={[
                                styles.patientAppointmentCard,
                                {
                                    backgroundColor: theme.cardBackground,
                                    borderLeftColor: getStatusColor(appointment.estado),
                                    borderLeftWidth: 6,
                                }
                            ]}
                        >
                            <View style={styles.patientInfo}>
                                <View style={styles.patientNameRow}>
                                    <Text style={[styles.patientName, { color: theme.text }]}>
                                        {appointment.pacientes?.nombre} {appointment.pacientes?.apellido}
                                    </Text>

                                    <View style={[styles.statusTag, { backgroundColor: getStatusColor(appointment.estado) }]}>
                                        <Text style={styles.statusText}>{appointment.estado}</Text>
                                    </View>
                                </View>

                                <Text style={[styles.doctorInfo, { color: theme.subtitle }]}>
                                    Médico: {appointment.doctor?.nombre}
                                </Text>

                                <View style={styles.appointmentDetails}>
                                    <Ionicons name="time-outline" size={16} color={theme.subtitle} />
                                    <Text style={[styles.infoText, { color: theme.subtitle, marginRight: 15 }]}>
                                        {appointment.hora}
                                    </Text>
                                    <Ionicons name="call-outline" size={16} color={theme.subtitle} />
                                    <Text style={[styles.infoText, { color: theme.subtitle }]}>
                                        {appointment.pacientes?.celular || "N/A"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.appointmentActions}>
                                <TouchableOpacity
                                    style={[styles.actionButtonOutline, { borderColor: theme.primary }]}
                                    onPress={() => handleCall(appointment.pacientes?.celular, appointment.pacientes?.nombre)}
                                >
                                    <Text style={[styles.actionButtonTextOutline, { color: theme.primary }]}>Llamar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.confirmarButton,
                                        appointment.estado === "confirmada"
                                            ? styles.confirmarButtonDisabled
                                            : styles.confirmarButtonActive,  
                                    ]}
                                    onPress={() => handleConfirmar(appointment.id, appointment.pacientes?.nombre)}
                                    disabled={appointment.estado === "confirmada"}
                                >
                                    <Text
                                        style={[
                                            styles.confirmarText,
                                            appointment.estado === "confirmada" && styles.confirmarTextDisabled,
                                        ]}
                                    >
                                        {appointment.estado === "confirmada" ? "Confirmada" : "Confirmar"}
                                    </Text>
                                </TouchableOpacity>



                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15, paddingHorizontal: 5 },
    appointmentsListContainer: { marginBottom: 10 },
    patientAppointmentCard: { padding: 15, borderRadius: 12, marginBottom: 10 },
    patientInfo: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 10, marginBottom: 10 },
    patientNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    patientName: { fontSize: 17, fontWeight: 'bold' },
    statusTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15 },
    statusText: { color: 'white', fontSize: 12, fontWeight: '600' },
    doctorInfo: { fontSize: 14, marginBottom: 5 },
    appointmentDetails: { flexDirection: "row", alignItems: "center", marginTop: 5 },
    infoText: { fontSize: 13, marginLeft: 5 },
    appointmentActions: { flexDirection: 'row', justifyContent: 'flex-end' },
    actionButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginLeft: 10 },
    actionButtonText: { color: "white", fontSize: 14, fontWeight: "bold" },
    actionButtonOutline: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
    actionButtonTextOutline: { fontSize: 14, fontWeight: "bold" },
    confirmarButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 100,
    },

    confirmarButtonActive: {
        backgroundColor: "#0f8e37ff",
    },

    confirmarButtonDisabled: {
        backgroundColor: "#9e9e9e", 
        opacity: 0.8,
    },

    confirmarText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "capitalize",
    },

    confirmarTextDisabled: {
        color: "#f5f5f5",
    },

});
