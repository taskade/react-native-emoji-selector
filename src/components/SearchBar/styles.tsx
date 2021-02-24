import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  searchbarContainer: {
    zIndex: 1,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 10,

    ...Platform.select({
      android: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        borderWidth: 1,
        borderColor: '#00000027',
      },
    }),
  },

  search: {
    paddingLeft: 8,
    borderRadius: 10,

    ...Platform.select({
      ios: {
        height: 36,
        borderRadius: 10,
      },
      android: {
        width: '100%',
        height: '100%',
      },
    }),
  },
});
