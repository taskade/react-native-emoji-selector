import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TabBar = (props) => {
  const {
    theme,
    activeCategory,
    onPress,
    onPressIn,
    width,
    darkMode,
    categoryKeys,
    categories,
    showHistory,
  } = props;

  const updatedCategoryKeys = useMemo(() => {
    return categoryKeys.filter((key) => {
      if (key === 'history' && !showHistory) {
        return false;
      }
      return true;
    });
  }, [categoryKeys, showHistory]);

  const tabSize = useMemo(() => {
    if (width === 0) {
      return 15;
    }
    return width / updatedCategoryKeys.length;
  }, [width, updatedCategoryKeys]);

  const inactiveBorderColor = useMemo(() => {
    return darkMode ? '#8E8E93' : '#E5E5EA';
  }, [darkMode]);

  const Tabs = useMemo(() => {
    return updatedCategoryKeys.map((key) => {
      const category = categories[key];
      return (
        <TouchableOpacity
          key={category.name}
          onPress={() => onPress(key)}
          onPressIn={() => onPressIn('')}
          style={[
            styles.tabContainer,
            {
              height: tabSize,
              borderColor: category === activeCategory ? theme : inactiveBorderColor,
            },
          ]}
        >
          <Text allowFontScaling={false} style={[styles.emojiText, { fontSize: tabSize - 24 }]}>
            {category.symbol}
          </Text>
        </TouchableOpacity>
      );
    });
  }, [
    updatedCategoryKeys,
    activeCategory,
    categories,
    tabSize,
    inactiveBorderColor,
    theme,
    onPress,
    onPressIn,
  ]);

  return <View style={styles.tabBar}>{Tabs}</View>;
};

TabBar.defaultProps = {
  isShown: true,
  onPress: () => {},
};

TabBar.defaultProps = {
  isShown: true,
  onPress: () => {},
};

TabBar.propTypes = {
  showHistory: PropTypes.bool,
  activeCategory: PropTypes.shape({
    symbol: PropTypes.string,
    name: PropTypes.string,
  }),
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  width: PropTypes.number,
  darkMode: PropTypes.bool,
  categoryKeys: PropTypes.array,
  categories: PropTypes.object,
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
  },
  tabContainer: {
    flex: 1,
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    textAlign: 'center',
    paddingBottom: 8,
  },
});

export default TabBar;
