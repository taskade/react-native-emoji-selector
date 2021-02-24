import React from 'react';
import { Text, TouchableHighlight } from 'react-native';

import { useThemeContext } from '../../../context/ThemeContext';
import styles from './styles';

interface Props {
  emoji: string;
  colSize: number;
  onPress: () => void;
}

const EmojiCell: React.FC<Props> = (props) => {
  const { emoji, colSize, onPress, ...other } = props;
  const { theme } = useThemeContext();

  return (
    <TouchableHighlight
      activeOpacity={1}
      underlayColor={theme.underlay}
      onPress={onPress}
      style={[styles.emojiCell, { width: colSize, height: colSize }]}
      {...other}
    >
      <Text allowFontScaling={false} style={{ color: '#FFFFFF', fontSize: colSize - 30 }}>
        {emoji}
      </Text>
    </TouchableHighlight>
  );
};

export default React.memo(EmojiCell);
