import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../../Themed'
import { ArkBookmark } from '../../../types'
import Markdown from '../../Markdown'

const Header = ({
  feed,
  isQuoted,
}: {
  feed: ArkBookmark
  isQuoted?: boolean
}) => {
  if (!feed.user) {
    return null
  }
  return (
    <View style={[styles.metabar, { marginBottom: 10 }]}>
      <Markdown
        key="user"
        content={feed.user}
        feed={feed}
        style={{
          text: { color: '#008cd5', fontWeight: '500', fontSize: 18 },
          link: {
            textDecorationLine: 'none',
            color: '#008cd5',
            fontStyle: 'normal',
          },
        }}
      />
      <Text style={styles.pubTime}>
        {/* {!isQuoted && dayjs(feed.createdAt).format('YYYY/MM/DD HH:MM')} */}
      </Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
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
})
