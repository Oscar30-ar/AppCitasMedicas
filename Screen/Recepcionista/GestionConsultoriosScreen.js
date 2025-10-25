import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../components/ThemeContext';
import { obtenerConsultorios, eliminarConsultorio } from '../../Src/Service/RecepcionService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ConsultorioCard = ({ consultorio, theme, onEdit, onDelete }) => (
    <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Ionicons name="business-outline" size={40} color={theme.primary} />
        <View style={styles.cardInfo}>
            <Text style={[styles.consultorioName, { color: theme.text }]}>
                {consultorio.nombre}
            </Text>
            <Text style={[styles.consultorioDetail, { color: theme.subtitle }]}>
                ID: {consultorio.id}
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

export default function GestionConsultoriosScreen() {
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [consultorios, setConsultorios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const cargarConsultorios = async () => {
        setLoading(true);
        try {
            const response = await obtenerConsultorios();
            if (response.success) {
                setConsultorios(response.data);
            } else {
                Alert.alert("Error", response.message || "No se pudieron cargar los consultorios.");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un problema al obtener los consultorios.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarConsultorios();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        cargarConsultorios();
    }, []);

    const handleDelete = (consultorio) => {
        Alert.alert(
            "Confirmar Eliminación",
            `¿Seguro que deseas eliminar el consultorio "${consultorio.nombre}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        const response = await eliminarConsultorio(consultorio.id);
                        if (response.success) {
                            setConsultorios((prev) => prev.filter((c) => c.id !== consultorio.id));
                            Alert.alert("Éxito", "Consultorio eliminado correctamente.");
                        } else {
                            Alert.alert("Error", response.message || "No se pudo eliminar el consultorio.");
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
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('AgregarConsultorio')}>
                <Ionicons name="add" size={24} color="white" />
                <Text style={styles.addButtonText}>Agregar Consultorio</Text>
            </TouchableOpacity>

            <FlatList
                data={consultorios}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
                }
                renderItem={({ item }) => (
                    <ConsultorioCard
                        consultorio={item}
                        theme={theme}
                        onEdit={() => navigation.navigate('EditarConsultorio', { consultorioId: item.id })}
                        onDelete={() => handleDelete(item)}
                    />
                )}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: theme.subtitle }}>No hay consultorios registrados.</Text>
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
    consultorioName: { fontSize: 16, fontWeight: "bold" },
    consultorioDetail: { fontSize: 14, marginTop: 2, color: '#6B7280' },
    actions: { flexDirection: 'row' },
});