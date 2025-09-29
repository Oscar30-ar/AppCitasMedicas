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
import { buscarPacientesNombre } from "../../Src/Service/RecepcionService";
import { useNavigation } from "@react-navigation/native";

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

export default function BuscarPacienteScreen() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (searchTerm.trim().length < 3) {
            setResults([]);
            return;
        }

        const debounce = setTimeout(async () => {
            setIsSearching(true);
            const response = await buscarPacientesNombre(searchTerm);
            if (response.success) {
                setResults(response.data);
            } else {
                Alert.alert("Búsqueda", response.message || "No se encontraron pacientes.");
            }
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handlePatientPress = (paciente) => {
        navigation.navigate('DetallePaciente', { paciente });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <Ionicons name="search" size={20} color={theme.subtitle} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Buscar por nombre, apellido o documento..."
                    placeholderTextColor={theme.subtitle}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    autoFocus={true}
                />
            </View>

            {isSearching ? (
                <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <PatientCard paciente={item} theme={theme} onPress={() => handlePatientPress(item)} />
                    )}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={{ color: theme.subtitle, textAlign: "center", marginTop: 50 }}>
                                {searchTerm.length > 2 ? "No se encontraron resultados." : "Ingrese al menos 3 caracteres para buscar."}
                            </Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
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