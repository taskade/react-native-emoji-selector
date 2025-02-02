import React from 'react';
import { Text, View } from 'react-native';

import { useThemeContext } from '../../../context/ThemeContext';
import styles from './styles';

const Header: React.FC = (props) => {
  const { children } = props;
  const { theme } = useThemeContext();

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
      <Text allowFontScaling={false} style={[styles.headerText, { color: theme.label }]}>
        {children}
      </Text>
    </View>
  );
};

export default React.memo(Header);
