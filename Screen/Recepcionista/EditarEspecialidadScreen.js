import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { ThemeContext } from '../../components/ThemeContext';
import { listarEspecialidadPorId, actualizarEspecialidad } from '../../Src/Service/RecepcionService';

export default function EditarEspecialidadScreen({ route, navigation }) {
    const { especialidadId } = route.params;
    const { theme } = useContext(ThemeContext);
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await listarEspecialidadPorId(especialidadId);
                if (response.success) {
                    setNombre(response.data.nombre);
                } else {
                    Alert.alert("Error", "No se pudo cargar la información de la especialidad.", [
                        { text: "OK", onPress: () => navigation.goBack() }
                    ]);
                }
            } catch (error) {
                console.error("Error cargando datos de especialidad:", error);
                Alert.alert("Error", "Error de conexión al cargar la especialidad.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [especialidadId]);

    const handleUpdate = async () => {
        if (!nombre.trim()) {
            Alert.alert("Error", "El nombre de la especialidad es obligatorio.");
            return;
        }

        setUpdating(true);
        const response = await actualizarEspecialidad(especialidadId, { nombre });
        if (response.success) {
            Alert.alert("Éxito", "Especialidad actualizada correctamente.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Error", response.message || "No se pudo actualizar la especialidad.");
        }
        setUpdating(false);
    };

    const styles = getStyles(theme);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: theme.subtitle, marginTop: 10 }}>Cargando datos de la especialidad...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Editar Especialidad</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de la Especialidad"
                        placeholderTextColor={theme.subtitle}
                        value={nombre}
                        onChangeText={setNombre}
                    />
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.primary }]}
                        onPress={handleUpdate}
                        disabled={updating}
                    >
                        {updating ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Actualizar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        color: theme.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
    },
    form: {
        backgroundColor: theme.cardBackground,
        padding: 20,
        borderRadius: 12,
    },
    input: {
        backgroundColor: theme.background,
        color: theme.text,
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: 20,
        fontSize: 16,
    },
    saveButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});