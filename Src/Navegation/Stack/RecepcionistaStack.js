import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardRecepcionista from "../../../Screen/Recepcionista/DashboardRecepcionista";
import CitasHoyScreen from "../../../Screen/Recepcionista/CitasHoyScreen";
import RegistroPacienteRecepcionista from "../../../Screen/Recepcionista/RegistroPacienteRecepcionista";
import GestionCitasScreen from "../../../Screen/Recepcionista/GestionCitasScreen";

const Stack = createNativeStackNavigator();

export default function Recepcionista_Stack({ setUserToken }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardRecepcionista"
                children={(props) => <DashboardRecepcionista {...props} setUserToken={setUserToken} />}
                options={{ title: "Panel de Recepción" }}
            />
            <Stack.Screen
                name="CitasHoy"
                component={CitasHoyScreen}
                options={{ title: "Citas de Hoy" }}
            />
            <Stack.Screen
                name="RegistroPacientes"
                component={RegistroPacienteRecepcionista}
                options={{ title: "Registrar Nuevo Paciente" }}
            />
            <Stack.Screen
                name="GestionCitas"
                component={GestionCitasScreen}
                options={{ title: "Agendar Nueva Cita" }}
            />

        </Stack.Navigator>
    )
}