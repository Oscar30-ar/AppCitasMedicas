// DetallePacienteScreen.js
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../components/ThemeContext";

export default function DetallePacienteScreen({ route }) {
    const { theme } = useContext(ThemeContext);
    const { paciente } = route.params; 

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Datos del Paciente</Text>

            <Text style={[styles.label, { color: theme.text }]}>Nombre</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.nombre} {paciente.apellido}</Text>

            <Text style={[styles.label, { color: theme.text }]}>Documento</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.documento}</Text>

            <Text style={[styles.label, { color: theme.text }]}>Teléfono</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.celular || "No registrado"}</Text>

            <Text style={[styles.label, { color: theme.text }]}>Fecha de nacimiento</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.fecha_nacimiento || "No registrado"}</Text>

            <Text style={[styles.label, { color: theme.text }]}>Dirección</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.ciudad || "No registrada"}</Text>

            <Text style={[styles.label, { color: theme.text }]}>Correo</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.correo || "No registrado"}</Text>

            <Text style={[styles.label, { color: theme.text }]}>Rh</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.Rh || "No registrado"}</Text>

            <Text style={[styles.label, { color: theme.text }]}>Eps</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.eps || "No registrado"}</Text>

            <Text style={[styles.label, { color: theme.text }]}>Genero</Text>
            <Text style={[styles.value, { color: theme.subtitle }]}>{paciente.genero || "No registrado"}</Text>


        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
    value: { fontSize: 15, marginTop: 3 },
});
