import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { obtenerHistorialPaciente } from "../../Src/Service/MedicoService";

// --- Componente para cada evento del historial ---
const EventCard = ({ item, theme }) => (
    <View style={[styles.eventCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={styles.eventHeader}>
            <Ionicons name="medkit-outline" size={24} color={theme.primary} />
            <Text style={[styles.eventTitle, { color: theme.text }]}>
                Consulta: {item.specialty}
            </Text>
        </View>
        <Text style={[styles.eventDate, { color: theme.subtitle }]}>
            📅 {item.date} a las {item.time}
        </Text>
        <Text style={[styles.eventDescription, { color: theme.text }]}>
           Descripcion: {item.description}
        </Text>
        <Text style={[styles.eventDoctor, { color: theme.subtitle }]}>
            Consultorio {item.consultorio}
        </Text>
        <Text style={[styles.eventDoctor, { color: theme.subtitle }]}>
            Con el Dr. {item.doctor}
        </Text>
    </View>
);

export default function HistorialPacienteScreen({ route }) {
    const { theme } = useContext(ThemeContext);
    const { paciente } = route.params; 

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            if (!paciente?.id) return;

            try {
                const result = await obtenerHistorialPaciente(paciente.id);

                if (result.success && Array.isArray(result.data)) {
                    const formattedHistory = result.data.map(cita => ({
                        id: cita.id,
                        date: cita.fecha,
                        time: cita.hora,
                        description: cita.descripcion || 'Consulta sin detalles.',
                        consultorio: cita.consultorio,
                        specialty: cita.doctor?.especialidades?.[0]?.nombre || 'Medicina General',
                        doctor: cita.doctor?.nombre + ' ' + cita.doctor?.apellido || 'Desconocido',
                        paciente: cita.paciente?.documento
                    }));
                    setHistory(formattedHistory);
                } else {
                    Alert.alert("Error de Historial", result.message || "No se pudo cargar el historial.");
                }
            } catch (error) {
                console.error("Error al cargar el historial del paciente:", error);
                Alert.alert("Error", "Ocurrió un error inesperado al cargar el historial.");
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [paciente]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.subtitle, marginTop: 10 }}>Cargando historial...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* --- Cabecera con info del paciente --- */}
            <View style={styles.header}>
                <FontAwesome5 name="user-injured" size={50} color={theme.primary} />
                <Text style={[styles.pageTitle, { color: theme.text }]}>
                    {paciente.nombre} {paciente.apellido}
                </Text>
                <Text style={[styles.patientId, { color: theme.subtitle }]}>
                    ID: {paciente.documento}
                </Text>
            </View>

            {/* --- Lista del historial --- */}
            <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <EventCard item={item} theme={theme} />}
                ListEmptyComponent={
                    <View style={styles.centerContent}>
                        <Text style={{ color: theme.subtitle, textAlign: 'center', marginTop: 50 }}>
                            Este paciente no tiene registros de citas.
                        </Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 25,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    patientId: {
        fontSize: 16,
        marginTop: 2,
    },
    eventCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        elevation: 3,
    },
    eventHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    eventDate: {
        fontSize: 14,
        marginBottom: 5,
    },
    eventDescription: {
        fontSize: 14,
        marginBottom: 5,
    },
    eventDoctor: {
        fontSize: 12,
        fontStyle: "italic",
    },
});