import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ViewPropTypes } from 'react-native';

import { EmojiRow, Header } from './components';

const Picker = React.forwardRef((props, ref) => {
  const {
    pickerFlatListStyle,
    contentContainerStyle,
    onEmojiSelected,
    colSize,
    columns = 6,
    data,
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

  const extractKey = useCallback((item, index) => {
    return `${item.index}_${index}`;
  }, []);

  const renderItem = useCallback(
    ({ item: { data: content, isHeader } }) =>
      isHeader ? (
        <Header>{content}</Header>
      ) : (
        <EmojiRow
          colSize={colSize}
          columns={columns}
          data={content}
          onEmojiSelected={onEmojiSelected}
        />
      ),
    [colSize, columns, onEmojiSelected],
  );

  const getItemLayout = useCallback(
    (item, index) => {
      const HEADER_HEIGHT = 40;
      const ROW_HEIGHT = colSize;
      const row = item[index];
      const numOfSectionsBefore = row.isHeader ? row.sectionIndex : row.sectionIndex + 1;
      return {
        length: row.isHeader ? HEADER_HEIGHT : ROW_HEIGHT,
        offset: ROW_HEIGHT * (index - numOfSectionsBefore) + HEADER_HEIGHT * numOfSectionsBefore,
        index,
      };
    },
    [colSize],
  );

  const getOnScollFailed = () => {};

  return (
    <FlatList
      ref={ref}
      style={[{ flex: 1 }, pickerFlatListStyle]}
      contentContainerStyle={[{ paddingBottom: colSize }, contentContainerStyle]}
      horizontal={false}
      keyboardShouldPersistTaps={'handled'}
      keyExtractor={extractKey}
      data={emojiList}
      stickyHeaderIndices={stickyIndex}
      onViewableItemsChanged={handleItemsChange.current}
      viewabilityConfig={viewConfig.current}
      onScrollToIndexFailed={getOnScollFailed}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={20}
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
};

export default Picker;
