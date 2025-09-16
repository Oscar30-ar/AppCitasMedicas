import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavegacion from './Src/Navegation/AppNavegacion';
import { ThemeProvider } from './components/ThemeContext';



export default function App() {
  return (
    <ThemeProvider>
      <AppNavegacion/>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};
