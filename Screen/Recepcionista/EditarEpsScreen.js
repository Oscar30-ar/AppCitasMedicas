import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../../components/ThemeContext';
import { obtenerEpsPorId, actualizarEps } from '../../Src/Service/RecepcionService';

export default function EditarEpsScreen({ route, navigation }) {
    const { epsId } = route.params;
    const { theme } = useContext(ThemeContext);
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            const response = await obtenerEpsPorId(epsId);
            if (response.success) {
                setNombre(response.data.nombre);
            } else {
                Alert.alert("Error", "No se pudo cargar la información del consultorio.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            }
            setLoading(false);
        };
        cargarDatos();
    }, [epsId]);

    const handleUpdate = async () => {
        if (!nombre.trim()) {
            Alert.alert("Error", "El nombre del consultorio es obligatorio.");
            return;
        }

        setUpdating(true);
        const response = await actualizarEps(epsId, { nombre });
        if (response.success) {
            Alert.alert("Éxito", "Eps actualizada correctamente.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Error", response.message || "No se pudo actualizar la Eps.");
        }
        setUpdating(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            padding: 20,
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.text,
            textAlign: 'center',
            marginBottom: 30,
        },
        input: {
            backgroundColor: theme.cardBackground,
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
            backgroundColor: theme.primary,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        }
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Eps</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de la Eps"
                placeholderTextColor={theme.subtitle}
                value={nombre}
                onChangeText={setNombre}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={updating}>
                {updating ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>Actualizar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}