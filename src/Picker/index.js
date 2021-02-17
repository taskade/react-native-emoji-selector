import PropTypes from 'prop-types';
import React from 'react';
import { FlatList, StyleSheet, Text, View, ViewPropTypes } from 'react-native';

import { charFromEmojiObject } from '../helpers';
import { EmojiCell } from './components'

const Picker = React.forwardRef((props, ref) => {
  const {
    pickerFlatListStyle,
    contentContainerStyle,
    onEmojiSelected,
    colSize,
    data,
  } = props;
  const {data: emojiList, stickyIndex} = data;
  
  return (
    <FlatList 
      ref={ref}
      style={[{ flex: 1 }, pickerFlatListStyle]}
      contentContainerStyle={[{ paddingBottom: colSize }, contentContainerStyle]}
      horizontal={false}
      keyboardShouldPersistTaps={'always'}
      keyExtractor={(item, index) => `${item.index}_${index}`}
      data={emojiList}
      stickyHeaderIndices={stickyIndex}
      renderItem={({item: {data: content, isHeader}}) => {
        return isHeader ? (
          <Text style={styles.sectionHeader}>{content}</Text>
        ) : (
          <View style={styles.emojiContainer}>
            {
              content.map((emoji, i) => (
                <View key={i}>
                <EmojiCell
                  
                  onPress={()=>onEmojiSelected(emoji)}
                  colSize={colSize}
                  emoji={charFromEmojiObject(emoji)}
                />
                </View>
              )
            )}
          </View>
        )
      }}
    />
  );
});

Picker.displayName = 'Picker';

Picker.propTypes = {
  pickerFlatListStyle: ViewPropTypes.style,
  contentContainerStyle: ViewPropTypes.style,
  columns: PropTypes.number, 
  numColumns: PropTypes.number,
  colSize: PropTypes.number,
  data: PropTypes.object,
  onEmojiSelected: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  sectionHeader: {
    margin: 8,
    fontSize: 16,
    width: "100%",
    color: "#8F8F8F"
  },
  emojiContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
})

export default Picker;
