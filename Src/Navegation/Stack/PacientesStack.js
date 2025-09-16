import DetallesPaciente from "../../../Screen/Pacientes/detallesPacientes";
import EditarPaciente from "../../../Screen/Pacientes/editarPaciente";
import ListarPaciente from "../../../Screen/Pacientes/listarPacientes";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../../../Screen/Pacientes/DashboardPaciente";

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
                name="EditarPaciente"
                component={EditarPaciente}
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