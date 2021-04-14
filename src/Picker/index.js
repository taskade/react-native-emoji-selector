import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, ViewPropTypes } from 'react-native';

import { EmojiSection, Header } from './components';

const Picker = React.forwardRef((props, ref) => {
  const {
    pickerFlatListStyle,
    contentContainerStyle,
    onEmojiSelected,
    colSize,
    columns = 6,
    data,
    darkMode = false,
    theme = {},
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
        <EmojiSection
          colSize={colSize}
          columns={columns}
          data={content}
          darkMode={darkMode}
          onEmojiSelected={onEmojiSelected}
          theme={theme}
        />
      );
    },
    [theme, darkMode, colSize, columns, onEmojiSelected],
  );

  return (
    <FlatList
      ref={ref}
      style={[{ flex: 1 }, pickerFlatListStyle]}
      contentContainerStyle={[{ paddingBottom: colSize }, contentContainerStyle]}
      horizontal={false}
      keyboardShouldPersistTaps={'never'}
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
});

export default Picker;
