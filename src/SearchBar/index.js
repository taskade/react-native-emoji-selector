import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

const SearchBar = (props) => {
  const { placeholder, theme, searchQuery, handleSearch, darkMode } = props;
  return (
    <View style={styles.searchbar_container}>
      <TextInput
        style={[styles.search, darkMode && styles.search_dark]}
        placeholder={placeholder}
        clearButtonMode="always"
        returnKeyType="done"
        autoCorrect={false}
        underlineColorAndroid={theme}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor={darkMode ? '#FFFFFF56' : '#00000056'}
      />
    </View>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  handleSearch: PropTypes.func,
  searchQuery: PropTypes.string,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  darkMode: PropTypes.bool,
};

const styles = StyleSheet.create({
  searchbar_container: {
    width: '100%',
    zIndex: 1,
  },
  search: {
    ...Platform.select({
      ios: {
        height: 36,
        paddingLeft: 8,
        borderRadius: 10,
        backgroundColor: '#F2F2F7',
      },
      android: {
        paddingBottom: 8,
      },
    }),
    margin: 8,
    color: '#00000087',
  },
  search_dark: {
    ...Platform.select({
      ios: {
        backgroundColor: '#48484A',
      },
    }),
    color: '#FFFFFF87',
  },
});

export default SearchBar;
