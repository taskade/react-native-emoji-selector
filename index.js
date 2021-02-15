import AsyncStorage from '@react-native-async-storage/async-storage';
import emoji from "emoji-datasource";
import PropTypes from 'prop-types';
import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewPropTypes
} from "react-native";

import { EmojiCell, SearchBar, TabBar } from './src';

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

const charFromUtf16 = utf16 =>
  String.fromCodePoint(...utf16.split("-").map(u => "0x" + u));
export const charFromEmojiObject = obj => charFromUtf16(obj.unified);
const filteredEmojis = emoji.filter(e => !e["obsoleted_by"]);
const emojiByCategory = category =>
  filteredEmojis.filter(e => e.category === category);
const sortEmoji = list => list.sort((a, b) => a.sort_order - b.sort_order);
const categoryKeys = Object.keys(Categories);

const storage_key = "@react-native-emoji-selector:HISTORY";
export default class EmojiSelector extends Component {
  state = {
    searchQuery: "",
    category: Categories.people,
    isReady: false,
    history: [],
    emojiList: null,
    colSize: 0,
    width: 0,
  };

  //
  //  HANDLER METHODS
  //
  handleTabSelect = category => {
    if (this.state.isReady) {
      if (this.scrollview)
        this.scrollview.scrollToOffset({ x: 0, y: 0, animated: false });
      this.setState({
        searchQuery: "",
        category
      });
    }
  };

  handleEmojiSelect = emoji => {
    if (this.props.showHistory) {
      this.addToHistoryAsync(emoji);
    }
    this.props.onEmojiSelected(charFromEmojiObject(emoji));
  };

  handleSearch = searchQuery => {
    this.setState({ searchQuery });
  };

  addToHistoryAsync = async emoji => {
    let history = await AsyncStorage.getItem(storage_key);

    let value = [];
    if (!history) {
      // no history
      let record = Object.assign({}, emoji, { count: 1 });
      value.push(record);
    } else {
      let json = JSON.parse(history);
      if (json.filter(r => r.unified === emoji.unified).length > 0) {
        value = json;
      } else {
        let record = Object.assign({}, emoji, { count: 1 });
        value = [record, ...json];
      }
    }

    AsyncStorage.setItem(storage_key, JSON.stringify(value));
    this.setState({
      history: value
    });
  };

  loadHistoryAsync = async () => {
    let result = await AsyncStorage.getItem(storage_key);
    if (result) {
      let history = JSON.parse(result);
      this.setState({ history });
    }
  };

  //
  //  RENDER METHODS
  //
  renderEmojiCell = ({ item }) => {
    return (
      <EmojiCell
        key={item.key}
        emoji={charFromEmojiObject(item.emoji)}
        onPress={() => this.handleEmojiSelect(item.emoji)}
        colSize={this.state.colSize}
    />
    )
  }

  returnSectionData() {
    const { history, emojiList, searchQuery, category } = this.state;
    const emojiData = () => {
      if (category === Categories.all && searchQuery === '') {
        // TODO: OPTIMISE THIS
        let largeList = [];
        categoryKeys.forEach((cat) => {
          const name = Categories[cat].name;
          const list = (name === Categories.history.name) ? history : emojiList[name];
          if (cat !== 'all' && cat !== 'history') {
            largeList = largeList.concat(list)
          }
        })
        return largeList.map((emoji) => ({
          key: emoji.unified,
          emoji
        }));
      } else { 
        let list = [];
        const name = category.name;
        if (searchQuery !== '') {
          const filtered = emoji.filter((e) => {
            return e.short_names.some((name) => {
              return name.includes(searchQuery.toLowerCase());
            }); 
          });
          list = sortEmoji(filtered);
        }
        else if (name === Categories.history.name) { list = history; }
        else { list = emojiList[name] }

        return list.map((emoji) => ({
          key: emoji.unified,
          emoji
        }));
      }
    }

    return this.props.shouldInclude 
      ? emojiData().filter(e => this.props.shouldInclude(e.emoji)) 
      : emojiData();
  }

  prerenderEmojis(callback) {
    let emojiList = {};
    categoryKeys.forEach(c => {
      let name = Categories[c].name;
      emojiList[name] = sortEmoji(emojiByCategory(name));
    });

    this.setState(
      {
        emojiList,
        colSize: Math.floor(this.state.width / this.props.columns)
      },
      callback
    );
  }

  handleLayout = ({ nativeEvent: { layout } }) => {
    this.setState({ width: layout.width }, () => {
      this.prerenderEmojis(() => {
        this.setState({ isReady: true });
      });
    });
  };

  //
  //  LIFECYCLE METHODS
  //
  componentDidMount() {
    const { category, showHistory } = this.props;
    this.setState({ category });

    if (showHistory) {
      this.loadHistoryAsync();
    }
  }

  render() {
    const {
      theme,
      columns,
      placeholder,
      showSearchBar,
      showSectionTitles,
      showTabs,
      darkMode,
      pickerStyle,
      pickerFlatListStyle,
      contentContainerStyle,
      ...other
    } = this.props;

    const { category, colSize, isReady, searchQuery } = this.state;
    const title = searchQuery !== "" ? "Search Results" : category.name;

    return (
      <View style={[styles.frame, pickerStyle ]} {...other} onLayout={this.handleLayout}>
        <View style={{ flex : 1 }} onLayout={this.handleLayout}>
          <View style={styles.tabBar}>
            {showTabs && (
              <TabBar
                activeCategory={category}
                darkMode={darkMode}
                onPress={this.handleTabSelect}
                theme={theme}
                width={this.state.width}
                categoryKeys={categoryKeys}
                categories={Categories}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            {showSearchBar && (
            <SearchBar
              darkMode={darkMode}
              placeholder={placeholder}
              theme={theme}
              searchQuery={searchQuery}
              handleSearch={this.handleSearch}
              />
            )}
            {isReady ? (
              <View style={{ flex: 1 }}>
                {showSectionTitles && (
                  <Text style={styles.sectionHeader}>{title}</Text>
                )}
                <FlatList
                  style={[{ flex: 1 }, pickerFlatListStyle]}
                  contentContainerStyle={[{ paddingBottom: colSize }, contentContainerStyle]}
                  data={this.returnSectionData()}
                  renderItem={this.renderEmojiCell}
                  horizontal={false}
                  numColumns={columns}
                  keyboardShouldPersistTaps={"always"}
                  ref={scrollview => (this.scrollview = scrollview)}
                  removeClippedSubviews
                />
              </View> 
            ) : (
              <View style={styles.loader} {...other}>
                <ActivityIndicator
                  size={"large"}
                  color={theme}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

EmojiSelector.defaultProps = {
  theme: '#007AFF',
  category: Categories.all,
  showTabs: true,
  showSearchBar: true,
  showHistory: false,
  showSectionTitles: true,
  darkMode: false,
  columns: 6,
  placeholder: "Search...",
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
  onEmojiSelected: PropTypes.func,
  theme: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  darkMode: PropTypes.bool,
  contentContainerStyle: ViewPropTypes.style,
  pickerStyle: ViewPropTypes.style,
  pickerFlatListStyle: ViewPropTypes.style,
};

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
  tabBar: {
    flexDirection: "row"
  },
  sectionHeader: {
    margin: 8,
    fontSize: 17,
    width: "100%",
    color: "#8F8F8F"
  }
});
