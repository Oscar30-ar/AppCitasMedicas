import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../Src/Service/Conexion";

export default function CambiarContrasenaScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas nuevas no coinciden.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Error", "La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("userToken");
            const response = await axios.post(
                `${BASE_URL}/api/change-password`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                Alert.alert("Éxito", "Contraseña cambiada correctamente.");
                navigation.goBack();
            } else {
                Alert.alert("Error", response.data.message || "No se pudo cambiar la contraseña.");
            }
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            Alert.alert("Error", "Ocurrió un error al cambiar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: theme.cardBackground }]}>
                    <FontAwesome5 name="heartbeat" size={30} color={theme.primary} />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Cambiar Contraseña</Text>
            </View>

            <View style={styles.form}>
                <View style={[styles.inputContainer, { borderColor: theme.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.subtitle} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Contraseña actual"
                        placeholderTextColor={theme.subtitle}
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                <View style={[styles.inputContainer, { borderColor: theme.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.subtitle} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Nueva contraseña"
                        placeholderTextColor={theme.subtitle}
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View style={[styles.inputContainer, { borderColor: theme.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.subtitle} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Confirmar nueva contraseña"
                        placeholderTextColor={theme.subtitle}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Cambiando..." : "Cambiar Contraseña"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    logoContainer: {
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        backgroundColor: "transparent",
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});