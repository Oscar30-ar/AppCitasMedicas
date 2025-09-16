import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Datos de ejemplo para el historial médico
const medicalHistoryData = [
    {
        id: "1",
        date: "2024-03-15",
        doctor: "Dr. Ana García",
        specialty: "Cardiología",
        eventType: "Consulta",
        description: "Revisión general y control de presión arterial."
    },
    {
        id: "2",
        date: "2024-03-10",
        doctor: "Laboratorio Central",
        specialty: "Laboratorio Clínico",
        eventType: "Examen",
        description: "Resultados de análisis de sangre y orina."
    },
    {
        id: "3",
        date: "2024-02-28",
        doctor: "Dr. Carlos Mendoza",
        specialty: "Medicina General",
        eventType: "Consulta",
        description: "Consulta de seguimiento por síntomas de resfriado."
    },
    {
        id: "4",
        date: "2024-02-15",
        doctor: "Radiología SA",
        specialty: "Radiología",
        eventType: "Examen",
        description: "Radiografía de tórax, sin hallazgos relevantes."
    },
];

const EventCard = ({ item }) => {
    return (
        <View style={styles.eventCard}>
            <View style={styles.eventHeader}>
                <Ionicons 
                    name={item.eventType === "Consulta" ? "medkit-outline" : "flask-outline"}
                    size={24}
                    color="#3b82f6"
                />
                <Text style={styles.eventTitle}>{item.eventType}: {item.specialty}</Text>
            </View>
            <Text style={styles.eventDate}>📅 {item.date}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
            <Text style={styles.eventDoctor}>Con el {item.doctor}</Text>
        </View>
    );
};

export default function HistorialMedicoScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Historial Médico</Text>
            <FlatList
                data={medicalHistoryData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <EventCard item={item} />}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a", // Fondo oscuro
        padding: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#f4f4f5",
        marginBottom: 20,
        textAlign: "center",
    },
    listContent: {
        paddingBottom: 20,
    },
    eventCard: {
        backgroundColor: "#1e293b",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    eventHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#f4f4f5",
        marginLeft: 10,
    },
    eventDate: {
        fontSize: 14,
        color: "#a1a1aa",
        marginBottom: 5,
    },
    eventDescription: {
        fontSize: 14,
        color: "#d1d5db",
        marginBottom: 5,
    },
    eventDoctor: {
        fontSize: 12,
        color: "#94a3b8",
        fontStyle: "italic",
    },
});