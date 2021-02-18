import PropsTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '../../themes';

const Header = (props) => {
  const { children, theme, darkMode }  = props; 
  const defaultTheme = darkMode ? DARK_THEME : LIGHT_THEME;
  const label = theme.label ? theme.label : defaultTheme.label;
  const background = theme.background ? theme.background : defaultTheme.background;

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <Text style={[styles.headerText, {color: label}]}>
        {children}
      </Text>
    </View>
  )
}

Header.propTypes = {
  children: PropsTypes.node,
  darkMode: PropsTypes.bool,
  theme: PropsTypes.object,
}

const styles = StyleSheet.create({
  headerText: {
    margin: 8,
    fontSize: 16,
    width: "100%",
  },
  container: {
    paddingVertical: 4,
  }
})

export default Header;
