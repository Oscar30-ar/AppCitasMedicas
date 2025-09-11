import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, IonIcons } from "@expo/vector-icons"
const Tab = createBottomTabNavigator();
import InicioStack from "./Stack/InicioStack";
import perfilScreen from "../../Screen/Perfil/perfilScreen";

export default function NavegacionPrincipal() {
    return (
        <Tab.Navigator
            screenOptions={{
                // Estilo para la barra de pestañas en general
                tabBarStyle:{
                    backgroundColor:'#eef6d7',
                    borderTopWidth:1,
                    borderTopColor:'#3d481d',
                    height:60,
                    paddingBottom:5,
                    paddingTop:5,
                },
                //colores de los iconos y texto de la pestaña
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor:'#808080',
                tabBarLabelStyle:{
                    fontSize:12,
                    fontWeight:'600',
                    marginTop:2,
                },
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={Inicio}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <IonIcons name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Inicio',
                }} />

            <Tab.Screen
                name="Perfil"
                component={perfilStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="user" size={size} color={color} />
                    ),
                    tabBarLabel: 'Perfil',
                }} />


            <Tab.Screen
                name="Configuracion"
                component={configuracionesStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <IonIcons name="settings-outline" size={size} color={color} />
                    ),
                    tabBarLabel: 'Configuracion',
                }} />
        </Tab.Navigator>
    )
}

