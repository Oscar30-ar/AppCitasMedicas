import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottonComponent from "../../components/BottonComponent";

export default function CrearCitasScreen({ navigation }) {
    const [doctor, setDoctor] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");

    const handleCreateAppointment = () => {
        // Lógica para programar la cita
        // Aquí se harían validaciones y se enviaría la información a una API
        console.log("Cita a programar:", { doctor, specialty, date, time, reason });
        alert("Cita programada con éxito!");
        navigation.goBack(); // O navegar a una pantalla de confirmación
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Programar Nueva Cita</Text>

            <View style={styles.form}>
                {/* Selector de Doctor (simulado con TextInput) */}
                <TextInput
                    style={styles.input}
                    placeholder="Doctor"
                    placeholderTextColor="#94a3b8"
                    value={doctor}
                    onChangeText={setDoctor}
                />

                {/* Selector de Especialidad (simulado con TextInput) */}
                <TextInput
                    style={styles.input}
                    placeholder="Especialidad"
                    placeholderTextColor="#94a3b8"
                    value={specialty}
                    onChangeText={setSpecialty}
                />

                {/* Selector de Fecha (simulado con TextInput) */}
                <View style={styles.inputWithIcon}>
                    <TextInput
                        style={styles.input}
                        placeholder="Fecha (YYYY-MM-DD)"
                        placeholderTextColor="#94a3b8"
                        value={date}
                        onChangeText={setDate}
                    />
                    <Ionicons name="calendar-outline" size={24} color="#94a3b8" style={styles.icon} />
                </View>

                {/* Selector de Hora (simulado con TextInput) */}
                <View style={styles.inputWithIcon}>
                    <TextInput
                        style={styles.input}
                        placeholder="Hora (HH:MM AM/PM)"
                        placeholderTextColor="#94a3b8"
                        value={time}
                        onChangeText={setTime}
                    />
                    <Ionicons name="time-outline" size={24} color="#94a3b8" style={styles.icon} />
                </View>

                {/* Motivo de la cita */}
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Motivo de la cita"
                    placeholderTextColor="#94a3b8"
                    value={reason}
                    onChangeText={setReason}
                    multiline={true}
                    numberOfLines={4}
                />

                <TouchableOpacity style={styles.programBtn} onPress={handleCreateAppointment}>
                    <Text style={styles.programText}>Programar Cita</Text>
                </TouchableOpacity>

                <BottonComponent
                    title="Cancelar"
                    onPress={() => navigation.goBack()}
                    style={styles.cancelBtn}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#0f172a", // Fondo oscuro
        padding: 20,
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    form: {
        backgroundColor: "#1e293b", // Fondo del formulario más oscuro
        padding: 20,
        borderRadius: 10,
    },
    input: {
        flex: 1,
        backgroundColor: "#334155", // Color de input más oscuro
        color: "white",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#334155",
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    icon: {
        padding: 10,
    },
    textArea: {
        height: 100, // Altura para el campo de texto de motivo
        textAlignVertical: 'top', // Alinea el texto en la parte superior
    },
    programBtn: {
        backgroundColor: "#16a34a", // Botón de color verde
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    programText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelBtn: {
        backgroundColor: "transparent",
        borderColor: "#94a3b8",
        borderWidth: 1,
        marginTop: 10,
    },
});