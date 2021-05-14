import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  searchbarContainer: {
    zIndex: 1,
    marginLeft: 8,
    marginRight: 8,

    ...Platform.select({
      ios: {},
      android: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        height: 36,
        borderWidth: 1,
        borderColor: '#00000027',
      },
    }),
  },

  search: {
    paddingLeft: 8,
    color: '#00000087',
    borderRadius: 10,

    ...Platform.select({
      ios: {
        backgroundColor: '#F2F2F7',
        height: 36,
        borderRadius: 10,
      },
      android: {
        width: '100%',
        height: '100%',
      },
    }),
  },

  searchDark: {
    backgroundColor: '#48484A',
    color: '#FFFFFF87',
  },
});
