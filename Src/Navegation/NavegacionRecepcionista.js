import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useContext } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import Recepcionista_Stack from "./Stack/RecepcionistaStack";
import ConfiguracionRecepcionista from "../../Screen/Recepcionista/configuracionRecepcionista";
import PerfilRecepcionista from "../../Screen/Recepcionista/PerfilRecepcionista";

const Tab = createBottomTabNavigator();

export default function NavegacionRecepcionista({ setUserToken }) {
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
                children={() => <Recepcionista_Stack setUserToken={setUserToken} />}
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
                children={() => <PerfilRecepcionista setUserToken={setUserToken} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-circle" size={size} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Configuracion"
                children={() => <ConfiguracionRecepcionista setUserToken={setUserToken} />}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="settings" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}