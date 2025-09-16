import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import {Ionicons } from "@expo/vector-icons";
export default function CardComponent({ title, description, icon}){
    return(
        <TouchableOpacity style={estilos.card}>
            <View style={estilos.iconContainer}>
                {icon}
            </View>
           
            <Text style={estilos.title}>{title}</Text>
            <Text style={estilos.description}>{description}</Text>
        </TouchableOpacity>
    )
}

const estilos = StyleSheet.create({
    card: {
        width: "45%",
        alignItems:"center",
        backgroundColor:"#fff",
        borderRadius:12,
        padding:16,
        marginVertical:8,
        elevation:3,
        shadowColor:"#000",
        shadowOpacity: 0.1,
        shadowOffset:{width: 0, height:2},
        shadowRadius:4,
    },

    iconContainer:{
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor:"#E3F2FD",
        justifyContent:"center",
        alignItems:"center"
      
    },

    textContainer:{
        flex:1,
        alignItems:"center",
    },

    title:{
        fontSize:12,
        fontWeight:"bold",
        marginBottom:2,
        color:"#1976D2",
    },

    description:{
        fontSize:14,
        color:"#555",
    },
})