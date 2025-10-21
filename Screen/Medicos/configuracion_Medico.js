import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator, Button, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { logout } from "../../Src/Service/AuthService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { eliminarCuentaMedico } from "../../Src/Service/MedicoService";

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function configuracionMedico({ setUserToken }) {
    //Notificaciones
    const [permisoNotificaciones, setPermisoNotificaciones] = useState(false);
    const [loadingNotificacion, setLoadingNotificacion] = useState(true);




    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isDark = theme.name === "dark";

    const handleDeleteAccount = async () => {
        setShowDeleteModal(false);
        setIsDeleting(true);

        try {
            const result = await eliminarCuentaMedico();

            if (result.success) {
                Alert.alert(
                    "¡Éxito!",
                    result.message,
                    [{ text: "Aceptar", onPress: () => setUserToken(null) }]
                );
            } else {
                Alert.alert("Error", result.message || "No se pudo eliminar la cuenta.");
            }

        } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
            Alert.alert("Error", "Ocurrió un error inesperado al eliminar la cuenta.");
        } finally {
            setIsDeleting(false);
        }
    };


    const settingsOptions = [
        {
            icon: <Ionicons name="key-outline" size={26} color={theme.primary} />,
            title: "Cambiar Contraseña",
            subtitle: "Actualizar tu contraseña",
            action: "changePassword",
        },
        {
            icon: (
                <Ionicons
                    name={isDark ? "moon" : "moon-outline"}
                    size={26}
                    color={theme.primary}
                />
            ),
            title: "Modo Oscuro",
            subtitle: isDark ? "Usando tema oscuro" : "Usando tema claro",
            action: "theme",
        },
        {
            icon: <Ionicons name="log-out-outline" size={26} color={theme.primary} />,
            title: "Cerrar Sesión",
            subtitle: "Salir de tu cuenta",
            action: "logout",
        },
    ];

    const handleOptionPress = (action) => {
        if (action === "changePassword") {
            navigation.navigate("CambiarContrasenaMedico");
        } else if (action === "theme") {
            toggleTheme();
        } else if (action === "logout") {
            setShowLogoutModal(true);
        }
    };

    const handleConfirmLogout = async () => {
        setShowLogoutModal(false);
        try {
            await logout();
            Alert.alert(
                "¡Éxito!",
                "Has cerrado sesión correctamente.",
                [{ text: "Aceptar", onPress: () => setUserToken(null) }],
                { cancelable: false }
            );
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            Alert.alert("Error", "No se pudo cerrar la sesión. Inténtalo de nuevo.");
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    //permisos para notificaciones

    const checkPermisos = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        const preferencia = await AsyncStorage.getItem("notificaciones_activas");
        setPermisoNotificaciones(status === 'granted' && preferencia === 'true');
        setLoadingNotificacion(false);
    };

    useEffect(() => {
        checkPermisos();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            checkPermisos();
        }, [])
    );

    const toggleSwitch = async (valor) => {
        if (valor) {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                await AsyncStorage.setItem("notificaciones_activas", "true");
                setPermisoNotificaciones(true);
            } else {
                await AsyncStorage.setItem("notificaciones_activas", "false");
            }
        } else {
            await AsyncStorage.setItem("notificaciones_activas", "false");
            setPermisoNotificaciones(false);
            Alert.alert("Notificaciones Desactivadas","No recibirás alertas directas.");
        }
    }
    const programarNotificacion = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        const preferencia = await AsyncStorage.getItem('notificaciones_activas');
        if (status !== 'granted' || preferencia !== 'true') {
            Alert.alert("No tienes permisos para recibir notificaciones");
            return;
        }

        const triggerDate = new Date(Date.now() + 10000); // 10 segundos

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Notificacion Programada',
                    body: ' Notificacion programada para 10 segundos',
                },
                trigger: {
                    type: 'date',
                    date: triggerDate, // Pasas tu objeto Date aquí
                },
            });
            Alert.alert("Notificación Programada", "Recibirás una notificación en unos segundos");
        } catch (error) {
            Alert.alert("Error al programar la notificación");
        }
    }


    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Opciones */}
            <View>
                {settingsOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}
                        onPress={() => handleOptionPress(option.action)}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: theme.name === 'dark' ? theme.cardBackground : 'rgba(59,130,246,0.1)' }]}>
                            {option.icon}
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>
                                {option.title}
                            </Text>
                            <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>
                                {option.subtitle}
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward-outline"
                            size={24}
                            color={theme.subtitle}
                        />
                    </TouchableOpacity>
                ))}

                <View style={{ marginTop: 8 }}>
                    {/* Opción para Activar/Desactivar Notificaciones */}
                    <View
                        style={[
                            styles.settingCard,
                            styles.notificationCard,
                            { backgroundColor: theme.cardBackground },
                        ]}
                    >
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: theme.name === 'dark' ? theme.cardBackground : 'rgba(59,130,246,0.1)' },
                            ]}
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={26}
                                color={theme.primary}
                            />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>
                                Notificaciones
                            </Text>
                            {loadingNotificacion ? (
                                <ActivityIndicator color={theme.primary} />
                            ) : (
                                <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>
                                    {permisoNotificaciones
                                        ? "Activadas: Recibirás recordatorios y alertas."
                                        : "Desactivadas: No recibirás alertas directas."}
                                </Text>
                            )}
                        </View>

                        {/* Switch de control */}
                        <Switch
                            trackColor={{ false: theme.subtitle, true: theme.primary }}
                            thumbColor={permisoNotificaciones ? "#fff" : "#f4f3f4"}
                            ios_backgroundColor={theme.subtitle}
                            onValueChange={toggleSwitch}
                            value={permisoNotificaciones}
                            disabled={loadingNotificacion}
                        />
                    </View>

                    {/* Opción de prueba de notificación*/}
                        <TouchableOpacity
                            style={[styles.testButton, { backgroundColor: theme.primary }]}
                            onPress={programarNotificacion}
                        >
                            <Text style={styles.testButtonText}>
                                Probar Notificación en 10s
                            </Text>
                            <Ionicons name="bulb-outline" size={18} color="white" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    
                </View>


            </View>

            <View style={styles.deleteSection}>
                <Text style={[styles.deleteHeader, { color: theme.text }]}>Zona de Riesgo</Text>

                <TouchableOpacity
                    style={[styles.deleteButton, isDeleting && styles.disabledButton]}
                    onPress={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.deleteButtonText}>
                            <Ionicons name="trash-outline" size={18} color="white" /> Eliminar Cuenta
                        </Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.deleteWarningText}>
                    Esta acción es permanente e irreversible.
                </Text>
            </View>


            {/* Modal de cierre de sesión */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLogoutModal}
                onRequestClose={handleCancelLogout}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContainer,
                            { backgroundColor: theme.cardBackground },
                        ]}
                    >
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Cerrar Sesión
                        </Text>
                        <Text style={[styles.modalMessage, { color: theme.subtitle }]}>
                            ¿Estás seguro de que quieres cerrar tu sesión?
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalCancelButton, { borderColor: theme.subtitle }]}
                                onPress={handleCancelLogout}
                            >
                                <Text style={[styles.modalCancelText, { color: theme.subtitle }]}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.modalConfirmButton,
                                    { backgroundColor: theme.primary },
                                ]}
                                onPress={handleConfirmLogout}
                            >
                                <Text style={styles.modalConfirmText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de eliminación de cuenta */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>⚠️ Eliminar Cuenta</Text>
                        <Text style={[styles.modalMessage, { color: theme.subtitle }]}>
                            ¿Estás **absolutamente seguro**? Esta acción es irreversible y eliminará todos tus datos.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                // ESTILO CORREGIDO: Borde y texto usan theme.subtitle
                                style={[styles.modalCancelButton, { borderColor: theme.subtitle }]}
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <Text style={[styles.modalCancelText, { color: theme.subtitle }]}>No, Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalConfirmDeleteButton}
                                onPress={handleDeleteAccount}
                            >
                                <Text style={styles.modalConfirmText}>Eliminar Definitivamente</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}



const styles = StyleSheet.create({

    // --- ESTILOS PARA NOTIFICACIONES ---
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    notificationCard: {
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    testButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    settingCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        padding: 18,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 18,
        padding: 10,
        borderRadius: 12,
    },
    textContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 17,
        fontWeight: "600",
    },
    settingSubtitle: {
        fontSize: 13,
    },

    // --- ESTILOS DE ELIMINACIÓN DE CUENTA ---
    deleteSection: {
        marginTop: 30,
        paddingVertical: 15,
        alignItems: 'center',
    },
    deleteHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#DC2626',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    deleteWarningText: {
        color: '#DC2626',
        fontSize: 12,
        marginTop: 10,
    },
    
    // --- ESTILOS DE MODAL (Reutilizados y adaptados) ---
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: 300,
        padding: 20,
        borderRadius: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalCancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
    },
    modalCancelText: {
        fontWeight: "bold",
    },
    modalConfirmButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    modalConfirmDeleteButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#DC2626',
    },
    modalConfirmText: {
        color: "white",
        fontWeight: "bold",
    },
});