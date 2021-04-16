import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  emojiContainer: {
    flex: 1,
  },

  noEmojiContainer: {
    flex: 1,
    paddingTop: 16,
    justifyContent: 'center',
    // backgroundColor: 'pink',
  },

  headerContainer: {
    paddingVertical: 4,
  },

  headerText: {
    margin: 8,
    fontSize: 16,
    width: '100%',
  },

  emojiCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  emojiWarn: {
    textAlign: 'center',
    fontSize: 64,
    paddingBottom: 12,
  },

  warningText: {
    textAlign: 'center',
    color: '#00000087',
  },

  warningTextDark: {
    color: '#FFFFFF90',
  },
});
