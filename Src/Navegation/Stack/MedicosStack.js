import { createStackNavigator } from "@react-navigation/stack";
import DetallesMedicos from "../../../Screen/Medicos/detallesMedicos";
import EditarMedicos from "../../../Screen/Medicos/editarMedicos";
import ListarMedicos from "../../../Screen/Medicos/listarMedicos";


const Stack = createStackNavigator();

export default function MedicosStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="DetalleMedicos"
                component={DetallesMedicos}
                options={{title: "Medicos"}}
            />

            <Stack.Screen
                name="EditarMedicos"
                component={EditarMedicos}
                options={{title: "Medicos"}}
            />

            <Stack.Screen
                name="ListarMedicos"
                component={ListarMedicos}
                options={{title: "Medicos"}}
            />
        </Stack.Navigator>
    )
}