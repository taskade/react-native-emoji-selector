import { ColorValue } from 'react-native';

export interface ThemeProps {
  primary?: ColorValue;
  background?: ColorValue;
  label?: ColorValue;
  underlay?: ColorValue;
}

export const LIGHT_THEME = {
  primary: '#007AFF',
  background: '#FFFFFF',
  label: '#8F8F8F',
  underlay: '#F0F0F0',
};

export const DARK_THEME = {
  primary: '#0A84FF',
  background: '#333333',
  label: '#8F8F8F',
  underlay: '#424242',
};
