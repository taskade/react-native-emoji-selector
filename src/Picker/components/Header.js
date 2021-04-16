import PropsTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '../../themes';
import styles from './styles';

const Header = (props) => {
  const { children, theme = undefined, darkMode } = props;
  const defaultTheme = darkMode ? DARK_THEME : LIGHT_THEME;
  const label = theme.label || defaultTheme.label;
  const background = theme.background ? theme.background : defaultTheme.background;

  return (
    <View style={[styles.headerContainer, { backgroundColor: background }]}>
      <Text style={[styles.headerText, { color: label }]}>{children}</Text>
    </View>
  );
};

Header.propTypes = {
  children: PropsTypes.node,
  darkMode: PropsTypes.bool,
  theme: PropsTypes.object,
};

export default Header;
