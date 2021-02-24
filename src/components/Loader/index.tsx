import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useThemeContext } from '../../context/ThemeContext';
import styles from './styles';

// Loading spinner as emoji is being loaded
const Loading: React.FC = (props) => {
  const { ...others } = props;
  const { theme } = useThemeContext();
  return (
    <View style={styles.loader} {...others}>
      <ActivityIndicator size={'large'} color={theme.primary} />
    </View>
  );
};

export default Loading;
