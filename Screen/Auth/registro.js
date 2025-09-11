import React, { useState } from "react";

import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import BottonComponent from "../../components/BottonComponent";



export default function RegisterPatientScreen({ navigation }) {

  const [nombre, setNombre] = useState("");

  const [apellido, setApellido] = useState("");

  const [documento, setDocumento] = useState("");

  const [teléfono, setTelefono] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");




  return (

    <View style={styles.container}>

      <Text style={styles.title}>Registro de Paciente</Text>



      <View style={styles.form}>

        <TextInput

          style={styles.input}

          placeholder="Nombre"

          placeholderTextColor="#94a3b8"

          value={nombre}

          onChangeText={setNombre}

        />



        <TextInput

          style={styles.input}

          placeholder="Apellido"

          placeholderTextColor="#94a3b8"

          value={apellido}

          onChangeText={setApellido}

        />



        <TextInput

          style={styles.input}

          placeholder="Cédula o documento de identidad"

          placeholderTextColor="#94a3b8"

          value={documento}

          keyboardType="phone-pad"

          onChangeText={setDocumento}

        />



        <TextInput

          style={styles.input}

          placeholder="Teléfono"

          placeholderTextColor="#94a3b8"

          value={teléfono}

          keyboardType="phone-pad"

          onChangeText={setTelefono}

        />

        <TextInput

          style={styles.input}

          placeholder="Fecha de nacimiento"

          placeholderTextColor="#94a3b8"

          keyboardType=""

          value={email}

          onChangeText={setEmail}

        />



        <TextInput

          style={styles.input}

          placeholder="Correo electrónico"

          placeholderTextColor="#94a3b8"

          keyboardType="email-address"

          value={email}

          onChangeText={setEmail}

        />



        <TextInput

          style={styles.input}

          placeholder="Contraseña"

          placeholderTextColor="#94a3b8"

          secureTextEntry

          value={password}

          onChangeText={setPassword}

        />



        <TextInput

          style={styles.input}

          placeholder="Confirmar contraseña"

          placeholderTextColor="#94a3b8"

          secureTextEntry

          value={confirmPassword}

          onChangeText={setConfirmPassword}

        />



        <TouchableOpacity style={styles.registerBtn}>

          <Text style={styles.registerText}>Registrar Paciente</Text>

        </TouchableOpacity>

        <BottonComponent
          title="Iniciar Sesion"
          onPress={() => navigation.navigate("Login")}
        />

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#0f172a",

    padding: 20,

    justifyContent: "center",

  },

  title: {

    color: "white",

    fontSize: 22,

    fontWeight: "bold",

    marginBottom: 20,

    textAlign: "center",

  },

  form: {

    backgroundColor: "#1e293b",

    padding: 20,

    borderRadius: 10,

  },

  input: {

    backgroundColor: "#334155",

    color: "white",

    padding: 10,

    borderRadius: 8,

    marginBottom: 12,

  },

  registerBtn: {

    backgroundColor: "#16a34a",

    padding: 15,

    borderRadius: 8,

    alignItems: "center",

    marginTop: 10,

  },

  registerText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 16,

  },

});