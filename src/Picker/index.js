import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ViewPropTypes } from 'react-native';

import { charFromEmojiObject } from '../helpers';
import { EmojiCell, Header } from './components';

const Picker = React.forwardRef((props, ref) => {
  const {
    pickerFlatListStyle,
    contentContainerStyle,
    onEmojiSelected,
    colSize,
    data,
    darkMode,
    theme,
    onViewableItemsChanged,
    ...others
  } = props;
  const { data: emojiList, stickyIndex } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewConfig = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  const handleItemsChange = React.useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  useEffect(() => {
    onViewableItemsChanged(currentIndex);
  }, [currentIndex, onViewableItemsChanged]);

  const _extractKey = useCallback((item, index) => {
    return `${item.index}_${index}`;
  }, []);

  const _renderItem = useCallback(
    ({ item: { data: content, isHeader } }) => {
      return isHeader ? (
        <Header theme={theme} style={styles.sectionHeader} darkMode={darkMode}>
          {content}
        </Header>
      ) : (
        <View style={styles.emojiContainer}>
          {content.map((emoji, i) => (
            <EmojiCell
              key={i}
              onPress={() => onEmojiSelected(emoji)}
              colSize={colSize}
              emoji={charFromEmojiObject(emoji)}
            />
          ))}
        </View>
      );
    },
    [theme, darkMode, colSize, onEmojiSelected],
  );

  return (
    <FlatList
      ref={ref}
      style={[{ flex: 1 }, pickerFlatListStyle]}
      contentContainerStyle={[{ paddingBottom: colSize }, contentContainerStyle]}
      horizontal={false}
      keyboardShouldPersistTaps={'always'}
      keyExtractor={_extractKey}
      data={emojiList}
      stickyHeaderIndices={stickyIndex}
      onViewableItemsChanged={handleItemsChange.current}
      viewabilityConfig={viewConfig.current}
      onScrollToIndexFailed={() => {}}
      removeClippedSubviews
      renderItem={_renderItem}
      {...others}
    />
  );
});

Picker.propTypes = {
  pickerFlatListStyle: ViewPropTypes.style,
  contentContainerStyle: ViewPropTypes.style,
  columns: PropTypes.number,
  numColumns: PropTypes.number,
  colSize: PropTypes.number,
  data: PropTypes.object,
  onEmojiSelected: PropTypes.func.isRequired,
  onViewableItemsChanged: PropTypes.func,
  darkMode: PropTypes.bool,
  theme: PropTypes.object,
};

const styles = StyleSheet.create({
  sectionHeader: {
    margin: 8,
    fontSize: 16,
    width: '100%',
    color: '#8F8F8F',
  },
  emojiContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default Picker;
