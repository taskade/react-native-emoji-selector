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

const EmojiSelector = (props) => {
  const {
    columns,
    darkMode,
    placeholder,
    showTabs,
    showSearchBar,
    showHistory,
    shouldInclude,
    onEmojiSelected,
    theme,
    contentContainerStyle,
    pickerStyle,
    pickerFlatListStyle,
    showSectionTitles,
    category,
    ...others
  } = props;
  const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState(undefined);
  const [isEmojiPrerender, setEmojiPrerender] = useState(false);
  const [isComponentReady, setComponentReady] = useState(false);
  const [history, setHistory] = useState([]);
  const [emojiData, setEmojiData] = useState({});
  const [currentCategory, setCurrentCategory] = useState(Categories.history);
  const [width, onLayout] = useComponentWidth();
  const defaultTheme = darkMode ? DARK_THEME : LIGHT_THEME;
  const scrollView = useRef(null);

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
    const emojiList = sortEmoji(
      emoji.filter((e) => {
        return e.short_names.some((name) => {
          return name.includes(searchQuery.toLowerCase());
        });
      }),
    );

    return {
      data: [
        { data: 'Search Results', index: 0, isHeader: true },
        { data: emojiList, index: 1, isHeader: false },
      ],
      stickyIndex: [0],
    };
  }, [searchQuery]);

  useEffect(() => {
    const prerenderEmojis = async () => {
      const emojiList = [];
      const stickyIndex = [];
      let index = 0;

      if (showHistory) {
        const newHistory = await _loadHistoryAsync();
        const name = Categories['history'].name;
        setHistory(newHistory);
        emojiList.push({ data: name, index: index, isHeader: true });
        emojiList.push({ data: newHistory, index: index + 1, isHeader: false });
        index += 2;
      }

      for (const key of categoryKeys) {
        const name = Categories[key].name;

        if (key !== 'history') {
          const emojiSort = sortEmoji(emojiByCategory(name));
          emojiList.push({ data: name, index: index, isHeader: true });
          emojiList.push({
            data: shouldInclude ? emojiSort.filter((e) => shouldInclude(e)) : emojiSort,
            index: index + 1,
            isHeader: false,
          });
          stickyIndex.push(index);
          index += 2;
        }
      }
      setEmojiData({ data: emojiList, stickyIndex: stickyIndex });
      setEmojiPrerender(true);
    };

    prerenderEmojis();
  }, []);

  const _loadHistoryAsync = async () => {
    const result = await AsyncStorage.getItem(storage_key);
    if (result) {
      return JSON.parse(result);
    }
    return [];
  };

  const _handleEmojiSelect = (selectedEmoji) => {
    onEmojiSelected(charFromEmojiObject(selectedEmoji));
  };

  const _handleTabSelect = (category) => {
    if (isEmojiPrerender && showTabs) {
      const index = categoryKeys.findIndex((key) => key === category);
      setCurrentCategory(Categories[category]);
      scrollView.current.scrollToIndex({
        animated: true,
        index: index * 2,
      });
    }
  };

  const _handleViewableEmoji = (index) => {
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
  };

  const _handleSearch = (text) => {
    setSearchQuery(text);
  };

  const primaryColor = theme.primary ? theme.primary : defaultTheme.primary;
  const backgroundColor = theme.background ? theme.background : defaultTheme.background;

  return (
    <View style={[styles.frame, { backgroundColor: backgroundColor }, pickerStyle]}>
      <View style={{ flex: 1 }} onLayout={onLayout}>
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
              data={searchResults ? searchResults : emojiData}
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

// Loading spinner as we load emoji
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

EmojiSelector.defaultProps = {
  theme: {},
  category: Categories.all,
  showTabs: true,
  showSearchBar: true,
  showHistory: false,
  showSectionTitles: true,
  darkMode: false,
  columns: 6,
  placeholder: 'Search',
  contentContainerStyle: undefined,
  pickerStyle: undefined,
  pickerFlatListStyle: undefined,
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
