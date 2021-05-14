import PropTypes from 'prop-types';
import React from 'react';
import { TextInput, View } from 'react-native';

import { useThemeContext } from '../../context/ThemeContext';
import styles from './styles';

const SearchBar = (props) => {
  const { isDark } = useThemeContext();
  const { placeholder, searchQuery, handleSearch } = props;
  return (
    <View style={styles.searchbarContainer}>
      <TextInput
        style={[styles.search, isDark && styles.searchDark]}
        placeholder={placeholder}
        clearButtonMode="always"
        returnKeyType="done"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor={isDark ? '#FFFFFF56' : '#00000056'}
      />
    </View>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  handleSearch: PropTypes.func,
  searchQuery: PropTypes.string,
};

export default SearchBar;
