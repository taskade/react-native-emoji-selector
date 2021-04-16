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
    ...Platform.select({
      ios: {
        backgroundColor: '#F2F2F7',
        height: 36,
        borderRadius: 10,
      },
      android: {
        width: '90%',
        height: '100%',
      },
    }),
  },

  search_dark: {
    backgroundColor: '#48484A',
    color: '#FFFFFF87',
  },

  searchDarkAndroid: {
    color: '#FFFFFF87',
  },

  closeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  closeButton: {
    height: 16,
    width: 16,
    tintColor: '#c7c7c7',
  },
});
