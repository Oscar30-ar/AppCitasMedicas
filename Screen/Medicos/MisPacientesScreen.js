import React, { useState, useEffect, useContext, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { obtenerMisPacientes } from "../../Src/Service/MedicoService";
import { useNavigation } from "@react-navigation/native";

const PatientCard = ({ paciente, theme, onPress }) => (
    <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
        onPress={onPress}
    >
        <Ionicons name="person-circle-outline" size={45} color={theme.primary} />
        <View style={styles.cardInfo}>
            <Text style={[styles.patientName, { color: theme.text }]}>
                {paciente.nombre} {paciente.apellido}
            </Text>
            <Text style={[styles.patientDetail, { color: theme.subtitle }]}>
                Documento: {paciente.documento}
            </Text>
            <Text style={[styles.patientDetail, { color: theme.subtitle }]}>
                Teléfono: {paciente.celular || "No registrado"}
            </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={theme.subtitle} />
    </TouchableOpacity>
);

export default function MisPacientesScreen() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const cargarPacientes = async () => {
        try {
            const res = await obtenerMisPacientes();
            if (res.success) {
                // 🧹 Filtramos: pacientes con id válido y únicos
                const unicos = Array.from(
                    new Map(
                        res.data
                            .filter((p) => p.id !== null && p.id !== undefined)
                            .map((p) => [p.id, p])
                    ).values()
                );
                setPacientes(unicos);
            } else {
                Alert.alert("Error", res.message || "No se pudieron cargar los pacientes.");
            }
        } catch (error) {
            console.error("Error al cargar pacientes:", error);
            Alert.alert("Error", "Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        cargarPacientes();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await cargarPacientes();
    };

    const filteredPacientes = useMemo(() => {
        if (!searchTerm) return pacientes;
        return pacientes.filter(
            (p) =>
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.documento.includes(searchTerm)
        );
    }, [searchTerm, pacientes]);

    const handlePress = (paciente) => {
        navigation.navigate("HistorialPaciente", { paciente });
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
            <View
                style={[
                    styles.searchContainer,
                    { backgroundColor: theme.cardBackground, borderColor: theme.border },
                ]}
            >
                <Ionicons name="search" size={20} color={theme.subtitle} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Buscar paciente..."
                    placeholderTextColor={theme.subtitle}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            <FlatList
                data={filteredPacientes}
                keyExtractor={(item, index) => `${item.id}-${index}`} // 🔑 asegura unicidad total
                renderItem={({ item }) => (
                    <PatientCard paciente={item} theme={theme} onPress={() => handlePress(item)} />
                )}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    center: { justifyContent: "center", alignItems: "center" },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 1,
        height: 50,
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardInfo: { flex: 1, marginLeft: 15 },
    patientName: { fontSize: 16, fontWeight: "bold" },
    patientDetail: { fontSize: 14, marginTop: 2 },
});
