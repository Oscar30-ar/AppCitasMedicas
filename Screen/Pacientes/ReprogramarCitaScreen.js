import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../../components/ThemeContext";
import { verificarDisponibilidad, reprogramarCitaPaciente } from "../../Src/Service/PacienteService";

export default function ReprogramarCitaScreen({ route, navigation }) {
    const { cita } = route.params;
    const { theme } = useContext(ThemeContext);

    // ✅ Crear la fecha directamente en zona local (sin UTC)
const [year, month, day] = cita.fecha.split("-").map(Number);
const fechaInicial = new Date(year, month - 1, day, 12, 0, 0); 
// 12:00 PM evita que el huso horario reste el día


    const [fecha, setFecha] = useState(fechaInicial);
    // 💡 CORRECCIÓN: Formatear la hora a "HH:mm" para que coincida con las opciones del Picker.
    const [hora, setHora] = useState(cita.hora ? cita.hora.slice(0, 5) : "08:00");
    const [disponible, setDisponible] = useState(null);
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generar intervalos de 15 minutos
    useEffect(() => {
        const horas = [];
        for (let h = 8; h < 17; h++) {
            for (let m of [0, 15, 30, 45]) {
                horas.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
            }
        }
        setHorasDisponibles(horas);
    }, []);

    // Verificar disponibilidad al cambiar fecha u hora
    useEffect(() => {
        const verificar = async () => {
            // ✅ Mantener formato local YYYY-MM-DD sin zona horaria
            const fechaLocal = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
                fecha.getDate()
            ).padStart(2, "0")}`;

            const result = await verificarDisponibilidad(cita.id_doctor, fechaLocal, hora);
            setDisponible(result);
        };
        verificar();
    }, [fecha, hora]);

    // Cambiar fecha desde DatePicker
    const onChangeFecha = (event, selectedDate) => {
        if (Platform.OS === "android") setShowDatePicker(false);
        if (event?.type === "dismissed") return;

        if (selectedDate) {
            // ✅ Guardar fecha como local sin desfase
            const localDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
            );
            setFecha(localDate);
        }
    };

    // Reprogramar cita
    const handleReprogramarCita = async () => {
        if (!disponible?.disponible) {
            Alert.alert("No disponible", disponible?.mensaje || "El doctor no está disponible en esa fecha y hora.");
            return;
        }

        setIsSubmitting(true);
        try {
            const fechaLocal = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
                fecha.getDate()
            ).padStart(2, "0")}`;

            const datos = { fecha: fechaLocal, hora };
            const result = await reprogramarCitaPaciente(cita.id, datos);

            if (result.success) {
                Alert.alert("✅ Éxito", "Cita reprogramada correctamente.", [
                    { text: "Aceptar", onPress: () => navigation.navigate("DashboardPacientes") },
                ]);
            } else {
                Alert.alert("Error", result.message || "No se pudo reprogramar la cita.");
            }
        } catch (error) {
            console.error("Error reprogramando cita:", error);
            Alert.alert("Error", error.response?.data?.message || "Error inesperado al reprogramar la cita.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Reprogramar Cita</Text>

            {/* Info de la cita original */}
            <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.infoTitle, { color: theme.primary }]}>Cita Actual</Text>
                <Text style={[styles.infoText, { color: theme.text }]}>
                    Doctor: {cita.doctor?.nombre} {cita.doctor?.apellido}
                </Text>
                <Text style={[styles.infoText, { color: theme.subtitle }]}>
                    Fecha: {fechaInicial.toLocaleDateString("es-CO")} a las {cita.hora}
                </Text>
            </View>

            {/* Nueva Fecha */}
            <Text style={[styles.label, { color: theme.text }]}>Nueva Fecha</Text>
            <TouchableOpacity
                style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={{ color: theme.text }}>{fecha.toLocaleDateString("es-CO")}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={fecha}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    minimumDate={new Date()}
                    onChange={onChangeFecha}
                />
            )}

            {/* Nueva Hora */}
            <Text style={[styles.label, { color: theme.text }]}>Nueva Hora</Text>
            <View
                style={[
                    styles.pickerContainer,
                    { backgroundColor: theme.cardBackground, borderColor: theme.border },
                ]}
            >
                <Picker
                    selectedValue={hora}
                    onValueChange={(itemValue) => setHora(itemValue)}
                    style={{ color: theme.text }}
                >
                    {horasDisponibles.map((h) => (
                        <Picker.Item key={h} label={h} value={h} />
                    ))}
                </Picker>
            </View>

            {/* Mensaje de disponibilidad */}
            {disponible && (
                <View
                    style={[
                        styles.disponibilidadBox,
                        {
                            backgroundColor: disponible.disponible ? "#E0F8E0" : "#FFE0E0",
                            borderColor: disponible.disponible ? "#2E7D32" : "#C62828",
                        },
                    ]}
                >
                    <Text
                        style={{
                            color: disponible.disponible ? "#2E7D32" : "#C62828",
                            fontWeight: "bold",
                            fontSize: 15,
                        }}
                    >
                        {disponible.mensaje}
                    </Text>
                </View>
            )}

            {/* Botón */}
            <TouchableOpacity
                onPress={handleReprogramarCita}
                style={[
                    styles.button,
                    { backgroundColor: theme.primary, marginTop: 18, opacity: isSubmitting ? 0.7 : 1 },
                ]}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Confirmar Reprogramación</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 18 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
    label: { marginTop: 10, fontSize: 16, fontWeight: "500" },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
        marginBottom: 14,
        justifyContent: "center",
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 6,
        marginBottom: 10,
    },
    button: {
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    disponibilidadBox: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
    },
    infoCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    infoTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
    infoText: { fontSize: 15, lineHeight: 22 },
});
