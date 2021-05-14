import emoji, { EmojiProps } from 'emoji-datasource';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleProp, View, ViewStyle } from 'react-native';

import { Loading, Picker, SearchBar, TabBar } from './src/components';
import { DARK_THEME, LIGHT_THEME, ThemeProps, ThemeWrapper } from './src/context/ThemeContext';
import {
  CATEGORIES,
  CATEGORIES_KEYS,
  CategoryTypeProps,
  charFromEmojiObject,
  getEmojisByCategory,
  sliceEmojiToRows,
  sortEmoji,
} from './src/utils/emojis';
import { getFrequentEmojis, setFrequentEmojis } from './src/utils/frequentEmojis';
import useComponentWidth from './src/utils/useComponentWidth';
import styles from './styles';

interface Props {
  columns?: number;
  placeholder?: string;
  darkMode?: boolean;
  showTabs?: boolean;
  showSectionTitles?: boolean;
  showSearchBar?: boolean;
  showHistory?: boolean;
  theme?: ThemeProps;
  pickerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<FlatList>;
  pickerFlatListStyle?: StyleProp<FlatList>;
  shouldInclude?: (emojiObj: EmojiProps) => boolean;
  onEmojiSelected: (emojiString: string) => void;
}

interface EmojiDataProps {
  data: {
    data: EmojiProps[] | string;
    index: number;
    sectionIndex: number;
    isHeader: boolean;
  }[];
  stickyIndex: number[];
}

const EmojiSelector: React.FC<Props> = (props) => {
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
  const [tabIndex, setTabIndex] = useState<{ [key: string]: number }>({});
  const [emojiData, setEmojiData] = useState<EmojiDataProps>();
  const [currentCategory, setCurrentCategory] = useState<CategoryTypeProps>(CATEGORIES.history);
  const [width, onLayout] = useComponentWidth();
  const scrollView = useRef<FlatList>(null);

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

  const searchResults: EmojiDataProps | undefined = useMemo(() => {
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
      const stickyToIndex: { [key: string]: number } = {};
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
    (cat: string) => {
      if (isEmojiPrerender && showTabs) {
        setCurrentCategory(CATEGORIES[cat]);
        scrollView.current?.scrollToIndex({
          animated: true,
          index: tabIndex[cat],
        });
      }
    },
    [isEmojiPrerender, showTabs, tabIndex],
  );

  const handleViewableEmoji = useCallback(
    (index) => {
      const currentRow = emojiData?.data[index];
      if (currentRow) {
        const currentCategoryKey = availableCategoryKeys[currentRow.sectionIndex];
        setCurrentCategory(CATEGORIES[currentCategoryKey]);
      }
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
              // ref={scrollView}
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

export default EmojiSelector;
