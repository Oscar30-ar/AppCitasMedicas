import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
    Switch,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import { logout } from "../../Src/Service/AuthService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { eliminarCuentaPaciente, guardarTokenNotificacion } from "../../Src/Service/PacienteService";
import * as Notifications from "expo-notifications";

// Configuración de cómo se muestran las notificaciones cuando llega una
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function ConfiguracionPaciente({ setUserToken }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [permisoNotificaciones, setPermisoNotificaciones] = useState(false);
    const [loadingNotificacion, setLoadingNotificacion] = useState(true);

    const isDark = theme.name === "dark";

    // Verificar permisos
    const checkPermisos = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        const preferencia = await AsyncStorage.getItem("notificaciones_activas");
        setPermisoNotificaciones(status === "granted" && preferencia === "true");
        setLoadingNotificacion(false);
    };

    useEffect(() => {
        // Escucha notificaciones recibidas
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
            Alert.alert("📢 Notificación", notification.request.content.body);
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        checkPermisos();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            checkPermisos();
        }, [])
    );

    const toggleSwitch = async (valor) => {
        console.log("🟢 toggleSwitch activado:", valor);

        if (valor) {
            try {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== "granted") {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                console.log("📱 Estado del permiso:", finalStatus);

                if (finalStatus !== "granted") {
                    Alert.alert("🚫 Permiso denegado", "No podrás recibir notificaciones.");
                    return;
                }

                // 🚨 Nuevo bloque de depuración
                console.log("🛰️ Obteniendo token desde Expo...");
                const response = await Notifications.getExpoPushTokenAsync({
                    projectId: "931b0874-5171-4ff1-947c-2e7f5327bda2",
                });
                console.log("📦 Respuesta completa del token:", response);

                const token = response.data;
                console.log("✅ Token obtenido:", token);

                if (!token) {
                    Alert.alert("Error", "No se pudo obtener el token de notificaciones.");
                    return;
                }

                await AsyncStorage.setItem("notificaciones_activas", "true");
                await AsyncStorage.setItem("expo_token", token);
                setPermisoNotificaciones(true);

                console.log("📤 Enviando token al backend...");
                const result = await guardarTokenNotificacion(token);
                console.log("📤 Resultado guardarTokenNotificacion:", result);

                Alert.alert("🔔Notificaciones activadas", "Ahora recibirás alertas.");
            } catch (error) {
                console.error("❌ Error en toggleSwitch:", error);
                Alert.alert("Error", "Ocurrió un error al activar las notificaciones.");
            }
        } else {
            await AsyncStorage.setItem("notificaciones_activas", "false");
            setPermisoNotificaciones(false);
            Alert.alert("🔕 Notificaciones desactivadas", "Ya no recibirás alertas.");
        }
    };


    const handleDeleteAccount = async () => {
        setShowDeleteModal(false);
        setIsDeleting(true);
        try {
            const result = await eliminarCuentaPaciente();
            if (result.success) {
                Alert.alert("¡Éxito!", result.message, [
                    { text: "Aceptar", onPress: () => setUserToken(null) },
                ]);
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

    const handleConfirmLogout = async () => {
        setShowLogoutModal(false);
        try {
            await logout();
            Alert.alert("¡Éxito!", "Has cerrado sesión correctamente.", [
                { text: "Aceptar", onPress: () => setUserToken(null) },
            ]);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            Alert.alert("Error", "No se pudo cerrar la sesión. Inténtalo de nuevo.");
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* --- Opciones principales --- */}
            <View>
                {[
                    { icon: "document-text-outline", title: "Términos de Uso", subtitle: "Leer los términos y condiciones", action: "terms" },
                    { icon: "key-outline", title: "Cambiar Contraseña", subtitle: "Actualizar tu contraseña", action: "changePassword" },
                    { icon: isDark ? "moon" : "moon-outline", title: "Modo Oscuro", subtitle: isDark ? "Usando tema oscuro" : "Usando tema claro", action: "theme" },
                    { icon: "log-out-outline", title: "Cerrar Sesión", subtitle: "Salir de tu cuenta", action: "logout" },
                ].map((option, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}
                        onPress={() => {
                            if (option.action === "theme") toggleTheme();
                            else if (option.action === "logout") setShowLogoutModal(true);
                            else if (option.action === "terms") navigation.navigate("TerminosUso");
                            else if (option.action === "changePassword") navigation.navigate("CambiarContrasena");
                        }}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: theme.name === "dark" ? theme.cardBackground : "rgba(59,130,246,0.1)" }]}>
                            <Ionicons name={option.icon} size={26} color={theme.primary} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>{option.title}</Text>
                            <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>{option.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={24} color={theme.subtitle} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* --- Notificaciones --- */}
            <View style={{ marginTop: 8 }}>
                <View style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.name === "dark" ? theme.cardBackground : "rgba(59,130,246,0.1)" }]}>
                        <Ionicons name="notifications-outline" size={26} color={theme.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.settingTitle, { color: theme.text }]}>Notificaciones</Text>
                        {loadingNotificacion ? (
                            <ActivityIndicator color={theme.primary} />
                        ) : (
                            <Text style={[styles.settingSubtitle, { color: theme.subtitle }]}>
                                {permisoNotificaciones ? "Activadas: Recibirás alerta." : "Desactivadas: No recibirás notificaciones."}
                            </Text>
                        )}
                    </View>
                    <Switch
                        trackColor={{ false: theme.subtitle, true: theme.primary }}
                        thumbColor={permisoNotificaciones ? "#fff" : "#f4f3f4"}
                        ios_backgroundColor={theme.subtitle}
                        onValueChange={toggleSwitch}
                        value={permisoNotificaciones}
                        disabled={loadingNotificacion}
                    />
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
            </View>

            {/* Modal de cierre de sesión */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLogoutModal}
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Cerrar Sesión</Text>
                        <Text style={[styles.modalMessage, { color: theme.subtitle }]}>
                            ¿Estás seguro de que quieres cerrar tu sesión?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalCancelButton, { borderColor: theme.subtitle }]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={[styles.modalCancelText, { color: theme.subtitle }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalConfirmButton, { backgroundColor: theme.primary }]}
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
                            ¿Estás seguro? Esta acción es irreversible y eliminará todos tus datos.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalCancelButton, { borderColor: theme.subtitle }]} onPress={() => setShowDeleteModal(false)}>
                                <Text style={[styles.modalCancelText, { color: theme.subtitle }]}>No, Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalConfirmDeleteButton} onPress={handleDeleteAccount}>
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

    // --- ESTILOS DE MODAL ---
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
    modalConfirmText: { color: "white", fontWeight: "bold" },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
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
    iconContainer: { marginRight: 18, padding: 10, borderRadius: 12 },
    textContainer: { flex: 1 },
    settingTitle: { fontSize: 17, fontWeight: "600" },
    settingSubtitle: { fontSize: 13 },
});
