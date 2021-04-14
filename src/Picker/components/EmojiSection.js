import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, ViewPropTypes } from 'react-native';

import { charFromEmojiObject } from '../../helpers';
import EmojiCell from './EmojiCell';

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

  const extractKey = useCallback((item, index) => index, []);

  return (
    <FlatList
      horizontal={false}
      contentContainerStyle={styles.emojiContainer}
      keyExtractor={extractKey}
      renderItem={renderItem}
      data={data}
      numColumns={columns}
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

const styles = StyleSheet.create({
  emojiContainer: {
    flex: 1,
  },
});

export default EmojiSection;
