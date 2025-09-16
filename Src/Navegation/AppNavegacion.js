import { NavigationContainer} from '@react-navigation/native';
import NavegacionPrincipal from "./NavegacionPrincipal";
import AuthNavegacion from "./AuthNavegacion";
export default function AppNavegacion(){
    return(
        <NavigationContainer>
           <NavegacionPrincipal/>
        </NavigationContainer>
    );
}