import { EmojiProps } from 'emoji-datasource';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ViewStyle, ViewToken } from 'react-native';

import { EmojiRow, Header } from './components';

interface Props {
  pickerFlatListStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  columns?: number;
  numColumns: number;
  colSize: number;
  data: {
    data: {
      data: EmojiProps[] | string;
      index: number;
      sectionIndex: number;
      isHeader: boolean;
    }[];
    stickyIndex: number[];
  };
  onEmojiSelected: (selectedEmoji: EmojiProps) => void;
  onViewableItemsChanged: (index: number) => void;
}

interface ViewableItemChangedProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const Picker: React.FC<Props> = React.forwardRef<FlatList, Props>((props, ref) => {
  const {
    pickerFlatListStyle = {},
    contentContainerStyle = {},
    colSize,
    columns = 6,
    data,
    onEmojiSelected,
    onViewableItemsChanged,
    ...others
  } = props;
  const { data: emojiList, stickyIndex } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewConfig = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  const handleItemsChange = React.useRef(({ viewableItems }: ViewableItemChangedProps) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0]?.index || 0);
    }
  });

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

  const getOnScollFailed = useCallback(() => {}, []);

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

export default Picker;
