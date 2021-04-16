import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import { charFromEmojiObject } from '../../helpers';
import EmojiCell from './EmojiCell';
import styles from './styles';

const EmojiNotFound = ['🤔', '🕵️‍♀️', '🙈'];

const EmojiSection = (props) => {
  const { colSize, data, onEmojiSelected, darkMode = false, theme, columns } = props;

  const renderItem = useCallback(
    ({ item: emoji, index }) => (
      <EmojiCell
        key={index}
        onPress={() => onEmojiSelected(emoji)}
        colSize={colSize}
        emoji={charFromEmojiObject(emoji)}
        darkMode={darkMode}
        theme={theme}
      />
    ),
    [colSize, darkMode, theme, onEmojiSelected],
  );

  const getRandomEmoji = useMemo(() => {
    return EmojiNotFound[Math.floor(Math.random() * EmojiNotFound.length)];
  }, []);

  const extractKey = useCallback((item, index) => index, []);

  return data.length === 0 ? (
    <View style={styles.noEmojiContainer}>
      <Text style={styles.emojiWarn}>{getRandomEmoji}</Text>
      <Text style={[styles.warningText, darkMode && styles.warningTextDark]}>No Emoji Found</Text>
    </View>
  ) : (
    <FlatList
      horizontal={false}
      contentContainerStyle={styles.emojiContainer}
      keyExtractor={extractKey}
      renderItem={renderItem}
      data={data}
      numColumns={columns}
      removeClippedSubviews={true}
    />
  );
};

EmojiSection.propTypes = {
  colSize: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  onEmojiSelected: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
  theme: PropTypes.object.isRequired,
};

export default EmojiSection;
