import DetallesPaciente from "../../../Screen/Pacientes/detallesPacientes";
import EditarPaciente from "../../../Screen/Pacientes/editarPaciente";
import ListarPaciente from "../../../Screen/Pacientes/listarPacientes";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../../../Screen/Pacientes/DashboardPaciente";
import CrearCitasScreen from "../../../Screen/Pacientes/NuevaCita";
import HistorialMedicoScreen from "../../../Screen/Pacientes/HistorialMedico";

const Stack = createNativeStackNavigator();

export default function Pacientes_Stack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardPacientes"
                component={DashboardScreen}
                options={{title: "Pacientes"}}
            />

            <Stack.Screen
                name="DetallesPaciente"
                component={DetallesPaciente}
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

            <Stack.Screen
                name="ListarPaciente"
                component={ListarPaciente}
                options={{title: "Pacientes"}}
            />
        </Stack.Navigator>
    )
}