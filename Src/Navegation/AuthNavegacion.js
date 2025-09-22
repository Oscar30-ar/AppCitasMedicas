import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login  from "../../Screen/Auth/login";
import Registro  from "../../Screen/Auth/registro";
import DashboardComponent from "../../Screen/Pacientes/DashboardPaciente";

const Stack = createNativeStackNavigator();

export default function AuthNavegacion({ setUserToken }){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                children={(props) => <Login {...props} setUserToken={setUserToken} />}
                options={{title:"Iniciar Sesión"}}
            />


            <Stack.Screen
                name="DashboardPaciente"
                component={DashboardComponent}
                options={{title:"DashboardComponent"}}
            />

            <Stack.Screen
                name="Registro"
                component={Registro}
                options={{title:"Registrarse"}}
            />
            
        </Stack.Navigator>
    )
}
