import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import EmojiSelector from './src/emoji-selector';

export default function App() {
  const [emoji, setEmoji] = useState(' ');
  const isDarkMode = useColorScheme() === 'dark';
  const theme = {
    background: isDarkMode ? '#333333' : '#FFFFFF',
    primary: '#007AFF',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={{ color: isDarkMode ? 'white' : 'black' }}>
        Please select the emoji you would like to use
      </Text>
      <View style={styles.display}>
        <Text style={{ fontSize: 48, backgroundColor: 'transparent' }}>{emoji}</Text>
      </View>
      <EmojiSelector
        onEmojiSelected={(emojiObj) => setEmoji(emojiObj)}
        showSearchBar={true}
        showTabs={true}
        showHistory={true}
        showSectionTitles={true}
        darkMode={isDarkMode}
        theme={theme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  display: {
    width: 72,
    height: 72,
    margin: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
