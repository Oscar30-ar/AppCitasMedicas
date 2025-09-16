import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Pacientes_Stack from "./Stack/PacientesStack";
import perfilScreen from "../../Screen/Pacientes/perfilScreen";
import confi_paciente from "../../Screen/Configuracion/configuracion_Paciente";
const Tab = createBottomTabNavigator();

export default function NavegacionPrincipal(){
    return(
        <Tab.Navigator
        screenOptions={{
            tabBarStyle:{
                backgroundColor: "#110d46ff",
                borderTopWidth: 1,
                borderTopColor: "#f4f4f4ff",
                height: 60,
               
               
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "#b3a5a5ff",
            tabBarLabelStyle:{
                fontSize: 12,
                fontWeight: "600",
                alignItems: "center"
               
            },             
        }}
        >
           
            <Tab.Screen 
            name="Inicio"
            component={Pacientes_Stack}
            options={{
                headerShown: false,
                tabBarIcon:({color, size}) =>(
                   <FontAwesome6 name="house-chimney" size={size}
                    color={color} />
                )
            }}
            
            />

                <Tab.Screen 
            name="Perfil"
            component={perfilScreen}
            options={{
                headerShown: false,
                tabBarIcon:({color, size}) =>(
                    <Ionicons name="people-circle" size={size} color={color}/>
                )
            }}
            />

          <Tab.Screen 
            name="Configuracion"
            component={confi_paciente}
            options={{
                headerShown: false,
                tabBarIcon:({color, size}) =>(
                  <Feather name="settings" size={size} color={color} />
                )
            }}
            />

        </Tab.Navigator>
    )
}