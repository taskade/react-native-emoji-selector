import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet,Text, TouchableOpacity, View} from 'react-native';


const TabBar = (props) => {
  const {
    theme,
    activeCategory,
    onPress,
    width,
    darkMode,
    categoryKeys,
    categories,
    showHistory,
  } = props;
  const tabSize = width / categoryKeys.length;

  const Tabs = categoryKeys.map(c => {
    const category = categories[c];
    if (c === 'history' && !showHistory) {
      return undefined;
    }
    return (
      <TouchableOpacity
        key={category.name}
        onPress={() => onPress(c)}
        style={{
          flex: 1,
          height: tabSize,
          borderColor: category === activeCategory 
          ? theme 
          : darkMode ? "#8E8E93" : '#E5E5EA',
          borderBottomWidth: 2,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            textAlign: "center",
            paddingBottom: 8,
            fontSize: tabSize - 24
          }}
        >
            {category.symbol}
        </Text>
      </TouchableOpacity>      
    );
  });

  return (
    <View style={styles.tabBar}>
      {Tabs}
    </View>
  )
};

TabBar.defaultProps = {
  isShown: true,
  onPress: () => {},
}

TabBar.propTypes = {
  showHistory: PropTypes.bool,
  activeCategory: PropTypes.shape({
    "symbol": PropTypes.string,
    "name": PropTypes.string,
  }),
  theme: PropTypes.oneOfType([
    PropTypes.string,       
    PropTypes.object,
  ]),
  onPress: PropTypes.func,
  width: PropTypes.number,
  darkMode: PropTypes.bool,
  categoryKeys: PropTypes.array,
  categories: PropTypes.object,
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
  }
});

export default TabBar;
