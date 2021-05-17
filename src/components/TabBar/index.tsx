import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useThemeContext } from '../../context/ThemeContext';
import { CATEGORIES } from '../../utils/emojis';
import styles from './styles';

interface Props {
  activeCategory: {
    symbol: string;
    name: string;
  };
  onPress: (key: string) => void;
  onPressIn: (key: string) => void;
  width: number;
  categoryKeys: string[];
}

const TabBar: React.FC<Props> = (props) => {
  const { activeCategory, onPress = () => {}, onPressIn = () => {}, width, categoryKeys } = props;
  const { isDark, theme } = useThemeContext();

  const tabSize = useMemo(() => {
    if (width === 0) {
      return 15;
    }
    return width / categoryKeys.length;
  }, [width, categoryKeys]);

  const inactiveBorderColor = useMemo(() => {
    return isDark ? '#8E8E93' : '#E5E5EA';
  }, [isDark]);

  const Tabs = useMemo(() => {
    return categoryKeys.map((key) => {
      const category = CATEGORIES[key];
      return (
        <TouchableOpacity
          key={category.name}
          onPress={() => onPress(key)}
          onPressIn={() => onPressIn('')}
          style={[
            styles.tabContainer,
            {
              height: tabSize,
              borderColor: category === activeCategory ? theme.primary : inactiveBorderColor,
            },
          ]}
        >
          <Text allowFontScaling={false} style={[styles.emojiText, { fontSize: tabSize - 24 }]}>
            {category.symbol}
          </Text>
        </TouchableOpacity>
      );
    });
  }, [categoryKeys, activeCategory, tabSize, inactiveBorderColor, theme, onPress, onPressIn]);

  return <View style={styles.tabBar}>{Tabs}</View>;
};

export default TabBar;
