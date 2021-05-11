import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { charFromEmojiObject } from '../../utils/emojis';
import EmojiCell from './EmojiCell';
import styles from './styles';
const EmojiNotFound = ['🤔', '🕵️‍♀️', '🙈'];

const EmojiRow = (props) => {
  const { colSize, data, onEmojiSelected, darkMode = false, theme } = props;

  const getRandomEmoji = useMemo(() => {
    return EmojiNotFound[Math.floor(Math.random() * EmojiNotFound.length)];
  }, []);

  return data.length === 0 ? (
    <View style={styles.noEmojiContainer}>
      <Text style={styles.emojiWarn}>{getRandomEmoji}</Text>
      <Text style={[styles.warningText, darkMode && styles.warningTextDark]}>No Emoji Found</Text>
    </View>
  ) : (
    <View style={styles.emojiContainer}>
      {data.map((emoji, index) => (
        <EmojiCell
          key={index}
          onPress={() => onEmojiSelected(emoji)}
          colSize={colSize}
          emoji={charFromEmojiObject(emoji)}
          darkMode={darkMode}
          theme={theme}
        />
      ))}
    </View>
  );
};

EmojiRow.propTypes = {
  colSize: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  onEmojiSelected: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
  theme: PropTypes.object.isRequired,
};

export default React.memo(EmojiRow);
