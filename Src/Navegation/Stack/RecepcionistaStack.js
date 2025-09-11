import { createStackNavigator } from "@react-navigation/stack";
import DetallesRecepcionista from "../../../Screen/Recepcionista/detallesRecepcionista";
import EditarRecepcionista from "../../../Screen/Recepcionista/editarRecepcionista";
import ListarRecepcionista from "../../../Screen/Recepcionista/listarRecepcionista";



const Stack = createStackNavigator();

export default function RecepcionistaStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="DetallesRecepcionista"
                component={DetallesRecepcionista}
                options={{title: "Recepcionista"}}
            />

            <Stack.Screen
                name="EditarRecepcionista"
                component={EditarRecepcionista}
                options={{title: "Recepcionista"}}
            />

            <Stack.Screen
                name="ListarRecepcionista"
                component={ListarRecepcionista}
                options={{title: "Recepcionista"}}
            />
        </Stack.Navigator>
    )
}