import AsyncStorage from '@react-native-async-storage/async-storage';
import emoji from "emoji-datasource";
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ViewPropTypes
} from "react-native";

import { Picker, SearchBar, TabBar } from './src';
import { charFromEmojiObject } from './src/helpers';
import { DARK_THEME,LIGHT_THEME } from './src/themes.js';

export const Categories = {
  all: {
    symbol: null,
    name: "All"
  },
  history: {
    symbol: "🕘",
    name: "Recently used"
  },
  emotion: {
    symbol: "😀",
    name: "Smileys & Emotion"
  },
  people: {
    symbol: "🧑",
    name: "People & Body"
  },
  nature: {
    symbol: "🦄",
    name: "Animals & Nature"
  },
  food: {
    symbol: "🍔",
    name: "Food & Drink"
  },
  activities: {
    symbol: "⚾️",
    name: "Activities"
  },
  places: {
    symbol: "✈️",
    name: "Travel & Places"
  },
  objects: {
    symbol: "💡",
    name: "Objects"
  },
  symbols: {
    symbol: "🔣",
    name: "Symbols"
  },
  flags: {
    symbol: "🏳️‍🌈",
    name: "Flags"
  }
};

const filteredEmojis = emoji.filter(e => !e["obsoleted_by"]);
const emojiByCategory = (category) => filteredEmojis.filter(e => e.category === category)
const sortEmoji = (list) => list.sort((a, b) => a.sort_order - b.sort_order);
const categoryKeys = Object.keys(Categories);
const storage_key = "@react-native-emoji-selector:HISTORY";

const EmojiSelector = (props) => {
  const { 
    category,
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
    ...others
  } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmojiPrerender, setEmojiPrerender] = useState(false);
  const [isComponentReady, setComponentReady] = useState(false);
  const [history, setHistory] = useState([]);
  const [emojiData, setEmojiData] = useState({});
  const [width, onLayout] = useComponentWidth();
  const defaultTheme = darkMode ? DARK_THEME : LIGHT_THEME;
  const colSize = useMemo(() => {
    setComponentReady(width !== 0);
    if (isComponentReady) {
      return 0;
    }
    return Math.floor(width/columns);
  }, [width, columns]);
  const scrollView = useRef(null);
  

  useEffect(() => {
    const prerenderEmojis = () => {
      const emojiList = [];
      const stickyIndex = []
      let index = 0;

      categoryKeys.forEach((category) => {
        const name = Categories[category].name;

        if (category !== 'all' && category !== 'history') {
          const emoji = sortEmoji(emojiByCategory(name));
          emojiList.push({data: name, index: index, isHeader: true});
          emojiList.push({
            data: shouldInclude ? emoji.filter((e) => shouldInclude(e)) : emoji,
            index: index + 1,
            isHeader: false,
          })
          stickyIndex.push(index)
          index += 2; 
        }
      })
      setEmojiData({data: emojiList, stickyIndex: stickyIndex});
    }

    const loadHistoryAsync = async () => {
      const result = await AsyncStorage.getItem(storage_key);
      if (result) {
        setHistory(JSON.parse(result))
      }
    }
    
    showHistory && loadHistoryAsync();
    prerenderEmojis();
    setEmojiPrerender(true);
  },[]);

  const handleEmojiSelect = (emoji) => {
    onEmojiSelected(charFromEmojiObject(emoji));
  }

  const primaryColor = theme.primary ? theme.primary : defaultTheme.primary;
  const backgroundColor = theme.background ? theme.background : defaultTheme.background;

  return (
    <View style={[styles.frame, {backgroundColor: backgroundColor}, pickerStyle]} {...others}>
      <View style={{ flex : 1 }} onLayout={onLayout}>
        <TabBar
          isShown={showTabs}
          activeCategory={category}
          darkMode={darkMode}
          theme={primaryColor}
          width={width}
          categoryKeys={categoryKeys}
          categories={Categories}
          // onPress={this.handleTabSelect}
        />

        <View style={{flex: 1}}>
          <SearchBar
            isShown={showSearchBar}
            darkMode={darkMode}
            placeholder={placeholder}
            theme={primaryColor}
            searchQuery={searchQuery}
            handleSearch={(query) => setSearchQuery(query)}
          />

          {!(isComponentReady && isEmojiPrerender)  ? (
            <Loading theme={primaryColor} {...others} />
          ) : (
            <Picker 
              pickerFlatListStyle={pickerFlatListStyle}
              contentContainerStyle={contentContainerStyle}
              onEmojiSelected={handleEmojiSelect}
              colSize={colSize}
              data={emojiData}
              ref={scrollView}
              darkMode={darkMode}
              theme={theme}
            />
          )}
        </View>
      </View>
    </View>
  );
};

// Loading spinner as we load emoji
const Loading = (props) => {
  const {theme, ...others} = props;
  return (
    <View style={styles.loader} {...others}>
      <ActivityIndicator
        size={"large"}
        color={theme}
      />
    </View>
  )
}

// Get width of container to calculate sizing of tabs
const useComponentWidth = () => {
  const [width, setWidth] = useState(0);
  const onLayout = useCallback((event) => {
    setWidth(event.nativeEvent.layout.width);
  });
  return [width, onLayout];
}

EmojiSelector.defaultProps = {
  theme: {},
  category: Categories.all,
  showTabs: true,
  showSearchBar: true,
  showHistory: false,
  showSectionTitles: true,
  darkMode: false,
  columns: 6,
  placeholder: "Search",
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
  theme: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: "100%"
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  sectionHeader: {
    margin: 8,
    fontSize: 17,
    width: "100%",
    color: "#8F8F8F"
  }
});

export default EmojiSelector;
