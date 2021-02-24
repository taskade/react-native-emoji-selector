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
  const { theme } = useThemeContext();
  const { placeholder, searchQuery, handleSearch } = props;
  return (
    <View style={styles.searchbarContainer}>
      <TextInput
        style={[
          styles.search,
          { backgroundColor: theme.searchBackground, color: theme.searchText },
        ]}
        placeholder={placeholder}
        clearButtonMode="always"
        returnKeyType="done"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor={theme.searchPlaceholder}
      />
    </View>
  );
};

export default SearchBar;
