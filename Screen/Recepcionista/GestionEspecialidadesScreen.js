import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../components/ThemeContext';
import { obtenerEspecialidades, eliminarEspecialidad } from '../../Src/Service/RecepcionService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const EspecialidadCard = ({ especialidad, theme, onEdit, onDelete }) => (
    <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Ionicons name="ribbon-outline" size={40} color={theme.primary} />
        <View style={styles.cardInfo}>
            <Text style={[styles.especialidadName, { color: theme.text }]}>
                {especialidad.nombre}
            </Text>
            <Text style={[styles.especialidadDetail, { color: theme.subtitle }]}>
                ID: {especialidad.id}
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

export default function GestionEspecialidadesScreen() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const cargarEspecialidades = async () => {
        setLoading(true);
        try {
            const response = await obtenerEspecialidades();
            if (response.success) {
                setEspecialidades(response.data);
            } else {
                Alert.alert("Error", response.message || "No se pudieron cargar las especialidades.");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al obtener las especialidades.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarEspecialidades();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        cargarEspecialidades();
    }, []);

    const handleDelete = (especialidad) => {
        Alert.alert(
            "Confirmar Eliminación",
            `¿Seguro que deseas eliminar la especialidad "${especialidad.nombre}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        const response = await eliminarEspecialidad(especialidad.id);
                        if (response.success) {
                            setEspecialidades((prev) => prev.filter((e) => e.id !== especialidad.id));
                            Alert.alert("Éxito", "Especialidad eliminada correctamente.");
                        } else {
                            Alert.alert("Error", response.message || "No se pudo eliminar la especialidad.");
                        }
                    },
                },
            ]
        );
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
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('AgregarEspecialidad')}>
                <Ionicons name="add" size={24} color="white" />
                <Text style={styles.addButtonText}>Agregar Especialidad</Text>
            </TouchableOpacity>

            <FlatList
                data={especialidades}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
                }
                renderItem={({ item }) => (
                    <EspecialidadCard
                        especialidad={item}
                        theme={theme}
                        onEdit={() => navigation.navigate('EditarEspecialidad', { especialidadId: item.id })}
                        onDelete={() => handleDelete(item)}
                    />
                )}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: theme.subtitle }}>No hay especialidades registradas.</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, marginBottom: 20 },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    card: { flexDirection: "row", alignItems: "center", padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, elevation: 2 },
    cardInfo: { flex: 1, marginLeft: 15 },
    especialidadName: { fontSize: 16, fontWeight: "bold" },
    especialidadDetail: { fontSize: 14, marginTop: 2, color: '#6B7280' },
    actions: { flexDirection: 'row' },
});