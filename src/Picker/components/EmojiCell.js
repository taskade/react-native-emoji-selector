import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '../../themes';

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
      style={[styles.touchable, { width: colSize, height: colSize }]}
      {...other}
    >
      <Text allowFontScaling={false} style={{ color: '#FFFFFF', fontSize: colSize - 30 }}>
        {emoji}
      </Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});

EmojiCell.propTypes = {
  emoji: PropTypes.string.isRequired,
  colSize: PropTypes.number,
  onPress: PropTypes.func,
  darkMode: PropTypes.bool,
  theme: PropTypes.object,
};

export default EmojiCell;
