import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../components/ThemeContext';
import { obtenerEps, eliminarEps } from '../../Src/Service/RecepcionService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// 🩺 Componente para mostrar cada EPS
const EpsCard = ({ eps, theme, onEdit, onDelete }) => (
  <View
    style={[
      styles.card,
      { backgroundColor: theme.cardBackground, borderColor: theme.border },
    ]}
  >
    <Ionicons name="medkit-outline" size={40} color={theme.primary} />
    <View style={styles.cardInfo}>
      <Text style={[styles.epsName, { color: theme.text }]}>{eps.nombre}</Text>
      <Text style={[styles.epsDetail, { color: theme.subtitle }]}>
        ID: {eps.id}
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

export default function GestionEpsScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [epsList, setEpsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarEps = async () => {
    setLoading(true);
    try {
      const response = await obtenerEps();
      if (response.success) {
        setEpsList(response.data);
      } else {
        Alert.alert('Error', response.message || 'No se pudieron cargar las EPS.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al obtener las EPS.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarEps();
    }, [])
  );

  const handleDelete = (eps) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Seguro que deseas eliminar la EPS "${eps.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const response = await eliminarEps(eps.id);
            if (response.success) {
              setEpsList((prev) => prev.filter((e) => e.id !== eps.id));
              Alert.alert('Éxito', 'EPS eliminada correctamente.');
            } else {
              Alert.alert('Error', response.message || 'No se pudo eliminar la EPS.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AgregarEps')}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Agregar una nueva EPS</Text>
      </TouchableOpacity>

      <FlatList
        data={epsList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EpsCard
            eps={item}
            theme={theme}
            onEdit={() => navigation.navigate('EditarEps', { epsId: item.id })}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: theme.subtitle }}>No hay EPS registradas.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    elevation: 2,
  },
  cardInfo: { flex: 1, marginLeft: 15 },
  epsName: { fontSize: 16, fontWeight: 'bold' },
  epsDetail: { fontSize: 14, marginTop: 2, color: '#6B7280' },
  actions: { flexDirection: 'row' },
});
