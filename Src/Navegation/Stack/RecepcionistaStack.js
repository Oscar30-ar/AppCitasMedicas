import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CrearCitasScreen from "../../../Screen/Pacientes/NuevaCita";
import DashboardRecepcionista from "../../../Screen/Recepcionista/DashboardRecepcionista";

const Stack = createNativeStackNavigator();

export default function Recepcionista_Stack({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardRecepcionista"
                children={(props) => <DashboardRecepcionista {...props} setUserToken={setUserToken} />}
                options={{ title: "Pacientes" }}
            />


        </Stack.Navigator>
    )
}