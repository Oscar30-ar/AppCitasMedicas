import { createStackNavigator } from "@react-navigation/stack";
import DetallesPaciente from "../../../Screen/Pacientes/detallesPacientes";
import EditarPaciente from "../../../Screen/Pacientes/editarPaciente";
import ListarPaciente from "../../../Screen/Pacientes/listarPacientes";

const Stack = createStackNavigator();

export default function PacientesStack(){
    return(
        <Stack.Navigator>
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