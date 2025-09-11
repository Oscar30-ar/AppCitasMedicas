import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PacientesStack from "./PacientesStack";
import MedicosStack from "./MedicosStack";
import RecepcionistaStack from "./RecepcionistaStack";


const Stack = createNativeStackNavigator();

export default function InicioStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="InicioPantalla"
                component={Inicio}
                options={{headerShown:false}}
            />

            <Stack.Screen
                name="PacientesFlow"
                component={PacientesStack}
                options={{headerShown:false}}
            />

            <Stack.Screen
                name="MedicosFlow"
                component={MedicosStack}
                options={{headerShown:false}}
            />

            <Stack.Screen
                name="RecepcionistaFlow"
                component={RecepcionistaStack}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    )
}