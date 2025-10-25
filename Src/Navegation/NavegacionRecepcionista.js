import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { ThemeContext } from "../../components/ThemeContext";

import Recepcionista_Stack from "./Stack/RecepcionistaStack";
import PerfilRecepcionista from "../../Screen/Recepcionista/PerfilRecepcionista";
import ConfiguracionRecepcionista from "../../Screen/Recepcionista/configuracionRecepcionista";
import EditarRecepcionistaScreen from "../../Screen/Recepcionista/EditarRecepcionistaScreen";
import CambiarContrasenaRecepcionista from "../../Screen/Recepcionista/CambiarContrasenaRecepcionista";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PerfilStackWrapper({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PerfilMain"
                children={(props) => <PerfilRecepcionista {...props} setUserToken={setUserToken} />}
                options={{ title: "Mi Perfil" }}
            />
            <Stack.Screen
                name="EditarRecepcionista"
                component={EditarRecepcionistaScreen}
                options={{ title: "Editar Perfil" }}
            />
        </Stack.Navigator>
    );
}

function ConfiguracionStackWrapper({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ConfiguracionMain"
                children={(props) => <ConfiguracionRecepcionista {...props} setUserToken={setUserToken} />}
                options={{ title: "Configuración" }}
            />
            <Stack.Screen
                name="CambiarContrasenaRecepcionista"
                component={CambiarContrasenaRecepcionista}
                options={{ title: "Cambiar Contraseña" }}
            />
        </Stack.Navigator>
    );
}

export default function NavegacionRecepcionista({ setUserToken }) {
    const { theme } = useContext(ThemeContext);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.subtitle,
                tabBarStyle: {
                    backgroundColor: theme.cardBackground,
                    borderTopWidth: 0,
                    elevation: 10,
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 5,
                },
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
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={focused ? 25 : 22} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Perfil"
                children={() => <PerfilStackWrapper setUserToken={setUserToken} />}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={focused ? 25 : 22} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Configuracion"
                children={() => <ConfiguracionStackWrapper setUserToken={setUserToken} />}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather name="settings" size={focused ? 25 : 22} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}