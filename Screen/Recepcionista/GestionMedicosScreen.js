import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../components/ThemeContext';
import { obtenerDoctores, eliminarDoctor } from '../../Src/Service/RecepcionService';
import { useNavigation } from '@react-navigation/native';

// 💡 Componente DoctorCard CORREGIDO 
const DoctorCard = ({ doctor, theme, onEdit, onDelete }) => (
    <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Ionicons name="person-circle-outline" size={40} color={theme.primary} />
        <View style={styles.cardInfo}>
            <Text style={[styles.doctorName, { color: theme.text }]}>
                Dr. {doctor.nombre} {doctor.apellido}
            </Text>
            {/* 💡 Muestra la especialidad de forma clara 💡 */}
            <Text style={[styles.doctorSpecialty, { color: theme.subtitle }]}>
                Especialidad: {doctor.especialidades?.map(e => e.nombre).join(', ') || 'N/A'}
            </Text>
        </View>
        <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={{ marginRight: 15 }}>
                <Ionicons name="pencil" size={22} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
        </View>
    </View>
);

export default function GestionMedicosScreen() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [doctores, setDoctores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDoctores = async () => {
            try {
                const response = await obtenerDoctores();
                console.log("👩‍⚕️ Doctores cargados:", response.data); 

                if (response.success) {
                    setDoctores(response.data.data);
                } else {
                    Alert.alert("Error", "No se pudieron cargar los médicos.");
                }
            } catch (error) {
                console.error("Error cargando doctores:", error);
                Alert.alert("Error", "No se pudieron obtener los médicos.");
            } finally {
                setLoading(false);
            }
        };

        cargarDoctores();
    }, []);

    const handleDelete = (doctor) => {
        Alert.alert(
            "Confirmar Eliminación",
            `¿Seguro deseas eliminar al Dr. ${doctor.nombre}? Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await eliminarDoctor(doctor.id);
                            if (response.success) {
                                setDoctores((prev) => prev.filter((d) => d.id !== doctor.id));
                                Alert.alert("Éxito", "Médico eliminado correctamente.");
                            } else {
                                Alert.alert("Error", response.message || "No se pudo eliminar el médico.");
                            }
                        } catch (error) {
                            console.error("Error eliminando doctor:", error);
                            Alert.alert("Error", "Ocurrió un problema al eliminar el médico.");
                        }
                    },
                },
            ]
        );
    };

    const handleAdd = () => {
        navigation.navigate('AgregarMedico');
    };

    const handleEdit = (doctor) => {
        navigation.navigate('EditarMedico', { doctorId: doctor.id });
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={handleAdd}>
                <Ionicons name="add" size={24} color="white" />
                <Text style={styles.addButtonText}>Agregar Nuevo Médico</Text>
            </TouchableOpacity>

            <FlatList
                data={doctores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <DoctorCard
                        doctor={item}
                        theme={theme}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item)}
                    />
                )}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: theme.subtitle }}>No hay médicos registrados.</Text>
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
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
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
    doctorName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    doctorSpecialty: {
        fontSize: 14,
        marginTop: 5,
        fontStyle: 'italic',
    },
    doctorDetail: {
        fontSize: 14,
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
    },
});