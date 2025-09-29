import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useContext } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import { createStackNavigator } from "@react-navigation/stack";
import EditarMedicoScreen from "../../Screen/Medicos/EditarMedicoScreen";
import CambiarContrasenaMedico from "../../Screen/Medicos/CambiarContrasenaMedico";
import Medico_Stack from "./Stack/MedicosStack";
import PerfilMedicoScreen from "../../Screen/Medicos/perfilScreenMedico";
import ConfiguracionMedicoScreen from "../../Screen/Medicos/configuracion_Medico"; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function PerfilStackWrapperMedico({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PerfilMainMedico"
                children={(props) => <PerfilMedicoScreen {...props} setUserToken={setUserToken} />}
                options={{
                    title: "Mi Perfil", 
                    headerShown: true, 
                }}
            />
            <Stack.Screen
                name="EditarMedico"
                component={EditarMedicoScreen} 
                options={{ title: "Términos de Uso" }}
            />
        </Stack.Navigator>
    );
}

function ConfiguracionStackWrapperMedico({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ConfiguracionMainMedico"
                children={(props) => <ConfiguracionMedicoScreen {...props} setUserToken={setUserToken} />}
                options={{ title: "Configuración", headerShown: true }}
            />

            <Stack.Screen
                name="CambiarContrasenaMedico"
                component={CambiarContrasenaMedico} 
                options={{ title: "Cambiar Contraseña" }}
            />
        </Stack.Navigator>
    );
}


export default function NavegacionMedico({ setUserToken }) {
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
                children={() => <Medico_Stack setUserToken={setUserToken} />}
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
                children={() => <PerfilStackWrapperMedico setUserToken={setUserToken} />}
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
                children={() => <ConfiguracionStackWrapperMedico setUserToken={setUserToken} />}
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

