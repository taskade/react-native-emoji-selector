import React, { useState } from "react";
import { 
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import EmojiSelector, { Categories } from "./src/emoji-selector";

const THEME = "#007AFF";

export default function App() {
  const [emoji, setEmoji] = useState(" ");
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#333333' : '#FFFFFF'}]}>
      <Text style={{color: isDarkMode ? 'white' : 'black'}}>Please select the emoji you would like to use</Text>
      <View style={styles.display}>
        <Text style={{ fontSize: 64, backgroundColor: "transparent" }}>
          {emoji}
        </Text>
      </View>
      <EmojiSelector
        onEmojiSelected={emoji => setEmoji(emoji)}
        showSearchBar={true}
        showTabs={true}
        showHistory={true}
        showSectionTitles={true}
        category={Categories.all}
        darkMode={isDarkMode}
      />      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    ...Platform.select({
      android: {
        paddingTop: 40,
      }
    })
  },
  display: {
    width: 96,
    height: 96,
    margin: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: THEME,
    alignItems: "center",
    justifyContent: "center"
  }
});
