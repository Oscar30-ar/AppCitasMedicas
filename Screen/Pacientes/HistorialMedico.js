import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { HistorialMedico } from "../../Src/Service/PacienteService";

// Componente para renderizar cada evento del historial
const EventCard = ({ item, theme }) => {
    return (
        <View style={[styles.eventCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.eventHeader}>
                <Ionicons 
                    name={item.eventType === "Consulta" ? "medkit-outline" : "flask-outline"}
                    size={24}
                    color={theme.primary}
                />
                <Text style={[styles.eventTitle, { color: theme.text }]}>
                    {item.eventType}: {item.specialty}
                </Text>
            </View>
            {/* Uso de campos mapeados: item.date, item.time, item.description, item.doctor, item.consultorio */}
            <Text style={[styles.eventDate, { color: theme.subtitle }]}>
                📅 {item.date} a las {item.time}
            </Text>
            <Text style={[styles.eventDescription, { color: theme.text }]}>
                {item.description}
            </Text>
            <Text style={[styles.eventDoctor, { color: theme.subtitle }]}>
                Con el {item.doctor} en consultorio {item.consultorio}
            </Text>
        </View>
    );
};

export default function HistorialMedicoScreen() {
    const { theme } = useContext(ThemeContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lógica para cargar el historial
    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            try {
                const result = await HistorialMedico();

                if (result.success && Array.isArray(result.data)) {
                    
                    // Mapeo de datos: De la estructura de Laravel a la estructura del componente
                    const formattedHistory = result.data.map(cita => ({
                        id: cita.id,
                        date: cita.fecha, // Base de datos: citas.fecha
                        time: cita.hora, // Base de datos: citas.hora
                        description: cita.descripcion || 'Consulta sin detalles', // Base de datos: citas.descripcion
                        consultorio: cita.consultorio, // Base de datos: citas.consultorio
                        
                        eventType: 'Consulta', 
                        
                        // Citas tiene relación 'doctor', que a su vez debe tener una relación 'especialidades' (muchos a muchos)
                        doctor: `Dr. ${cita.doctor?.nombre || ''} ${cita.doctor?.apellido || ''}`, 
                        
                        // Asumimos que el doctor tiene una relación 'especialidades' y tomamos la primera
                        specialty: cita.doctor?.especialidades?.[0]?.nombre || 'Medicina General', 
                    }));
                    
                    setHistory(formattedHistory);
                } else {
                    Alert.alert("Error de Historial", result.message || "La respuesta del servidor no es una lista válida de citas."); 
                }
            } catch (error) {
                console.error("Error al cargar el historial:", error);
                Alert.alert("Error", "Ocurrió un error inesperado al cargar el historial.");
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);
    
    // Si está cargando
    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.subtitle, marginTop: 10 }}>Cargando historial...</Text>
            </View>
        );
    }
    
    // Si no hay historial
    if (!history || history.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
                <Text style={[styles.pageTitle, { color: theme.text }]}>Historial Médico</Text>
                <Text style={{ color: theme.subtitle, textAlign: 'center', marginTop: 20 }}>
                    No se encontraron registros de citas médicas.
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
                    <FontAwesome5 name="heartbeat" size={30} color={theme.primary} />
                </View>
                <Text style={[styles.pageTitle, { color: theme.text }]}>Historial Médico</Text>
            </View>
            <FlatList
                data={history}
                keyExtractor={(item, index) => item.id ? String(item.id) : index.toString()} 
                renderItem={({ item }) => <EventCard item={item} theme={theme} />}
                contentContainerStyle={styles.listContent}
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
    listContent: {
        paddingBottom: 20,
    },
    eventCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
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