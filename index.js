import AsyncStorage from '@react-native-async-storage/async-storage';
import emoji from 'emoji-datasource';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, ViewPropTypes } from 'react-native';

import { Picker, SearchBar, TabBar } from './src';
import { charFromEmojiObject } from './src/helpers';
import { DARK_THEME, LIGHT_THEME } from './src/themes.js';

export const Categories = {
  history: {
    symbol: '🕘',
    name: 'Recently Used',
  },
  emotion: {
    symbol: '😀',
    name: 'Smileys & Emotion',
  },
  people: {
    symbol: '🧑',
    name: 'People & Body',
  },
  nature: {
    symbol: '🦄',
    name: 'Animals & Nature',
  },
  food: {
    symbol: '🍔',
    name: 'Food & Drink',
  },
  activities: {
    symbol: '⚾️',
    name: 'Activities',
  },
  places: {
    symbol: '✈️',
    name: 'Travel & Places',
  },
  objects: {
    symbol: '💡',
    name: 'Objects',
  },
  symbols: {
    symbol: '🔣',
    name: 'Symbols',
  },
  flags: {
    symbol: '🏳️‍🌈',
    name: 'Flags',
  },
};

const filteredEmojis = emoji.filter((e) => !e['obsoleted_by']);
const emojiByCategory = (category) => filteredEmojis.filter((e) => e.category === category);
const sortEmoji = (list) => list.sort((a, b) => a.sort_order - b.sort_order);
const categoryKeys = Object.keys(Categories);
const storage_key = '@react-native-emoji-selector:HISTORY';
const sliceEmojiToRows = (array, size) => {
  let slicedArray = [];
  for (let i = 0; i < array.length; i += size) {
    slicedArray.push(array.slice(i, i + size));
  }
  return slicedArray;
};

const EmojiSelector = (props) => {
  const {
    theme = {},
    columns = 6,
    category = Categories.all,
    placeholder = 'Search',
    darkMode = false,
    showTabs = true,
    showSearchBar = true,
    showHistory = true,
    shouldInclude = undefined,
    showSectionTitles = true,
    onEmojiSelected,
    contentContainerStyle = undefined,
    pickerStyle = undefined,
    pickerFlatListStyle = undefined,
    ...others
  } = props;
  const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState(undefined);
  const [isEmojiPrerender, setEmojiPrerender] = useState(false);
  const [isComponentReady, setComponentReady] = useState(false);
  const [history, setHistory] = useState([]);
  const [tabIndex, setTabIndex] = useState({});
  const [emojiData, setEmojiData] = useState({});
  const [currentCategory, setCurrentCategory] = useState(Categories.history);
  const [width, onLayout] = useComponentWidth();
  const defaultTheme = darkMode ? DARK_THEME : LIGHT_THEME;
  const scrollView = useRef(null);
  const primaryColor = useMemo(() => theme.primary || defaultTheme.primary, [theme, defaultTheme]);
  const backgroundColor = useMemo(() => theme.background || defaultTheme.background, [
    theme,
    defaultTheme,
  ]);
  const isSearching = useMemo(() => searchQuery !== '', [searchQuery]);

  const colSize = useMemo(() => {
    setComponentReady(width !== 0);
    if (width === 0) {
      return 0;
    }
    return Math.floor(width / columns);
  }, [width, columns]);

  const searchResults = useMemo(() => {
    if (searchQuery === '') {
      return undefined;
    }
    const data = [];
    let index = 0;
    data.push({ data: 'Search Results', sectionIndex: 0, index: 0, isHeader: true });
    index++;

    const emojiList = sortEmoji(
      emoji.filter((e) => {
        return e.short_names.some((name) => {
          return name.includes(searchQuery.toLowerCase());
        });
      }),
    );

    if (emojiList.length === 0) {
      data.push({ data: [], index: index, sectionIndex: 0, isHeader: false });
    } else {
      sliceEmojiToRows(emojiList, columns).map((emojiRow) => {
        data.push({
          data: emojiRow,
          index: index,
          sectionIndex: 0,
          isHeader: false,
        });
        index++;
      });
    }
    return {
      data,
      stickyIndex: [0],
    };
  }, [searchQuery, columns]);

  useEffect(() => {
    const prerenderEmojis = async () => {
      const emojiList = [];
      const stickyIndex = [];
      const stickyToIndex = {};
      let index = 0;
      let sectionIndex = 0;

      if (showHistory) {
        const newHistory = await _loadHistoryAsync();
        setHistory(newHistory);

        const name = Categories['history'].name;
        emojiList.push({ data: name, index: index, sectionIndex, isHeader: true });
        stickyIndex.push(index);
        stickyToIndex['history'] = index;
        index++;
        sectionIndex++;

        sliceEmojiToRows(newHistory, columns).map((emojiRow) => {
          emojiList.push({
            data: emojiRow,
            index: index,
            sectionIndex,
            isHeader: false,
          });
          index++;
        });
      }

      for (const key of categoryKeys) {
        if (key !== 'history') {
          const name = Categories[key].name;
          const emojiSort = sortEmoji(emojiByCategory(name));
          const emojiIncluded = shouldInclude
            ? emojiSort.filter((e) => shouldInclude(e))
            : emojiSort;

          emojiList.push({ data: name, index: index, sectionIndex, isHeader: true });
          stickyIndex.push(index);
          stickyToIndex[key] = index;
          index++;
          sectionIndex++;

          sliceEmojiToRows(emojiIncluded, columns).map((emojiRow) => {
            emojiList.push({
              data: emojiRow,
              index: index,
              sectionIndex,
              isHeader: false,
            });
            index++;
          });
        }
      }
      setEmojiData({ data: emojiList, stickyIndex: stickyIndex });
      setTabIndex(stickyToIndex);
      setEmojiPrerender(true);
    };

    prerenderEmojis();
  }, [showHistory, shouldInclude, columns]);

  const _loadHistoryAsync = async () => {
    const result = await AsyncStorage.getItem(storage_key);
    if (result) {
      return JSON.parse(result);
    }
    return [];
  };

  const _handleEmojiSelect = useCallback(
    (selectedEmoji) => {
      onEmojiSelected(charFromEmojiObject(selectedEmoji));
    },
    [onEmojiSelected],
  );

  const _handleTabSelect = useCallback(
    (cat) => {
      if (isEmojiPrerender && showTabs) {
        setCurrentCategory(Categories[cat]);
        scrollView.current.scrollToIndex({
          animated: true,
          index: tabIndex[cat],
        });
      }
    },
    [isEmojiPrerender, showTabs, tabIndex],
  );

  const _handleViewableEmoji = useCallback(
    (index) => {
      // only update at the emoji header
      var currentIndex = index;
      if (currentIndex % 2 !== 0) {
        currentIndex = index - 1;
      }

      const emojiList = emojiData.data.find((key) => key.index === currentIndex);
      categoryKeys.forEach((key) => {
        if (Categories[key].name === emojiList.data) {
          setCurrentCategory(Categories[key]);
        }
      });
    },
    [emojiData],
  );

  const _handleSearch = useCallback(
    (text) => {
      setSearchQuery(text);
    },
    [setSearchQuery],
  );

  return (
    <View style={[styles.frame, { backgroundColor: backgroundColor }, pickerStyle]}>
      <View style={{ flex: 1 }} onLayout={onLayout}>
        <View style={{ flex: 1 }}>
          {showSearchBar && (
            <SearchBar
              darkMode={darkMode}
              placeholder={placeholder}
              theme={primaryColor}
              searchQuery={searchQuery}
              handleSearch={_handleSearch}
            />
          )}

          {showTabs && (
            <TabBar
              activeCategory={currentCategory}
              darkMode={darkMode}
              theme={primaryColor}
              width={width}
              categoryKeys={categoryKeys}
              categories={Categories}
              reference={scrollView}
              showHistory={showHistory}
              onPress={_handleTabSelect}
              onPressIn={_handleSearch}
            />
          )}

          {!(isEmojiPrerender && isComponentReady) ? (
            <Loading theme={primaryColor} {...others} />
          ) : (
            <Picker
              pickerFlatListStyle={pickerFlatListStyle}
              contentContainerStyle={contentContainerStyle}
              onEmojiSelected={_handleEmojiSelect}
              onViewableItemsChanged={_handleViewableEmoji}
              colSize={colSize}
              columns={columns}
              data={isSearching ? searchResults : emojiData}
              ref={scrollView}
              darkMode={darkMode}
              theme={theme}
              {...others}
            />
          )}
        </View>
      </View>
    </View>
  );
};

// Loading spinner as emoji is being loaded
const Loading = (props) => {
  const { theme, ...others } = props;
  return (
    <View style={styles.loader} {...others}>
      <ActivityIndicator size={'large'} color={theme} />
    </View>
  );
};

// Get width of container to calculate sizing of tabs
const useComponentWidth = () => {
  const [width, setWidth] = useState(0);
  const onLayout = useCallback((event) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);
  return [width, onLayout];
};

EmojiSelector.propTypes = {
  category: PropTypes.object,
  columns: PropTypes.number,
  placeholder: PropTypes.string,
  showTabs: PropTypes.bool,
  showSearchBar: PropTypes.bool,
  showHistory: PropTypes.bool,
  showSectionTitles: PropTypes.bool,
  shouldInclude: PropTypes.func,
  onEmojiSelected: PropTypes.func.isRequired,
  theme: PropTypes.object,
  darkMode: PropTypes.bool,
  contentContainerStyle: ViewPropTypes.style,
  pickerStyle: ViewPropTypes.style,
  pickerFlatListStyle: ViewPropTypes.style,
};

Loading.propTypes = {
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    margin: 8,
    fontSize: 17,
    width: '100%',
    color: '#8F8F8F',
  },
});

export default EmojiSelector;
