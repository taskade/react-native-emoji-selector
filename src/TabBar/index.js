import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';


const TabBar = (props) => {
  const { theme, activeCategory, onPress, width, darkMode, categoryKeys, categories } = props;
  const tabSize = width / categoryKeys.length;
  console.log(categories)

  return categoryKeys.map(c => {
    const category = categories[c];
    if (c !== "all")
    return (
      <TouchableOpacity
        key={category.name}
        onPress={() => onPress(category)}
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
};

TabBar.propTypes = {
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

export default TabBar;
