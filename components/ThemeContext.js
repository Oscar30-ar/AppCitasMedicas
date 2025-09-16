import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const lightTheme = {
  background: "#f4f4f5",
  cardBackground: "#ffffff",
  text: "#0f172a",
  subtitle: "#a1a1aa",
  border: "#e4e4e7",
  primary: "#3b82f6",
  tabBackground: "#ffffff",
};

const darkTheme = {
  background: "#0f172a",
  cardBackground: "#1e293b",
  text: "#f4f4f5",
  subtitle: "#a1a1aa",
  border: "#334155",
  primary: "#3b82f6",
  tabBackground: "#110d46ff",
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme);
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    setTheme(newIsDarkMode ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};