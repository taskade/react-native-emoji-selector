declare module 'react-native-emoji-selector' {
  import * as React from 'react';
  import { ColorValue, ViewStyle } from 'react-native';

  /**
   * Categories
   * The package itself exports a dictionary of objects, however
   * to to enforce usage of the exported dictionary the types
   * just simplifies to an enum. Once compiled it runs the
   * same because the export is named the same.
   */
  export enum Categories {
    history = 'history',
    emotion = 'emotion',
    people = 'people',
    nature = 'nature',
    food = 'food',
    activities = 'activities',
    places = 'places',
    objects = 'objects',
    symbols = 'symbols',
    flag = 'flag',
  }

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
