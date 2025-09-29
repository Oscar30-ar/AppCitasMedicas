import React, { useState, useEffect, useContext, useMemo } from "react";
import {View,Text,StyleSheet,FlatList,ActivityIndicator,TextInput,TouchableOpacity,Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { obtenerMisPacientes } from "../../Src/Service/MedicoService"; // Asumimos que esta función existe
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// --- Componente para cada paciente en la lista ---
const PatientCard = ({ paciente, theme, onPress }) => (
    <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
        onPress={onPress}
    >
        <Ionicons name="person-circle-outline" size={40} color={theme.primary} />
        <View style={styles.cardInfo}>
            <Text style={[styles.patientName, { color: theme.text }]}>
                {`${paciente.nombre} ${paciente.apellido}`}
            </Text>
            <Text style={[styles.patientDetail, { color: theme.subtitle }]}>
                ID: {paciente.documento}
            </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={theme.subtitle} />
    </TouchableOpacity>
);

export default function MisPacientesScreen() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const cargarPacientes = async () => {
            try {
                // NOTA: Debes crear esta función en MedicoService.js y el endpoint en tu backend
                const response = await obtenerMisPacientes();
                if (response.success) {
                    setPacientes(response.data);
                } else {
                    Alert.alert("Error", response.message || "No se pudieron cargar los pacientes.");
                }
            } catch (error) {
                console.error("Error al cargar la lista de pacientes:", error);
                Alert.alert("Error", "Ocurrió un error inesperado al obtener los pacientes.");
            } finally {
                setLoading(false);
            }
        };

        cargarPacientes();
    }, []);

    // Filtra los pacientes según el término de búsqueda
    const filteredPacientes = useMemo(() => {
        if (!searchTerm) {
            return pacientes;
        }
        return pacientes.filter(
            (p) =>
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.documento.includes(searchTerm)
        );
    }, [searchTerm, pacientes]);

    const handlePatientPress = (paciente) => {
        // Aquí puedes navegar al historial clínico del paciente
        navigation.navigate('HistorialPaciente', { paciente: paciente });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.subtitle, marginTop: 10 }}>Cargando pacientes...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* --- Barra de Búsqueda --- */}
            <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <Ionicons name="search" size={20} color={theme.subtitle} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Buscar por nombre, apellido o documento..."
                    placeholderTextColor={theme.subtitle}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {/* --- Lista de Pacientes --- */}
            <FlatList
                data={filteredPacientes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PatientCard paciente={item} theme={theme} onPress={() => handlePatientPress(item)} />
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={{ color: theme.subtitle, textAlign: "center", marginTop: 50 }}>
                            {searchTerm ? "No se encontraron pacientes." : "Aún no tienes pacientes asignados."}
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
        padding: 15,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 1,
        height: 50,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardInfo: {
        flex: 1,
        marginLeft: 15,
    },
    patientName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    patientDetail: {
        fontSize: 14,
        marginTop: 2,
    },
});