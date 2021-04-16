import PropTypes from 'prop-types';
import React from 'react';
import { TextInput, View } from 'react-native';

import styles from './styles';

const SearchBar = (props) => {
  const { placeholder, searchQuery, handleSearch, darkMode } = props;

  return (
    <View style={styles.searchbarContainer}>
      <TextInput
        style={[styles.search, darkMode && styles.search_dark]}
        placeholder={placeholder}
        clearButtonMode="always"
        returnKeyType="done"
        autoCorrect={false}
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

export default SearchBar;
