import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../../components/ThemeContext';
import { agregarEspecialidad } from '../../Src/Service/RecepcionService';

export default function AgregarEspecialidadScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!nombre.trim()) {
            Alert.alert("Error", "El nombre de la especialidad es obligatorio.");
            return;
        }

        setLoading(true);
        try {
            const response = await agregarEspecialidad({ nombre });
            if (response.success) {
                Alert.alert("Éxito", "Especialidad agregada correctamente.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Error", response.message || "No se pudo agregar la especialidad.");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al guardar la especialidad.");
        } finally {
            setLoading(false);
        }
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
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Nueva Especialidad</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de la Especialidad"
                placeholderTextColor={theme.subtitle}
                value={nombre}
                onChangeText={setNombre}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>Guardar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}