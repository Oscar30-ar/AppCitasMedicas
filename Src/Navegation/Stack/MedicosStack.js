import { createStackNavigator } from "@react-navigation/stack";
import DetallesMedicos from "../../../Screen/Medicos/detallesMedicos";
import EditarMedicos from "../../../Screen/Medicos/editarMedicos";
import ListarMedicos from "../../../Screen/Medicos/listarMedicos";
import DashboardMedico from "../../../Screen/Medicos/DashboardMedico";


const Stack = createStackNavigator();

export default function Medico_Stack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardMedicos"
                children={(props) => <DashboardScreen {...props} setUserToken={setUserToken} />}
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