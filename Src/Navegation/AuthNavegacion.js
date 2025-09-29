import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../Screen/Auth/login";
import Registro from "../../Screen/Auth/registroPaciente";
import ForgotPasswordScreen from "../../Screen/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../../Screen/Auth/ResetPasswordScreen";
import DashboardComponent from "../../Screen/Pacientes/DashboardPaciente";
import DashboardMedico from "../../Screen/Medicos/DashboardMedico";
import DashboardRecepcionista from "../../Screen/Recepcionista/DashboardRecepcionista";

const Stack = createNativeStackNavigator();

export default function AuthNavegacion({ setUserToken, setUserRole }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                children={(props) => (
                    <Login
                        {...props}
                        setUserToken={setUserToken}
                        setUserRole={setUserRole}
                    />
                )}
                options={{ title: "Iniciar Sesión" }}
            />
            <Stack.Screen
                name="DashboardPaciente"
                children={(props) => (
                    <DashboardComponent {...props} setUserToken={setUserToken} />
                )}
                options={{ title: "Dashboard Paciente" }}
            />
            <Stack.Screen
                name="DashboardMedico"
                children={(props) => (
                    <DashboardMedico {...props} setUserToken={setUserToken} />
                )}
                options={{ title: "Dashboard Médico" }}
            />
            <Stack.Screen
                name="DashboardRecepcionista"
                children={(props) => (
                    <DashboardRecepcionista {...props} setUserToken={setUserToken} />
                )}
                options={{ title: "Dashboard Recepcionista" }}
            />
            <Stack.Screen
                name="Registro"
                component={Registro}
                options={{ title: "Registrarse" }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ title: 'Restablecer Contraseña' }}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{ title: "Restablecer Contraseña" }}
            />

        </Stack.Navigator>
    )
}