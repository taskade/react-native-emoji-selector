declare module '@taskade/react-native-emoji-selector' {
  import * as React from 'react';
  import { ColorValue, ViewStyle, StyleProp, FlatList } from 'react-native';

  export interface EmojiSelectorProps {
    // category?: Categories;
    columns?: number;
    placeholder?: string;
    darkMode?: boolean;
    showTabs?: boolean;
    showSectionTitles?: boolean;
    showSearchBar?: boolean;
    showHistory?: boolean;
    theme?: { [key: string]: ColorValue };
    pickerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<FlatList>;
    pickerFlatListStyle?: StyleProp<ViewStyle>;
    shouldInclude?: (emojiObj: any) => boolean;
    onEmojiSelected: (emojiString: string) => void;
  }

  const EmojiSelector: React.ComponentType<EmojiSelectorProps>;

  export default EmojiSelector;
}
