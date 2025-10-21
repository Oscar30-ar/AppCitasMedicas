import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardRecepcionista from "../../../Screen/Recepcionista/DashboardRecepcionista";
import CitasHoyScreen from "../../../Screen/Recepcionista/CitasHoyScreen";
import RegistroPacienteRecepcionista from "../../../Screen/Recepcionista/RegistroPacienteRecepcionista";
import NuevaCitaScreen from "../../../Screen/Recepcionista/NuevaCitaScreen";
import BuscarPacienteScreen from "../../../Screen/Recepcionista/BuscarPacienteScreen";
import HistorialPacienteScreen from "../../../Screen/Medicos/HistorialPacienteScreen";
import DetallePacienteScreen from "../../../Screen/Recepcionista/DetallesPacienteScreen";
import GestionMedicosScreen from "../../../Screen/Recepcionista/GestionMedicosScreen";
import AgregarMedicoScreen from "../../../Screen/Recepcionista/AgregarMedicoScreen";
import EditarMedicoScreen from "../../../Screen/Recepcionista/EditarMedicoScreen";
import EditarRecepcionistaScreen from "../../../Screen/Recepcionista/EditarRecepcionistaScreen";
import GestionConsultoriosScreen from "../../../Screen/Recepcionista/GestionConsultoriosScreen";
import AgregarConsultorioScreen from "../../../Screen/Recepcionista/AgregarConsultorioScreen";
import EditarConsultorioScreen from "../../../Screen/Recepcionista/EditarConsultorioScreen";
import AgregarEspecialidadScreen from "../../../Screen/Recepcionista/AgregarEspecialidadScreen";
import EditarEspecialidadScreen from "../../../Screen/Recepcionista/EditarEspecialidadScreen";
import GestionEspecialidadesScreen from "../../../Screen/Recepcionista/GestionEspecialidadesScreen";

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
                name="NuevaCita"
                component={NuevaCitaScreen}
                options={{ title: "Agendar Nueva Cita" }}
            />
            <Stack.Screen
                name="BuscarPaciente"
                component={BuscarPacienteScreen}
                options={{ title: "Buscar Paciente" }}
            />
            <Stack.Screen
                name="HistorialPaciente"
                component={HistorialPacienteScreen}
                options={{ title: "Historial del Paciente" }}
            />
            <Stack.Screen
                name="DetallePaciente"
                component={DetallePacienteScreen}
                options={{ title: "Historial del Paciente" }}
            />
            <Stack.Screen
                name="GestionMedicos"
                component={GestionMedicosScreen}
                options={{ title: "Gestión de Médicos" }}
            />
            <Stack.Screen
                name="AgregarMedico"
                component={AgregarMedicoScreen}
                options={{ title: "Agregar Nuevo Médico" }}
            />

            <Stack.Screen
                name="EditarMedico"
                component={EditarMedicoScreen}
                options={{ title: "Editar Médico" }}
            />
            <Stack.Screen
                name="EditarRecepcionista"
                component={EditarRecepcionistaScreen}
                options={{ title: "Editar Perfil" }}
            />
            <Stack.Screen
                name="GestionConsultorios"
                component={GestionConsultoriosScreen}
                options={{ title: "Gestión de Consultorios" }}
            />
            <Stack.Screen
                name="AgregarConsultorio"
                component={AgregarConsultorioScreen}
                options={{ title: "Agregar Consultorio" }}
            />
            <Stack.Screen
                name="EditarConsultorio"
                component={EditarConsultorioScreen}
                options={{ title: "Editar Consultorio" }}
            />
            <Stack.Screen
                name="GestionEspecialidades"
                component={GestionEspecialidadesScreen}
                options={{ title: "Gestión de Especialidades" }}
            />
            <Stack.Screen
                name="AgregarEspecialidad"
                component={AgregarEspecialidadScreen}
                options={{ title: "Agregar Especialidad" }}
            />
            <Stack.Screen
                name="EditarEspecialidad"
                component={EditarEspecialidadScreen}
                options={{ title: "Editar Especialidad" }}
            />

        </Stack.Navigator>
    )
}