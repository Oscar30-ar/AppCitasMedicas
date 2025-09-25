import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useContext } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import Medico_Stack from "./Stack/MedicosStack";
import PerfilScreenMedico from "../../Screen/Medicos/perfilScreenMedico";
import configuracion_Medico from "../../Screen/Medicos/configuracion_Medico";

const Tab = createBottomTabNavigator();

export default function NavegacionMedico({ setUserToken }) {
    const { theme } = useContext(ThemeContext);
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: theme.tabBackground,
                    borderTopWidth: 1,
                    borderTopColor: theme.border,
                    height: 60,
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.subtitle,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
            }}
        >
            <Tab.Screen
                name="Inicio"
                children={() => <Medico_Stack setUserToken={setUserToken} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6 name="house-chimney" size={size} color={color} />
                    ),
                    title: "Inicio"
                }}
            />

            <Tab.Screen
                name="PerfilMedico"
                children={() => <PerfilScreenMedico setUserToken={setUserToken} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-circle" size={size} color={color} />
                    ),
                    title: "Perfil"
                }}
            />

            <Tab.Screen
                name="ConfiguracionMedico"
                children={() => <configuracion_Medico setUserToken={setUserToken} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="settings" size={size} color={color} />
                    ),
                    title: "Configuración"
                }}
            />
        </Tab.Navigator>
    );
}