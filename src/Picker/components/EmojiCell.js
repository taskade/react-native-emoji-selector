import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Text, TouchableHighlight } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '../../themes';
import styles from './styles';

const EmojiCell = (props) => {
  const { emoji, colSize, onPress, darkMode = false, theme = {}, ...other } = props;
  const DEFAULT_THEME = useMemo(() => (darkMode ? DARK_THEME : LIGHT_THEME), [darkMode]);

  const underlayColor = useMemo(() => {
    return theme.underlay ? theme.underlay : DEFAULT_THEME.underlay;
  }, [theme, DEFAULT_THEME]);

  return (
    <TouchableHighlight
      activeOpacity={1}
      underlayColor={underlayColor}
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

EmojiCell.propTypes = {
  emoji: PropTypes.string.isRequired,
  colSize: PropTypes.number,
  onPress: PropTypes.func,
  darkMode: PropTypes.bool,
  theme: PropTypes.object,
};

export default React.memo(EmojiCell);
