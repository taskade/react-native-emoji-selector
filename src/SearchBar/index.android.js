import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

import styles from './styles';

const SearchBar = (props) => {
  const { placeholder, searchQuery, handleSearch, darkMode } = props;

  const onClear = useCallback(() => {
    handleSearch('');
  }, [handleSearch]);

  return (
    <View style={[styles.searchbarContainer, darkMode && styles.search_dark]}>
      <TextInput
        style={[styles.search, darkMode && styles.searchDarkAndroid]}
        placeholder={placeholder}
        clearButtonMode="always"
        returnKeyType="done"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor={darkMode ? '#FFFFFF56' : '#00000056'}
      />
      {searchQuery !== '' && (
        <TouchableOpacity style={styles.closeButtonContainer} onPress={onClear}>
          <Image style={styles.closeButton} source={require('../img/navigation/icCancel.png')} />
        </TouchableOpacity>
      )}
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
