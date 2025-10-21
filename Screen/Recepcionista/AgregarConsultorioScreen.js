import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../components/ThemeContext';
import { agregarConsultorio } from '../../Src/Service/RecepcionService';

export default function AgregarConsultorioScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!nombre.trim()) {
            Alert.alert("Error", "El nombre del consultorio es obligatorio.");
            return;
        }

        setLoading(true);
        try {
            const response = await agregarConsultorio({ nombre });
            if (response.success) {
                Alert.alert("Éxito", "Consultorio agregado correctamente.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Error", response.message || "No se pudo agregar el consultorio.");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al guardar el consultorio.");
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
        pickerContainer: {
            backgroundColor: theme.cardBackground,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 20,
            justifyContent: 'center',
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
            <Text style={styles.title}>Agregar Nuevo Consultorio</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre del Consultorio"
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