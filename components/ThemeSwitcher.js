import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from './ThemeContext';

export default function ThemeSwitcher() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.button,
        { backgroundColor: isDarkMode ? "#191a65ff" : "#000000ff" }, // 🔄 fondo cambia con el tema
      ]}
    >
      <Ionicons
        name={isDarkMode ? "sunny" : "moon"}
        size={28}
        color={isDarkMode ? "#facc15" : "#ffffffff"} // 🌞 amarillo sol | 🌙 oscuro luna
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20, 
    right: 20,  
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
    top:940,
  },
});
