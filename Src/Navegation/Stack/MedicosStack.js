import { createStackNavigator } from "@react-navigation/stack";
import DashboardMedico from "../../../Screen/Medicos/DashboardMedico";
import CambiarContrasenaMedico from "../../../Screen/Medicos/CambiarContrasenaMedico";
import EditarMedicoScreen from "../../../Screen/Medicos/EditarMedicoScreen";


const Stack = createStackNavigator();

export default function Medico_Stack({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardMedicos"
                children={(props) => <DashboardMedico {...props} setUserToken={setUserToken} />}
                options={{ title: "Medicos" }}
            />
            <Stack.Screen
                name="CambiarContrasenaMedico"
                component={CambiarContrasenaMedico}
                options={{ title: "Cambiar Contraseña" }}
            />
            <Stack.Screen
                name="EditarMedico"
                component={EditarMedicoScreen}
                options={{ title: "Editar Perfil" }}
            />

        </Stack.Navigator>
    )
}