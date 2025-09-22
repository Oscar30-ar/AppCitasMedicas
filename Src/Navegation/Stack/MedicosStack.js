import { createStackNavigator } from "@react-navigation/stack";
import DashboardMedico from "../../../Screen/Medicos/DashboardMedico";


const Stack = createStackNavigator();

export default function Medico_Stack({setUserToken}){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="DashboardMedicos"
                children={(props) => <DashboardMedico {...props} setUserToken={setUserToken} />}
                options={{title: "Medicos"}}
            />

        </Stack.Navigator>
    )
}