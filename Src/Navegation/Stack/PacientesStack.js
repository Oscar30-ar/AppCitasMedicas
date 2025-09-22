import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../../../Screen/Pacientes/DashboardPaciente";
import CrearCitasScreen from "../../../Screen/Pacientes/NuevaCita";
import HistorialMedicoScreen from "../../../Screen/Pacientes/HistorialMedico";

const Stack = createNativeStackNavigator();

export default function Pacientes_Stack({ setUserToken }){ // Asegúrate de recibir la prop
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardPacientes"
                // Usa `children` para pasar la prop setUserToken
                children={(props) => <DashboardScreen {...props} setUserToken={setUserToken} />}
                options={{title: "Pacientes"}}
            />
            <Stack.Screen
                name="NuevaCita"
                component={CrearCitasScreen}
                options={{title: "Pacientes"}}
            />

            <Stack.Screen
                name="HistorialMedico"
                component={HistorialMedicoScreen}
                options={{title: "Pacientes"}}
            />
            
        </Stack.Navigator>
    )
}