import emoji from 'emoji-datasource';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';

import { Loading, Picker, SearchBar, TabBar } from './src/components';
import { DARK_THEME, LIGHT_THEME, ThemeWrapper } from './src/context/ThemeContext';
import {
  CATEGORIES,
  CATEGORIES_KEYS,
  charFromEmojiObject,
  getEmojisByCategory,
  sliceEmojiToRows,
  sortEmoji,
} from './src/utils/emojis';
import { getFrequentEmojis, setFrequentEmojis } from './src/utils/frequentEmojis';

const EmojiSelector = (props) => {
  const {
    theme = {},
    columns = 6,
    placeholder = 'Search',
    darkMode = false,
    showTabs = true,
    showSearchBar = true,
    showHistory = true,
    shouldInclude = undefined,
    // showSectionTitles = true,
    onEmojiSelected = () => {},
    contentContainerStyle = undefined,
    pickerStyle = undefined,
    pickerFlatListStyle = undefined,
    ...others
  } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmojiPrerender, setEmojiPrerender] = useState(false);
  const [isComponentReady, setComponentReady] = useState(false);
  const [tabIndex, setTabIndex] = useState({});
  const [emojiData, setEmojiData] = useState({});
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES.history);
  const [width, onLayout] = useComponentWidth();
  const scrollView = useRef(null);
  const currentTheme = useMemo(() => {
    const defaultTheme = darkMode ? DARK_THEME : LIGHT_THEME;
    return { ...defaultTheme, ...theme };
  }, [darkMode, theme]);

  const isSearching = useMemo(() => searchQuery !== '', [searchQuery]);
  const availableCategoryKeys = useMemo(() => {
    return CATEGORIES_KEYS.filter((key) => {
      if (key === 'history' && !showHistory) {
        return false;
      }
      return true;
    });
  }, [showHistory]);

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
        const newHistory = await getFrequentEmojis();
        const name = CATEGORIES['history'].name;
        emojiList.push({ data: name, index: index, sectionIndex, isHeader: true });
        stickyIndex.push(index);
        stickyToIndex['history'] = index;
        index++;

        sliceEmojiToRows(newHistory, columns).map((emojiRow) => {
          emojiList.push({
            data: emojiRow,
            index: index,
            sectionIndex,
            isHeader: false,
          });
          index++;
        });
        sectionIndex++;
      }

      for (const key of CATEGORIES_KEYS) {
        if (key !== 'history') {
          const name = CATEGORIES[key].name;
          const emojiSort = sortEmoji(getEmojisByCategory(name));
          const emojiIncluded = shouldInclude
            ? emojiSort.filter((e) => shouldInclude(e))
            : emojiSort;

          emojiList.push({ data: name, index: index, sectionIndex, isHeader: true });
          stickyIndex.push(index);
          stickyToIndex[key] = index;
          index++;

          sliceEmojiToRows(emojiIncluded, columns).map((emojiRow) => {
            emojiList.push({
              data: emojiRow,
              index: index,
              sectionIndex,
              isHeader: false,
            });
            index++;
          });
          sectionIndex++;
        }
      }
      setEmojiData({ data: emojiList, stickyIndex: stickyIndex });
      setTabIndex(stickyToIndex);
      setEmojiPrerender(true);
    };

    prerenderEmojis();
  }, [showHistory, shouldInclude, columns]);

  const handleEmojiSelect = useCallback(
    (selectedEmoji) => {
      if (showHistory) {
        setFrequentEmojis(selectedEmoji);
      }
      onEmojiSelected(charFromEmojiObject(selectedEmoji));
    },
    [onEmojiSelected, showHistory],
  );

  const handleTabSelect = useCallback(
    (cat) => {
      if (isEmojiPrerender && showTabs) {
        setCurrentCategory(CATEGORIES[cat]);
        scrollView.current.scrollToIndex({
          animated: true,
          index: tabIndex[cat],
        });
      }
    },
    [isEmojiPrerender, showTabs, tabIndex],
  );

  const handleViewableEmoji = useCallback(
    (index) => {
      const currentRow = emojiData.data[index];
      const currentCategoryKey = availableCategoryKeys[currentRow.sectionIndex];
      setCurrentCategory(CATEGORIES[currentCategoryKey]);
    },
    [availableCategoryKeys, emojiData],
  );

  const handleSearch = useCallback(
    (text) => {
      setSearchQuery(text);
    },
    [setSearchQuery],
  );

  return (
    <ThemeWrapper darkMode={darkMode} customTheme={theme}>
      <View style={[styles.frame, { backgroundColor: currentTheme.background }, pickerStyle]}>
        <View style={{ flex: 1 }} onLayout={onLayout}>
          {/* <View style={{ flex: 1 }}> */}
          {showSearchBar && (
            <SearchBar
              placeholder={placeholder}
              searchQuery={searchQuery}
              handleSearch={handleSearch}
            />
          )}

          {showTabs && isComponentReady && (
            <TabBar
              activeCategory={currentCategory}
              width={width}
              categoryKeys={availableCategoryKeys}
              reference={scrollView}
              onPress={handleTabSelect}
              onPressIn={handleSearch}
            />
          )}

          {!(isEmojiPrerender && isComponentReady) ? (
            <Loading {...others} />
          ) : (
            <Picker
              pickerFlatListStyle={pickerFlatListStyle}
              contentContainerStyle={contentContainerStyle}
              onEmojiSelected={handleEmojiSelect}
              onViewableItemsChanged={handleViewableEmoji}
              colSize={colSize}
              columns={columns}
              data={isSearching ? searchResults : emojiData}
              ref={scrollView}
              {...others}
            />
          )}
        </View>
        {/* </View> */}
      </View>
    </ThemeWrapper>
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

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
  },
  sectionHeader: {
    margin: 8,
    fontSize: 17,
    width: '100%',
    color: '#8F8F8F',
  },
});

export default EmojiSelector;
