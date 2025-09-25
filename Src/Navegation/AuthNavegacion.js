import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login  from "../../Screen/Auth/login";
import Registro  from "../../Screen/Auth/registroPaciente";
import DashboardComponent from "../../Screen/Pacientes/DashboardPaciente";
import DashboardMedico from "../../Screen/Medicos/DashboardMedico";
import DashboardRecepcionista from "../../Screen/Recepcionista/DashboardRecepcionista";

const Stack = createNativeStackNavigator();

export default function AuthNavegacion({ setUserToken, setUserRole }){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                children={(props) => <Login {...props} setUserToken={setUserToken} setUserRole={setUserRole}/>}
                options={{title:"Iniciar Sesión"}}
            />


            <Stack.Screen
                name="DashboardPaciente"
                component={DashboardComponent}
                options={{title:"DashboardComponent"}}
            />

            <Stack.Screen
                name="DashboardMedico"
                component={DashboardMedico}
                options={{title:"DashboardMedico"}}
            />
            <Stack.Screen
                name="DashboardRecepcionista"
                component={DashboardRecepcionista}
                options={{title:"DashboardRecepcionista"}}
            />

            <Stack.Screen
                name="Registro"
                component={Registro}
                options={{title:"Registrarse"}}
            />
            
        </Stack.Navigator>
    )
}
