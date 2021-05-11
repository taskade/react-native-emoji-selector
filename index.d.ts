declare module 'react-native-emoji-selector' {
  import * as React from 'react';
  import { ColorValue, ViewStyle } from 'react-native';
  import { Categories } from 'emoji';

  export interface EmojiSelectorProps {
    onEmojiSelected(emoji: string): void;
    placeholder?: string;
    showTabs?: boolean;
    showSearchBar?: boolean;
    showHistory?: boolean;
    showSectionTitles?: boolean;
    category?: Categories;
    columns?: number;
    shouldInclude?: (e: any) => boolean;
    darkMode?: boolean;
    pickerStyle: ViewStyle;
    pickerFlatListStyle?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    theme?: {
      primary?: ColorValue;
      background?: ColorValue;
      label?: ColorValue;
      underlay?: ColorValue;
    };
  }

  const EmojiSelector: React.ComponentType<EmojiSelectorProps>;

  export default EmojiSelector;
}
