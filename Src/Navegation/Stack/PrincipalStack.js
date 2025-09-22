import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Pacientes_Stack from "./PacientesStack";
import Medico_Stack from "./MedicosStack";



const Stack = createNativeStackNavigator();

export default function PrincipalStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="StackPaciente"
                component={Pacientes_Stack}
                options={{headerShown:false}}
            />
            <Stack.Screen
                name="StackMedico"
                component={Medico_Stack}
                options={{headerShown:false}}
            />

        </Stack.Navigator>
    )
}