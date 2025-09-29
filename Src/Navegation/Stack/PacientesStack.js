import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../../../Screen/Pacientes/DashboardPaciente";
import HistorialMedicoScreen from "../../../Screen/Pacientes/HistorialMedico";
import MapaScreen from "../../../Screen/Pacientes/MapaScreen";
import ContactoScreen from "../../../Screen/Pacientes/ContactoScreen";
import CambiarContrasenaScreen from "../../../Screen/Pacientes/CambiarContrasenaScreen";
import TerminosUsoScreen from "../../../Screen/Pacientes/TerminosUsoScreen";
import EditarPacienteScreen from "../../../Screen/Pacientes/EditarPacienteScreen";

const Stack = createNativeStackNavigator();

export default function Pacientes_Stack({ setUserToken }){ 
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardPacientes"
                children={(props) => <DashboardScreen {...props} setUserToken={setUserToken} />}
                options={{ 
                    headerShown: true, 
                    title: "Pacientes"
                }}
            />

            <Stack.Screen
                name="HistorialMedico"
                component={HistorialMedicoScreen}
                options={{title: "Historial Medico"}}
            />

            <Stack.Screen
                name="Mapa"
                component={MapaScreen}
                options={{title: "Mapa"}}
            />

            <Stack.Screen
                name="Contacto"
                component={ContactoScreen}
                options={{title: "Contacto"}}
            />

            <Stack.Screen
                name="CambiarContrasena"
                component={CambiarContrasenaScreen}
                options={{title: "Cambiar Contraseña"}}
            />

            <Stack.Screen
                name="TerminosUso"
                component={TerminosUsoScreen}
                options={{title: "Terminos de Uso"}}
            />

            <Stack.Screen
                name="EditarPaciente"
                component={EditarPacienteScreen}
                options={{title: "Editar Perfil"}}
            />

        </Stack.Navigator>
    )
}