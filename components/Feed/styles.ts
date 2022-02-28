import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  feedItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 2,
  },
  quotedItem: {
    borderBottomWidth: 0,
    padding: 10,
    marginTop: 10,
  },
  readMore: {
    color: '#008cd5',
    fontSize: 14,
    marginVertical: 6,
    textAlign: 'center',
  },
  pubTime: {
    color: '#999',
    fontSize: 12,
  },
  metabar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: 'transparent',
  },
  fromLink: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
  refer: {
    marginTop: 15,
  },
})

export default styles
