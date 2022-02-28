import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#999',
    borderBottomWidth: 0.3,
  },
  betweenWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  settingText: {
    fontFamily: 'NotoSansSC',
    marginLeft: 10,
    opacity: 0.9,
  },
  logo: {
    width: 40,
    height: 40,
    opacity: 0.5,
    marginTop: 50,
  },
})

export default styles
