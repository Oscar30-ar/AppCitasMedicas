import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Pacientes_Stack from "./Stack/PacientesStack";
import confi_paciente from "../../Screen/Pacientes/configuracion_Paciente";
import { useContext } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import PerfilScreen from "../../Screen/Pacientes/perfilScreen";

const Tab = createBottomTabNavigator();

export default function NavegacionPrincipal({ setUserToken }) {
    const { theme } = useContext(ThemeContext);
    return (

        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: "#090632ff",
                    borderTopWidth: 1,
                    borderTopColor: "#ffffffff",
                    height: 60,
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "#eaeaeaff",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >

            <Tab.Screen
                name="Inicio"
                children={() => <Pacientes_Stack setUserToken={setUserToken} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6 name="house-chimney" size={size}
                            color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Perfil"
                children={() => <PerfilScreen setUserToken={setUserToken} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-circle" size={size} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Configuracion"
                children={() => <confi_paciente setUserToken={setUserToken} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="settings" size={size} color={color} />
                    )
                }}
            />

        </Tab.Navigator>
    )
}