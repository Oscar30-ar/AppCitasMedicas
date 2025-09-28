// components/LogoutModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LogoutModal({ visible, onCancel, onConfirm, theme }) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.title, { color: theme.text }]}>Cerrar Sesión</Text>
          <Text style={[styles.message, { color: theme.subtitle }]}>
            ¿Estás seguro de que quieres cerrar tu sesión?
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.subtitle }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: theme.subtitle }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: theme.primary }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// 🎨 Estilos del modal
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 300,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelText: {
    fontWeight: "bold",
  },
});
