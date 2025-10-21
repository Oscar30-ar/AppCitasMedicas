import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useContext } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import Pacientes_Stack from "./Stack/PacientesStack";
import ConfiguracionPaciente from "../../Screen/Pacientes/configuracion_Paciente";
import PerfilScreen from "../../Screen/Pacientes/perfilScreen";
import { createStackNavigator } from "@react-navigation/stack";
import TerminosUsoScreen from "../../Screen/Pacientes/TerminosUsoScreen";
import CambiarContrasenaScreen from "../../Screen/Pacientes/CambiarContrasenaScreen";
import EditarPacienteScreen from "../../Screen/Pacientes/EditarPacienteScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function PerfilStackWrapper({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PerfilMain"
                children={(props) => <PerfilScreen {...props} setUserToken={setUserToken} />}
                options={{
                    title: "Mi Perfil", 
                    headerShown: true, 
                }}
            />
            <Stack.Screen
                name="EditarPaciente"
                component={EditarPacienteScreen} // crea esta pantalla
                options={{ title: "Editar Paciente" }}
            />
        </Stack.Navigator>
    );
}

function ConfiguracionStackWrapper({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ConfiguracionMain"
                children={(props) => <ConfiguracionPaciente {...props} setUserToken={setUserToken} />}
                options={{ title: "Configuración", headerShown: true }}
            />

            <Stack.Screen
                name="TerminosUso"
                component={TerminosUsoScreen} 
                options={{ title: "Términos de Uso" }}
            />

            <Stack.Screen
                name="CambiarContrasena"
                component={CambiarContrasenaScreen} 
                options={{ title: "Cambiar Contraseña" }}
            />
        </Stack.Navigator>
    );
}


export default function NavegacionPaciente({ setUserToken }) {
    const { theme } = useContext(ThemeContext);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
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
                    marginBottom: 4,
                },
            }}
        >
            <Tab.Screen
                name="Inicio"
                children={() => <Pacientes_Stack setUserToken={setUserToken} />}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <FontAwesome6
                            name="house-chimney"
                            size={focused ? 25 : 22}
                            color={color}
                        />
                    ),
                    title: "Inicio",
                }}
            />

            <Tab.Screen
                name="Perfil"
                children={() => <PerfilStackWrapper setUserToken={setUserToken} />}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person-circle" : "person-circle-outline"}
                            size={focused ? 26 : 22}
                            color={color}
                        />
                    ),
                    title: "Perfil",
                }}
            />

            <Tab.Screen
                name="Configuracion"
                children={() => <ConfiguracionStackWrapper setUserToken={setUserToken} />}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather
                            name="settings"
                            size={focused ? 25 : 22}
                            color={color}
                        />
                    ),
                    title: "Configuración",
                }}
            />
        </Tab.Navigator>
    );
}
