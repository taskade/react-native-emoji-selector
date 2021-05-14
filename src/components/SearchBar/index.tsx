import React from 'react';
import { TextInput, View } from 'react-native';

import { useThemeContext } from '../../context/ThemeContext';
import styles from './styles';

interface Props {
  placeholder: string;
  searchQuery: string;
  handleSearch: (search: string) => void;
}

const SearchBar: React.FC<Props> = (props) => {
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

export default SearchBar;
