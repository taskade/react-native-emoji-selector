import React, { createContext, useContext, useMemo } from 'react';
import { ColorValue } from 'react-native';

interface ThemeProps {
  primary?: ColorValue;
  background?: ColorValue;
  label?: ColorValue;
  underlay?: ColorValue;
}

interface Props {
  darkMode: boolean;
  customTheme?: ThemeProps;
}

export const LIGHT_THEME: ThemeProps = {
  primary: '#007AFF',
  background: '#FFFFFF',
  label: '#8F8F8F',
  underlay: '#F0F0F0',
};

export const DARK_THEME: ThemeProps = {
  primary: '#0A84FF',
  background: '#333333',
  label: '#8F8F8F',
  underlay: '#424242',
};

const ThemeContext = createContext({
  isDark: false,
  theme: LIGHT_THEME,
});

export const ThemeWrapper: React.FC<Props> = (props) => {
  const { darkMode, customTheme, children } = props;
  const currentTheme = useMemo(() => {
    const defaultTheme = darkMode ? DARK_THEME : LIGHT_THEME;
    return { ...defaultTheme, ...customTheme };
  }, [customTheme, darkMode]);

  const sharedState = useMemo(
    () => ({
      isDark: darkMode,
      theme: currentTheme,
    }),
    [darkMode, currentTheme],
  );

  return <ThemeContext.Provider value={sharedState}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
