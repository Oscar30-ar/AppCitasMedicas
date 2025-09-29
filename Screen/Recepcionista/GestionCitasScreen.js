import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, FlatList } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import apiConexion from "../../Src/Service/Conexion";
import { crearCita } from "../../Src/Service/RecepcionService";

export default function GestionCitasScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);

    // Estados para la búsqueda de pacientes
    const [searchTerm, setSearchTerm] = useState("");
    const [pacientesEncontrados, setPacientesEncontrados] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    // Estados para el agendamiento
    const [especialidades, setEspecialidades] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [horaSeleccionada, setHoraSeleccionada] = useState(null);

    // Estados de carga
    const [loading, setLoading] = useState(true);
    const [loadingDoctores, setLoadingDoctores] = useState(false);
    const [loadingHoras, setLoadingHoras] = useState(false);
    const [creandoCita, setCreandoCita] = useState(false);

    // --- BÚSQUEDA DE PACIENTES ---
    useEffect(() => {
        if (searchTerm.length < 3) {
            setPacientesEncontrados([]);
            return;
        }
        const delayDebounce = setTimeout(async () => {
            setIsSearching(true);
            const result = await buscarPacientes(searchTerm);
            if (result.success) {
                setPacientesEncontrados(result.data);
            }
            setIsSearching(false);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // --- LÓGICA DE AGENDAMIENTO ---
    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                const response = await apiConexion.get("/especialidades");
                setEspecialidades(response.data);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar las especialidades.");
            } finally {
                setLoading(false);
            }
        };
        fetchEspecialidades();
    }, []);

    useEffect(() => {
        if (!especialidadSeleccionada) return;
        const fetchDoctores = async () => {
            setLoadingDoctores(true);
            try {
                const response = await apiConexion.get(`/doctores/especialidad/${especialidadSeleccionada}`);
                setDoctores(response.data);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar los doctores.");
            } finally {
                setLoadingDoctores(false);
            }
        };
        fetchDoctores();
    }, [especialidadSeleccionada]);

    useEffect(() => {
        if (!doctorSeleccionado) return;
        const fetchHoras = async () => {
            setLoadingHoras(true);
            try {
                const response = await apiConexion.get(`/citas/available-times/${doctorSeleccionado}`);
                setHorasDisponibles(response.data);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar los horarios.");
            } finally {
                setLoadingHoras(false);
            }
        };
        fetchHoras();
    }, [doctorSeleccionado]);

    const handleCreateCita = async () => {
        if (!pacienteSeleccionado || !doctorSeleccionado || !fechaSeleccionada || !horaSeleccionada) {
            Alert.alert("Error", "Completa todos los pasos.");
            return;
        }
        setCreandoCita(true);
        try {
            const citaData = {
                id_paciente: pacienteSeleccionado.id,
                id_doctor: doctorSeleccionado,
                fecha: fechaSeleccionada,
                hora: horaSeleccionada,
            };
            const result = await crearCita(citaData);

            if (result.success) {
                Alert.alert("Éxito", "Cita creada exitosamente.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Error", result.message || "No se pudo crear la cita.");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error inesperado.");
        } finally {
            setCreandoCita(false);
        }
    };

    const formattedDates = [...new Set(horasDisponibles.map(h => h.fecha))];
    const formattedTimes = fechaSeleccionada ? horasDisponibles.filter(h => h.fecha === fechaSeleccionada).map(h => h.hora) : [];

    const styles = getStyles(theme);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Gestión de Citas</Text>

            {/* --- 1. SELECCIÓN DE PACIENTE --- */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>1. Buscar Paciente</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={theme.subtitle} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por nombre o documento..."
                        placeholderTextColor={theme.subtitle}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onFocus={() => setPacienteSeleccionado(null)} // Limpia selección al buscar de nuevo
                    />
                </View>

                {isSearching && <ActivityIndicator color={theme.primary} />}

                {!pacienteSeleccionado ? (
                    <FlatList
                        data={pacientesEncontrados}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.patientResult} onPress={() => {
                                setPacienteSeleccionado(item);
                                setSearchTerm(`${item.nombre} ${item.apellido}`);
                                setPacientesEncontrados([]);
                            }}>
                                <Text style={{ color: theme.text }}>{item.nombre} {item.apellido} - {item.documento}</Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <View style={styles.patientSelected}>
                        <Ionicons name="person-circle" size={24} color={theme.primary} />
                        <Text style={styles.patientSelectedText}>Paciente: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}</Text>
                    </View>
                )}
            </View>

            {/* --- 2. AGENDAMIENTO (se muestra si hay paciente) --- */}
            {pacienteSeleccionado && (
                <>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>2. Selecciona Especialidad</Text>
                        {loading ? <ActivityIndicator color={theme.primary} /> : (
                            <View style={styles.pickerContainer}>
                                <Picker selectedValue={especialidadSeleccionada} onValueChange={setEspecialidadSeleccionada} style={{ color: theme.text }} dropdownIconColor={theme.text}>
                                    <Picker.Item label="--- Selecciona ---" value={null} />
                                    {especialidades.map(e => <Picker.Item key={e.id} label={e.nombre} value={e.id} />)}
                                </Picker>
                            </View>
                        )}
                    </View>

                    {especialidadSeleccionada && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>3. Selecciona Doctor</Text>
                            {loadingDoctores ? <ActivityIndicator color={theme.primary} /> : (
                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={doctorSeleccionado} onValueChange={setDoctorSeleccionado} style={{ color: theme.text }} dropdownIconColor={theme.text}>
                                        <Picker.Item label="--- Selecciona ---" value={null} />
                                        {doctores.map(d => <Picker.Item key={d.id} label={`${d.nombre} ${d.apellido}`} value={d.id} />)}
                                    </Picker>
                                </View>
                            )}
                        </View>
                    )}

                    {doctorSeleccionado && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>4. Selecciona Fecha</Text>
                            {loadingHoras ? <ActivityIndicator color={theme.primary} /> : (
                                <View style={styles.pickerContainer}>
                                    <Picker selectedValue={fechaSeleccionada} onValueChange={setFechaSeleccionada} style={{ color: theme.text }} dropdownIconColor={theme.text}>
                                        <Picker.Item label="--- Selecciona ---" value={null} />
                                        {formattedDates.map((f, i) => <Picker.Item key={i} label={f} value={f} />)}
                                    </Picker>
                                </View>
                            )}
                        </View>
                    )}

                    {fechaSeleccionada && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>5. Selecciona Hora</Text>
                            <View style={styles.pickerContainer}>
                                <Picker selectedValue={horaSeleccionada} onValueChange={setHoraSeleccionada} style={{ color: theme.text }} dropdownIconColor={theme.text}>
                                    <Picker.Item label="--- Selecciona ---" value={null} />
                                    {formattedTimes.map((t, i) => <Picker.Item key={i} label={t} value={t} />)}
                                </Picker>
                            </View>
                        </View>
                    )}

                    {horaSeleccionada && (
                        <TouchableOpacity style={styles.confirmButton} onPress={handleCreateCita} disabled={creandoCita}>
                            {creandoCita ? <ActivityIndicator color="white" /> : <Text style={styles.confirmButtonText}>Confirmar Cita</Text>}
                        </TouchableOpacity>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: theme.text,
        textAlign: "center",
        marginBottom: 20,
    },
    sectionContainer: {
        marginBottom: 20,
        backgroundColor: theme.cardBackground,
        padding: 15,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: theme.text,
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.background,
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: theme.border,
    },
    searchInput: {
        flex: 1,
        height: 45,
        marginLeft: 10,
        color: theme.text,
    },
    patientResult: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    patientSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: `${theme.primary}20`,
        borderRadius: 8,
        marginTop: 10,
    },
    patientSelectedText: {
        color: theme.primary,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 8,
        backgroundColor: theme.background,
    },
    confirmButton: {
        backgroundColor: theme.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});