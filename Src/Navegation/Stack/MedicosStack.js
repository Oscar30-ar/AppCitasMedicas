import { createStackNavigator } from "@react-navigation/stack";
import DashboardMedico from "../../../Screen/Medicos/DashboardMedico";
import CambiarContrasenaMedico from "../../../Screen/Medicos/CambiarContrasenaMedico";
import EditarMedicoScreen from "../../../Screen/Medicos/EditarMedicoScreen";
import MisPacientesScreen from "../../../Screen/Medicos/MisPacientesScreen";
import HistorialPacienteScreen from "../../../Screen/Medicos/HistorialPacienteScreen";
import AgendaHoyMedicoScreen from "../../../Screen/Medicos/AgendaHoyMedicoScreen";


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
            <Stack.Screen
                name="MisPacientes"
                component={MisPacientesScreen}
                options={{ title: "Mis Pacientes" }}
            />

            <Stack.Screen
                name="HistorialPaciente"
                component={HistorialPacienteScreen}
                options={{ title: "Historial del Paciente" }}
            />
            <Stack.Screen
                name="AgendaHoy"
                component={AgendaHoyMedicoScreen}
                options={{ title: "Agenda de Hoy" }}
            />

        </Stack.Navigator>
    )
}